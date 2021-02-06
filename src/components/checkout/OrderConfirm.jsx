import React, { useContext, useState } from 'react';
import { IonAlert, IonCol, IonContent, IonGrid, IonItem, IonLabel, IonRow, IonText } from '@ionic/react';
import AddressTile from '../Cards/AddressTile';
import { useHistory } from 'react-router';
import { CartContext } from '../../App';

const OrderConfirm = (props) => {
    const cartContext = useContext(CartContext);
    const history = useHistory();
    const [infoAlertState, setInfoAlertState] = useState({show: props.preOrder.orderItems.length === 0, msg: 'You have no items left in the cart'});
    
    if (props.preOrder.orderItems.length > 0) {
        return (
            <IonContent className="ion-padding order-review-table" color="dark">
                <IonGrid className="p-2">
                    <IonRow className="p-2 ion-text-center border-bottom border-secondary">
                        <IonCol>
                            <IonText className="headtext" color="light">Please confirm your order before proceeding</IonText>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-text-right p-0 pr-2">
                        <IonCol size="6" className="p-0">
                            <IonLabel color="light"><span>Order Total:</span></IonLabel>
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
                            <IonLabel className="subtext"><span>Shipping Charge:</span></IonLabel>
                        </IonCol>
                        <IonCol size="6" className="p-0">
                            <IonLabel><div>{'₹'+props.preOrder.totalChargesValue}</div></IonLabel>
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
                                <IonLabel color="light"><span>Bill Amount:</span></IonLabel>
                        </IonCol>
                        <IonCol size="6">
                                <h6>{'₹'+props.preOrder.finalTotal}</h6>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <AddressTile title="Delivery address:"
                            addressId={props.preOrder.shippingAddress.id}
                            fName={props.preOrder.shippingAddress.firstName}
                            lName={props.preOrder.shippingAddress.lastName}
                            line1={props.preOrder.shippingAddress.line1}
                            line2={props.preOrder.shippingAddress.line2}
                            city={props.preOrder.shippingAddress.city}
                            state={props.preOrder.shippingAddress.state}
                            country={props.preOrder.shippingAddress.country}
                            zipCode={props.preOrder.shippingAddress.zipcode}
                            phone={props.preOrder.shippingAddress.phoneNumber} />

                <AddressTile title="Billing address:"
                            addressId={props.preOrder.billingAddress.id}
                            fName={props.preOrder.billingAddress.firstName}
                            lName={props.preOrder.billingAddress.lastName}
                            line1={props.preOrder.billingAddress.line1}
                            line2={props.preOrder.billingAddress.line2}
                            city={props.preOrder.billingAddress.city}
                            state={props.preOrder.billingAddress.state}
                            country={props.preOrder.shippingAddress.country}
                            zipCode={props.preOrder.billingAddress.zipcode}
                            phone={props.preOrder.billingAddress.phoneNumber} />
            </IonContent>
        )
        
    }
    else {
        return (
            <IonContent className="ion-padding order-review-table" color="dark">
                <IonAlert isOpen={infoAlertState.show}
                            onDidDismiss={()=> setInfoAlertState(false)}
                            header={''}
                            cssClass='groc-alert'
                            message={infoAlertState.msg}
                            buttons={[{text:'OK', handler: ()=>history.push("/products/cart/"+props.preOrder.customerId)}]}/>
            </IonContent>
        )
    }
}

export default OrderConfirm;