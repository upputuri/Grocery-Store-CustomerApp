import { IonAlert, IonCol, IonContent, IonGrid, IonHeader, IonLoading, IonPage, IonRow, IonText } from '@ionic/react';
import { Client,  basicAuth } from 'ketting';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { LoginContext } from '../../../App';
import OrderTile from '../../../components/Cards/OrderTile';
import BaseToolbar from '../../../components/Menu/BaseToolbar';
import ServiceRequest, { serviceBaseURL } from '../../../components/Utilities/ServiceCaller';

const Orders = () => {
    const [loadingState, setLoadingState] = useState(false);
    const [serviceRequestAlertState, setServiceRequestAlertState] = useState({show: false, msg: ''});
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const [cancelAlertState, setCancelAlertState] = useState({show: false, msg: 'Are you sure you want to cancel the order?', orderId: 0});
    const [retryState, setRetryState] = useState(false);
    const loginContext = useContext(LoginContext);
    const [ordersState, setOrdersState] = useState(null);
    const history = useHistory();
    const search = useLocation().search;

    const newOrderId = new URLSearchParams(search).get('id');

    useEffect(()=>{
        loadOrders();
    },[])
    
    const loadOrders = async () => {
        let path = serviceBaseURL + '/orders?cuid='+loginContext.customer.id;
        const client = new Client(path);
        const resource = client.go();
        const authHeaderBase64Value = btoa(loginContext.customer.email+':'+loginContext.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        let receivedState;
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
                return;
            } 
            setLoadingState(false);
            setServiceRequestAlertState({show: true, msg: e.toString()});
            return;
        }
        // alert(JSON.stringify(receivedState));
        const orders = receivedState.getEmbedded().map((orderState) => orderState.data);
        // console.log(JSON.stringify(newOrderId));
        // console.log(JSON.stringify(orders));
        setOrdersState(orders);
        console.log("Loaded orders from server");
        setLoadingState(false);  
    }

    const sendCancelRequest = async (orderId) => {
        setLoadingState(true);
        let serviceRequest = new ServiceRequest();
        await serviceRequest.cancelOrder(orderId, {loginId: loginContext.customer.email,
                                                                            password: loginContext.customer.password});
        if (serviceRequest.hasResponse && serviceRequest.isResponseOk)
        {
            console.log("Cancel order on server complete for orderId: "+orderId);
            setLoadingState(false);  
        }
        else if (serviceRequest.hasResponse){
            if (serviceRequest.responseObject.status && serviceRequest.responseObject === 401){
                history.push("/login");
                return;
            } 
            setLoadingState(false);
            setServiceRequestAlertState({show: true, msg: serviceRequest.responseObject.message});
            return;
        }
    }

    const processOrderCancel = (orderId) => {
        sendCancelRequest(orderId).then(()=>loadOrders());
    }

    const checkAndProceedToCancel = (orderId) => {
        setCancelAlertState({...cancelAlertState, show: true, orderId: orderId});
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
                <IonAlert isOpen={cancelAlertState.show}
                            onDidDismiss={()=> setCancelAlertState({...cancelAlertState, show: false})}
                            header={''}
                            message={cancelAlertState.msg}
                            buttons={[{text: 'Yes', handler: processOrderCancel.bind(this, cancelAlertState.orderId)}, 'No']}/>                    
                <IonContent className="ion-padding" color="dark">
                    {newOrderId === 0 && 
                    <IonGrid className="m-0">
                        <IonRow className="p-3 ion-text-center border border-succes">
                            <IonCol>
                                <h6>Failed to get a response from server. Check your orders below before placing a new order!</h6>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    }
                    {newOrderId > 0  &&
                    <IonRow className="p-3 ion-text-center border border-success">
                        <IonCol>
                            <h6>Your Order has been placed successfully!</h6>
                            <IonText color="primary">{'Order# '+newOrderId}</IonText>
                        </IonCol>
                    </IonRow>
                    }
                    {ordersState && ordersState.map((order) =>{
                        // console.log(order.orderId);
                        return <OrderTile key={order.orderId} newOrderId = {newOrderId}
                                            order = {order}
                                            cancelClickHandler = {checkAndProceedToCancel.bind(this, order.orderId)}/>
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
}

export default Orders;