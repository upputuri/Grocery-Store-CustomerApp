import { IonBadge, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import React, { useContext, useState } from 'react';
import { Redirect, useHistory } from 'react-router';
import { validateLocaleAndSetLanguage } from 'typescript';
import { LoginContext } from '../App';

const Login = (props) =>
{
    const loginContext = useContext(LoginContext);
    let history = useHistory();
    const [userIdState, setUserIdState] = useState('');
    const [passwordState, setPasswordState] = useState('');
    const [errorState, setErrorState] = useState('');

    const setUserId = (event) => {
        setUserIdState(event.target.value);
        setErrorState('');
    }

    const setPassword = (event) => {
        setPasswordState(event.target.value);
        setErrorState('');        
    }

    const setError = (errorText) =>
    {
        setErrorState(errorText);
    }

    const loginRequestHandler = () =>
    {
        const result = checkInput();
        if (result === true){

          let loginResult = loginContext.login(userIdState, passwordState);
          loginResult.then((result) => {
            if (!result.hasResponse)
              setError("Server unreachable! Please try after some time.")
            else if (result.hasResponse && !result.isResponseOk)
              setError(result.responseObject.message);
          })
          setError("Please wait...");
        }
        
    }

    const checkInput = () =>
    {
      if(userIdState == "") {
        setError("Username cannot be blank!");
        return false;
      }
      let re = /([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/;
      if(!re.test(userIdState)) {
        setError("Username must be a valid email Id!");
        return false;
      }
  
      if(passwordState != "") {
        if(passwordState.length < 6) {
          setError("Password must contain at least six characters!");
          return false;
        }
        if(passwordState == userIdState) {
          setError("Password must be different from Username!");
          return false;
        }
        re = /[0-9]/;
        if(!re.test(passwordState)) {
          setError("password must contain at least one number (0-9)!");
          return false;
        }
        re = /[a-z]/;
        if(!re.test(passwordState)) {
          setError("password must contain at least one lowercase letter (a-z)!");
          return false;
        }
        re = /[A-Z]/;
        if(!re.test(passwordState)) {
          setError("password must contain at least one uppercase letter (A-Z)!");
          return false;
        }
      } else {
        setError("Please enter your password!");
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
                <IonTitle>Login
                </IonTitle>
            </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding shop-cart-page" color="dark">
            <div className="card mb-2">
                <div className="border-bottom text-center p-3">VEGIT Login</div>
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
                            <IonLabel position="stacked">Password</IonLabel>
                            <IonInput placeholder="Enter Password" required type="password"
                             onIonChange={setPassword}
                             value={passwordState}></IonInput>
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
                    <IonButton color="secondary" routerDirection="forward" expand="block" onClick={loginRequestHandler} className="ion-no-margin">Next</IonButton>
                    <div className='ion-text-center m-3'>or</div>
                    <IonButton color="secondary" routerDirection="forward" expand="block" className="ion-no-margin">Login with OTP</IonButton>
                </div>
            </div>
            </IonContent>
        </IonPage>
    );
}

export default Login;