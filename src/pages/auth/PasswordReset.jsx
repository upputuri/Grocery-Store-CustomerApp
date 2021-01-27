import { IonAlert, IonButton, IonButtons, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonList, IonLoading, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router';
import { LoginContext } from '../../App';
import { clientConfig, isPasswordValid } from '../../components/Utilities/AppCommons';
import { logoURL, serviceBaseURL } from '../../components/Utilities/ServiceCaller';
import CountDownTimer from './CountDownTimer';

const PasswordReset = () => {
    const history = useHistory();
    const [loadingState, setLoadingState] = useState(false);
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const [passwordResetSuccessAlertState, setPasswordResetSucessAlertState] = useState({show: false, msg: ''});
    const [otpState, setOtpState] = useState(false);
    const [resendOtpEnabledState, setResendOTPEnabledState] = useState(false);
    const [mobileState, setMobileState] = useState('');
    const [errorState, setErrorState] = useState('');
    const [passwordState, setPasswordState] = useState('');
    const [rePasswordState, setRePasswordState] = useState('');
    const [passwordEditingState, setPasswordEditingState] = useState(false);
    const waitTimeForResendOTP = 30; //seconds

    const setMobile = (event) => {
        setMobileState(event.detail.value);
        setErrorState('');
    }

    const setPassword = (event) => {
        setPasswordState(event.detail.value);
        setErrorState('');        
    }

    const setRePassword = (event) => {
        setRePasswordState(event.detail.value);
        passwordState.localeCompare(event.detail.value) !== 0 ? setErrorState('Passwords do not match!'): setErrorState('');       
    }

    const setOtp = (event) => {
        setOtpState(event.detail.value);
        setErrorState('');
    }

    const sendOTPServiceRequest = async () => {
        if (mobileState === '') {
            setErrorState("Please input a mobile number.");
            return;
        }
        let path = serviceBaseURL + '/customers/me/otptokens';
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
                    message: 'OTP to reset your password is {}. Do not share OTP with anyone.'}
            });
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            if (e.status === 400){
                setErrorState("Please enter a valid mobile number");
            }
            else if (e.status === 500){
                setErrorState(clientConfig.serverErrorAlertMsg);
            }
            else {
                setErrorState(clientConfig.connectivityErrorAlertMsg);
            }
            setLoadingState(false);
            return false;
        }
        console.log("Send OTP request accepted by server");
        setLoadingState(false);
        setPasswordEditingState(true);
        setResendOTPEnabledState(false);
        setInfoAlertState({show: true, msg: 'If you are a registered user, you will receive an OTP on your mobile. Please enter this OTP to proceed'});
        return true;
    }

    const resendOTP = () => {
        sendOTPServiceRequest();
    }

    const sendPasswordResetRequest = async () => {
        if (checkInput() === false)
            return;
        let path = serviceBaseURL + '/customers/me';
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
                    mobile: mobileState,
                    otp: otpState,
                    password: passwordState
                }
            });
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            if (e.status === 400){
                setErrorState("Please enter correct OTP");
            }
            else if (e.status === 500){
                setErrorState(clientConfig.serverErrorAlertMsg);
            }
            else {
                setErrorState(clientConfig.connectivityErrorAlertMsg);
            }
            setLoadingState(false);
            return false;
        }
        console.log("Password reset request accepted by server");
        setLoadingState(false);
        setPasswordResetSucessAlertState({show: true, msg: "Password reset successful. Please login!"});
        return true;
    }

    const checkInput = () => {
        if(passwordState === "") {
            setErrorState("Please enter your password!");
            return false;
          }else if (!isPasswordValid(undefined, passwordState)) {
            setErrorState(clientConfig.passwordFormatError);
            return false;
          } else if (passwordState !== rePasswordState){
            setErrorState("Please re-enter password!");
            return false;
          }
    }

    const navigateToLoginPage = () => {
        history.push('/login');
    }

    const verifyMobileWithOTP = () => {
        // setShowOTPCheckModal(true);
        sendOTPServiceRequest();
    }

    return (
        <IonPage>
            <LoginContext.Consumer>
            {
                (context) => context.isAuthenticated ? <Redirect to='/home'/>: ''
            }
            </LoginContext.Consumer>
            <IonHeader className="osahan-nav border-bottom border-white"> 
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton></IonMenuButton>
                    </IonButtons>
                    <IonTitle>Reset Password
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonLoading isOpen={loadingState}/>
            <IonAlert isOpen={infoAlertState.show}
                        onDidDismiss={()=>setInfoAlertState({show: false, msg: ''})}
                        header={''}
                        cssClass='groc-alert'
                        message={infoAlertState.msg}
                        buttons={['OK']}/>   
            <IonAlert isOpen={passwordResetSuccessAlertState.show}
                        onDidDismiss={navigateToLoginPage}
                        header={''}
                        cssClass='groc-alert'
                        message={passwordResetSuccessAlertState.msg}
                        buttons={['OK']}/>  
            {/* <IonModal isOpen={showOTPCheckModal}>
                <IonHeader>
                    <IonToolbar color="night">
                        <IonButtons slot="end">
                            <IonButton size="small" onClick={cancelOTP}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <OTPCheck mobile={mobileState} 
                    onOTPCheckSuccess={setPasswordEditingState.bind(this, true)} 
                    onOTPCheckFail={setShowOTPCheckModal.bind(this, false)}
                    onOTPCreated={sendOTPServiceRequest}/>
            </IonModal> */}
            <IonContent className="ion-padding shop-cart-page" color="dark">
            <IonGrid>
                <div className="border-bottom text-center p-3">
                    <IonText color="light">Please enter your registered mobile number. We will send an OTP for validation</IonText>
                </div>
                <div className="p-2">
                    <form className="card">
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked">
                                Mobile No.
                                <IonText color="danger">*</IonText>
                            </IonLabel>
                            <IonInput placeholder="Registered Mobile No." required type="email" disabled={passwordEditingState}
                                    onIonChange={setMobile} 
                                    value={mobileState}></IonInput>
                        </IonItem>
                    </IonList>
                    {passwordEditingState &&
                    <div>
                        <IonList lines="full" className="ion-no-margin ion-no-padding">
                            <div>
                                <IonItem>
                                    <IonLabel> OTP </IonLabel>
                                    <IonInput autofocus={true} className="border m-2" type="text" value={otpState} onIonChange={setOtp}></IonInput>
                                </IonItem>
                                <div className="d-flex p-2 justify-content-center align-items-center">
                                    {resendOtpEnabledState ?
                                        <IonButton onClick={resendOTP} size="small" color="secondary">Resend OTP</IonButton>
                                    :
                                        <CountDownTimer seconds={waitTimeForResendOTP} onTimeOut={() => setResendOTPEnabledState(true)}/>}
                                </div>
                            </div>
                        </IonList>
                        <IonList lines="full" className="ion-no-margin ion-no-padding">
                            <IonItem>
                                <IonLabel position="stacked">Password
                                    <IonText color="danger">*</IonText>
                                </IonLabel>
                                <IonInput placeholder="Enter Password" required type="password"
                                onIonChange={setPassword}
                                value={passwordState}></IonInput>
                            </IonItem>
                        </IonList>
                        <IonList lines="full" className="ion-no-margin ion-no-padding">
                            <IonItem>
                                <IonLabel position="stacked">Confirm Password
                                    <IonText color="danger">*</IonText>
                                </IonLabel>
                                <IonInput placeholder="Re-enter Password" required type="password"
                                onIonChange={setRePassword}
                                value={rePasswordState}></IonInput>
                            </IonItem>
                        </IonList>
                    </div>}
                    </form>
                </div>
                {/* {errorState !== '' &&
                <IonList>
                    <IonItem>
                        <IonLabel className="ion-text-center ion-text-wrap" color="danger">
                            <small>{errorState}</small>
                        </IonLabel>
                    </IonItem>
                </IonList>} */}

                <div>
                    {errorState !== '' && <div className="d-flex justify-content-center">
                        <IonLabel className="p-2 ion-text-center ion-text-wrap" color="danger">
                                <small>{errorState}</small>
                        </IonLabel>
                    </div>}
                {!passwordEditingState && <IonButton onClick={verifyMobileWithOTP} color="secondary" routerDirection="forward" expand="block" className="ion-no-margin">Send OTP</IonButton>}
                {passwordEditingState && <IonButton onClick={sendPasswordResetRequest} color="secondary" routerDirection="forward" expand="block" className="ion-no-margin">Reset Password</IonButton>}
                </div>
            </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default PasswordReset;