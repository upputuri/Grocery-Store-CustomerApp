import React from 'react';
import { useContext, useState } from "react";
import { useHistory } from "react-router";
import { CartContext, LoginContext } from "../../App";

const withCartUpdateOps = (CartItemControlComponent) => {
    return (props) => {
        const [qtyState, setQtyState] = useState(props.qty);
        const history = useHistory();
        const loginContext = useContext(LoginContext);
        const cartContext = useContext(CartContext);

        const {qty, passThroughProps} = props; 
    
        const changeCartQty = (qty) => 
        {
            if (qty === -1 && qtyState <= 1)
                return;
    
            if (!loginContext.isAuthenticated)
            {
                console.log("Customer is not authenticated, hence redirecting to login page");
                history.push("/login");
                return;
            }
            console.log("Invoking add Item on cart context");
            cartContext.addItem(props.productId, props.variantId, qty).then((result) => {
                if (result.success === true) {
                    setQtyState(qtyState+qty);
                }
            });            
        }

        return (
            <CartItemControlComponent {...passThroughProps} qty={qtyState} addQty={changeCartQty} removeQty={(qty) => changeCartQty(qty*-1)} />
        )
    }
}

export {withCartUpdateOps}