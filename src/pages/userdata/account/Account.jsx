import { IonAlert, IonButton, IonCheckbox, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonItem, IonItemGroup, IonLabel, IonPage, IonRadio, IonRouterLink, IonRow, IonText } from '@ionic/react';
import { keyOutline as keyIcon, lockClosedOutline as lockClosedIcon, navigateCircleOutline as navigateIcon, personCircleOutline as personIcon } from 'ionicons/icons';
import Client from 'ketting';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { LoginContext } from '../../../App';
import BaseToolbar from '../../../components/Menu/BaseToolbar';
import { serviceBaseURL } from '../../../components/Utilities/ServiceCaller';
import './account.css';

const Account = (props) => {
    const loginContext = useContext(LoginContext);
    const history = useHistory();
    const [subscribedState, setSubscribedState] = useState(false);
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});

    useEffect(()=>{
        loadSubscription();
    }, []);

    const handleLogout = () => {
        loginContext.logout();
        history.push('/home');
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
            setInfoAlertState({show: true, msg: 'Please check your connectivity'});
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
            <IonHeader className="osahan-nav">
                <BaseToolbar title="Account"/>     
            </IonHeader>
            <IonAlert isOpen={infoAlertState.show}
                        onDidDismiss={()=> setInfoAlertState(false)}
                        header={''}
                        message={infoAlertState.msg}
                        buttons={['OK']}/>  
            <IonContent className="account-info-table ion-padding my-profile-page" color="dark">
                <div>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                                <div className="border-bottom border-secondary">
                                    <div className="profile-picture-box mt-3 mb-3">
                                        <img alt="profile_picture" src="assets/user/blank_profile.png"/>     
                                    </div>
                                </div>
                            </IonCol>
                        </IonRow>
                        <IonRow className="ion-text-center">
                            <IonCol>
                                <div>
                                    <IonText color="primary"><h5>{loginContext.customer.fname+" "+loginContext.customer.lname}</h5></IonText>
                                    <IonText><span>{loginContext.customer.email}</span></IonText>                                        
                                </div>
                            </IonCol>
                        </IonRow>

                    </IonGrid>
                </div>  
                <div className="mb-3 card bg-black profile-box text-center">

                </div>

                <div className="menu-box">
                    <IonItemGroup>
                        <IonRouterLink routerLink="/account/security">
                            <IonItem color="night" lines="full" className="border-bottom border-secondary">
                                <IonIcon slot="start" icon={keyIcon} color="primary" size="small"/>
                                <IonLabel>{'Login & Security'}</IonLabel>
                            </IonItem>
                        </IonRouterLink>
                        <IonRouterLink routerLink="/account/profile">
                            <IonItem color="night" lines="full" className="border-bottom border-secondary">
                                <IonIcon slot="start" icon={personIcon} color="primary" size="small"/>
                                <IonLabel>Profile</IonLabel>
                            </IonItem>
                        </IonRouterLink>
                        <IonRouterLink routerLink="/account/addresslist">
                            <IonItem color="night" lines="full">
                                <IonIcon slot="start" icon={navigateIcon} color="primary" size="small"/>
                                <IonLabel>Addresses</IonLabel>
                            </IonItem>
                        </IonRouterLink>
                    </IonItemGroup>
                </div>
                <div className="mt-3 card bg-black profile-box text-center">
                    <IonItem color="night">
                        <IonCheckbox slot="start" onClick={toggleSubscription} checked={subscribedState} />
                        <IonText className="maintext" color="primary">{!subscribedState ? 'Sign Up ': 'You are signed up '}for our newsletter and to get updates</IonText>
                    </IonItem>
                </div>
            </IonContent>

            <IonFooter className="border-0">
                <IonButton onClick={handleLogout} size="large" className="button-block p-0 m-0" expand="full" color="secondary">
                    <IonIcon icon={lockClosedIcon}></IonIcon>
                    Logout
                </IonButton>
            </IonFooter> 
        </IonPage>            
    )

}
export default Account;