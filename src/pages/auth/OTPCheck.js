import { IonAlert, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonLoading, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useEffect, useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router';
import { LoginContext } from '../../App';
import { clientConfig } from '../../components/Utilities/AppCommons';
import { logoURL, serviceBaseURL } from '../../components/Utilities/ServiceCaller';
import CountDownTimer from './CountDownTimer';

const OTPCheck = (props) => {
    const loginContext = useContext(LoginContext);
    const [loadingState, setLoadingState] = useState(false);
    const [serviceRequestAlertState, setServiceRequestAlertState] = useState({show: false, msg: ''});
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const [otpState, setOtpState]  =useState('');
    const [generatedOtpState, setGeneratedOtpState] = useState('');
    const [waitingForOTPState, setWaitingForOTPState] = useState(false);
    const [otpClearingTimerState, setOTPClearingTimerState] = useState(null);
    const [resendOTPEnabledState, setResendOTPEnabledState] = useState(false);
    const [errorState, setErrorState] = useState('');
    const waitTimeForResendOTP = 30; //seconds

    useEffect(()=>{
        createOTP();
    },[]);

    const setOtp = (event) => {
        setOtpState(event.detail.value);
        setErrorState('');
    }

    const createOTP = () => {
        let re = /^\d{10}$/;
        // if(mobileState === "" || !re.test(mobileState)) {
        //   setErrorState("Please enter a valid 10 digit mobile No.");
        //   return;
        // }
        const otp = generateOTP();
        props.otpCreated();
        setGeneratedOtpState(otp);

        //Expire OTP after 10 mins
        const otpClearingTimer = setTimeout(()=>setGeneratedOtpState(''), clientConfig.otpTimout);
        setWaitingForOTPState(true);
        setOTPClearingTimerState(otpClearingTimer);
        setResendOTPEnabledState(false);
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
            props.otpVerified();
        }
    }

    return (

            <IonContent className="ion-padding shop-cart-page" color="dark">
            <div className="card mb-2">
                <div className="border-bottom text-center p-3">
                    <img alt="img" className="single-img" src={logoURL}/>
                </div>
                <div className="p-3">
                    <form className="card">
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
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
    )
}

export default OTPCheck;