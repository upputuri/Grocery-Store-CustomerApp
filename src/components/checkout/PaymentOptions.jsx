import { IonButton, IonCol, IonContent, IonGrid, IonItem, IonLabel, IonList, IonListHeader, IonRadio, IonRadioGroup, IonRow, IonText } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { LoginContext } from '../../App';
import { serviceBaseURL } from '../Utilities/ServiceCaller';



const PaymentOptions = (props) => {
    const [selectedOption, setSelectionOption] = useState(props.selectedOption);

    const updateSelection = (event) => {
        setSelectionOption(event.detail.value);
        props.paymentOptionSelectHandler(event.detail.value);
    }



    return (
        <IonContent className="ion-padding" color="dark">
            <IonGrid className="p-2">
                <IonRow className="p-3 ion-text-center border-bottom border-secondary">
                    <IonCol>
                        <IonText color="light">Please select a payment option</IonText>
                    </IonCol>
                </IonRow>
                <IonRow className="p-2 border-bottom border-secondary">
                    <IonCol>
                        <IonList className="p-0">
                            <IonRadioGroup color="night" value={selectedOption} onIonChange={updateSelection}>
                                <IonListHeader color="night" >
                                    Instant Payment
                                </IonListHeader>
                                {props.paymentOptions.instant && props.paymentOptions.instant.map((instantOption) => {
                                    // alert(instanOption.name)
                                    return <IonItem color="night" lines="none" key={instantOption.id}>
                                                <IonLabel>
                                                    {instantOption.name}
                                                </IonLabel>
                                                <IonRadio slot="start" value={instantOption.id}/>
                                            </IonItem>
                                })}
                            </IonRadioGroup>
                        </IonList>
                    </IonCol>
                </IonRow>
                <IonRow className="p-2">
                    <IonCol>
                        <IonList className="p-0">
                            <IonRadioGroup color="night" value={selectedOption} onIonChange={updateSelection}>
                                <IonListHeader color="night" >
                                    Pay On Delivery
                                </IonListHeader>
                                {props.paymentOptions.ondelivery && props.paymentOptions.ondelivery.map((onDelOption) => {
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
                {/* <IonRow className="p-2">
                    <IonCol>
                        <IonList className="p-0">
                            <IonListHeader color="night">Credit cards, Debit cards, Netbanking</IonListHeader>
                        </IonList>
                    </IonCol>
                </IonRow>
                <IonRow className="p-2">
                    <IonCol>
                        <IonButton color="secondary" routerDirection="forward" expand="block" onClick={razorPayPOClicked} className="pgi-button ion-no-margin">
                        <img alt="razorpay" className="single-img" src="assets/320px-Razorpay_logo.svg.png"/>
                        </IonButton>
                    </IonCol>
                </IonRow> */}
                {/* <IonRow className="p-2 border-bottom border-secondary">
                    <IonCol>
                        <IonList className="p-0">
                            <IonRadioGroup color="night" value={selectedOption} onIonChange={updateSelection}>
                                <IonListHeader color="night" >
                                    Credit/Debit Cards
                                </IonListHeader>
                                <IonItem color="night" lines="none">
                                    <IonLabel>
                                        Razor Pay
                                    </IonLabel>
                                    <IonRadio slot="start" value="razorpay"/>
                                </IonItem>
                            </IonRadioGroup>
                        </IonList>
                    </IonCol>
                </IonRow> */}
            </IonGrid>                        
        </IonContent>
    )
}

export default PaymentOptions;