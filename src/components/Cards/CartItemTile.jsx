import { IonButton, IonButtons, IonCard, IonCol, IonRow, IonText } from '@ionic/react'
import React from 'react'
import { CartContext } from '../../App'

const CartItemTile = (props) =>
{
    return (
        <IonCard className="bg-black">
            <IonRow>
                <IonCol size="auto">
                    <img alt="img" className="not-found-img m-2" width="70px" height="70px" src="assets/item/9.jpg"/>
                </IonCol>
                <IonCol>
                    <IonRow>
                        <IonCol>
                            <IonText color="primary"><strong>{props.name}</strong></IonText>
                        </IonCol>
                        <IonCol>
                            <div className="ion-text-end text-white">{'₹'+props.totalPrice}</div>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonText color="primary">{props.unitLabel}</IonText>
                        </IonCol>
                        <CartContext.Consumer>
                            {context =>                            
                            <IonCol>
                                <IonButton size="small" shape="round" color='danger'>-</IonButton>
                                    <IonText className="m-2 text-white">{props.qty}</IonText>
                                <IonButton onClick={() => 
                                                {
                                                    context.addItem(props.productId, props.variationId, 1)
                                                    props.qtyChangeHandler();
                                                }} 
                                            size="small" shape="round" color="secondary">+</IonButton>
                            </IonCol>
                            }
                        </CartContext.Consumer>   
                    </IonRow>
                </IonCol>
            </IonRow>
        </IonCard>
    )
}

export default CartItemTile;