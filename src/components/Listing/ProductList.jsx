import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonLoading, IonPage, IonRow, IonSearchbar } from '@ionic/react';
import Client from 'ketting';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import ProductCard from '../Cards/ProductCard';
import BaseToolbar from '../Menu/BaseToolbar';
import GrocSearch from '../Menu/GrocSearch';
import { serviceBaseURL } from '../Utilities/ServiceCaller';
import { chevronBack as previous, chevronForward as next} from 'ionicons/icons';
import { productListPageSize as pageSize} from '../Utilities/AppCommons';

const ProductList = () => {
    
    const [data, setData] = useState(null);
    const [query, setQuery] = useState('');
    const [queryResultCount, setQueryResultCount] = useState(pageSize);
    const history = useHistory();
    const search = useLocation().search;
    const [showLoading, setShowLoading] = useState(false);
    const [currentPageOffset, setCurrentPageOffset] = useState(0);

    let loadProducts = async (query, offset) => {
        if (!offset) {
            offset = 0;
        }
        // alert(offset);
        if (offset >= queryResultCount || offset < 0) {
            return;
        }
        if (query.length > 0) {
            query = query + '&offset='+offset+'&size='+pageSize;
        }
        let path = serviceBaseURL+'/products'+query;     
        setShowLoading(true);
        console.log("Making service call: "+path);
        const client = new Client(path);
        const resource = client.go();
        let productListState;
        try{
            productListState = await resource.get();
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            setShowLoading(false);
            return;
        }
        const products = productListState.data.products;
        setCurrentPageOffset(offset);
        setQueryResultCount(productListState.data.totalCount);
        console.log("Loaded products from server");
        // alert(JSON.stringify(products));
        setData(products);
        setShowLoading(false);
    }
    
    useEffect(()=>{
        // const cat = new URLSearchParams(search).get('category');
        // const keywords = new URLSearchParams(search).get('keywords');
        // const sortKey = new URLSearchParams()
        // let queryString = cat && cat.length>0 ? 'category='+cat : 'category=';
        // queryString = keywords && keywords.length>0 ? queryString+'&keywords='+keywords : queryString+'&keywords=';
        let queryString = search;
        if (query.localeCompare(queryString) !== 0){
            setQuery(queryString);
            loadProducts(queryString);
        }
    });

    const loadNextPage = () => {
        loadProducts(query, currentPageOffset+pageSize);
    }
    
    const loadPreviousPage = () => {
        loadProducts(query, currentPageOffset-pageSize);
    }

    const viewProductDetail = (id) =>
    {   
        history.push('/products/single/'+id);
    }

    console.log("Rendering product list");
    return (
            <IonPage>
                <IonHeader className="osahan-nav border-white border-bottom">
                    <BaseToolbar title="Products"/>
                    <GrocSearch/>      
                </IonHeader>            
                <IonLoading isOpen={showLoading}/>
                <IonContent color="dark" className="ion-padding">
                    {/* <div className="d-flex justify-content-between">
                        <IonButton onClick={loadPreviousPage} size="small" color="secondary"><IonIcon size="small" slot="start" icon={previous}></IonIcon>Prev</IonButton>
                        <IonButton onClick={loadNextPage} size="small" color="secondary"><IonIcon size="small" slot="end" icon={next}></IonIcon>Next</IonButton>
                    </div> */}
                    {data && data.map(
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
                    <div>
                        <IonRow>
                            <IonCol size="6">
                                <div className="d-flex justify-content-start">
                                    {currentPageOffset > 0 && <IonButton disabled={currentPageOffset > 0 ? false: true} onClick={loadPreviousPage} size="small" color="secondary"><IonIcon size="small" slot="start" icon={previous}></IonIcon>Prev</IonButton>}
                                </div>
                            </IonCol>
                            <IonCol size="6">
                                <div className="d-flex justify-content-end">
                                    {currentPageOffset+pageSize < queryResultCount && <IonButton disabled={currentPageOffset+pageSize < queryResultCount ? false: true} onClick={loadNextPage} size="small" color="secondary"><IonIcon size="small" slot="end" icon={next}></IonIcon>Next</IonButton>}
                                </div>
                            </IonCol>
                        </IonRow>
                    </div>
                </IonContent>
            </IonPage>        
        )

}

export default ProductList;