import { IonButton, IonButtons, IonCard, IonCol, IonIcon, IonicSafeString, IonRow, IonText } from '@ionic/react'
import React from 'react'
import { CartContext } from '../../App'
import { addCircle as addIcon, removeCircle as removeIcon, trash as trashIcon } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { defaultImageURL, thumbNailImageStoreURL } from '../Utilities/ServiceCaller';

const CartItemTile = (props) =>
{
    const history = useHistory();

    const viewProduct = (productId) => {
        history.push('/products/single/'+productId);
    }

    return (
        <IonCard onClick={viewProduct.bind(this, props.productId)} className="bg-black">
            <IonRow>
                <IonCol size="auto">
                    <img alt="img" className="not-found-img m-2" width="70px" height="70px" src={props.image?thumbNailImageStoreURL+'/'+props.image:defaultImageURL}/>
                </IonCol>
                <IonCol>
                    <IonRow>
                        <IonCol>
                            <IonText color="primary"><strong>{props.name}</strong></IonText>
                        </IonCol>
                        <IonCol>
                            <div className="ion-text-end text-white">{'₹'+props.totalPriceAfterDiscount}</div>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonText color="primary">{props.unitLabel}</IonText>
                        </IonCol>
                        <CartContext.Consumer>
                            {context =>                            
                            <IonCol>
                                <IonIcon size="large" icon={props.qty>1 ? removeIcon: trashIcon} onClick={(event) => 
                                                {
                                                    //context.addItem(props.productId, props.variationId, -1);
                                                    props.qtyChangeHandler(props.productId, props.variationId, -1);
                                                    event.stopPropagation();
                                                }} 
                                            color='danger'>
                                                </IonIcon>
                                    <IonText className="m-2 text-white ion-text-center">{props.qty}</IonText>
                                <IonIcon size="large" icon={addIcon} onClick={(event) => 
                                                {
                                                    //context.addItem(props.productId, props.variationId, 1);
                                                    props.qtyChangeHandler(props.productId, props.variationId, 1);
                                                    event.stopPropagation();
                                                }} 
                                            color="secondary">
                                                </IonIcon>
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