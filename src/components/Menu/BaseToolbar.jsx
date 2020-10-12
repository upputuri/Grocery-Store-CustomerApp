import { IonBadge, IonButton, IonButtons, IonIcon, IonMenuButton, IonTitle, IonToolbar } from '@ionic/react';
import React, { useContext } from 'react';
import { useHistory, withRouter } from 'react-router';
import { LoginContext, CartContext } from '../../App';
import { cartOutline as cartOutlineIcon } from 'ionicons/icons';

const BaseToolbar = (props)=>{
    let history = useHistory();
    let loginContext = useContext(LoginContext);
    
    const viewCart = (customerId) =>
    {
        if (!loginContext.isAuthenticated)
        {
            history.push("/login");
            return;
        }
        history.push("/products/cart/"+customerId);
    }

    return (
        <IonToolbar>
            <IonButtons slot="start">
                <IonMenuButton/>
            </IonButtons>
            <IonTitle>
                {props.title}
            </IonTitle>
            <IonButtons slot="primary">
                <LoginContext.Consumer>
                    {(context) => 
                        (
                            <IonButton onClick={viewCart.bind(this,context.customer.id)} className="top-cart" color="primary">
                                <IonBadge color="primary">
                                    <CartContext.Consumer>{(context) => context.itemCount}</CartContext.Consumer>
                                </IonBadge>
                                <IonIcon slot="start" icon={cartOutlineIcon}></IonIcon>
                            </IonButton>
                        )
                    }
                </LoginContext.Consumer>
            </IonButtons>
        </IonToolbar> 
    )
}

export default BaseToolbar;