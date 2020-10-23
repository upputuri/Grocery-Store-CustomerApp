import { IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../../App';
import CartButton from '../../../components/Menu/CartButton';

const Orders = () => {
    const cartContext = useContext(CartContext);
    const [ordersState, setOrdersState] = useState(null);
    useEffect(()=>{
        loadOrders();
    },[])

    const loadOrders = () => {

    }

    if (ordersState !== null) {
        console.log("Rendering Orders page");
        return (
            <IonPage>
                <IonHeader className="osahan-nav">
                    <BaseToolbar title="Your Orders"/>     
                </IonHeader>
                <IonLoading isOpen={loadingState}/>
                <IonAlert isOpen={infoAlertState.show}
                            onDidDismiss={()=> setInfoAlertState(false)}
                            header={''}
                            message={infoAlertState.msg}
                            buttons={['OK']}/>                 
                <IonContent>
                    {cartContext.order.id && cartContext.order.id !=0 &&
                    <IonGrid className="p-3">
                        <IonRow className="p-3 ion-text-center border-bottom">
                            <IonCol>
                                <h6>Your Order has been placed successfully!</h6>
                                <IonText color="primary">{'Order# '+cartContext.order.id}</IonText>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    }
                    {ordersState && ordersState.map((order) =>{
                        <IonGrid>
                            <IonRow className="ion-text-center">
                                <IonCol>
                                    <IonText color="primary">{'Order# '+order.id}</IonText>
                                </IonCol>
                                <IonCol>
                                    <IonText color="primary">{'₹'+order.finalTotal}</IonText>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonButton color="secondary" size="small">Cancel Order</IonButton>
                                </IonCol>
                                <IonCol>
                                    <IonButton color="secondary" size="small">View Details</IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    })}  
                </IonContent>

            </IonPage>
        )
    }
    else {
        console.log("show alert "+serviceRequestAlertState.show);
            return (
            <IonPage>
                <IonHeader className="osahan-nav">
                    <BaseToolbar title="Your Orders"/>     
                </IonHeader>
                <IonLoading isOpen={loadingState}/>                
                <IonContent color="dark">
                    <IonAlert
                        isOpen={serviceRequestAlertState.show}
                        header={'Error'}
                        subHeader={serviceRequestAlertState.msg}
                        message={'Failed to load'}
                        buttons={[{text: 'Cancel', 
                                    handler: ()=>{history.push('/home')}
                                }, {text: 'Retry', 
                                    handler: ()=>{setServiceRequestAlertState({show: false, msg: ''}); setRetryState(!retryState)}}]}
                    />
                </IonContent>
            </IonPage>
        )
    }
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