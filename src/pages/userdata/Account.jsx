import { IonAlert, IonButton, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonItem, IonItemGroup, IonLabel, IonLoading, IonPage, IonRouterLink, IonRow, IonSearchbar, IonText } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { LoginContext } from '../../App';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import { serviceBaseURL } from '../../components/Utilities/ServiceCaller';
import { navigateCircleOutline as navigateIcon, personCircleOutline as personIcon, listOutline as listIcon, lockClosedOutline as lockClosedIcon } from 'ionicons/icons';
import './account.css';

const Account = (props) => {
    const loginContext = useContext(LoginContext);
    const history = useHistory();

    return (
        <IonPage>
            <IonHeader className="osahan-nav">
                <BaseToolbar title="Account"/>     
            </IonHeader>
            <IonContent className="ion-padding my-profile-page" color="dark">
                <div>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                                <div className="border-bottom">
                                    <div className="profile-picture-box mt-3 mb-3">
                                        <img alt="profile_picture" src="assets/user/srikanth1.jpg"/>     
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
                        <IonRouterLink routerLink="/account/profile">
                            <IonItem color="night" lines="full" className="border-bottom">
                                <IonIcon slot="start" icon={personIcon} color="primary" size="small"/>
                                <IonLabel>Profile</IonLabel>
                            </IonItem>
                        </IonRouterLink>
                        <IonRouterLink routerLink="/account/addresslist">
                            <IonItem color="night" lines="full" className="border-bottom">
                                <IonIcon slot="start" icon={navigateIcon} color="primary" size="small"/>
                                <IonLabel>Addresses</IonLabel>
                            </IonItem>
                        </IonRouterLink>
                        <IonRouterLink routerLink="/account/orders">
                            <IonItem color="night" lines="full">
                                <IonIcon slot="start" icon={listIcon} color="primary" size="small"/>
                                <IonLabel>Orders</IonLabel>
                            </IonItem>
                        </IonRouterLink>
                    </IonItemGroup>
                </div>
            </IonContent>

            <IonFooter className="border-0">
                <IonButton size="large" className="button-block p-0 m-0" expand="full" color="secondary">
                    <IonIcon icon={lockClosedIcon}></IonIcon>
                    Logout
                </IonButton>
            </IonFooter> 
        </IonPage>            
    )

}
export default Account;