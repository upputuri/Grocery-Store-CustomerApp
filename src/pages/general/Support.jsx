import { IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuToggle, IonPage, IonRow, IonText, IonTextarea, IonTitle } from '@ionic/react';
import React, { useState } from 'react';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import { callOutline as phoneIcon, logoTwitter as twitterIcon, logoFacebook as fbIcon, logoInstagram as instaIcon, navigate as navigateIcon} from 'ionicons/icons';
const Support = () => {
    const [selectedIndex , setSelectedIndex] = useState(-1);

    const toggleSelectedIndex = (i) =>{
        setSelectedIndex(selectedIndex !== i ? i : -1);
    }

    return <IonPage>
                <IonHeader className="osahan-nav">
                    <BaseToolbar title="Support"/>     
                </IonHeader>                                           
                <IonContent className="ion-padding" color="dark">
                <IonGrid color="night">
                    <IonRow className="ion-text-left border-bottom border-secondary">
                        <IonCol className="p-3 ion-text-center"><IonText className="headtext" color="primary">We are happy to hear from you!</IonText></IonCol>
                    </IonRow>
                    <IonRow className="ion-text-left border-bottom border-secondary">
                        <IonCol>
                            <IonList className="bg-black menu-top-section">
                                <IonMenuToggle auto-hide="false" >
                                <IonItem color="night" detail="false">
                                    <IonIcon color="primary" icon={phoneIcon} slot="start"/>
                                    <IonText color="">98989898989</IonText>
                                </IonItem>
                                </IonMenuToggle>

                                <IonMenuToggle auto-hide="false" >
                                <IonItem color="night" detail="false">
                                    <IonIcon color="primary" icon={fbIcon} slot="start"/>
                                    <IonText color="">vegitclub</IonText>
                                </IonItem>
                                </IonMenuToggle>

                                <IonMenuToggle auto-hide="false" >
                                <IonItem color="night" detail="false">
                                    <IonIcon color="primary" icon={twitterIcon} slot="start"/>
                                    <IonText color="">@vegitclub</IonText>
                                </IonItem>
                                </IonMenuToggle>

                                <IonMenuToggle auto-hide="false" >
                                <IonItem color="night" detail="false">
                                    <IonIcon color="primary" icon={instaIcon} slot="start"/>
                                    <IonText color="">@vegitclub</IonText>
                                </IonItem>
                                </IonMenuToggle>
                            </IonList>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonGrid className="address-card" color="night">
                                <IonRow className="ion-text-left">
                                    <IonCol size="1"></IonCol>
                                    <IonCol className="ion-text-wrap" size="11">
                                        <IonText className="maintext">Our Head office:</IonText>
                                        <IonText className="headtext" color="primary"><h5>The Vegit Club</h5></IonText>
                                        <IonLabel className="ion-text-wrap">34, East Street<br/>
                                                    West Side colony<br/>
                                                    City: Hyderabad<br/>
                                                    Pin: 500001
                                        </IonLabel><br/>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                </IonContent>
            </IonPage>
}

export default Support;