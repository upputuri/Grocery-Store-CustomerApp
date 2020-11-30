import { IonAlert, IonButton, IonCol, IonContent, IonDatetime, IonHeader, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage, IonPicker, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonText } from '@ionic/react';
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

    const setFirstName = (event) =>{
        setFirstNameState(event.detail.value);
    }

    const setLastName = (event) => {
        setLastNameState(event.detail.value);
    }

    const setLine1 = (event) => {
        setLine1State(event.detail.value);
    }

    const setMobile = (event) => {
        setMobileState(event.detail.value);
    }

    const setCity = (event) => {
        setCityState(event.detail.value);
    }

    const setLine2 = (event) => {
        setLine2State(event.detail.value);
    }

    const setStateId = (event) => {
        setStateIdState(event.detail.value);
    }

    const setZipCode = (event) => {
        setZipCodeState(event.detail.value);
    }

    const isInputValid = () => {
        var zipCodeRegEx = /^\d{6}?$/;
        var phoneRegEx = /^\d{10}?$/;
        var cityRegEx = /^[A-Z]+$/i;
        return (fNameState && fNameState.trim().length > 1) &&
        (lNameState && lNameState.trim().length > 0) &&
        (line1State && line1State.trim().length > 0) &&
        (cityState && cityState.trim().length > 0) &&
        (stateIdState && stateIdState > 0) &&
        (zipCodeState && zipCodeRegEx.test(zipCodeState.trim())) &&
        (mobileState && phoneRegEx.test(mobileState.trim())) &&
        (cityState && cityRegEx.test(cityState.trim()));
    }

    const submitAddress = () => {
        if (!isInputValid()){
            setErrorState("Invalid Input! Please check.");
            return;
        }
        props.submitClickHandler({
            id: props.addressId,
            firstName: fNameState,
            lastName: lNameState,
            line1: line1State,
            line2: line2State,
            city: cityState,
            stateId: stateIdState,
            zipcode: zipCodeState,
            phone: mobileState
        });
    }

    const customAlertOptions = {
        cssClass: 'groc-select'
        };

    return (
        <IonContent color="night">
            <form className="card p-3">
                <IonList lines="full" className="ion-no-margin ion-no-padding">
                    <IonItem>
                        <IonLabel position="stacked">First Name
                            <IonText color="danger">*</IonText>
                        </IonLabel>
                        <IonInput placeholder="First Name" required type="text" minlength="2" maxlength="30" 
                        onIonChange={setFirstName}
                        value={fNameState}></IonInput>
                    </IonItem>
                </IonList>
                <IonList lines="full" className="ion-no-margin ion-no-padding">
                    <IonItem>
                        <IonLabel position="stacked">Last Name
                            <IonText color="danger">*</IonText>
                        </IonLabel>
                        <IonInput placeholder="Last Name" required type="text" minlength="1" maxlength="30" 
                        onIonChange={setLastName}
                        value={lNameState}></IonInput>
                    </IonItem>
                </IonList>
                <IonList lines="full" className="ion-no-margin ion-no-padding">
                    <IonItem>
                        <IonLabel position="stacked">Phone Number
                            <IonText color="danger">*</IonText>
                        </IonLabel>
                        <IonInput placeholder="Mobile Num" required type="text" minlength="10" maxlength="10"
                        onIonChange={setMobile}
                        value={mobileState}></IonInput>
                    </IonItem>
                </IonList>                            
                <IonList lines="full" className="ion-no-margin ion-no-padding">
                    <IonItem>
                        <IonLabel position="stacked">Line1
                            <IonText color="danger">*</IonText>
                        </IonLabel>
                        <IonInput placeholder="Address Line 1" required type="text" minlength="1" maxlength="50" 
                        onIonChange={setLine1}
                        value={line1State}></IonInput>
                    </IonItem>
                </IonList>
                <IonList lines="full" className="ion-no-margin ion-no-padding">
                    <IonItem>
                        <IonLabel position="stacked">Line2
                        </IonLabel>
                        <IonInput placeholder="Address Line 2" type="text" maxlength="50" 
                        onIonChange={setLine2}
                        value={line2State}></IonInput>
                    </IonItem>
                </IonList>  
                <IonList lines="full" className="ion-no-margin ion-no-padding">
                    <IonItem>
                        <IonLabel position="stacked">City
                            <IonText color="danger">*</IonText>
                        </IonLabel>
                        <IonInput placeholder="City" type="text" minlength="1" maxlength="30" 
                        onIonChange={setCity}
                        value={cityState}></IonInput>
                    </IonItem>
                </IonList> 
                <IonList lines="full" className="ion-no-margin ion-no-padding">
                    <IonItem>
                        <IonLabel position="stacked">State
                        <IonText color="danger">*</IonText>
                        </IonLabel>
                        {/* <IonPicker placeholder="State" type="text" 
                        onIonChange={setStateId}
                        value={stateIdState}></IonPicker> */}
                        <IonSelect interfaceOptions={customAlertOptions} value={`${stateIdState}`} placeholder="Select One" onIonChange={setStateId}>
                            {props.states && props.states.map((state)=>{
                                return <IonSelectOption key={state.stateId} value={state.stateId}>{state.name}</IonSelectOption>
                            })}

                        </IonSelect>
                    </IonItem>
                </IonList>
                <IonList lines="full" className="ion-no-margin ion-no-padding">
                    <IonItem>
                        <IonLabel position="stacked">Pin Code
                        <IonText color="danger">*</IonText>
                        </IonLabel>
                        <IonInput placeholder="Pin Code" type="text" 
                        onIonChange={setZipCode}
                        value={zipCodeState}></IonInput>
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
                    <IonRow>
                        <IonCol>
                            <IonButton color="secondary" onClick={props.backClickHandler} className="ion-no-margin">Cancel</IonButton>
                        </IonCol>
                        <IonCol>
                            <IonButton color="secondary" expand="block" onClick={submitAddress} className="ion-no-margin">Update</IonButton>
                        </IonCol>
                    </IonRow>
                </div>
            </form>
        </IonContent>
    )
}

export default AddressForm;