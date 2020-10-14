import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar, IonItemDivider } from '@ionic/react';
import React, { useContext, useState } from 'react';
import { Redirect, useHistory } from 'react-router';
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
            else{ 
              history.goBack();
              return;
            }
          })
          setError("Please wait...");
        }
        
    }

    const checkInput = () =>
    {
      if(userIdState === "") {
        setError("Username cannot be blank!");
        return false;
      }
      let re = /([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/;
      if(!re.test(userIdState)) {
        setError("Invalid credentials!");
        return false;
      }
  
      if(passwordState === "") {
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
                    <IonButton color="secondary" routerDirection="forward" expand="block" onClick={loginRequestHandler} className="ion-no-margin">Submit</IonButton>
                    <div className='ion-text-center m-3'>or</div>
                    <IonButton color="secondary" routerDirection="forward" expand="block" className="ion-no-margin">Login with Phone</IonButton>
                    <div className='ion-text-center m-3'>New User?</div>
                    <IonButton color="secondary" routerDirection="forward" expand="block" onClick={()=>history.push('/register')} className="ion-no-margin">Sign Up</IonButton>                    
                </div>
            </div>
            </IonContent>
        </IonPage>
    );
}

export default Login;