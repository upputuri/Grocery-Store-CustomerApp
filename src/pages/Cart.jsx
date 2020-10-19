import { IonButton, IonButtons, IonCol, IonContent, IonFooter, IonHeader, IonIcon, IonLoading, IonPage, IonRouterLink, IonRow, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { chevronForwardOutline as nextIcon } from 'ionicons/icons';
import Client from 'ketting';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, withRouter } from "react-router-dom";
import { LoginContext } from '../App';
import CartItemTile from '../components/Cards/CartItemTile';
import BaseToolbar from '../components/Menu/BaseToolbar';
import { serviceBaseURL } from '../components/Utilities/ServiceCaller.ts';


const Cart = (props) =>{
    const [cartItemsState, setCartItemsState] = useState({
        data: null,
        resource: null,
        cartTotal: 0.0
    });

    const [showLoading, setShowLoading] = useState(false);

    useEffect(()=>{
        if (cartItemsState.data === null)
        {
            loadCart();        
            setShowLoading(true);
        }
    });


    const loginContext = useContext(LoginContext);
    const history = useHistory();
    // componentDidUpdate()
    // {
    //     // const { customerId } = this.props.match.params;
    //     // let path = serviceBaseURL + '/customers/'+customerId+'/cart/items';
    //     // if (this.state.resource !== null && path.localeCompare(this.state.resource.uri) === 0)
    //     //     return;
    //     if (this.state.data === null)
    //         this.loadCart();
    // }

    const loadCart = async () =>
    {
        const { customerId } = props.match.params;
        if (!customerId)
        {
            history.push("/login");
            return;
        }
        let path = serviceBaseURL + '/customers/'+customerId+'/cart/items';

        const client = new Client(path);
        const resource = client.go();
        let receivedState;
        const authHeaderBase64Value = btoa(loginContext.customer.email+':'+loginContext.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);
        console.log("Making service call: "+resource.uri);
        try{
            receivedState = await resource.get({
                headers: loginHeaders
            });
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            if (e.status && e.status === 401)//Unauthorized
            {
                history.push("/login");
            } 
            return;
        }
        const items = receivedState.getEmbedded().map((itemState) => itemState.data);
        // alert(items.length);
        const cartTotal = items.reduce((a, item) => a+item.totalPrice, 0.0);
        console.log('cart total'+cartTotal);
        setCartItemsState({
            data: items,
            resource: resource,
            cartTotal: cartTotal
        });
        setShowLoading(false);   
    }

    const qtyChangeHandler = () =>
    {
        setCartItemsState({
            data: null,
            resource: null,
            cartTotal: 0.0
        });
    }


    return (
        <IonPage>
            <IonHeader className="osahan-nav">
                <BaseToolbar title="Your Cart"/>
                <IonSearchbar className="pt-1" placeholder="Search for products"></IonSearchbar>      
            </IonHeader>              
            <IonContent color="dark" >
                {
                    cartItemsState.data && cartItemsState.data.map(
                    (item) => {
                        return ( 
                                <CartItemTile
                                    id={item.cartItemId}
                                    key={item.cartItemId}
                                    productId={item.productId}
                                    variationId={item.variationId} 
                                    name={item.productName} 
                                    discount={item.discount} 
                                    unitLabel={item.unitLabel}
                                    qty={item.qty}
                                    totalPrice={item.totalPrice}
                                    qtyChangeHandler={qtyChangeHandler.bind(this)}/>
                        )
                    }
                )}
            </IonContent>
            <IonLoading isOpen={showLoading}/>
            <IonFooter>
                <IonToolbar color="secondary">
                    <IonRow>
                        <IonCol>
                            <IonTitle><small>Cart Total: </small>{'₹'+cartItemsState.cartTotal}</IonTitle>
                        </IonCol>
                        <IonCol>
                            <IonButtons >
                            </IonButtons>
                        </IonCol>
                    </IonRow>
                </IonToolbar>
                <IonToolbar color="secondary">
                        <IonButtons slot="end">
                            <IonButton onClick={()=>history.push('/checkout')} size="small" shape="round">
                                Checkout<IonIcon size="large" icon={nextIcon}></IonIcon>
                            </IonButton>                                
                        </IonButtons>
                </IonToolbar>
            </IonFooter>                
        </IonPage>
    )

}

export default withRouter(Cart);
