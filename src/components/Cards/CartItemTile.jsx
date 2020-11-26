import { IonCard, IonCol, IonGrid, IonIcon, IonRow, IonText } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router';
import CartItemQtyControl from '../Menu/CartItemQtyControl';
import { defaultImageURL, thumbNailImageStoreURL } from '../Utilities/ServiceCaller';
import { close as trashIcon } from 'ionicons/icons';

const CartItemTile = (props) =>
{
    const history = useHistory();

    const viewProduct = (productId) => {
        history.push('/products/single/'+productId);
    }

    const deleteItemClicked = () => {
        if (props.qty >= 1) {
            // alert(props.qty*-1);
            props.qtyChangeHandler(props.qty*-1);
        }
    }

    return (
        <IonGrid className="p-2">
            <IonRow>
                <IonCol size="auto">
                    {/* <IonText className="subtext" color="danger">Remove</IonText> */}
                    <IonIcon onClick={deleteItemClicked} size="small" icon={trashIcon} color="primary"></IonIcon>
                </IonCol>
                <IonCol onClick={viewProduct.bind(this, props.productId)} size="auto">
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
                        <IonCol size="7">
                            <IonText color="primary">{props.unitLabel}</IonText>
                        </IonCol>                         
                        <IonCol size="5">
                            <div className="d-flex justify-content-end">
                            <CartItemQtyControl qty={props.qty}
                                            productId={props.productId}
                                            variantId={props.variationId} 
                                            onQtyUpdate={props.qtyChangeHandler} />
                            </div>
                        </IonCol>
                    </IonRow>
                </IonCol>
            </IonRow>
        </IonGrid>
    )
}

export default CartItemTile;