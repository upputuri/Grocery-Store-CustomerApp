import { IonButton, IonIcon, IonText } from '@ionic/react';
import { add as addIcon, remove as removeIcon } from 'ionicons/icons';
import React from 'react';

const CartItemQtyControl = (props) => {

    const changeCartQty = (qty) => 
    {
        if (qty === -1 && props.qty <= 1)
            return;
        console.log("Updating qty from qtychangecontrol: "+qty);
        props.onQtyUpdate(qty);
    }

    return (
        <div className="d-inline-block">
                        <div className="d-flex">
                        <IonButton onClick={changeCartQty.bind(this, -1)} color="secondary" size="small" className="cart-qty-button ion-no-padding m-0">
                            <IonIcon className="m-1 m-md-3" icon={removeIcon} size="small"></IonIcon></IonButton>
                        <div className="cart-qty-value ml-2 mr-2"><IonText color="light">{props.qty}</IonText></div>
                        <IonButton onClick={changeCartQty.bind(this, 1)} color="secondary" size="small" className="cart-qty-button ion-no-padding m-0">
                            <IonIcon className="m-1 m-md-3" icon={addIcon} size="small"></IonIcon></IonButton>                            
                        </div>
        </div>
    )
}

export default CartItemQtyControl;