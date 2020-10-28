import { IonCol, IonContent, IonGrid, IonItem, IonLabel, IonRow, IonText } from '@ionic/react';
import React from 'react';
import PromoCodeForm from '../forms/PromoCodeForm';


const OrderReview = (props) => {
    return (
        <IonContent className="ion-padding order-review-table" color="dark">
            <PromoCodeForm orderValue={props.preOrder.orderTotal} 
                            appliedCode={props.appliedPromoCode} 
                            codeApplied={props.promoCodeApplied} 
                            codeCleared={props.promoCodeCleared}/>
            <IonGrid className="p-2">
                <IonRow className="p-2 ion-text-center border-bottom">
                    <IonCol>
                        <IonText className="headtext" color="primary">Please review your order</IonText>
                    </IonCol>
                </IonRow>
                <IonRow className="p-2 border-bottom">
                    <IonCol size="6" className="ion-text-left">
                        <IonText color="primary">Item</IonText>         
                    </IonCol>
                    <IonCol size="2" className="ion-text-right">   
                        <IonText color="primary">count</IonText>
                    </IonCol>
                    <IonCol size="4" className="ion-text-right">
                        <IonText color="primary">Price</IonText>
                    </IonCol>
                </IonRow>
                {props.preOrder.orderItems && props.preOrder.orderItems.map((orderItem, index) => {
                    return <IonRow className="p-0 pr-1 border-bottom" key={index}>
                                <IonCol size="6">
                                    <small>{orderItem.name+'-'+orderItem.qtyUnit}</small>
                                </IonCol>
                                <IonCol size="2" className="ion-text-right">   
                                    <small>{orderItem.qty}</small>
                                </IonCol>
                                <IonCol size="4" className="ion-text-right">
                                    <small>{orderItem.totalPriceAfterDiscount}</small>
                                </IonCol>
                            </IonRow>
                })}
                <IonRow className="ion-text-right p-0 pr-2">
                    <IonCol size="6" className="p-0">
                        <IonLabel color="primary"><span>Sub Total:</span></IonLabel>
                    </IonCol>
                    <IonCol size="6" className="p-0">
                        <IonLabel><div>{'₹'+props.preOrder.orderTotal}</div></IonLabel>
                    </IonCol>
                </IonRow>
                <IonRow className="ion-text-right p-0 pr-2">
                    <IonCol size="6" className="p-0">
                        <IonLabel className="subtext"><span>Discounts (Promo Code):</span></IonLabel>
                    </IonCol>
                    <IonCol size="6" className="p-0">
                        <IonLabel><div>{'₹'+props.preOrder.totalDiscountValue}</div></IonLabel>
                    </IonCol>
                </IonRow>
                <IonRow className="ion-text-right p-0 pr-2">
                    <IonCol size="6" className="p-0">
                        <IonLabel className="subtext"><span>Discounted Total:</span></IonLabel>
                    </IonCol>
                    <IonCol size="6" className="p-0">
                        <IonLabel><div>{'₹'+props.preOrder.discountedTotal}</div></IonLabel>
                    </IonCol>
                </IonRow>
                <IonRow className="ion-text-right p-0 pr-2">
                    <IonCol size="6" className="p-0">
                        <IonLabel className="subtext"><span>{'Taxes ('+props.preOrder.totalTaxRate+'%):'}</span></IonLabel>
                    </IonCol>
                    <IonCol size="6" className="p-0">
                        <IonLabel><div>{'₹'+props.preOrder.totalTaxValue}</div></IonLabel>
                    </IonCol>
                </IonRow>
                <IonRow className="ion-text-right p-0">
                    <IonCol size="6">
                            <IonLabel color="primary"><span>Bill Amount:</span></IonLabel>
                    </IonCol>
                    <IonCol size="6">
                            <h6>{'₹'+props.preOrder.finalTotal}</h6>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    )
}

export default OrderReview;