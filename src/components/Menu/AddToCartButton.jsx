import { IonButton } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router';
import { CartContext, LoginContext } from '../../App';


const AddToCartButton = (props) => {
    const history = useHistory();
    const addToCart = (loginContext, cartContext, productId, variantId, qty) => 
    {
        if (!loginContext.isAuthenticated)
        {
            console.log("Customer is not authenticated, hence redirecting to login page");
            history.push("/login");
            return;
        }
        console.log("Invoking add Item on cart context");
        cartContext.addItem(productId, variantId, qty);
        return false;
    }

    return (
        <div className="">
            <LoginContext.Consumer>
                {loginContext => 
                    <CartContext.Consumer>
                        {cartContext =>
                        <IonButton 
                            onClick={(event) => {addToCart(loginContext, cartContext, props.productId, props.variationId, 1); event.stopPropagation()}} 
                            color="secondary" shape="round">Add</IonButton>
                        }
                    </CartContext.Consumer>
                }
            </LoginContext.Consumer>
        </div>
    )
}

export default AddToCartButton;