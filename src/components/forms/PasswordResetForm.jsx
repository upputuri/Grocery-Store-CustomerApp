import { IonButton, IonInput, IonItem, IonLabel, IonList, IonText } from '@ionic/react';
import React, { useContext, useState } from 'react';
import { LoginContext } from '../../App';
import { isPasswordValid, passwordFormatError } from '../Utilities/AppCommons';

const PasswordResetForm = (props) => {
    const loginContext = useContext(LoginContext);
    const [currentPasswordState, setCurrentPasswordState] = useState('');
    const [newPasswordState, setNewPasswordState] = useState('');
    const [rePasswordState, setRePasswordState] = useState('');
    const [errorState, setErrorState] = useState('');
    const [editingState, setEditingState] = useState(false);

    const setCurrentPassword = (event) => {
        setCurrentPasswordState(event.detail.value);
        setErrorState('');
    }

    const setNewPassword = (event) => {
        setNewPasswordState(event.detail.value);
        setErrorState('');
    }

    const setRePassword = (event) => {
        setRePasswordState(event.detail.value);
        newPasswordState.localeCompare(event.detail.value) !== 0 ? setErrorState('Passwords do not match!'): setErrorState('');  
    }

    const checkPasswordMatch = () => {
        return newPasswordState.localeCompare(rePasswordState) === 0;
    }

    const checkInput = (event) => {
        if (currentPasswordState !== loginContext.customer.password) {
            setErrorState('Incorrect current password');
            return false;
        }
        else if(newPasswordState === "") {
            setErrorState("Please enter your password!");
            return false;
        }else if (!isPasswordValid(loginContext.customer.email, newPasswordState)) {
            setErrorState(passwordFormatError);
            return false;
        } else{
            return true;
        }
    }

    const submitClicked = () => {
        if (checkInput() && checkPasswordMatch()) {
            setCurrentPasswordState('');
            setNewPasswordState('');
            setRePasswordState('');
            setEditingState(false);
            props.onNewPasswordInput(newPasswordState);
        }
    }

    return (
    <div className="card mb-2 p-3">
        <form className="card">
            {!editingState &&
            <IonList lines="full" className="ion-no-margin ion-no-padding">
            <IonItem>
                <IonLabel position="stacked" >Password</IonLabel>
                <IonInput disabled type="password"
                    value='******'></IonInput>
            </IonItem>

            <div className="p-2">
                <IonButton onClick={() => setEditingState(true)} size="small" color="secondary">Edit</IonButton>
            </div>
            </IonList>
            }
            {editingState && 
            <IonList lines="full" className="ion-no-margin ion-no-padding">
                <IonItem>
                    <IonLabel position="stacked">Current Password
                        <IonText color="danger">*</IonText>
                    </IonLabel>
                    <IonInput required type="password"
                        onIonChange={setCurrentPassword}
                        value={currentPasswordState}></IonInput>
                </IonItem>
            </IonList>}
            {editingState && 
            <div>
            <IonList lines="full" className="ion-no-margin ion-no-padding">
                <IonItem>
                    <IonLabel position="stacked">New Password
                        <IonText color="danger">*</IonText>
                    </IonLabel>
                    <IonInput required type="password"
                        onIonChange={setNewPassword}
                        value={newPasswordState}></IonInput>
                </IonItem>
            {/* </IonList>
            <IonList lines="full" className="ion-no-margin ion-no-padding"> */}
                <IonItem>
                    <IonLabel position="stacked">Confirm New Password
                        <IonText color="danger">*</IonText>
                    </IonLabel>
                    <IonInput required type="password"
                        onIonChange={setRePassword}
                        value={rePasswordState}></IonInput>
                </IonItem>
                <div className="p-2">
                    <IonButton onClick={submitClicked} size="small" color="secondary">Submit</IonButton>
                </div>
            </IonList>

            </div>}
             
            {errorState !== '' &&
            <IonList lines="full" className="ion-no-margin ion-no-padding">
                <IonItem>
                    <IonLabel className="ion-text-center ion-text-wrap" color="danger">
                        <small>{errorState}</small>
                    </IonLabel>
                </IonItem>
            </IonList>}
        </form>
    </div>
    )
}

export default PasswordResetForm;