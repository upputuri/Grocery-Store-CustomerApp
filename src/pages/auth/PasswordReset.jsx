import { IonAlert, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonLoading, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router';
import { LoginContext } from '../../App';
import { logoURL, serviceBaseURL } from '../../components/Utilities/ServiceCaller';

const PasswordReset = () => {
    const history = useHistory();
    const [loadingState, setLoadingState] = useState(false);
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const [mobileState, setMobileState] = useState('');
    const [errorState, setErrorState] = useState('');

    const setMobile = (event) => {
        setMobileState(event.detail.value);
        setErrorState('');
    }

    const sendPasswordResetRequest = async () => {
        if (mobileState === '') {
            setErrorState("Please input a mobile number.");
            return;
        }
        let path = serviceBaseURL + '/application/passwords';
        const client = new Client(path);
        const resource = client.go();
        const requestHeaders = new Headers();
        requestHeaders.append("Content-Type", "application/json");
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        let receivedState;
        try{
            receivedState = await resource.post({
                headers: requestHeaders,
                data: { 
                    type: 'mobile',
                    target: mobileState,
                    message: 'Your new password to login to Vegit app is {}. Please change this password immediately after login.'}
            });
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            if (e.status === 400){
                setErrorState("Please enter a valid registered mobile number");
            }
            else {
                setErrorState("Server unreachable. Please check your connectivity and try again");
            }
            setLoadingState(false);
            return false;
        }
        console.log("Password reset request accepted by server");
        setLoadingState(false);
        setInfoAlertState({show: true, msg: "Password reset successful. Please login!"});
        return true;
    }

    const navigateToLoginPage = () => {
        setInfoAlertState({show: false, msg: ''});
        history.push('/login');
    }
    return (
        <IonPage>
            <LoginContext.Consumer>
            {
                (context) => context.isAuthenticated ? <Redirect to='/home'/>: ''
            }
            </LoginContext.Consumer>
            <IonHeader className="osahan-nav border-bottom border-white">
            <IonAlert isOpen={infoAlertState.show}
                        onDidDismiss={navigateToLoginPage}
                        header={''}
                        cssClass='groc-alert'
                        message={infoAlertState.msg}
                        buttons={['OK']}/>   
            <IonLoading isOpen={loadingState}/>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonMenuButton></IonMenuButton>
                </IonButtons>
                <IonTitle>Login with OTP
                </IonTitle>
            </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding shop-cart-page" color="dark">
            <div className="card mb-2">
                <div className="border-bottom text-center p-3">
                    <IonText color="light" className="pl-3 pr-3 pt-2 ion-text-center">Please input your registered mobile number. We will reset the password and send an sms</IonText>
                </div>
                <div className="p-3">
                    <form className="card">
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked">
                                Mobile No.
                                <IonText color="danger">*</IonText>
                            </IonLabel>
                            <IonInput placeholder="Registered Mobile No." required type="email" 
                                    onIonChange={setMobile} 
                                    value={mobileState}></IonInput>
                        </IonItem>
                        <div className="p-2">
                            <IonButton onClick={sendPasswordResetRequest} size="small" color="secondary">Reset Password</IonButton>
                        </div>
                        {errorState !== '' &&
                            <IonItem>
                                <IonLabel className="ion-text-center ion-text-wrap" color="danger">
                                    <small>{errorState}</small>
                                </IonLabel>
                            </IonItem>}
                    </IonList>
                    </form>
                </div>
            </div>
            </IonContent>
        </IonPage>
    )
}

export default PasswordReset;