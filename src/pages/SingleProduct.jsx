import { IonAlert, IonBadge, IonContent, IonGrid, IonHeader, IonIcon, IonLoading, IonPage, IonSearchbar, IonSlide, IonSlides, IonText } from '@ionic/react';
import { checkmarkCircle as checkMarkIcon } from 'ionicons/icons';
import Client from 'ketting';
import React, { useEffect, useState } from 'react';
import { useHistory, withRouter } from "react-router-dom";
import AddToCartButton from '../components/Menu/AddToCartButton';
import BaseToolbar from '../components/Menu/BaseToolbar';
import GrocSearch from '../components/Menu/GrocSearch';
import { defaultImageURL, mediumImageStoreURL, serviceBaseURL } from '../components/Utilities/ServiceCaller';

const SingleProduct = (props) => {
    const [productState, setProductState] = useState(null);
    const [slideImages, setSlideImages] = useState([]);
    const [variantIndexState, setVariantIndexState] = useState(0);
    const [resourceState, setResourceState] = useState(null);
    const [loadingState, setLoadingState] = useState(false);
    const [alertState, setAlertState] = useState({show: false, msg: ''});
    const [retryState, setRetryState] = useState(false);
    const history = useHistory();


    // state = {
    //     productId: null,
    //     resource: null,
    //     data: null,
    //     variantIndex: 0,
    // }

    // shouldComponentUpdate()
    // {
    //     return this.state.productId !== null && 
    //     this.state.resource !== null && 
    //     this.state.data !== null;
    // }
    useEffect(() =>{
        const { productId } = props.match.params;
        if (productState && productState.id === productId)
            return; //do nothing as the resource is already loaded
        loadSingleProduct(productId);
    }, [retryState]);
    // const componentDidMount = () =>
    // {
    //     const { productId } = props.match.params;
    //     if (productState && productState.id === productId)
    //         return; //do nothing as the resource is already loaded
    //     this.loadSingleProduct(productId);
    // }

    // const componentDidUpdate = () =>
    // {
    //     const { productId } = props.match.params;
    //     if (productState && productState.id === productId)
    //         return; //do nothing as the resource is already loaded
    //     this.loadSingleProduct(productId);
    // }

    const loadSingleProduct = async (id) =>
    {
        let path = serviceBaseURL + '/products/'+id;
        if (resourceState !== null && path.localeCompare(resourceState.uri) === 0)
            return;

        const client = new Client(path);
        const resource = client.go();
        let receivedState;
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        try{
            receivedState = await resource.get();
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            setLoadingState(false);
            setAlertState({show: true, msg: e.toString()});
            return;
        }
        const product = receivedState.data;
        // alert(JSON.stringify(products));
        setProductState(product);
        setSlideImages(product.variations[0].images);
        setResourceState(resource);
        setLoadingState(false);  
    }

    const variantSelected = (index) => 
    {
        setVariantIndexState(index);
        let images = productState.variations[index].images.length > 0 ? productState.variations[index].images : productState.images;
        setSlideImages(images);
    }

    const sliderOptions = {
        initialSlide: 0,
        spaceBetween: 10,
        // pagination: {
        //     el: 'groc-slides',
        //     type: 'bullets',
        // }
    }

    if (productState !== null)
    {
        return (

            <IonPage>
                <IonHeader className="osahan-nav border-white border-bottom">
                    <BaseToolbar title=""/>
                    <GrocSearch/>      
                </IonHeader>
                <IonLoading isOpen={loadingState}/>              
                <IonContent color="dark" className="ion-padding">
                    {productState && 
                    <div>
                        <IonSlides options={sliderOptions} pager="true">
                            {slideImages && slideImages.map((image, index) => {
                            return <IonSlide key={index}>
                                        <img alt="img" className="single-img" src={image?mediumImageStoreURL+"/"+image:defaultImageURL}/>
                                    </IonSlide>
                            })}
                        </IonSlides>
                        <div>
                            <IonGrid>
                            <div className="mb-2 p-3">
                                <div>
                                <div>
                                    <IonText color="light">
                                        <h6 className="mb-1">{productState.name} - {productState.variations[variantIndexState].name}</h6>
                                    </IonText>
                                    <div className="font-weight-normal mb-2 price">
                                        {productState.discount > 0 &&
                                        <IonText>
                                            <span className="price-before-discount">{'₹'+productState.variations[variantIndexState].price}</span>
                                            <span className="price-after-discount"> {'₹'+productState.variations[variantIndexState].priceAfterDiscount}</span>
                                            <IonBadge color="secondary">{productState.discount+'% OFF'}</IonBadge>
                                        </IonText> || 
                                        <IonText>
                                            <span className="price-after-discount">{'₹'+productState.variations[variantIndexState].price}</span>
                                        </IonText>}                                          
                                    </div>
                                    <small className="text-secondary">
                                        <div className="d-flex">
                                        <div><IonIcon color="success" icon={checkMarkIcon}></IonIcon>Available in - </div>
                                        <div>
                                            {productState.variations.map((v, index) => {
                                                return <IonBadge color={
                                                    index === variantIndexState? 'red':'tertiary'
                                                }className='ml-1' key={v.id} onClick={variantSelected.bind(this, index)}>{v.name}</IonBadge>
                                            })}
                                        </div>
                                        </div>
                                    </small>                                                      
                                    <div className="small text-gray-500 d-flex align-middle justify-content-end">
                                        {productState.variations[variantIndexState].inStock ? 
                                        <AddToCartButton productId={productState.id} variationId={productState.variations[variantIndexState].id}/>
                                        :
                                        <IonText color="secondary">Out of Stock</IonText>}
                                    </div>
                                </div>
                                </div>
                            </div>
                            </IonGrid>
                            <IonGrid>
                            <div className="mb-2 p-3">
                                <div className="short-description">
                                <small className="float-right"><span className="badge badge-success">{productState.variations[variantIndexState].inStock ? 'In Stock': 'Out of Stock'}</span></small>
                                <h6 className="font-weight-bold mb-3">
                                    Quick Overview  
                                </h6>
                                <p className="text-secondary">{productState.description}
                                </p>
                                <p className="mb-0 text-secondary">{productState.variations[variantIndexState].description}</p>
                                </div>
                            </div>
                            </IonGrid>
                        </div>
                    </div>
                    }
                    </IonContent>
            </IonPage>

        )
    }
    else{
        return (
        <IonPage>
            <IonHeader className="osahan-nav border-white border-bottom">
                <BaseToolbar />
                <IonSearchbar className="pt-1" placeholder="Search for products"></IonSearchbar>      
            </IonHeader>
            <IonLoading isOpen={loadingState}/>                
            <IonContent color="dark">
                <IonAlert
                    isOpen={alertState.show}
                    header={'Error'}
                    cssClass='groc-alert'
                    subHeader={alertState.msg}
                    message={'Failed to load'}
                    buttons={[{text: 'Cancel', handler: ()=>{history.push('/home')}}, 
                                {text: 'Retry', handler: ()=>{setAlertState({show: false, msg: ''}); setRetryState(!retryState)}}]}
                />
            </IonContent>
        </IonPage>
    )
    }

}

export default withRouter(SingleProduct);