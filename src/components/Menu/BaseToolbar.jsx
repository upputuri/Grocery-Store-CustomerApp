import { IonBadge, IonButton, IonButtons, IonIcon, IonMenuButton, IonTitle, IonToolbar } from '@ionic/react';
import React, { useContext } from 'react';
import { useHistory, withRouter } from 'react-router';
import { LoginContext, CartContext } from '../../App';
import { cartOutline as cartOutlineIcon } from 'ionicons/icons';
import CartButton from './CartButton';

const BaseToolbar = (props)=>{
    let history = useHistory();
    let loginContext = useContext(LoginContext);
    
    // const viewCart = (customerId) =>
    // {
    //     console.log(loginContext.isAuthenticated+","+customerId);
    //     if (!loginContext.isAuthenticated)
    //     {
    //         history.push("/login");
    //         return;
    //     }
    //     history.push("/products/cart/"+customerId);
    //     return;
    // }

    return (
        <IonToolbar>
            <IonButtons slot="start">
                <IonMenuButton/>
            </IonButtons>
            <IonTitle>
                {props.title}
            </IonTitle>
            {/* <IonButtons slot="primary">
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
            </IonButtons> */}
            <CartButton/>
        </IonToolbar> 
    )
}

export default BaseToolbar;