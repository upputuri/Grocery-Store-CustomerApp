import { IonBadge, IonButton, IonGrid, IonText } from '@ionic/react';
import React from 'react';
import AddToCartButton from '../Menu/AddToCartButton';
import { defaultImageURL, smallImageStoreURL } from '../Utilities/ServiceCaller';

type ProductCardProps = {
    productId: string,
    name: string,
    image: string,
    unitLabel: string,
    variationId: string,
    originalPrice: number,
    discountPrice: number,
    discount: number,
    inStock: boolean,
    productClickHandler: Function
}

const ProductCard = (props: ProductCardProps) =>
{
    return (
        <IonGrid onClick={()=>props.productClickHandler(props.productId)} className="d-flex p-3 bg-black mb-2">
            <div className="shop-cart-left">
                <img alt="img" className="not-found-img" src={props.image?smallImageStoreURL+'/'+props.image:defaultImageURL}/>
            </div>
            <div className="shop-cart-right">
                <div className="font-weight-normal mb-2 price ml-3">
                    <span>
                        {/* <IonText><h5 className="mb-2 text-white">{'₹'+props.discountPrice}
                                    <span><IonText color="success">{props.discount > 0 ? props.discount+'% OFF':''}</IonText></span>
                                </h5>
                        </IonText> */}
                        {props.discount > 0 &&
                        <IonText>
                            <span className="price-before-discount">{'₹'+props.originalPrice}</span>
                            <span className="price-after-discount"> {'₹'+props.discountPrice}</span>
                            <IonBadge color="secondary">{props.discount+'% OFF'}</IonBadge>
                        </IonText> || 
                        <IonText>
                            <span className="price-after-discount">{'₹'+props.originalPrice}</span>
                        </IonText>}

                    </span>
                    <IonText color="primary"><h6 className="mb-2 ">{props.name}</h6></IonText>
                </div>              
                <div className="small text-gray-500 d-flex ml-3 align-items-center justify-content-between">
                    <small className="subtext">{props.unitLabel}</small>
                </div>
                <div className="small text-gray-500 d-flex ml-3 align-items-center justify-content-end">
                    {props.inStock ? <AddToCartButton productId={props.productId} variationId={props.variationId}/>
                    :
                    <IonText color="secondary">Out of Stock</IonText>}
                </div>
            </div>
        </IonGrid>
    )
}

export default ProductCard;