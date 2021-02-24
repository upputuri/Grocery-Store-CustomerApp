import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonicSafeString, IonItem, IonLabel, IonList, IonLoading, IonModal, IonPage, IonPicker, IonPickerColumn, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import ProductCard from '../Cards/ProductCard';
import BaseToolbar from '../Menu/BaseToolbar';
import GrocSearch from '../Menu/GrocSearch';
import { serviceBaseURL } from '../Utilities/ServiceCaller';
import { chevronBack as previous, chevronForward as next, filter as filterIcon, funnel as sortIcon} from 'ionicons/icons';
import { clientConfig } from '../Utilities/AppCommons';
import InfoMessageTile from '../Cards/InfoMessageTile';
import { CartContext } from '../../App';
import { Plugins } from '@capacitor/core';
import { connect } from 'react-redux';

const ProductList = (props) => {
    
    const [productListState, setProductListState] = useState(undefined);
    const [filtersState, setFiltersState] = useState({});
    const [query, setQuery] = useState('');
    const [queryResultCount, setQueryResultCount] = useState(clientConfig.productListPageSize);
    const history = useHistory();
    const search = useLocation().search;
    const [searchTextState, setSearchTextState] = useState(''); 
    const [showLoading, setShowLoading] = useState(false);
    const [currentPageOffset, setCurrentPageOffset] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [showSortOptions, setShowSortOptions] = useState(false);
    const cartContext = useContext(CartContext);
    const [currentSortOption, setCurrentSortOption] = useState('itemname-asc');
    Plugins.App.addListener('backButton', (event)=> {
        if (showFilters === true)
            setShowFilters(false);
    });

    const setFilters = (event) => {
        //alert(event.target.name+" "+event.target.value);
        const newFilters = {...filtersState};
        newFilters[event.target.name] = (event.target.value && event.target.value.length)>0?event.target.value:undefined;
        setFiltersState(newFilters);
        //alert(JSON.stringify(newFilters));
    }

    const clearFilters = () => {
        setFiltersState({});
        setShowFilters(false);
    }

    const filterProducts = () => {
        setShowFilters(false);
        setQueryResultCount(clientConfig.productListPageSize);
        loadProducts(query);
    }

    const onPickerCancel = () => {
        setShowSortOptions(false);
    }
    
    const onPickerDone = (picker) => {
        // alert(JSON.stringify(picker['sortpicker'].value));
        setShowSortOptions(false);
        setCurrentSortOption(picker['sortpicker'].value);
        loadProducts(query, undefined, picker['sortpicker'].value);
    }

    const loadProducts = async (query, offset, sortOption) => {
        // alert(offset+" "+queryResultCount);
        
        if ((offset !== undefined && offset >= queryResultCount) || offset < 0) {
            return;
        }

        if (!offset) {
            offset = 0;
        }
        if (query.length > 0) {
            query = query + (sortOption? '&sortkey='+sortOption.split('-')[0]+
                                '&sortorder='+sortOption.split('-')[1] : '')+
                                '&coverid='+props.selectedCover.coverId+
                                '&offset='+offset+'&size='+clientConfig.productListPageSize;
        }
        let path = serviceBaseURL+'/products'+query;     
        setShowLoading(true);
        console.log("Making service call: "+path);
        const client = new Client(path);
        const resource = client.go();
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        let receivedState;
        // alert(JSON.stringify(filtersState));
        try{
            receivedState = await resource.post({
                    data: JSON.stringify(filtersState),
                    headers: headers
                }
            );
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            setShowLoading(false);
            return;
        }
        setCurrentPageOffset(offset);
        setQueryResultCount(receivedState.data.totalCount);
        console.log("Loaded products from server");
        // alert(JSON.stringify(receivedState.data));
        setProductListState(receivedState.data);
        setShowLoading(false);
    }
    
    useEffect(()=>{
        // const cat = new URLSearchParams(search).get('category');
        const keywords = new URLSearchParams(search).get('userinput');
        // alert(keywords);
        setSearchTextState(keywords);
        // const sortKey = new URLSearchParams()
        // let queryString = cat && cat.length>0 ? 'category='+cat : 'category=';
        // queryString = keywords && keywords.length>0 ? queryString+'&keywords='+keywords : queryString+'&keywords=';
        let queryString = search;
        if (query.localeCompare(queryString) !== 0){
            setQuery(queryString);
            loadProducts(queryString, undefined, queryString.includes('sortkey') ? undefined : currentSortOption);
        }
    });

    const loadNextPage = () => {
        loadProducts(query, currentPageOffset+clientConfig.productListPageSize);
    }
    
    const loadPreviousPage = () => {
        loadProducts(query, currentPageOffset-clientConfig.productListPageSize);
    }

    const viewProductDetail = (id) =>
    {   
        history.push('/products/single/'+id);
    }

    const showFiltersModal = () => {
        // console.log(history.location);
        // let currentPath = history.location;
        // currentPath.hash = 'filters';
        // history.push(currentPath);
        // alert('opening filters')
        setShowFilters(true);
    }
    console.log("Rendering product list");
    const SortColumn = {
        name: "sortpicker",
        options: [
            { text: "Name: Ascending", value: "itemname-asc" },
            { text: "Name: Descending", value: "itemname-desc" },
            { text: "Price: Low to High", value: "itemprice-asc" },
            { text: "Price: High to Low", value: "itemprice-desc" },
        ]
      }

    // if (productListState) {
    return (
        <IonPage>
            <IonHeader className="osahan-nav border-white border-bottom">
                <BaseToolbar title="Products"/>
                <div className="d-flex align-middle">
                    <span></span>{/*This line is added so as to make the searchTextState data prop to be passed correctly in GrocSearch in next line. Not sure why it works with this (or any) element placed before it*/}
                    <GrocSearch searchText={searchTextState}/>
                    <IonButton onClick={setShowSortOptions.bind(this,true)} color="night" className="ion-no-padding ml-0 mr-2"><IonIcon size="small" icon={sortIcon}></IonIcon></IonButton>
                    <IonButton onClick={setShowFilters.bind(this,true)} color="night" className="ion-no-padding ml-0 mr-2"><IonIcon size="small" icon={filterIcon}></IonIcon></IonButton>
                </div>
            </IonHeader>            
            <IonLoading isOpen={showLoading}/>
            <IonContent color="dark" className="ion-padding">
                <IonPicker cssClass="groc-option-picker" isOpen={showSortOptions} columns={[SortColumn]} buttons={[
                    {
                        text: "Cancel",
                        role: "cancel",
                        handler: onPickerCancel
                    },
                    {
                        text: "Done",
                        handler: onPickerDone
                    }
                ]}>

                </IonPicker>
                <IonModal isOpen={showFilters}>
                    <IonHeader>
                        <IonToolbar color="night">
                            {/* <IonTitle>Select Filters</IonTitle> */}
                            <IonButtons slot="end">
                                <IonButton size="small" onClick={clearFilters}>Clear</IonButton>
                                <IonButton size="small" onClick={filterProducts}>Done</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent color="dark" fullscreen>
                    <IonList className="ion-no-padding">
                        {/* {clientConfig.filters.split(',').filter((filterName)=>productListState && productListState.filterOptions[filterName]? true: false).map((filterName) => { */}
                        {productListState && Object.keys(productListState.filterOptions).map((filterName) => {
                            return <IonItem key={filterName}>
                                <IonLabel>{filterName}</IonLabel>
                                <IonSelect cssClass='groc-select' name={filterName} multiple={true} value={filtersState[filterName]} placeholder="All" onIonChange={setFilters}>
                                    {productListState && 
                                        productListState.filterOptions[filterName] && 
                                        productListState.filterOptions[filterName].map((filterOption) => {
                                        return <IonSelectOption key={filterOption} value={filterOption}>{filterOption}</IonSelectOption>
                                    })}
                                </IonSelect>
                            </IonItem>
                        })}
                    {/* <IonItem>
                        <IonLabel>Weight</IonLabel>
                        <IonSelect placeholder="Select One">
                            <IonSelectOption value="female">Female</IonSelectOption>
                            <IonSelectOption value="male">Male</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Volume</IonLabel>
                        <IonSelect placeholder="Select One">
                            <IonSelectOption value="female">Female</IonSelectOption>
                            <IonSelectOption value="male">Male</IonSelectOption>
                        </IonSelect>
                    </IonItem> */}
                    </IonList>
                    </IonContent>
                </IonModal>
                {productListState && productListState.products && productListState.products.map(
                    (product) =>{
                        return product.variations.length>0 ? <ProductCard 
                                                                productId={product.id}
                                                                key={product.id}
                                                                name={product.name}
                                                                image={product.images[0]}
                                                                variationId={product.variations[0].id}
                                                                originalPrice={product.variations[0].price}
                                                                discountPrice={product.variations[0].priceAfterDiscount}
                                                                discount={product.discount}
                                                                inStock={product.variations[0].inStock}
                                                                unitLabel={product.variations[0].name}   
                                                                productClickHandler={viewProductDetail} />
                                                            :
                                                                '';
                    }
                )}
                {productListState && (!productListState.products || productListState.products.length === 0) && !searchTextState &&
                <InfoMessageTile detail="No products to display"/>}
                {productListState && (!productListState.products || productListState.products.length === 0) && searchTextState &&
                <InfoMessageTile detail={'No search results found for "'+searchTextState+'"'}/>}

                <div>
                    <IonRow>
                        <IonCol size="6">
                            <div className="d-flex justify-content-start">
                                {currentPageOffset > 0 && <IonButton disabled={currentPageOffset > 0 ? false: true} onClick={loadPreviousPage} size="small" color="secondary"><IonIcon size="small" slot="start" icon={previous}></IonIcon>Prev</IonButton>}
                            </div>
                        </IonCol>
                        <IonCol size="6">
                            <div className="d-flex justify-content-end">
                                {currentPageOffset+clientConfig.productListPageSize < queryResultCount && <IonButton disabled={currentPageOffset+clientConfig.productListPageSize < queryResultCount ? false: true} onClick={loadNextPage} size="small" color="secondary"><IonIcon size="small" slot="end" icon={next}></IonIcon>Next</IonButton>}
                            </div>
                        </IonCol>
                    </IonRow>
                </div>
            </IonContent>
        </IonPage>        
    )
    // }
    // else{
    //     return <IonPage>
    //         <IonHeader className="osahan-nav border-white border-bottom">
    //             <BaseToolbar title="Products"/>
    //             <div className="d-flex align-middle">
    //                 <GrocSearch/>
    //                 <IonButton onClick={setShowFilters.bind(this,true)} color="night" className="ion-no-padding ml-0 mr-2"><IonIcon size="small" icon={filterIcon}></IonIcon></IonButton>
    //             </div>
    //         </IonHeader>            
    //         <IonLoading isOpen={showLoading}/>
    //         <IonContent color="dark" className="ion-padding">

    //         </IonContent>
    //     </IonPage>
    // }
        
}

const mapStateToProps = (state) => {
    return {
        selectedCover: state.userPrefs.cover
    }
}

export default connect(mapStateToProps)(ProductList);