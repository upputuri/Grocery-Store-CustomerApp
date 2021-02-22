import { IonButton, IonIcon, IonText } from '@ionic/react';
import { add as addIcon, remove as removeIcon } from 'ionicons/icons';
import React from 'react';
import { withCartUpdateOps } from './HOCs';


const CartItemQtyControl = (props) => {
    // const [qtyState, setQtyState] = useState(props.qty);
    // const history = useHistory();
    // const loginContext = useContext(LoginContext);
    // const cartContext = useContext(CartContext);

    // const changeCartQty = (qty) => 
    // {
    //     if (qty === -1 && qtyState <= 1)
    //         return;

    //     if (!loginContext.isAuthenticated)
    //     {
    //         console.log("Customer is not authenticated, hence redirecting to login page");
    //         history.push("/login");
    //         return;
    //     }
    //     console.log("Invoking add Item on cart context");
    //     cartContext.addItem(props.productId, props.variantId, qty).then((result) => {
    //         if (result.success === true) {
    //             setQtyState(qtyState+qty);
    //         }
    //     });            
    // }

    return (
        <div className="d-inline-block">
            <div className="d-flex">
            <IonButton onClick={() => props.removeQty(1)} color="secondary" size="small" className="cart-qty-button ion-no-padding m-0">
                <IonIcon className="m-1 m-md-3" icon={removeIcon} size="small"></IonIcon></IonButton>
            <div className="cart-qty-value ml-2 mr-2"><IonText color="light">{props.qty}</IonText></div>
            <IonButton onClick={() => props.addQty(1)} color="secondary" size="small" className="cart-qty-button ion-no-padding m-0">
                <IonIcon className="m-1 m-md-3" icon={addIcon} size="small"></IonIcon></IonButton>                            
            </div>
        </div>
    )
}

export default withCartUpdateOps(CartItemQtyControl);