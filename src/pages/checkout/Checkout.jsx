import { IonAlert, IonButton, IonButtons, IonCol, IonContent, IonFooter, IonHeader, IonIcon, IonLoading, IonPage, IonRow, IonText, IonToolbar } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import { Switch, useHistory } from 'react-router';
import { CartContext, LoginContext, TransactionContext } from '../../App';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import { chevronForwardOutline as nextIcon, chevronBackOutline as previousIcon } from 'ionicons/icons';
import DeliveryOptions from '../../components/checkout/DeliveryOptions';
import Client from 'ketting';
import { logoURL, serviceBaseURL } from '../../components/Utilities/ServiceCaller';
import PaymentOptions from '../../components/checkout/PaymentOptions';
import OrderReview from '../../components/checkout/OrderReview'
import OrderConfirm from '../../components/checkout/OrderConfirm';
import BillingOptions from '../../components/checkout/BillingOptions';
import { clientConfig, generateOrderId, sendEmailNotification, sendMobileNotification } from '../../components/Utilities/AppCommons';
import { loadStripe } from '@stripe/stripe-js';

var RazorpayCheckout = require('com.razorpay.cordova/www/RazorpayCheckout');

const Checkout = (props) => {
    const [deliveryOptionsPhase, billingOptionsPhase, orderReviewPhase, PaymentOptionsPhase, OrderConfirmPhase] = [
                                                                            {title: 'Select a delivery address'},
                                                                            {title: 'Select a billing address'},
                                                                            {title: 'Review Order'},
                                                                            {title: 'Choose Payment'},
                                                                            {title: 'Confirm & Pay'}
                                                                        ];                                                                    
    const phases = [deliveryOptionsPhase, billingOptionsPhase, orderReviewPhase, PaymentOptionsPhase, OrderConfirmPhase];
    const [phaseData, setPhaseData] = useState(null);
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [shippingAddressIdState, setShippingAddressIdState] = useState(0);
    // const [statesList, setStatesList] = useState(undefined);
    const [citiesList, setCitiesList] = useState(undefined);
    const [finalBillAmountState, setFinalBillAmountState] = useState(0);
    const [loadingState, setLoadingState] = useState(false);
    const [confirmAlertState, setConfirmAlertState] = useState({show: false, msg: ''});
    const [serviceRequestAlertState, setServiceRequestAlertState] = useState({show: false, msg: ''});
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const [retryState, setRetryState] = useState(false);
    const loginContext = useContext(LoginContext);
    const cartContext = useContext(CartContext);
    const transactionContext = useContext(TransactionContext);
    const [promoCodeState, setPromoCodeState] = useState(cartContext.order.promoCodes[0]);
    const [paymentOptionIdState, setPaymentOptionIdState] = useState(cartContext.order.paymentOptionId);
    const [razorPayOrderIdState, setRazorPayOrderIdState] = useState(undefined);                                                                   
    const [variablesState, setVariablesState] = useState(undefined);
    const history = useHistory();

    useEffect(()=>{
        switch (currentPhaseIndex) {
            case 0:
            case 1:
                loadCities().then(()=>{
                    loadAddressList();
                });
                break;
            case 2:
                loadPreOrderSummary();
                break;
            case 3:
                loadPaymentOptions();
                break;
            case 4:
                loadPreOrderSummary();
            default:
                break;
        }
    }, [retryState, promoCodeState]);

    useEffect(()=>{
        loadVariables();
    }, []);

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


    const loadVariables = async () => {
        let path = serviceBaseURL + '/application/variables?keys=contact_no';
        const client = new Client(path);
        const resource = client.go();
        let receivedState;
        // setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        try{
            receivedState = await resource.get();
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            setLoadingState(false);
            return;
        }
        const variablesMap = receivedState.data;
        // alert(JSON.stringify(variables));
        setVariablesState(variablesMap.variables);
        // setLoadingState(false);  
    }
    // const loadStatesList = async () => {
    //     let path = serviceBaseURL + '/application/states';
    //     const client = new Client(path);
    //     const resource = client.go();
    //     setLoadingState(true);
    //     console.log("Making service call: "+resource.uri);
    //     let receivedState;
    //     try{
    //         receivedState = await resource.get();
    //     }
    //     catch(e)
    //     {
    //         console.log("Service call failed with - "+e);
    //         setLoadingState(false);
    //         setServiceRequestAlertState({show: true, msg: e.toString()});
    //         return;
    //     }
    //     // alert(JSON.stringify(receivedState));
    //     const states = receivedState.getEmbedded().map((state) => state.data);
    //     console.log("Loaded states from server");
    //     // alert(JSON.stringify(states));
    //     setStatesList(states);
    // }

    const loadCities = async () => {
        const client = new Client(serviceBaseURL+'/stores/covers/cities');
        const resource = client.go();
        console.log("Making service call: "+resource.uri);
        let receivedData;
        try{
            receivedData = await resource.get();
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            return;
        }
        // alert(JSON.stringify(receivedData));
        console.log("Received response from service call: "+resource.uri);
        const cities = receivedData.getEmbedded().map((cityState) => cityState.data);
        // alert(JSON.stringify(cities));
        // console.log(images);
        setCitiesList(cities);
    }

    const createAddressRequest = async (address) => {
        console.log("Creating address: "+JSON.stringify(address));
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
            receivedState = await resource.post({
                data: address,
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
        console.log("Updated address on server - address Id "+address.id);
        setLoadingState(false);         
    }

    const saveNewAddress = (address) => {
        //Send service request
        console.log("Saving edited address with Id "+ address.id);
        createAddressRequest(address).then(()=>{loadAddressList()})
    }

    const loadPreOrderSummary = async () => {
        let path = serviceBaseURL + '/orders/preorders?coverid='+cartContext.order.cover.coverId;
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
        preOrderSummary.transaction && transactionContext.setTransactionId(preOrderSummary.transaction.id);
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
        // loadPreOrderSummary().then(()=>{
        //     setConfirmAlertState({show: true, msg: "Ready to place order?"});
        // });
    }
    
    const processPlaceOrder = () => {
        //Create order and show success page
        // alert(JSON.stringify(preOrder));
        if (phaseData.transaction && phaseData.transaction.providerId === 'razorpay') {
            processRazorPayPayment(phaseData.transaction);
        }
        else if (phaseData.transaction && phaseData.transaction.providerId === 'stripe') {
            processStripePayment(phaseData.transaction);
        }
        else {
            sendPlaceOrderRequest();
        }
        //history.push('/orderplaced');
        setCurrentPhaseIndex(-1);
    }

    const sendPlaceOrderRequest = (response) => {
        cartContext.placeOrder(response).then((newOrder)=>{
            console.log("Promise resolved new order "+JSON.stringify(newOrder));
            // alert(encodeURIComponent(newOrder.createdTS));
            history.push("/orderplaced?id="+newOrder.id+"&canceltimeout="+newOrder.cancelTimeout+"&createdts="+encodeURIComponent(newOrder.createdTS));
            if (newOrder.id > 0) {
                let receivedOrderTS = newOrder.createdTS;
                let displayOrderId = generateOrderId(newOrder.id, receivedOrderTS);
                const msg = `Dear ${loginContext.isAuthenticated && loginContext.customer.fname && loginContext.customer.fname.trim() !== '' ? loginContext.customer.fname : 'Customer'}, 
                Your order ${displayOrderId}  is placed successfully. Please use this number for all queries regarding your order. You can reach us at ${variablesState ? variablesState.contact_no : '7767988348'}. Thanks.`
                // const msg = "Thank you for shopping with us! Your order has been placed successfully. We will process your order at the earliest";
                sendEmailNotification(loginContext, "We have received your order", msg);
                sendMobileNotification(loginContext, msg);
            }
            // setInfoAlertState({show: true, msg: 'Failed to get a response from server. Check your orders page before placing the order again!'});
        });
    }

    const backwardExit = () => {
        history.push('/products/cart/'+loginContext.customer.id);
        setCurrentPhaseIndex(-1)
    }

    const checkPhaseDone = () => {
        return (currentPhaseIndex === 0 && cartContext.order.deliveryAddressId > 0) ||
        (currentPhaseIndex === 1 && cartContext.order.billingAddressId > 0) ||
        (currentPhaseIndex === 2 && true) ||
        (currentPhaseIndex === 3 && cartContext.order.paymentOptionId)
    }

    const deliveryAddressSelected = (addressId, city, showWarning) => {
        console.log("Address seleted for delivery - Id: "+addressId);
        // alert(city+" "+cartContext.order.cover.coverCity);
        if (city.toLowerCase() !== cartContext.order.cover.coverCity.toLowerCase()){
            if (showWarning === true){
                setInfoAlertState({show: true, msg: clientConfig.wrongCityAddressSelectedErrorMsg})
            }
            return;
        }
        cartContext.setDeliveryAndBillingAddress(addressId, 0);
    }

    const billingAddressSelected = (addressId) => {
        console.log("Address seleted for billing - Id: "+addressId);
        cartContext.setBillingAddress(addressId);
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

    const processRazorPayPayment = async (transaction) => {
        // alert(transaction.providerData);
        // alert("RazorPay not supported");
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
        sendPlaceOrderRequest(JSON.stringify(success));
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

    const processStripePayment = async (transaction) => {
        const providerData = JSON.parse(transaction.providerData);
        const session = JSON.parse(providerData.session);
        alert(transaction.providerData);
        const stripePromise = loadStripe(providerData.key);
        const stripe = await stripePromise;

        // When the customer clicks on the button, redirect them to Checkout.
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        alert("Stripe call result is : "+JSON.stringify(result));
        if (result.error) {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.
        }
        else{
            // Poll server for result.
            alert("payment on stripe processed. Poll server to get orderId");
        }
    }


    if (phaseData !== null) {
        console.log("Rendering checkout page");
        return (
            <IonPage>
                <IonHeader className="osahan-nav border-white border-bottom">
                    <BaseToolbar title="Checking Out"/>
                    <IonRow className="osahan-nav border-white border-top">
                        <IonCol className="ion-padding">
                            <IonText color="light" className="maintext">{phases[currentPhaseIndex] && phases[currentPhaseIndex].title}</IonText>
                        </IonCol>
                    </IonRow>     
                </IonHeader>
                <IonLoading isOpen={loadingState}/>

                {currentPhaseIndex === 0 && <DeliveryOptions addresses={phaseData}
                                                                // states={statesList} 
                                                                citiesList={citiesList} 
                                                                selectedDeliveryAddressId={cartContext.order.deliveryAddressId}
                                                                selectedBillingAddressId={cartContext.order.billingAddressId}
                                                                onDeliveryAddressSelected={deliveryAddressSelected}
                                                                onBillingAddressSelected={billingAddressSelected}
                                                                addressAddHandler={saveNewAddress}/>}
                {currentPhaseIndex === 1 && <BillingOptions addresses={phaseData}
                                                                // states={statesList} 
                                                                citiesList = {citiesList}
                                                                selectedBillingAddressId={cartContext.order.billingAddressId}
                                                                onBillingAddressSelected={billingAddressSelected}
                                                                addressAddHandler={saveNewAddress}/>}
                {currentPhaseIndex === 2 && <OrderReview 
                                                    preOrder={phaseData} 
                                                    preOrderConfirmHandler={preOrderConfirmed}
                                                    promoCodeApplied={updatePromoCodeInCart}
                                                    promoCodeCleared={clearPromoCodeInCart}
                                                    appliedPromoCode={cartContext.order.promoCodes[0]}/>}
                {currentPhaseIndex === 3 && <PaymentOptions paymentOptions={phaseData} 
                                                            selectedOption={cartContext.order.paymentOptionId}
                                                            paymentOptionSelectHandler={paymentOptionConfirmed}/>}           
                {currentPhaseIndex === 4 && <OrderConfirm preOrder={phaseData}/>}       

                <IonAlert isOpen={confirmAlertState.show}
                            onDidDismiss={()=> setConfirmAlertState({...confirmAlertState, show: false})}
                            header={''}
                            cssClass='groc-alert'
                            message={confirmAlertState.msg}
                            buttons={[{text: 'Yes', handler: processPlaceOrder}, 'No']}/> 
                <IonAlert isOpen={infoAlertState.show}
                            onDidDismiss={()=> setInfoAlertState(false)}
                            header={''}
                            cssClass='groc-alert'
                            message={infoAlertState.msg}
                            buttons={['OK']}/>
                <IonFooter>
                    <IonToolbar color="night border-white border-top">
                            <IonButtons slot="start">
                                <IonButton onClick={goBack} className="ion-no-margin">
                                    <IonIcon size="large" icon={previousIcon}></IonIcon>Back
                                </IonButton>
                            </IonButtons>
                            <IonButtons slot="end">
                                {currentPhaseIndex+1 === phases.length ? 
                                <IonButton onClick={processPlaceOrder} className="ion-no-margin">
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