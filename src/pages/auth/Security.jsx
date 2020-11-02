import { IonAlert, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage, IonRow } from '@ionic/react';
import React, { createRef, useContext, useEffect, useRef, useState } from 'react';
import { LoginContext } from '../../App';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import '../../App.scss';
import Client from 'ketting';
import { serviceBaseURL } from '../../components/Utilities/ServiceCaller';
import CountDownTimer from './CountDownTimer';

const Security = () => {
    const [loadingState, setLoadingState] = useState(false);
    const [serviceRequestAlertState, setServiceRequestAlertState] = useState({show: false, msg: ''});
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const [retryState, setRetryState] = useState(false);
    const loginContext = useContext(LoginContext);
    const [emailState, setEmailState] = useState('');
    const [mobileState, setMobileState] = useState('');
    const [otpState, setOtpState]  =useState('');
    const [generatedOtpState, setGeneratedOtpState] = useState('');
    const [editingState, setEditingState] = useState('');
    const [waitingForOTPState, setWaitingForOTPState] = useState(false);
    const [otpClearingTimerState, setOTPClearingTimerState] = useState(null);
    const [resendOTPEnabledState, setResendOTPEnabledState] = useState(false);
    const [errorState, setErrorState] = useState('');
    const waitTimeForResendOTP = 30; //seconds

    const setEmail = (event) => {
        setEmailState(event.detail.value);
        setErrorState('');
    }
    const setMobile = (event) => {
        setMobileState(event.detail.value);
    }
    const setOtp = (event) => {
        setOtpState(event.detail.value);
    }

    const sendOTPForEmailUpdate = async (otp) => {
        let path = serviceBaseURL + '/application/otptokens';
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
                data: {otp: otp, 
                    type: 'email',
                    target: emailState,
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

    const sendOTPForMobileUpdate = async (otp) => {
        //TODO: hack, change
        const emailId = loginContext.customer.email && loginContext.customer.email.length>0 ? loginContext.customer.email : 'thevegitclub@gmail.com';
        let path = serviceBaseURL + '/application/otptokens';
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
                data: {otp: otp, 
                    type: 'email',
                    target: emailId,
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

    const editEmailClicked = () => {
        setWaitingForOTPState(false);
        setEditingState('email');
    }

    const editMobileClicked = () => {
        setWaitingForOTPState(false);
        setEditingState('mobile');
    }

    const sendOTPForEmailUpdateClicked = () => {
        let re = /([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/;
        if(emailState === "" || !re.test(emailState)) {
          setErrorState("Please enter a valid email Id");
          return;
        }
        const otp = generateOTP();
        setGeneratedOtpState(otp);
        sendOTPForEmailUpdate(otp).then((done)=>{
            if (done){
                //Expire OTP after 10 mins
                const otpClearingTimer = setTimeout(()=>setGeneratedOtpState(''), 600000);
                setWaitingForOTPState(true);
                setOTPClearingTimerState(otpClearingTimer);
                setResendOTPEnabledState(false);
                setInfoAlertState({show: true, msg: "An OTP has been sent to your new email Id. Please input the OTP to validate the email Id."});
            }
            else{
                setGeneratedOtpState('');
            }
        });
    }

    const sendOTPForMobileUpdateClicked = () => {
        let re = /^\d{10}$/;
        if(mobileState === "" || !re.test(mobileState)) {
          setErrorState("Please enter a valid 10 digit mobile No.");
          return;
        }
        const otp = generateOTP();
        setGeneratedOtpState(otp);
        sendOTPForMobileUpdate(otp).then((done)=>{
            if (done){
                //Expire OTP after 10 mins
                const otpClearingTimer = setTimeout(()=>setGeneratedOtpState(''), 600000);
                setWaitingForOTPState(true);
                setOTPClearingTimerState(otpClearingTimer);
                setResendOTPEnabledState(false);
                setInfoAlertState({show: true, msg: "An OTP has been sent to your new email Id. Please input the OTP to validate the email Id."});
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

    const verifyOTPForEmailUpdate = () => {
        // Compare input OTP with generated OTP
        if (generatedOtpState === otpState) {
            // alert(generatedOtpState+","+otpState);
            setWaitingForOTPState(false);
            setLoadingState(true);
            sendEmailUpdateServiceRequest();
        }
    }

    const verifyOTPForMobileUpdate = () => {
        // Compare input OTP with generated OTP
        if (generatedOtpState === otpState) {
            // alert(generatedOtpState+","+otpState);
            setWaitingForOTPState(false);
            setLoadingState(true);
            sendMobileUpdateServiceRequest();
        }
    }
    
    const sendEmailUpdateServiceRequest = () => {
        loginContext.updateProfile({email: emailState}).then((result) => {
            if (result) {
                setEditingState('');
                setWaitingForOTPState(false);
                setResendOTPEnabledState(false);
                clearTimeout(otpClearingTimerState);
                setOTPClearingTimerState(null);
                setEmailState('');
                setErrorState("");
                setInfoAlertState({show: true, msg: "Email successfully updated!"});
            }
            else {
                setErrorState("Update request failed on server. Please try again");
            }
            setLoadingState(false);
        });
    }

    const sendMobileUpdateServiceRequest = () => {
        loginContext.updateProfile({mobile: mobileState}).then((result) => {
            if (result) {
                setEditingState('');
                setWaitingForOTPState(false);
                setResendOTPEnabledState(false);
                clearTimeout(otpClearingTimerState);
                setOTPClearingTimerState(null);
                setMobileState('');
                setErrorState("");
                setInfoAlertState({show: true, msg: "Mobile No. successfully updated!"});
            }
            else {
                setErrorState("Update request failed on server. Please try again");
            }
            setLoadingState(false);
        });
    }

    return (
        <IonPage>
            <IonHeader className="osahan-nav">
                <BaseToolbar title={'Login & Security'}/>     
            </IonHeader>
            <IonLoading isOpen={loadingState}/>
            <IonAlert isOpen={infoAlertState.show}
                        onDidDismiss={()=> setInfoAlertState(false)}
                        header={''}
                        message={infoAlertState.msg}
                        buttons={['OK']}/>                   
            <IonContent className="ion-padding" color="dark">

                            <div className="card mb-2">
                            <div className="p-3">    
                            <form className="card">
                                <IonList lines="full" className="ion-no-margin ion-no-padding">
                                    <IonItem>
                                        <IonLabel position="stacked">
                                            Email Id
                                        </IonLabel>
                                        <IonInput type="email" disabled
                                                value={loginContext.customer.email}></IonInput>
                                    </IonItem>
                                    {editingState !== 'email' ? 
                                        <div className="p-2">
                                            <IonButton onClick={editEmailClicked} size="small" color="secondary">Edit</IonButton>
                                        </div>
                                    :
                                    <div>
                                        <IonItem>
                                            <IonLabel position="stacked">
                                                New Email Id
                                            </IonLabel>
                                            <IonInput autofocus={waitingForOTPState ? false : true} type="email" disabled={waitingForOTPState ? true : false}
                                                    onIonChange={setEmail} 
                                                    value={emailState}></IonInput>
                                        </IonItem>
                                        {!waitingForOTPState && 
                                                <div className="p-2">
                                                   <IonButton onClick={sendOTPForEmailUpdateClicked} size="small" color="secondary">Send OTP</IonButton>
                                                </div>}
                                        {waitingForOTPState && 
                                        <div>
                                            <IonItem>
                                                <IonLabel> OTP </IonLabel>
                                                <IonInput autofocus={true} className="border m-2" type="text" value={otpState} onIonChange={setOtp}></IonInput>
                                            </IonItem>
                                            <div className="d-flex p-2 justify-content-center align-items-center">
                                                <IonButton onClick={verifyOTPForEmailUpdate} size="small" color="secondary">Verify</IonButton>
                                                {resendOTPEnabledState ?
                                                    <IonButton onClick={sendOTPForEmailUpdateClicked} size="small" color="secondary">Resend OTP</IonButton>
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
                                    </div>}
                                </IonList>
                            </form>
                            </div>
                            </div>
                            <div className="card mb-2">
                            <div className="p-3">    
                            <form className="card">
                                <IonList lines="full" className="ion-no-margin ion-no-padding">
                                    <IonItem>
                                        <IonLabel position="stacked">
                                            Mobile #
                                        </IonLabel>
                                        <IonInput disabled type="tel" 
                                                value={loginContext.customer.mobile}></IonInput>
                                    </IonItem>
                                    {editingState !== 'mobile' ? 
                                    <div className="p-2">
                                        <IonButton onClick={editMobileClicked} size="small" color="secondary">Edit</IonButton>
                                        </div>
                                    :
                                    <div>
                                        <IonItem>
                                            <IonLabel position="stacked">
                                                New Mobile No.
                                            </IonLabel>
                                            <IonInput autofocus={waitingForOTPState ? false : true} type="tel" disabled={waitingForOTPState ? true : false}
                                                    onIonChange={setMobile} 
                                                    value={mobileState}></IonInput>
                                        </IonItem>
                                        {!waitingForOTPState && 
                                                <div className="p-2">
                                                   <IonButton onClick={sendOTPForMobileUpdateClicked} size="small" color="secondary">Send OTP</IonButton>
                                                </div>}
                                        {waitingForOTPState && 
                                        <div>
                                            <IonItem>
                                                <IonLabel> OTP </IonLabel>
                                                <IonInput autofocus={true} className="border m-2" type="text" value={otpState} onIonChange={setOtp}></IonInput>
                                            </IonItem>
                                            <div className="d-flex p-2 justify-content-center align-items-center">
                                                <IonButton onClick={verifyOTPForMobileUpdate} size="small" color="secondary">Verify</IonButton>
                                                {resendOTPEnabledState ?
                                                    <IonButton onClick={sendOTPForMobileUpdateClicked} size="small" color="secondary">Resend OTP</IonButton>
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
                                    </div>}                                        
                                </IonList>
                            </form>
                            </div>
                            </div>

            </IonContent>
        </IonPage>
    )
}

export default Security;