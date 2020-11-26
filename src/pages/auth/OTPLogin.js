import { IonAlert, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonLoading, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router';
import { LoginContext } from '../../App';
import { logoURL, serviceBaseURL } from '../../components/Utilities/ServiceCaller';
import CountDownTimer from './CountDownTimer';

const OTPLogin = () => {
    const loginContext = useContext(LoginContext);
    const [loadingState, setLoadingState] = useState(false);
    const [serviceRequestAlertState, setServiceRequestAlertState] = useState({show: false, msg: ''});
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const [mobileState, setMobileState] = useState('');
    const [otpState, setOtpState]  =useState('');
    const [generatedOtpState, setGeneratedOtpState] = useState('');
    const [waitingForOTPState, setWaitingForOTPState] = useState(false);
    const [otpClearingTimerState, setOTPClearingTimerState] = useState(null);
    const [resendOTPEnabledState, setResendOTPEnabledState] = useState(false);
    const [errorState, setErrorState] = useState('');
    const waitTimeForResendOTP = 30; //seconds

    const setOtp = (event) => {
        setOtpState(event.detail.value);
        setErrorState('');
    }
    const setMobile = (event) => {
        setMobileState(event.detail.value);
        setErrorState('');
    }

    const sendOTPServiceRequest = async (otp) => {
        let path = serviceBaseURL + '/application/otptokens';
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
                data: {otp: otp, 
                    type: 'email',
                    target: 'thevegitclub@gmail.com',
                    message: 'Password(OTP) to update your email Id is {}. This OTP is valid for 10 minutes. Do not share OTP with anyone.'}
            });
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            setLoadingState(false);
            setServiceRequestAlertState({show: true, msg: "Failed to send OTP. Please try again"});
            return false;
        }
        console.log("Send OTP request accepted by server");
        setLoadingState(false);
        return true;
    }

    const sendOTP = () => {
        let re = /^\d{10}$/;
        if(mobileState === "" || !re.test(mobileState)) {
          setErrorState("Please enter a valid 10 digit mobile No.");
          return;
        }
        const otp = generateOTP();
        setGeneratedOtpState(otp);
        sendOTPServiceRequest(otp).then((done)=>{
            if (done){
                //Expire OTP after 10 mins
                const otpClearingTimer = setTimeout(()=>setGeneratedOtpState(''), 600000);
                setWaitingForOTPState(true);
                setOTPClearingTimerState(otpClearingTimer);
                setResendOTPEnabledState(false);
                setInfoAlertState({show: true, msg: "An OTP has been sent to this mobile number. Please input the OTP to login."});
            }
            else{
                setGeneratedOtpState('');
            }
        });
    }

    const generateOTP = () => { 
        // Declare a digits variable  
        // which stores all digits 
        var digits = '0123456789'; 
        let OTP = ''; 
        for (let i = 0; i < 4; i++ ) { 
            OTP += digits[Math.floor(Math.random() * 10)]; 
        } 
        return OTP; 
    }
    
    const verifyOTP = () => {
        // Compare input OTP with generated OTP
        if (generatedOtpState === otpState) {
            // alert(generatedOtpState+","+otpState);
            setOtpState('');
            setWaitingForOTPState(false);
            sendLoginRequest();
        }
    }

    const sendLoginRequest = () => {
        setLoadingState(true);
        loginContext.loginWithOTP(mobileState).then((result) => {
            if (result === 200) {
                setWaitingForOTPState(false);
                setResendOTPEnabledState(false);
                clearTimeout(otpClearingTimerState);
                setOTPClearingTimerState(null);
                setOtpState('');
                setErrorState("");
                setInfoAlertState({show: true, msg: "Email successfully updated!"});
            }
            else if (result === 400) {
                setErrorState("New email Id not accepted. This email Id is already registered with another account");
            }
            setLoadingState(false);
        });
    }
    return (
        <IonPage>
            <LoginContext.Consumer>
            {
                (context) => context.isAuthenticated ? <Redirect to='/home'/>: ''
            }
            </LoginContext.Consumer>
            <IonHeader className="osahan-nav border-white border-bottom">
            <IonAlert isOpen={infoAlertState.show}
                        onDidDismiss={()=> setInfoAlertState(false)}
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
                    <img alt="img" className="single-img" src={logoURL}/>
                </div>
                <div className="p-3">
                    <form className="card">
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked">
                                Mobile No.
                                <IonText color="danger">*</IonText>
                            </IonLabel>
                            <IonInput placeholder="Mobile No." required type="email" 
                                    onIonChange={setMobile} 
                                    value={mobileState}></IonInput>
                        </IonItem>
                        {!waitingForOTPState && 
                        <div className="p-2">
                            <IonButton onClick={sendOTP} size="small" color="secondary">Send OTP</IonButton>
                        </div>}
                        {waitingForOTPState && 
                        <div>
                            <IonItem>
                                <IonLabel> OTP </IonLabel>
                                <IonInput autofocus={true} className="border m-2" type="text" value={otpState} onIonChange={setOtp}></IonInput>
                            </IonItem>
                            <div className="d-flex p-2 justify-content-center align-items-center">
                                <IonButton onClick={verifyOTP} size="small" color="secondary">Verify</IonButton>
                                {resendOTPEnabledState ?
                                    <IonButton onClick={sendOTP} size="small" color="secondary">Resend OTP</IonButton>
                                :
                                    <CountDownTimer seconds={waitTimeForResendOTP} onTimeOut={() => setResendOTPEnabledState(true)}/>}
                            </div>
                        </div>}
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

export default OTPLogin;