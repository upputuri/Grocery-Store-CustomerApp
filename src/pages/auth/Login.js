import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar, IonItemDivider, IonGrid } from '@ionic/react';
import React, { useContext, useState } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router';
import { LoginContext } from '../../App';
import { logoURL } from '../../components/Utilities/ServiceCaller';

const Login = (props) =>
{
    const loginContext = useContext(LoginContext);
    let history = useHistory();
    const [userIdState, setUserIdState] = useState('');
    const [passwordState, setPasswordState] = useState('');
    const [errorState, setErrorState] = useState('');
    const redirectTo = new URLSearchParams(useLocation().search).get('redirect');
     
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

    const passwordLoginRequestHandler = () =>
    {
        const result = checkInput();
        if (result === true){

          let loginResult = loginContext.login(userIdState, passwordState);
          loginResult.then((result) => {
            if (!result.hasResponse)
              setError("Server unreachable! Please try after some time.")
            else if (result.hasResponse && !result.isResponseOk && result.responseObject.status === 401)
              setError("Login failed. Please check credentials or contact support!");
            else{ 
              redirectTo ? history.push(redirectTo): history.push("/home");
              return;
            }
          });
          setError("Please wait...");
        }
        
    }

    const googleLoginClicked = async () => {
      loginContext.loginWithGoogle();
    }

    const checkInput = () =>
    {
      if(userIdState === "") {
        setError("Username cannot be blank!");
        return false;
      }
      // let re = /([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/;
      // if(!re.test(userIdState)) {
      //   setError("Invalid credentials!");
      //   return false;
      // }
  
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
              (context) => context.isAuthenticated ? <Redirect to={redirectTo ? redirectTo: '/home'}/>: ''
            }
          </LoginContext.Consumer>
            <IonHeader className="osahan-nav border-white border-bottom">
            <IonToolbar>
                <IonButtons slot="start">
                    <IonMenuButton></IonMenuButton>
                </IonButtons>
                <IonTitle>Login
                </IonTitle>
            </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" color="dark">
            <IonGrid>
                <div className="border-bottom text-center p-2">
                  <img alt="img" className="single-img" src={logoURL}/>
                </div>
                <div className="p-2">
                    <form className="card">
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel color="dark" position="stacked">
                                Email Id/Mobile No.
                                <IonText color="danger">*</IonText>
                            </IonLabel>
                            <IonInput placeholder="Email Id/Mobile No." required type="email" 
                                    onIonChange={setUserId} 
                                    value={userIdState}></IonInput>
                        </IonItem>
                    </IonList>
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked">Password
                                <IonText color="danger">*</IonText></IonLabel>
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
                <div className="p-2 border-top">
                    <IonButton color="secondary" routerDirection="forward" expand="block" onClick={passwordLoginRequestHandler} className="ion-no-margin">Submit</IonButton>
                    <div className='ion-text-center m-2'></div>
                    <IonButton color="secondary" routerDirection="forward" expand="block" onClick={()=>history.push('/resetpass')} className="ion-no-margin">Forgot Password?</IonButton>
                   <div className='ion-text-center m-2'>New User?</div>
                    <IonButton color="secondary" routerDirection="forward" expand="block" onClick={()=>history.push('/register')} className="ion-no-margin">Sign Up</IonButton>                    
                </div>
            </IonGrid>
            </IonContent>
        </IonPage>
    );
}

export default Login;