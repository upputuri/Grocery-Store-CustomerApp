import { IonBadge, IonButton, IonLabel, IonNote, IonText } from '@ionic/react'
import { attachProps } from '@ionic/react/dist/types/components/utils';
import React from 'react'

type ProductCardProps = {
    id: string,
    name: string,
    unitLabel: string,
    originalPrice: number,
    discountPrice: number,
    discount: number,
    productClickHandler: Function
}

const ProductCard = (props: ProductCardProps) =>
{
    return (
        <div onClick={()=>props.productClickHandler(props.id)} className="d-flex p-3 bg-black mb-2">
            <div className="shop-cart-left">
                <img alt="img" className="not-found-img" src="assets/small/3.jpg"/>
            </div>
            <div className="shop-cart-right">
                <div className="font-weight-normal mb-2 price ml-3">
                    <span>
                        <IonText><h5 className="mb-2 text-white">{'₹'+props.discountPrice}
                                    <span><IonText color="success">{props.discount > 0 ? props.discount+'% OFF':''}</IonText></span>
                                </h5>
                        </IonText>
                    </span>
                    <IonText color="primary"><h6 className="mb-2 ">{props.name}</h6></IonText>
                </div>              
                <div className="small text-gray-500 d-flex ml-3 align-items-center justify-content-between">
                    <small className="text-secondary">{props.unitLabel}</small>
                    <div className="input-group shop-cart-value">
                        <IonButton color="secondary" shape="round">
                            Add
                        </IonButton>
                        {/* <span className="input-group-btn"><button disabled="disabled" className="btn btn-sm" type="button">-</button></span>
                        <input type="text" max="10" min="1" value="1" className="form-control border-form-control form-control-sm input-number text-white bg-black" name="quant[1]"/>
                        <span className="input-group-btn"><button className="btn btn-sm" type="button">+</button>
                        </span> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard;