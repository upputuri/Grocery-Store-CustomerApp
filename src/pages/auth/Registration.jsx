import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar, IonItemDivider, IonCheckbox, IonGrid, IonModal, IonAlert, IonLoading, IonSelect, IonSelectOption } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useState } from 'react';
import { Redirect, useHistory } from 'react-router';
import { LoginContext } from '../../App';
import { isPasswordValid, passwordFormatError } from '../../components/Utilities/AppCommons';
import { logoURL, serviceBaseURL } from '../../components/Utilities/ServiceCaller';
import OTPCheck from './OTPCheck';

const Registration = () =>
{
    const [loadingState, setLoadingState] = useState(false);
    const [infoAlertState, setInfoAlertState] = useState(false);
    const [serviceRequestAlertState, setServiceRequestAlertState] = useState({show: false, msg: ''});
    const loginContext = useContext(LoginContext);
    const history = useHistory();
    const [emailIdState, setEmailIdState] = useState('');
    const [mobileState, setMobileState] = useState('');
    const [showOTPPanel, setShowOTPPanel] = useState(false);
    const [passwordState, setPasswordState] = useState('');
    const [rePasswordState, setRePasswordState] = useState('');
    const [fNameState, setFNameState] = useState('');
    const [lNameState, setLNameState] = useState('');
    const [genderState, setGenderState] = useState(undefined);
    const [acceptedState, setAcceptedState] = useState(false);
    const [errorState, setErrorState] = useState('');

    const toggleAccept = () => {
      setAcceptedState(!acceptedState);
    }

    const setEmail = (event) => {
      setEmailIdState(event.detail.value);
      setErrorState('');
    }

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

    const setFirstName = (event) => {
      setFNameState(event.detail.value);
      setErrorState('');
    }

    const setLastName = (event) => {
      setLNameState(event.detail.value);
      setErrorState('');
    }

    const setGender = (event) => {
      setGenderState(event.detail.value);
      setErrorState('');
    }

    const checkInputAndProceed = async () => {
      if (checkInput() && passwordState === rePasswordState)
      {
        let queryString = 'mobile='+mobileState;
        queryString = emailIdState ? queryString+'&email='+emailIdState : queryString; 
        let path = serviceBaseURL + '/customers/idpool?'+queryString;
        const client = new Client(path);
        const resource = client.go();      
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        let receivedState;
        try{
          receivedState = await resource.get({
          });
      }
      catch(e)
      {
        if (e.status && e.status === 400)
        {
          console.log("Service call failed with - "+e);
          setErrorState("An account already exists with this email/mobile! Please login if you are an existing user.");
        } 
        setLoadingState(false);
        return false;
      }
      setLoadingState(false);
      setShowOTPPanel(true);
    }
  }

    const closeOTPCheckAndProceed = () => {
      setShowOTPPanel(false);
      sendRegisterRequest();
    }

    const sendOTPForMobileRequest = async (otp) => {
        let path = serviceBaseURL + '/application/otptokens';
        const client = new Client(path);
        const resource = client.go();
        // const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
        // const loginHeaders = new Headers();
        // loginHeaders.append("Content-Type", "application/json");
        // loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        let receivedState;
        try{
            receivedState = await resource.post({
                data: {otp: otp, 
                    type: 'mobile',
                    target: mobileState,
                    message: 'Password(OTP) to verify your mobile number is {}. This OTP is valid for 10 minutes. Do not share OTP with anyone.'}
            });
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            setLoadingState(false);
            setServiceRequestAlertState({show: true, msg: "Failed to send OTP. Please try again"});
            setShowOTPPanel(false);
            return false;
        }
        console.log("Send OTP request accepted by server");
        setLoadingState(false);
        setInfoAlertState({show: true, msg: 'An OTP has been sent to the mobile number you are registering with. Please use the OTP you received to verify your mobile.'});
        return true;
    }

    const sendRegisterRequest = async () =>
    {
      // if (checkInput() && passwordState === rePasswordState){

          let result = loginContext.register(mobileState, emailIdState, fNameState, lNameState, genderState, passwordState).then(
              (result) => {
                if (result === 400)
                {
                    console.log('Registration failed because an account already exists with given email');
                    setErrorState("An account already exists with this email/mobile! Please login if you are an existing user.");
                }
                else if(result === 200){
                    console.log('Registration successful');
                    return <Redirect to="/home"/>
                }
                else{
                    console.log('Server error');
                    setErrorState("Unable to process your request now. Please try again later or contact support!")
                }
              }
          );
        // }  
    }

    const checkInput = () =>
    {
      let mobileRegex = /^\d{10}$/;
      if(mobileState === "" || !mobileRegex.test(mobileState)) {
        setErrorState("Please enter a valid 10 digit mobile No.");
        return;
      }
      let emailRegex = /([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/;
      if(emailIdState !== "" && !emailRegex.test(emailIdState)) {
        setErrorState("Email Id must be valid");
        return false;
      }
      // if(fNameState === "") {
      //   setErrorState("First name cannot be blank!");
      //   return false;
      // }
      // if(lNameState === "") {
      //   setErrorState("Last Name cannot be blank!");
      //   return false;
      // }
  
      if(passwordState === "") {
        setErrorState("Please enter your password!");
        return false;
      }else if (!isPasswordValid(emailIdState, passwordState)) {
        setErrorState(passwordFormatError);
        return false;
      } else if (passwordState !== rePasswordState){
        setErrorState("Please re-enter password!");
        return false;
      }
      
      if (acceptedState !== true) {
        setErrorState("Please accept the terms & conditions");
        return false;
      }
      return true;
    }

    const customAlertOptions = {
      cssClass: 'groc-select'
      };

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
                <IonTitle>Registration
                </IonTitle>
            </IonToolbar>
            </IonHeader>
            <IonLoading isOpen={loadingState}/>
            <IonAlert isOpen={infoAlertState.show}
                        onDidDismiss={()=> setInfoAlertState(false)}
                        header={''}
                        cssClass='groc-alert'
                        message={infoAlertState.msg}
                        buttons={['OK']}/>   
            <IonAlert isOpen={serviceRequestAlertState.show}
                        onDidDismiss={()=> setServiceRequestAlertState(false)}
                        header={''}
                        cssClass='groc-alert'
                        message={serviceRequestAlertState.msg}
                        buttons={['OK']}/>
            <IonModal isOpen={showOTPPanel}>
              <IonHeader className="osahan-nav border-bottom border-white">
                  <IonToolbar>
                      <IonTitle className="ml-2">OTP Verification
                      </IonTitle>
                      <IonButtons slot="end">
                          <IonButton size="small" onClick={()=>setShowOTPPanel(false)}>Cancel</IonButton>
                      </IonButtons>
                  </IonToolbar>
              </IonHeader>
              <OTPCheck otpCreated={sendOTPForMobileRequest} otpVerified={closeOTPCheckAndProceed}/>
            </IonModal>      
            <IonContent className="ion-padding" color="dark">
            <IonGrid>
                <div className="border-bottom text-center p-2">
                  <img alt="img" className="single-img" src={logoURL}/>
                </div>
                <div className="p-2">
                    <form className="card">
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked">
                                Mobile No. 
                                <IonText color="danger">*</IonText>
                            </IonLabel>
                            <IonInput placeholder="Mobile No." type="tel" 
                                    onIonChange={setMobile} 
                                    value={mobileState}></IonInput>
                        </IonItem>
                    </IonList>
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked">
                                Email Id
                            </IonLabel>
                            <IonInput placeholder="Enter Email" type="email" 
                                    onIonChange={setEmail} 
                                    value={emailIdState}></IonInput>
                        </IonItem>
                    </IonList>
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked">First Name
                            </IonLabel>
                            <IonInput placeholder="First Name" type="text"
                             onIonChange={setFirstName}
                             value={fNameState}></IonInput>
                        </IonItem>
                    </IonList>
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked">Last Name
                            </IonLabel>
                            <IonInput placeholder="Last Name" type="text"
                             onIonChange={setLastName}
                             value={lNameState}></IonInput>
                        </IonItem>
                    </IonList>
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked">
                                Gender
                            </IonLabel>
                            <IonSelect interfaceOptions={customAlertOptions} value={genderState} placeholder="Select One" onIonChange={setGender}>
                                <IonSelectOption value="male">Male</IonSelectOption>
                                <IonSelectOption value="female">Female</IonSelectOption>
                            </IonSelect>
                        </IonItem>
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
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                      <IonItem>
                          <IonCheckbox slot="start" onClick={toggleAccept} checked={acceptedState} />
                          <IonText className="subtext" color="tertiary">{'I accept the terms & conditions'}</IonText>
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
                    </form>
                </div>
                <div className="p-2 border-top">
                    <IonButton color="secondary" routerDirection="forward" expand="block" onClick={checkInputAndProceed} className="ion-no-margin">Submit</IonButton>
                    {/* <div className='ion-text-center m-3'>Registered User?</div>
                    <IonButton color="secondary" routerDirection="forward" expand="block" onClick={()=>history.goBack()} className="ion-no-margin">Login</IonButton> */}
                </div>
            </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default Registration;