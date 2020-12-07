import { IonButton, IonButtons, IonCol, IonContent, IonFooter, IonHeader, IonIcon, IonLoading, IonPage, IonRouterLink, IonRow, IonSearchbar, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { chevronForwardOutline as nextIcon } from 'ionicons/icons';
import Client from 'ketting';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, withRouter } from "react-router-dom";
import { CartContext, LoginContext } from '../../App';
import CartItemTile from '../../components/Cards/CartItemTile';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import GrocSearch from '../../components/Menu/GrocSearch';
import { serviceBaseURL } from '../../components/Utilities/ServiceCaller.jsx';


const Cart = (props) =>{
    const [cartItemsState, setCartItemsState] = useState({
        data: null,
        cartTotal: 0.0
    });

    const [showLoading, setShowLoading] = useState(false);

    useEffect(()=>{
        loadCart();        
    }, []);


    const loginContext = useContext(LoginContext);
    const cartContext = useContext(CartContext);
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
        let path = serviceBaseURL + '/customers/'+customerId+'/cart?coverid='+cartContext.order.cover.coverId;
        setShowLoading(true);
        const client = new Client(path);
        const resource = client.go();
        let receivedState;
        const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
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
            setShowLoading(false);
            return;
        }
        console.log("Service call response received");
        // alert(JSON.stringify(receivedState));
        // const items = receivedState.getEmbedded().map((itemState) => itemState.data);
        const items = receivedState.data.cartItems;
        // const totalCartCount = items.map((item)=>item.qty).reduce((a, c)=>a+c,0);
        // alert(totalCartCount);
        cartContext.setCartCount(items.length);
        // alert(items.length);
        // const cartTotal = items.reduce((a, item) => a+item.totalPrice, 0.0);
        const cartTotal = receivedState.data.cartTotal;
        console.log('cart total'+cartTotal);
        //alert(JSON.stringify(items));
        setCartItemsState({
            data: items,
            cartTotal: cartTotal
        });
        setShowLoading(false);   
    }

    const qtyChangeHandler = (productId, variationId, qty) =>
    {
        console.log("Cart page received request from cartqtychangecontrol: "+productId+":"+variationId+","+qty)
        cartContext.addItem(productId, variationId, qty).then(()=>loadCart());
    }

    // const cartItemDeleteHandler = (id) => {

    // }

    return (
        <IonPage>
            <IonHeader className="osahan-nav border-white border-bottom">
                <BaseToolbar title="Your Cart"/>
                <GrocSearch/>      
            </IonHeader>              
            <IonContent color="dark" className="ion-padding">
                {
                    cartItemsState.data && cartItemsState.data.map(
                    (item) => {
                        //alert(JSON.stringify(item));
                        return ( 
                                <CartItemTile
                                    id={item.cartItemId}
                                    key={item.cartItemId}
                                    productId={item.productId}
                                    variationId={item.variationId}
                                    image={item.image} 
                                    name={item.productName} 
                                    discount={item.discount} 
                                    unitLabel={item.unitLabel}
                                    qty={item.qty}
                                    totalPriceAfterDiscount={item.totalPriceAfterDiscount}
                                    qtyChangeHandler={qtyChangeHandler.bind(this, item.productId, item.variationId)}
                                    // onDeleteClick={cartItemDeleteHandler}
                                    />
                        )
                    }
                )}
            </IonContent>
            <IonLoading isOpen={showLoading}/>
            <IonFooter>
                <IonToolbar color="night border-white border-top">
                    <IonRow>
                        <IonCol className="ion-padding">
                            <IonText className="headtext"><small>Cart Total: </small>{'₹'+cartItemsState.cartTotal}</IonText>
                        </IonCol>
                        <IonCol>
                            <IonButtons >
                            </IonButtons>
                        </IonCol>
                    </IonRow>
                </IonToolbar>
                <IonToolbar color="night">
                        <IonButtons slot="end">
                            <IonButton onClick={()=>cartItemsState.data && cartItemsState.data.length>0 && history.push('/checkout')} size="small" shape="round">
                                Checkout<IonIcon size="large" icon={nextIcon}></IonIcon>
                            </IonButton>                                
                        </IonButtons>
                </IonToolbar>
            </IonFooter>                
        </IonPage>
    )

}

export default withRouter(Cart);
