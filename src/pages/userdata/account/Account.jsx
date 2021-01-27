import { IonAlert, IonButton, IonCheckbox, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonItem, IonItemGroup, IonLabel, IonLoading, IonPage, IonRadio, IonRouterLink, IonRow, IonText } from '@ionic/react';
import { trashBinOutline as deactivateIcon, mail as mailIcon, call as phoneIcon, create as editIcon, keyOutline as keyIcon, lockClosedOutline as lockClosedIcon, navigateCircleOutline as navigateIcon, personCircleOutline as personIcon } from 'ionicons/icons';
import Client from 'ketting';
import React, { useContext, useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router';
import { LoginContext } from '../../../App';
import BaseToolbar from '../../../components/Menu/BaseToolbar';
import { clientConfig } from '../../../components/Utilities/AppCommons';
import { profileImageStoreURL, serviceBaseURL } from '../../../components/Utilities/ServiceCaller';


const Account = (props) => {
    const loginContext = useContext(LoginContext);
    const history = useHistory();
    const [subscribedState, setSubscribedState] = useState(false);
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const [loadingState, setLoadingState] = useState(false);
    const [deactivateConfirmAlertState, setDeactivateConfirmAlertState] = useState({show: false, msg: ''});

    useEffect(()=>{
        if (loginContext.isAuthenticated){
            loadSubscription();
        }
        else{
            history.push("/login");
        }
    }, []);

    const handleLogout = () => {
        loginContext.logout();
        history.push('/home');
    }
    
    const confirmBeforeDeactivate = () => {
        setDeactivateConfirmAlertState({show: true, msg: 'Are you sure you want to deactivate your account?'})
    }

    const deactivateAccount = async () => {
        let path = serviceBaseURL + '/customers/me';
        const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
        setLoadingState(true);
        let response;
        try{
            response = await fetch(path, {method: 'DELETE',
                            headers: loginHeaders});
        }
        catch(e)
        {
            console.log("Service call failed with - "+e); 
            setLoadingState(false);
            setInfoAlertState({show: true, msg: clientConfig.connectivityErrorAlertMsg});
            return;
        }
        if (response.ok){
            console.log("Deactivate request successful on server");
            setLoadingState(false);
            loginContext.logout();
            setInfoAlertState({show: true, msg: 'Your account has been deactivated'});
            history.push("/home");
            return true;       
        }
        else {
            let responseObj = await response.json();
            console.log("Server returned a failure response to address delete request :"+responseObj.message);
            setLoadingState(false); 
            setInfoAlertState({show: true, msg: 'Deactivation failed, please contact support'});
            return;         
        }

    }

    const toggleSubscription = () => {
        sendUpdateSubscriptionRequest();
    }

    const loadSubscription = async () => {
        let path = serviceBaseURL + '/application/subscriptions?email='+loginContext.customer.email;  
        const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value); 
        const client = new Client(path);
        const resource = client.go();
        let receivedState;
        console.log("Making service call: "+resource.uri);
        try{
            receivedState = await resource.get();
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            return;
        }
        const sub = receivedState.data;
        setSubscribedState(sub.newsletter);
    }

    const sendUpdateSubscriptionRequest = async () => {
        let path = serviceBaseURL + '/application/subscriptions?email='+loginContext.customer.email;
        const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value); 
      
        console.log("Making service call: "+path);
        let response;
        try{
            response = await fetch(path, {
                method: 'POST',
                body: JSON.stringify({newsletter: !subscribedState}),
                headers: loginHeaders
            });
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            setInfoAlertState({show: true, msg: clientConfig.connectivityErrorAlertMsg});
        }
        if (response.ok) {
          console.log("Service call completed successfully");
          setSubscribedState(!subscribedState);
        }
        else{
            setInfoAlertState({show: true, msg: 'Server error. Please try again later or contact support!'});
        }
    }

    return (
        <IonPage>
            <LoginContext.Consumer>
                {
                (context) => !context.isAuthenticated ? <Redirect to='/login'/>: ''
                }
            </LoginContext.Consumer>
            <IonHeader className="osahan-nav border-bottom border-white">
                <BaseToolbar title="Account"/>     
            </IonHeader>
            <IonLoading isOpen={loadingState}/>
            <IonAlert isOpen={infoAlertState.show}
                        onDidDismiss={()=> setInfoAlertState(false)}
                        header={''}
                        cssClass='groc-alert'
                        message={infoAlertState.msg}
                        buttons={['OK']}/>  
            <IonAlert isOpen={deactivateConfirmAlertState.show}
                        onDidDismiss={()=> setDeactivateConfirmAlertState(false)}
                        header={''}
                        cssClass='groc-alert'
                        message={deactivateConfirmAlertState.msg}
                        buttons={[{text: 'Yes', handler: deactivateAccount}, {text: 'No'}]}/>  
            <IonContent className="account-info-table ion-padding my-profile-page" color="dark">
                <div>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                                <div className="border-bottom border-secondary">
                                    <div className="profile-picture-box mt-3 mb-3">
                                        <img alt="profile_picture" src={loginContext.customer.image ? profileImageStoreURL + "/" + loginContext.customer.image : "assets/user/blank_profile.png"}/>     
                                    </div>
                                    {/* <div className="d-flex justify-content-center">
                                    <IonText color="medium"><IonIcon size="small" icon={editIcon}></IonIcon>Edit</IonText>
                                    </div> */}
                                </div>
                            </IonCol>
                        </IonRow>
                        <IonRow className="ion-text-center">
                            <IonCol>
                                <div>
                                    <IonText color="light"><h5>{loginContext.customer.fname+" "+loginContext.customer.lname}</h5></IonText>
                                    <IonText><span>{loginContext.customer.email}</span></IonText>                                        
                                </div>
                            </IonCol>
                        </IonRow>

                    </IonGrid>
                </div>  
                <div className="mb-3 card bg-black profile-box text-center">

                </div>

                <IonGrid className="menu-box">
                    <IonItemGroup>
                        <IonRouterLink routerLink="/account/security">
                            <IonItem color="night" lines="full" className="border-bottom border-secondary">
                                <IonIcon slot="start" icon={keyIcon} color="light" size="small"/>
                                <IonLabel>{'Login & Security'}</IonLabel>
                            </IonItem>
                        </IonRouterLink>
                        <IonRouterLink routerLink="/account/profile">
                            <IonItem color="night" lines="full" className="border-bottom border-secondary">
                                <IonIcon slot="start" icon={personIcon} color="light" size="small"/>
                                <IonLabel>Profile</IonLabel>
                            </IonItem>
                        </IonRouterLink>
                        <IonRouterLink routerLink="/account/addresslist">
                            <IonItem color="night" lines="full" className="border-bottom border-secondary">
                                <IonIcon slot="start" icon={navigateIcon} color="light" size="small"/>
                                <IonLabel>Addresses</IonLabel>
                            </IonItem>
                        </IonRouterLink>
                        <IonRouterLink routerLink="/contactus">
                            <IonItem color="night" lines="full">
                                <IonIcon slot="start" icon={mailIcon} color="light" size="small"/>
                                <IonLabel>Tickets</IonLabel>
                            </IonItem>
                        </IonRouterLink>
                    </IonItemGroup>
                </IonGrid>
                <IonGrid className="mt-3 card bg-black profile-box text-center">
                    <IonItem color="night">
                        <IonCheckbox slot="start" onClick={toggleSubscription} checked={subscribedState} />
                        <IonText className="maintext" color="light">Sign Up for our newsletter and to get updates</IonText>
                    </IonItem>
                </IonGrid>
            </IonContent>

            <IonFooter className="border-white border-top">
                <IonButton onClick={handleLogout} size="large" className="button-block p-0 m-0" expand="full" color="night">
                    <IonIcon icon={lockClosedIcon} size="small"></IonIcon>
                    Logout
                </IonButton>
            </IonFooter> 
            <IonFooter className="border-white border-top">
                <IonButton onClick={confirmBeforeDeactivate} size="small" className="button-block p-0 m-0" expand="full" color="danger">
                    <IonIcon icon={deactivateIcon}></IonIcon>
                    Deactivate Account
                </IonButton>
            </IonFooter> 
        </IonPage>            
    )

}
export default Account;