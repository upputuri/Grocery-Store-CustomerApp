import { IonAlert, IonBadge, IonContent, IonHeader, IonIcon, IonLoading, IonPage, IonSearchbar, IonSlide, IonSlides, IonText } from '@ionic/react';
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
        setResourceState(resource);
        setLoadingState(false);  
    }

    const variantSelected = (index) => 
    {
        setVariantIndexState(index);
    }

    // const addToCart = (loginContext, cartContext, productId, variantId, qty) =>
    // {
    //     if (!loginContext.isAuthenticated)
    //     {
    //         console.log("Customer is not authenticated, hence redirecting to login page");
    //         history.push("/login");
    //         return;
    //     }
    //     console.log("Invoking add Item on cart context");
    //     cartContext.addItem(productId, variantId, qty);
    // }
    if (productState !== null)
    {
        return (

            <IonPage>
                <IonHeader className="osahan-nav">
                    <BaseToolbar title=""/>
                    <GrocSearch/>      
                </IonHeader>
                <IonLoading isOpen={loadingState}/>              
                <IonContent color="dark">
                    {productState && 
                    <div>
                        <IonSlides pager="true">
                            {productState.images && productState.images.map((image) => {
                            return <IonSlide key={image}>
                                        <img alt="img" className="single-img" src={image?mediumImageStoreURL+"/"+image:defaultImageURL}/>
                                    </IonSlide>
                            })}
                        </IonSlides>
                        <div className="p-3">
                            <div className="mb-2 card p-3 single-page-info">
                                <div>
                                <div className="single-page-shop">
                                    <IonText color="primary">
                                        <h6 className="mb-1">{productState.name} - {productState.variations[variantIndexState].name}</h6>
                                    </IonText>


                                    {/* <p className="font-weight-normal text-white mb-2 price">
                                    <span className="old-price mr-2">₹338.99</span> <span className="regular-price text-secondary font-weight-normal">₹190.99</span> 
                                    <IonBadge color="success">25% OFF</IonBadge>
                                    </p> */}
                                    <div className="font-weight-normal mb-2 price">
                                        {/* <span><IonText><h5 className="mb-2 text-white">{'₹'+productState.variations[variantIndexState].price}
                                            <span>
                                            <IonText color="success">  {productState.discount > 0 ? productState.discount+'% OFF':''}</IonText></span></h5></IonText>
                                        </span> */}
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
                                        <strong>
                                            <IonIcon color="success" icon={checkMarkIcon}></IonIcon>
                                            Available in - 
                                        </strong>
                                        <span>
                                            {productState.variations.map((v, index) => {
                                                
                                                return <IonBadge color={
                                                    index === variantIndexState? 'red':'tertiary'
                                                }className='ml-1' key={v.id} onClick={variantSelected.bind(this, index)}>{v.name}</IonBadge>
                                            })}
                                        </span>
                                    </small>                                                      
                                    <div className="small text-gray-500 d-flex align-items-center justify-content-end">
                                        {/* <div>
                                            <IonIcon color="tertiary" icon={starIcon}></IonIcon>
                                            4.4
                                        </div> */}
                                        {productState.variations[variantIndexState].inStock ? 
                                        <AddToCartButton productId={productState.id} variationId={productState.variations[variantIndexState].id}/>
                                        :
                                        <IonText color="secondary">Out of Stock</IonText>}
                                        {/* <!-- <div className="input-group shop-cart-value">
                                            <span className="input-group-btn"><button disabled="disabled" className="btn btn-sm" type="button">-</button></span>
                                            <input type="text" max="10" min="1" value="1" className="form-control border-form-control form-control-sm input-number bg-black text-white" name="quant[1]">
                                            <span className="input-group-btn"><button className="btn btn-sm" type="button">+</button>
                                            </span>
                                        </div> --> */}
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="mb-2 card p-3 single-page-info">
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
                        </div>
                        {/* <ListingSection title="Other similar products">
                            <PosterSlider/>
                        </ListingSection> */}
                        
                    </div>
                    }
                    </IonContent>
            </IonPage>

        )
    }
    else{
        return (
        <IonPage>
            <IonHeader className="osahan-nav">
                <BaseToolbar />
                <IonSearchbar className="pt-1" placeholder="Search for products"></IonSearchbar>      
            </IonHeader>
            <IonLoading isOpen={loadingState}/>                
            <IonContent color="dark">
                <IonAlert
                    isOpen={alertState.show}
                    header={'Error'}
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