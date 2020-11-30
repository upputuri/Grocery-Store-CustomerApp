import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { CartContext, LoginContext } from '../../App';
import { cartOutline as cartOutlineIcon } from 'ionicons/icons';
import { IonBadge, IonButton, IonButtons, IonIcon } from '@ionic/react';



const CartButton = () =>
{
    const loginContext = useContext(LoginContext);
    const history = useHistory();

    const viewCart = (customerId) =>
    {
        //console.log(loginContext.isAuthenticated+","+customerId);
        if (!loginContext.isAuthenticated)
        {
            history.push("/login");
            return;
        }
        history.push("/products/cart/"+customerId);
        return;
    }

    return (
        <IonButtons slot="primary">
            <LoginContext.Consumer>
            {(context) => 
                (
                    <IonButton onClick={viewCart.bind(this,context.customer.id)} className="top-cart" color="light">
                        <IonBadge color="light">
                            <CartContext.Consumer>{(context) => context.itemCount}</CartContext.Consumer>
                        </IonBadge>
                        <IonIcon slot="start" icon={cartOutlineIcon}></IonIcon>
                    </IonButton>
                )
            }
            </LoginContext.Consumer>
        </IonButtons>
    )
}

export default CartButton;