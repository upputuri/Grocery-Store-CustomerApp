import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import Client from 'ketting';
import React, { useContext } from 'react';
import { LoginContext } from '../App';

const serviceBaseURL = "http://localhost:8080/groc";

class Cart extends React.Component{
    state = {
        items: [],
        resource: null
    }

    componentDidMount()
    {
        this.loadCart();
    }

    componentDidUpdate()
    {
        this.loadCart();
    }

    async loadCart()
    {
        let path = serviceBaseURL + '/customers/'+this.props.customerId+'/cart/items';
        if (this.state.resource !== null && path.localeCompare(this.state.resource.uri) === 0)
            return;

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
        this.setState({
            data: items,
            resource: resource
        })    
    }

    render(){
        return (
            <IonPage >
                <IonHeader className="osahan-nav">
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton/>
                        </IonButtons>
                        <IonTitle>
                            Your Cart
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent color="dark">
                    
                </IonContent>
            </IonPage>
        )
    }
}

export default Cart;
