import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar, IonItemDivider } from '@ionic/react';
import React, { useContext, useState } from 'react';
import { Redirect, useHistory } from 'react-router';
import { LoginContext } from '../App';

const Registration = () =>
{
    const loginContext = useContext(LoginContext);
    const history = useHistory();
    const [userIdState, setUserIdState] = useState('');
    const [passwordState, setPasswordState] = useState('');
    const [rePasswordState, setRePasswordState] = useState('');
    const [fNameState, setFNameState] = useState('');
    const [lNameState, setLNameState] = useState('');
    const [errorState, setErrorState] = useState('');
    const passwordFormatError = "Password must contain at least six characters, one lowercase, one uppercase and one numeric!";

    const setUserId = (event) => {
        setUserIdState(event.target.value);
        setErrorState('');
    }

    const setPassword = (event) => {
        setPasswordState(event.target.value);
        setErrorState('');        
    }

    const setRePassword = (event) => {
        setRePasswordState(event.target.value);
        passwordState.localeCompare(event.target.value) !== 0 ? setErrorState('Passwords do not match!'): setErrorState('');       
    }

    const setFirstName = (event) => {
        setFNameState(event.target.value);
        setErrorState('');
    }

    const setLastName = (event) => {
        setLNameState(event.target.value);
        setErrorState('');
    }

    const checkPasswordMatch = (event) => {
        return passwordState.localeCompare(rePasswordState) === 0;
    }

    const sendRegisterRequest = async () =>
    {
        if (checkInput() && checkPasswordMatch()){

          let result = loginContext.register(userIdState, fNameState, lNameState, passwordState).then(
              (result) => {
                if (result === 400)
                {
                    console.log('Registration failed because an account already exists with given email');
                    setErrorState("An account already exists with this email! Please login if you are an existing user.");
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
        }  
    }

    const checkInput = () =>
    {
      if(userIdState === "") {
        setErrorState("Email Id cannot be blank!");
        return false;
      }
      let re = /([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/;
      if(!re.test(userIdState)) {
        setErrorState("Email Id must be valid");
        return false;
      }
      if(fNameState === "") {
        setErrorState("First name cannot be blank!");
        return false;
      }
      if(lNameState === "") {
        setErrorState("Last Name cannot be blank!");
        return false;
      }
  
      if(passwordState !== "") {
        if(passwordState.length < 6) {
          setErrorState(passwordFormatError);
          return false;
        }
        if(passwordState === userIdState) {
          setErrorState(passwordFormatError);
          return false;
        }
        re = /[0-9]/;
        if(!re.test(passwordState)) {
          setErrorState(passwordFormatError);
          return false;
        }
        re = /[a-z]/;
        if(!re.test(passwordState)) {
          setErrorState(passwordFormatError);
          return false;
        }
        re = /[A-Z]/;
        if(!re.test(passwordState)) {
          setErrorState(passwordFormatError);
          return false;
        }
      } else {
        setErrorState("Please enter your password!");
        return false;
      }

      return true;
    }

    return (
        <IonPage>
          <LoginContext.Consumer>
            {
              (context) => context.isAuthenticated ? <Redirect to='/home'/>: ''
            }
          </LoginContext.Consumer>
            <IonHeader className="osahan-nav">
            <IonToolbar>
                <IonButtons slot="start">
                    <IonMenuButton></IonMenuButton>
                </IonButtons>
                <IonTitle>Registration
                </IonTitle>
            </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding shop-cart-page" color="dark">
            <div className="card mb-2">
                <div className="border-bottom text-center p-3">VEGIT Registration</div>
                <div className="p-3">
                    <form className="card">
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked">
                                Email Id 
                                <IonText color="danger">*</IonText>
                            </IonLabel>
                            <IonInput placeholder="Enter Email" required type="email" 
                                    onIonChange={setUserId} 
                                    value={userIdState}></IonInput>
                        </IonItem>
                    </IonList>
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
                <div className="p-3 border-top">
                    <IonButton color="secondary" routerDirection="forward" expand="block" onClick={sendRegisterRequest} className="ion-no-margin">Submit</IonButton>
                    <div className='ion-text-center m-3'>Registered User?</div>
                    <IonButton color="secondary" routerDirection="forward" expand="block" onClick={()=>history.goBack()} className="ion-no-margin">Login</IonButton>
                </div>
            </div>
            </IonContent>
        </IonPage>
    )
}

export default Registration;