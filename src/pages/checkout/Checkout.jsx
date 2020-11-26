import { IonAlert, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonLoading, IonPage, IonRow, IonToolbar } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import { Switch, useHistory } from 'react-router';
import { CartContext, LoginContext } from '../../App';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import { chevronForwardOutline as nextIcon, chevronBackOutline as previousIcon } from 'ionicons/icons';
import DeliveryOptions from '../../components/checkout/DeliveryOptions';
import Client from 'ketting';
import { logoURL, razorPayKey, serviceBaseURL } from '../../components/Utilities/ServiceCaller';
import PaymentOptions from '../../components/checkout/PaymentOptions';
import OrderReview from '../../components/checkout/OrderReview'
import OrderConfirm from '../../components/checkout/OrderConfirm';

var RazorpayCheckout = require('com.razorpay.cordova/www/RazorpayCheckout');

const Checkout = (props) => {
    const [deliveryOptionsPhase, orderReviewPhase, PaymentOptionsPhase, OrderConfirmPhase] = [
                                                                            {title: 'Choose Delivery'},
                                                                            {title: 'Review Order'},
                                                                            {title: 'Choose Payment'},
                                                                            {title: 'Confirm & Pay'}
                                                                        ];                                                                    
    const phases = [deliveryOptionsPhase, orderReviewPhase, PaymentOptionsPhase, OrderConfirmPhase];
    const [phaseData, setPhaseData] = useState(null);
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [shippingAddressIdState, setShippingAddressIdState] = useState(0);
    
    const [finalBillAmountState, setFinalBillAmountState] = useState(0);
    const [loadingState, setLoadingState] = useState(false);
    const [confirmAlertState, setConfirmAlertState] = useState({show: false, msg: ''});
    const [serviceRequestAlertState, setServiceRequestAlertState] = useState({show: false, msg: ''});
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const [retryState, setRetryState] = useState(false);
    const loginContext = useContext(LoginContext);
    const cartContext = useContext(CartContext);
    const [promoCodeState, setPromoCodeState] = useState(cartContext.order.promoCodes[0]);
    const [paymentOptionIdState, setPaymentOptionIdState] = useState(cartContext.order.paymentOptionId);
    const [razorPayOrderIdState, setRazorPayOrderIdState] = useState(undefined);                                                                   
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
            case 3:
                loadPreOrderSummary();
            default:
                break;
        }
    }, [retryState, promoCodeState]);

    const loadAddressList = async () => {
        let path = serviceBaseURL + '/customers/'+loginContext.customer.id+'/addresses';
        const client = new Client(path);
        const resource = client.go();
        const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
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
        let path = serviceBaseURL + '/orders/preorders';
        const client = new Client(path);
        const resource = client.go();
        const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        let receivedState;
        try{
            receivedState = await resource.post({
                headers: loginHeaders,
                data: {...cartContext.order, customerId: loginContext.customer.id}
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
        preOrderSummary.transaction && cartContext.setTransactionId(preOrderSummary.transaction.id);
        // alert(JSON.stringify(addresses));
        setPhaseData(preOrderSummary);
        console.log("Loaded preorder summary from server");
        setLoadingState(false);      
        return preOrderSummary;   
    }

    const loadPaymentOptions = async () => {
        //Load 'Instant Payment' options
        setLoadingState(true);
        let instantOptions = await loadPaymentOptionsWithType(1);
        //Load 'Pay on Delivery' options
        let ondeliveryOptions = await loadPaymentOptionsWithType(2);
        setPhaseData({instant: instantOptions, ondelivery: ondeliveryOptions});
        setLoadingState(false);

    }
    const loadPaymentOptionsWithType = async (type) => {
        let path = serviceBaseURL + '/application/paymentoptions?type='+type;
        const client = new Client(path);
        const resource = client.go();
        const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
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
            setServiceRequestAlertState({show: true, msg: e.toString()});
            return;
        }
        // alert(JSON.stringify(receivedState));
        const paymentOptions = receivedState.getEmbedded().map((option) => option.data);
        // alert(JSON.stringify(paymentOptions));
        
        // let newPhaseData = {...phaseData};
        // newPhaseData[`${typeName}`] = paymentOptions;
        // alert(JSON.stringify(newPhaseData));
        // setPhaseData(newPhaseData);
        console.log("Loaded payment options from server");
        return paymentOptions;
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
        loadPreOrderSummary().then(()=>{
            setConfirmAlertState({show: true, msg: "Ready to place order?"});
        });
    }
    
    const sendPlaceOrderRequest = () => {
        //Create order and show success page
        // alert(JSON.stringify(preOrder));
        if (phaseData.transaction && phaseData.transaction.providerId === 'razorpay') {
            razorPayPOClicked(phaseData.transaction);
        }
        else {
            cartContext.placeOrder().then((newOrderId)=>{
                console.log("Promise resolved new orderId "+newOrderId);
                history.push("/orderplaced?id="+newOrderId);
                // setInfoAlertState({show: true, msg: 'Failed to get a response from server. Check your orders page before placing the order again!'});
            });
        }
        //history.push('/orderplaced');
        setCurrentPhaseIndex(-1);
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
        setPaymentOptionIdState(paymentOptionId);
    }

    // Promo code logic
    const updatePromoCodeInCart = (code) => {
        cartContext.setPromoCodes([code]);
        setPromoCodeState(code);
        //loadPreOrderSummary();
    }

    const clearPromoCodeInCart = () => {
        cartContext.setPromoCodes([]);
        setPromoCodeState('');
    }

    const razorPayPOClicked = async (transaction) => {
        // alert(transaction.providerData);
        const providerData = JSON.parse(transaction.providerData);
        const orderId = providerData.order.id;
        const razorPayKey = providerData.key;
        const amount = providerData.order.amount;
        // alert(orderId+" "+razorPayKey+" "+amount);
        // alert(orderId);
            var options = {
                description: 'Payment towards Vegit order',
                image: logoURL,
                order_id: orderId,
                currency: 'INR',
                key: razorPayKey,
                amount: `${amount}`,
                name: 'The Vegit Club',
                theme: {
                    color: '#3399cc'
                    }
            };
            console.log(RazorpayCheckout);
            RazorpayCheckout.on('payment.success', razorPaySuccessCallback);
            RazorpayCheckout.on('payment.cancel', razorPayFailCallback);
            RazorpayCheckout.open(options);
    }

    const razorPaySuccessCallback = (success) => {
        // alert('payment_id: ' + success.razorpay_payment_id);
        // var orderId = success.razorpay_order_id;
        // var signature = success.razorpay_signature;
        // alert(JSON.stringify(success));
        // Now send request to place order and pass the transaction data along with the request
        //cartContext.setTransactionResponse(JSON.stringify(success));
        cartContext.placeOrder(JSON.stringify(success)).then((newOrderId)=>{
            // console.log("Promise resolved new orderId "+newOrderId);
            history.push("/orderplaced?id="+newOrderId);
                // setInfoAlertState({show: true, msg: 'Failed to get a response from server. Check your orders page before placing the order again!'});
        });
    }
    
    const razorPayFailCallback = (error) => {
        history.push("/orderplaced?id=-1");
        // alert(error.description + ' (Error '+error.code+')');
        // alert(JSON.stringify(error));
        //setInfoAlertState({show: true, msg: error.description + ' (Error '+error.code+')'});
        // Always place order request to server with transaction response attached. Server will take a decision on creating order or otherwise and return a
        // order creation response code.
        // cartContext.placeOrder().then((newOrderId)=>{

        //     //console.log("Promise resolved new orderId "+newOrderId);
        //     //history.push("/orderplaced?id="+newOrderId);
        //         // setInfoAlertState({show: true, msg: 'Failed to get a response from server. Check your orders page before placing the order again!'});
        // });
    }

    if (phaseData !== null) {
        console.log("Rendering checkout page");
        return (
            <IonPage>
                <IonHeader className="osahan-nav border-white border-bottom">
                    <BaseToolbar title="Checking Out"/>     
                </IonHeader>
                <IonLoading isOpen={loadingState}/>

                {currentPhaseIndex === 0 && <DeliveryOptions addresses={phaseData} 
                                                                selectedAddressId={cartContext.order.deliveryAddressId} 
                                                                addressSelectHandler={deliveryAddressSelected}/>}
                {currentPhaseIndex === 1 && <OrderReview 
                                                    preOrder={phaseData} 
                                                    preOrderConfirmHandler={preOrderConfirmed}
                                                    promoCodeApplied={updatePromoCodeInCart}
                                                    promoCodeCleared={clearPromoCodeInCart}
                                                    appliedPromoCode={cartContext.order.promoCodes[0]}/>}
                {currentPhaseIndex === 2 && <PaymentOptions paymentOptions={phaseData} 
                                                            selectedOption={cartContext.order.paymentOptionId}
                                                            paymentOptionSelectHandler={paymentOptionConfirmed}/>}           
                {currentPhaseIndex === 3 && <OrderConfirm preOrder={phaseData}/>}       

                <IonAlert isOpen={confirmAlertState.show}
                            onDidDismiss={()=> setConfirmAlertState({...confirmAlertState, show: false})}
                            header={''}
                            cssClass='groc-alert'
                            message={confirmAlertState.msg}
                            buttons={[{text: 'Yes', handler: sendPlaceOrderRequest}, 'No']}/> 
                <IonAlert isOpen={infoAlertState.show}
                            onDidDismiss={()=> setInfoAlertState(false)}
                            header={''}
                            cssClass='groc-alert'
                            message={infoAlertState.msg}
                            buttons={['OK']}/>
                <IonFooter>
                    <IonToolbar color="secondary">
                            <IonButtons slot="start">
                                <IonButton onClick={goBack} className="ion-no-margin">
                                    <IonIcon size="large" icon={previousIcon}></IonIcon>Back
                                </IonButton>
                            </IonButtons>
                            <IonButtons slot="end">
                                {currentPhaseIndex+1 === phases.length ? 
                                <IonButton onClick={sendPlaceOrderRequest} className="ion-no-margin">
                                    {phaseData.transaction.providerId === 'cod' ? 'Place Order' : 'Pay'}
                                    <IonIcon size="large" icon={nextIcon}></IonIcon>
                                </IonButton>
                                :
                                <IonButton onClick={goForward} className="ion-no-margin">Next
                                    <IonIcon size="large" icon={nextIcon}></IonIcon>
                                </IonButton>}
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
                <IonHeader className="osahan-nav border-bottom border-white">
                    <BaseToolbar title="Checking out"/>     
                </IonHeader>
                <IonLoading isOpen={loadingState}/>                
                <IonContent color="dark">
                    <IonAlert
                        isOpen={serviceRequestAlertState.show}
                        header={'Error'}
                        cssClass='groc-alert'
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