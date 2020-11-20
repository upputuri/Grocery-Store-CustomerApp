import { IonButton, IonCol, IonContent, IonGrid, IonItem, IonLabel, IonList, IonListHeader, IonRadio, IonRadioGroup, IonRow, IonText } from '@ionic/react';
import React, { useState } from 'react';

var RazorpayCheckout = require('com.razorpay.cordova/www/RazorpayCheckout');


const PaymentOptions = (props) => {
    const [selectedOption, setSelectionOption] = useState(props.selectedOption);

    const updateSelection = (event) => {
        setSelectionOption(event.detail.value)
        props.paymentOptionSelectHandler(event.detail.value);
    }

    const razorPayPOClicked = () => {
        var options = {
            description: 'Payment towards Vegit order',
            image: 'https://i.imgur.com/3g7nmJC.png',
            order_id: 'order_G2CEwOKqpCZ7jv',
            currency: 'INR',
            key:'rzp_test_gtgk7x1URhgpBg',
            amount:'1',
            name: 'Acme Corp',
            theme: {
                color: '#3399cc'
                }
        };
        console.log(RazorpayCheckout);
        RazorpayCheckout.on('payment.success', successCallback);
        RazorpayCheckout.on('payment.cancel', cancelCallback);
        RazorpayCheckout.open(options);
    }

    const successCallback = (success) => {
        alert('payment_id: ' + success.razorpay_payment_id);
        var orderId = success.razorpay_order_id;
        var signature = success.razorpay_signature;
        console.log("OrderId: "+orderId+", signature: "+signature);
    }
    
    const cancelCallback = (error) => {
        alert(error.description + ' (Error '+error.code+')')
    }

    return (
        <IonContent className="ion-padding" color="dark">
            <IonGrid className="p-2">
                <IonRow className="p-3 ion-text-center border-bottom border-secondary">
                    <IonCol>
                        <IonText color="primary">Please select a payment option</IonText>
                    </IonCol>
                </IonRow>
                <IonRow className="p-2 border-bottom border-secondary">
                    <IonCol>
                        <IonList className="p-0">
                            <IonRadioGroup color="night" value={selectedOption} onIonChange={updateSelection}>
                                <IonListHeader color="night" >
                                    Pay On Delivery
                                </IonListHeader>
                                {props.onDeliveryOptions && props.onDeliveryOptions.map((onDelOption) => {
                                    return <IonItem color="night" lines="none" key={onDelOption.id}>
                                                <IonLabel>
                                                    {onDelOption.name}
                                                </IonLabel>
                                                <IonRadio slot="start" value={onDelOption.id}/>
                                            </IonItem>
                                })}
                            </IonRadioGroup>
                        </IonList>
                    </IonCol>
                </IonRow>
                <IonRow className="p-2">
                    <IonCol>
                        <IonList className="p-0">
                            <IonListHeader color="night">Credit cards, Debit cards, Netbanking</IonListHeader>
                        </IonList>
                    </IonCol>
                </IonRow>
                <IonRow className="p-2">
                    <IonCol>
                        <IonButton color="secondary" routerDirection="forward" expand="block" onClick={razorPayPOClicked} className="ion-no-margin">
                        <img alt="razorpay" className="single-img" src="assets/320px-Razorpay_logo.svg.png"/>
                        </IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>                        
        </IonContent>
    )
}

export default PaymentOptions;