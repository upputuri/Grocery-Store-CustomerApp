import { IonButton, IonButtons, IonCol, IonContent, IonFooter, IonHeader, IonIcon, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { chevronForwardOutline as nextIcon } from 'ionicons/icons';
import Client from 'ketting';
import React from 'react';
import { withRouter } from "react-router-dom";
import CartItemTile from '../components/Cards/CartItemTile';
import BaseToolbar from '../components/Menu/BaseToolbar';
import { serviceBaseURL } from '../components/Utilities/ServiceCaller.ts';


class Cart extends React.Component{
    state = {
        data: null,
        resource: null,
        cartTotal: 0.0
    }

    componentDidMount()
    {
        //this.loadCart();
    }

    componentDidUpdate()
    {
        // const { customerId } = this.props.match.params;
        // let path = serviceBaseURL + '/customers/'+customerId+'/cart/items';
        // if (this.state.resource !== null && path.localeCompare(this.state.resource.uri) === 0)
        //     return;
        if (this.state.data === null)
            this.loadCart();
    }

    async loadCart()
    {
        const { customerId } = this.props.match.params;
        let path = serviceBaseURL + '/customers/'+customerId+'/cart/items';

        const client = new Client(path);
        const resource = client.go();
        let receivedState;
        try{
            receivedState = await resource.get();
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            return;
        }
        const items = receivedState.getEmbedded().map((itemState) => itemState.data);
        // alert(items.length);
        const cartTotal = items.reduce((a, item) => a+item.totalPrice, 0.0);
        console.log('cart total'+cartTotal);
        this.setState({
            data: items,
            resource: resource,
            cartTotal: cartTotal
        });   
    }

    qtyChangeHandler()
    {
        this.setState({data:null})
    }

    render(){
        return (
            <IonPage>
                <IonHeader className="osahan-nav">
                    <BaseToolbar title="Your Cart"/>
                    <IonSearchbar className="pt-1" placeholder="Search for products"></IonSearchbar>      
                </IonHeader>              
                <IonContent color="dark" >
                    {
                        this.state.data && this.state.data.map(
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
                                        qtyChangeHandler={this.qtyChangeHandler.bind(this)}/>
                            )
                        }
                    )}
                </IonContent>
                <IonFooter>
                    <IonToolbar color="secondary">
                        <IonRow>
                            <IonCol>
                                <IonTitle><small>Cart Total: </small>{'₹'+this.state.cartTotal}</IonTitle>
                            </IonCol>
                            <IonCol>
                                <IonButtons >
                                </IonButtons>
                            </IonCol>
                        </IonRow>
                    </IonToolbar>
                    <IonToolbar color="secondary">
                        <IonButtons slot="end">
                                <IonButton size="small" shape="round">
                                    Checkout<IonIcon size="large" icon={nextIcon}></IonIcon>
                                </IonButton>                                
                        </IonButtons>
                    </IonToolbar>
                </IonFooter>                
            </IonPage>
        )
    }
}

export default withRouter(Cart);
