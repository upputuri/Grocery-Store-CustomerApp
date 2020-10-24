import { IonCol, IonContent, IonGrid, IonItem, IonLabel, IonRow, IonText } from '@ionic/react';
import React from 'react';


const OrderReview = (props) => {
    return (
        <IonContent className="ion-padding order-review-table" color="dark">
            <IonGrid className="p-2">
                <IonRow className="p-3 ion-text-center border-bottom">
                    <IonCol>
                        <IonText color="primary">Please review and cofirm your order</IonText>
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
                    return <IonRow className="p-2 border-bottom" key={index}>
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
                <IonRow className="ion-text-right p-1">
                    <IonCol size="6">
                        <IonLabel color="primary"><span>Sub Total:</span></IonLabel>
                    </IonCol>
                    <IonCol size="6">
                        <IonLabel><div>{'₹'+props.preOrder.orderTotal}</div></IonLabel>
                    </IonCol>
                </IonRow>
                <IonRow className="ion-text-right p-1">
                    <IonCol size="6">
                        <IonLabel color="primary"><span>{'Taxes ('+props.preOrder.totalTaxRate+'%):'}</span></IonLabel>
                    </IonCol>
                    <IonCol size="6">
                        <IonLabel><div>{'₹'+props.preOrder.totalTaxValue}</div></IonLabel>
                    </IonCol>
                </IonRow>
                <IonRow className="ion-text-right p-1">
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