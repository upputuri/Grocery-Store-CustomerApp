import { IonAlert, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonLabel, IonLoading, IonPage, IonRow, IonText } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { LoginContext } from '../../../App';
import AddressTile from '../../../components/Cards/AddressTile';
import BaseToolbar from '../../../components/Menu/BaseToolbar';
import ServiceRequest, { serviceBaseURL } from '../../../components/Utilities/ServiceCaller';
import StatusText from './StatusText';

const OrderDetail = (props) => {
    const [orderDetailState, setOrderDetailState] = useState(null);
    const [displayTS, setDisplayTS] = useState(null);
    const [loadingState, setLoadingState] = useState(false);
    const [serviceRequestAlertState, setServiceRequestAlertState] = useState({show: false, msg: ''});
    const [cancelAlertState, setCancelAlertState] = useState({show: false, msg: 'Are you sure you want to cancel the order?'});
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const [retryState, setRetryState] = useState(false);
    const loginContext = useContext(LoginContext);
    const history = useHistory();

    useEffect(()=>{
        const { id } = props.match.params;
        loadOrderDetail(id);
    },[]);

    const loadOrderDetail = async (orderId) => {
        let path = serviceBaseURL + '/orders/'+orderId;
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
        const orderDetail = receivedState.data;
        setOrderDetailState(orderDetail);
        let receivedOrderTS = orderDetail.createdTS;
        let displayTS = receivedOrderTS;
        if (receivedOrderTS){
            const date = new Date(receivedOrderTS);
            displayTS = date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
        }
        else{
            displayTS = "Unavailable";
        }
        setDisplayTS(displayTS);
        
        console.log("Loaded order detail from server");
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

    const processOrderCancel = () => {
        sendCancelRequest(orderDetailState.id).then(loadOrderDetail.bind(this,orderDetailState.id));
    }

    const checkAndProceedToCancel = () => {
        setCancelAlertState({...cancelAlertState, show: true});
    }


    if (orderDetailState !== null){
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
                            buttons={[{text: 'Yes', handler: processOrderCancel}, 'No']}/>                                              
                <IonContent className="ion-padding order-review-table" color="dark">
                    <IonGrid className="p-2">
                        <IonRow className="ion-text-center border-bottom">
                        <IonCol className="p-3">
                            <IonText color="primary">{'Order# '+orderDetailState.id}</IonText>
                        </IonCol>
                        <IonCol className="p-3">
                            <IonText color="primary">{'₹'+orderDetailState.finalTotal}</IonText>
                        </IonCol>
                        </IonRow>
                        <IonRow className="ion-text-left">
                            <IonCol>
                                <IonText className="subtext ml-2">Order time: </IonText><IonText color="secondary">{displayTS}</IonText>
                            </IonCol>
                        </IonRow>
                        <IonRow className="ion-text-left">
                            <IonCol>
                                <IonText className="subtext ml-2">Status: </IonText><StatusText status={orderDetailState.status.trim()}/>
                            </IonCol>
                        </IonRow>
                        {(orderDetailState.status.trim() === 'Initial' || orderDetailState.status.trim() === 'Executing') &&
                        <IonRow className="border-bottom">
                            <IonCol>
                                <div className="d-flex justify-content-end">
                                    <IonButton onClick={checkAndProceedToCancel} className="ml-2" color="tertiary" size="small">Cancel Order</IonButton>
                                </div>
                            </IonCol>
                        </IonRow>
                        }
                        <IonRow className="p-2 border-bottom">
                            <IonCol size="6" className="ion-text-left">
                                <IonText color="primary">Item</IonText>
                            </IonCol>
                            <IonCol size="2" className="ion-text-right">   
                                <IonText color="primary">count</IonText>
                            </IonCol>
                            <IonCol size="4" className="ion-text-right">
                                <IonText color="primary">Price</IonText>
                            </IonCol>
                        </IonRow>
                        {orderDetailState.orderItems && orderDetailState.orderItems.map((orderItem, index) => {
                            return <IonRow className="p-2 border-bottom" key={index}>
                                        <IonCol size="6">
                                            <small>{orderItem.name+'-'+orderItem.qtyUnit}</small>
                                        </IonCol>
                                        <IonCol size="2" className="ion-text-right">   
                                            <small>{orderItem.qty}</small>
                                        </IonCol>
                                        <IonCol size="4" className="ion-text-right">
                                            <small>{orderItem.totalPriceAfterDiscount}</small>
                                        </IonCol>
                                    </IonRow>
                        })}
                        <IonRow className="ion-text-right">
                            <IonCol size="6">
                                <IonLabel color="primary"><span>Sub Total:</span></IonLabel>
                            </IonCol>
                            <IonCol size="6">
                                <IonLabel><div>{'₹'+orderDetailState.orderTotal}</div></IonLabel>
                            </IonCol>
                        </IonRow>
                        <IonRow className="ion-text-right">
                            <IonCol size="6">
                                <IonLabel color="primary"><span>Discounted Total:</span></IonLabel>
                            </IonCol>
                            <IonCol size="6">
                                <IonLabel><div>{'₹'+orderDetailState.discountedTotal}</div></IonLabel>
                            </IonCol>
                        </IonRow>
                        <IonRow className="ion-text-right">
                            <IonCol size="6">
                                <IonLabel color="primary"><span>{'Taxes ('+orderDetailState.totalTaxRate+'%):'}</span></IonLabel>
                            </IonCol>
                            <IonCol size="6">
                                <IonLabel><div>{'₹'+orderDetailState.totalTaxValue}</div></IonLabel>
                            </IonCol>
                        </IonRow>
                        <IonRow className="ion-text-right">
                            <IonCol size="6">
                                    <IonLabel color="primary"><span>Bill Amount:</span></IonLabel>
                            </IonCol>
                            <IonCol size="6">
                                    <h6>{'₹'+orderDetailState.finalTotal}</h6>
                            </IonCol>
                        </IonRow>
                    </IonGrid>

                    <AddressTile title="Delivery address:"
                        addressId={orderDetailState.shippingAddress.id}
                        fName={orderDetailState.shippingAddress.firstName}
                        lName={orderDetailState.shippingAddress.lastName}
                        line1={orderDetailState.shippingAddress.line1}
                        line2={orderDetailState.shippingAddress.line2}
                        city={orderDetailState.shippingAddress.city}
                        state={orderDetailState.shippingAddress.state}
                        zipCode={orderDetailState.shippingAddress.zipcode}
                        phone={orderDetailState.shippingAddress.phoneNumber} />
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

export default OrderDetail;