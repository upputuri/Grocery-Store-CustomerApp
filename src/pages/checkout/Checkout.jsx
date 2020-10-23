import { IonAlert, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonLoading, IonPage, IonRow, IonToolbar } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import { Switch, useHistory } from 'react-router';
import { CartContext, LoginContext } from '../../App';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import { chevronForwardOutline as nextIcon, chevronBackOutline as previousIcon } from 'ionicons/icons';
import DeliveryOptions from '../../components/checkout/DeliveryOptions';
import Client from 'ketting';
import { serviceBaseURL } from '../../components/Utilities/ServiceCaller';
import PaymentOptions from '../../components/checkout/PaymentOptions';
import OrderReview from '../../components/checkout/OrderReview'

const Checkout = (props) => {
    const [deliveryOptionsPhase, orderReviewPhase, PaymentOptionsPhase] = [
                                                                            {title: 'Choose Delivery'},
                                                                            {title: 'Review Order'},
                                                                            {title: 'Choose Payment'}
                                                                        ];                                                                    
    const phases = [deliveryOptionsPhase, orderReviewPhase, PaymentOptionsPhase];
    const [phaseData, setPhaseData] = useState(null);
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
                                                                        
    const [shippingAddressIdState, setShippingAddressIdState] = useState(0);
    
    const [finalBillAmountState, setFinalBillAmountState] = useState(0);
    const [loadingState, setLoadingState] = useState(false);
    const [serviceRequestAlertState, setServiceRequestAlertState] = useState({show: false, msg: ''});
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const [retryState, setRetryState] = useState(false);
    const loginContext = useContext(LoginContext);
    const cartContext = useContext(CartContext);
    const history = useHistory();

    useEffect(()=>{
        switch (currentPhaseIndex) {
            case 0:
                loadAddressList();
                break;
            case 1:
                loadPreOrderSummary();
                break;
            case 2:
                loadPaymentOptions();
                break;
            default:
                break;
        }
    }, [retryState]);

    const loadAddressList = async () => {
        let path = serviceBaseURL + '/customers/'+loginContext.customer.id+'/addresses';
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
        const addresses = receivedState.getEmbedded().map((addressState) => addressState.data);
        // alert(JSON.stringify(addresses));
        setPhaseData(addresses);
        console.log("Loaded addresses from server");
        setLoadingState(false);  
    }

    const loadPreOrderSummary = async () => {
        let path = serviceBaseURL + '/orders/preorder?customerId='+loginContext.customer.id+'&deliveryAddressId='+cartContext.order.deliveryAddressId;
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
        const preOrderSummary = receivedState.data;
        // alert(JSON.stringify(addresses));
        setPhaseData(preOrderSummary);
        console.log("Loaded preorder summary from server");
        setLoadingState(false);         
    }

    const loadPaymentOptions = async () => {
        let path = serviceBaseURL + '/application/paymentoptions?type=ondelivery';
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
        const paymentOptions = receivedState.getEmbedded().map((option) => option.data);
        // alert(JSON.stringify(paymentOptions));
        setPhaseData(paymentOptions);
        console.log("Loaded payment options from server");
        setLoadingState(false);
    }

    const goForward = () => {
        if (!checkPhaseDone()) {
            console.log('Current phase confirmation action not received');
            return;
        }
        if (currentPhaseIndex<0 || currentPhaseIndex>=phases.length) {
            console.log('Invalid Checkout Navigation request, not processing');
            return;
        }
        currentPhaseIndex+1<phases.length ? setCurrentPhaseIndex(currentPhaseIndex+1):forwardExit();
        setPhaseData(null);
        setRetryState(!retryState);
    }

    const goBack = () => {
        if (currentPhaseIndex<0 || currentPhaseIndex>=phases.length) {
            console.log('Invalid Checkout Navigation request, not processing');
            return;
        }        
        currentPhaseIndex>0 ? setCurrentPhaseIndex(currentPhaseIndex-1):backwardExit();
        setPhaseData(null);
        setRetryState(!retryState);
    }

    const forwardExit = () => {
        //Create order and show success page
        cartContext.placeOrder().then(()=>{
            cartContext.order.id != 0 ? history.push("/orders?id="+cartContext.order.id): 
                setInfoAlertState({show: true, msg: 'Failed to get a response from server. Check your orders page before repeating the order!'});
        });
        //history.push('/orderplaced');
        setCurrentPhaseIndex(-1)
    }

    const backwardExit = () => {
        history.push('/products/cart/'+loginContext.customer.id);
        setCurrentPhaseIndex(-1)
    }

    const checkPhaseDone = () => {
        return (currentPhaseIndex === 0 && cartContext.order.deliveryAddressId > 0) ||
        (currentPhaseIndex === 1 && true) ||
        (currentPhaseIndex === 2 && cartContext.order.paymentType !== null)
    }

    const deliveryAddressSelected = (addressId) => {
        console.log("Address seleted for delivery - Id: "+addressId);
        cartContext.setDeliveryAddress(addressId);
    }

    const preOrderConfirmed = () => {

    }

    const paymentOptionConfirmed = (paymentOptionId) => {
        console.log("Payment option selected: "+paymentOptionId);
        cartContext.setPaymentOption(paymentOptionId);
    }

    if (phaseData !== null) {
        console.log("Rendering checkout page");
        return (
            <IonPage>
                <IonHeader className="osahan-nav">
                    <BaseToolbar title="Checking Out"/>     
                </IonHeader>
                <IonLoading isOpen={loadingState}/>
                <IonAlert isOpen={infoAlertState.show}
                            onDidDismiss={()=> setInfoAlertState(false)}
                            header={''}
                            message={infoAlertState.msg}
                            buttons={['OK']}/>

                {currentPhaseIndex === 0 && <DeliveryOptions addresses={phaseData} 
                                                                selectedAddressId={cartContext.order.deliveryAddressId} 
                                                                addressSelectHandler={deliveryAddressSelected}/>}
                {currentPhaseIndex === 1 && <OrderReview preOrder={phaseData} preOrderConfirmHandler={preOrderConfirmed}/>}
                {currentPhaseIndex === 2 && <PaymentOptions onDeliveryOptions={phaseData} 
                                                            selectedOption={cartContext.order.paymentOptionId}
                                                            paymentOptionSelectHandler={paymentOptionConfirmed}/>}                  

                <IonFooter>
                    <IonToolbar color="secondary">
                            <IonButtons slot="start">
                                <IonButton onClick={goBack} className="ion-no-margin">
                                    <IonIcon size="large" icon={previousIcon}></IonIcon>Back
                                </IonButton>
                            </IonButtons>
                            <IonButtons slot="end">
                                <IonButton onClick={goForward} className="ion-no-margin">Next
                                    <IonIcon size="large" icon={nextIcon}></IonIcon>
                                </IonButton>
                            </IonButtons>
                    </IonToolbar>  
                </IonFooter>
            </IonPage>
        )
    }
    else {
        console.log("show alert "+serviceRequestAlertState.show);
            return (
            <IonPage>
                <IonHeader className="osahan-nav">
                    <BaseToolbar title="Checking out"/>     
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

export default Checkout;