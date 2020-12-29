import { IonBadge, IonButton, IonButtons, IonIcon, IonMenuButton, IonTitle, IonToolbar } from '@ionic/react';
import React, { useContext } from 'react';
import { useHistory, withRouter } from 'react-router';
import { LoginContext, CartContext } from '../../App';
import { chevronBackOutline as backIcon } from 'ionicons/icons';
import CartButton from './CartButton';
import { DeviceContext } from '../../App';

const BaseToolbar = (props)=>{
    let history = useHistory();
    let deviceContext = useContext(DeviceContext);
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
                {deviceContext.platform === 'ios' && 
                <IonIcon size="large" icon={backIcon} onClick={()=>history.goBack()} className="ion-no-padding"></IonIcon>}
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