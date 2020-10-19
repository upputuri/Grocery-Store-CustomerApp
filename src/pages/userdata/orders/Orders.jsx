import { IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import React, { useContext } from 'react';
import { CartContext } from '../../../App';
import CartButton from '../../../components/Menu/CartButton';

const Orders = () => {
    const cartContext = useContext(CartContext);
    return (
    <IonPage>
        <IonHeader class="osahan-nav">
          <IonToolbar>
            <IonButtons slot="start">
                <IonMenuButton/>
            </IonButtons>
            <IonTitle>
                Orders
            </IonTitle>
            <CartButton/>
          </IonToolbar>      
        </IonHeader>
        <IonContent className="ion-padding" color="dark">
            <IonGrid className="p-3">
                <IonRow className="p-3 ion-text-center border-bottom">
                    <IonCol>
                        <h6>Your Order has been placed successfully!</h6>
                        <IonText color="primary">{'Order# '+cartContext.order.id}</IonText>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    </IonPage>        
    )
}

export default Orders;