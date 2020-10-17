import { IonAlert, IonButton, IonContent, IonDatetime, IonHeader, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage, IonPicker, IonSearchbar, IonText } from '@ionic/react';
import React, { useEffect, useState } from 'react';

const AddressForm = (props) => {

    const [fNameState, setFirstNameState] = useState(props.fName);
    const [lNameState, setLastNameState] = useState(props.lName);
    const [mobileState, setMobileState] = useState(props.phone);
    const [line1State, setLine1State] = useState(props.line1);
    const [line2State, setLine2State] = useState(props.line2);
    const [cityState, setCityState] = useState(props.city);
    const [stateIdState, setStateIdState] = useState(props.stateId);
    const [zipCodeState, setZipCodeState] = useState(props.zipCode);
    const [errorState, setErrorState] = useState('');

    const setFirstName = (event) =>
    {
        setFirstNameState(event.target.value);
    }

    const setLastName = (event) => {
        setLastNameState(event.target.value);
    }

    const setLine1 = (event) => {
        setLine1State(event.target.value);
    }

    const setMobile = (event) =>
    {
        setMobileState(event.target.value);
    }

    const setCity = (event) => {
        setCityState(event.target.value);
    }

    const setLine2 = (event) => {
        setLine2State(event.target.value);
    }

    const setStateId = (event) => {
        setStateIdState(event.target.value);
    }

    const setZipCode = (event) => {
        setZipCodeState(event.target.value);
    }

    return (
        <IonContent color="night">
            <form className="card p-3">
                <IonList lines="full" className="ion-no-margin ion-no-padding">
                    <IonItem>
                        <IonLabel position="stacked">First Name
                            <IonText color="danger">*</IonText>
                        </IonLabel>
                        <IonInput placeholder="First Name" required type="text" 
                        onIonChange={setFirstName}
                        value={fNameState}></IonInput>
                    </IonItem>
                </IonList>
                <IonList lines="full" className="ion-no-margin ion-no-padding">
                    <IonItem>
                        <IonLabel position="stacked">Last Name
                            <IonText color="danger">*</IonText>
                        </IonLabel>
                        <IonInput placeholder="Last Name" required type="text" 
                        onIonChange={setLastName}
                        value={lNameState}></IonInput>
                    </IonItem>
                </IonList>
                <IonList lines="full" className="ion-no-margin ion-no-padding">
                    <IonItem>
                        <IonLabel position="stacked">Phone Number
                            <IonText color="danger">*</IonText>
                        </IonLabel>
                        <IonInput placeholder="Mobile Num" required type="text" 
                        onIonChange={setMobile}
                        value={mobileState}></IonInput>
                    </IonItem>
                </IonList>                            
                <IonList lines="full" className="ion-no-margin ion-no-padding">
                    <IonItem>
                        <IonLabel position="stacked">Line1
                            <IonText color="danger">*</IonText>
                        </IonLabel>
                        <IonInput placeholder="Address Line 1" required type="text" 
                        onIonChange={setLine1}
                        value={line1State}></IonInput>
                    </IonItem>
                </IonList>
                <IonList lines="full" className="ion-no-margin ion-no-padding">
                    <IonItem>
                        <IonLabel position="stacked">Line2
                        </IonLabel>
                        <IonInput placeholder="Address Line 2" type="text" 
                        onIonChange={setLine2}
                        value={line2State}></IonInput>
                    </IonItem>
                </IonList>  
                <IonList lines="full" className="ion-no-margin ion-no-padding">
                    <IonItem>
                        <IonLabel position="stacked">City
                            <IonText color="danger">*</IonText>
                        </IonLabel>
                        <IonInput placeholder="City" type="text" 
                        onIonChange={setCity}
                        value={cityState}></IonInput>
                    </IonItem>
                </IonList> 
                <IonList lines="full" className="ion-no-margin ion-no-padding">
                    <IonItem>
                        <IonLabel position="stacked">State
                        <IonText color="danger">*</IonText>
                        </IonLabel>
                        <IonPicker placeholder="State" type="text" 
                        onIonChange={setStateId}
                        value={stateIdState}></IonPicker>
                    </IonItem>
                </IonList>
                <IonList lines="full" className="ion-no-margin ion-no-padding">
                    <IonItem>
                        <IonLabel position="stacked">Pin Code
                        <IonText color="danger">*</IonText>
                        </IonLabel>
                        <IonPicker placeholder="Pin Code" type="text" 
                        onIonChange={setZipCode}
                        value={setZipCodeState}></IonPicker>
                    </IonItem>
                </IonList>                                                        
                {errorState !== '' &&
                <IonList lines="full" className="ion-no-margin ion-no-padding">
                    <IonItem>
                        <IonLabel className="ion-text-center ion-text-wrap" color="danger">
                            <small>{errorState}</small>
                        </IonLabel>
                    </IonItem>
                </IonList>}
                <div className="mt-2">
                    <IonButton color="secondary" routerDirection="forward" expand="block" onClick={props.submitClickHandler} className="ion-no-margin">Update</IonButton>
                </div>
            </form>
        </IonContent>
    )
}

export default AddressForm;