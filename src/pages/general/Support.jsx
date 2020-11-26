import { IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonMenuToggle, IonPage, IonRow, IonText, IonTextarea, IonTitle } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import { mail as mailIcon, callOutline as phoneIcon, logoTwitter as twitterIcon, logoYoutube as youtubeIcon, logoFacebook as fbIcon, logoInstagram as instaIcon, navigate as navigateIcon} from 'ionicons/icons';
import { serviceBaseURL } from '../../components/Utilities/ServiceCaller';
import Client from 'ketting';
const Support = () => {
    const [loadingState, setLoadingState] = useState(false);
    const [variablesState, setVariablesState] = useState(null);
    const [socialHandlesState, setSocialHandlesState] = useState(null);

    useEffect(() => {
        loadVariables();
        loadSocialHandles();
    }, []);

    const loadVariables = async () => {
        let path = serviceBaseURL + '/application/variables?keys=contact_no,contact_email,company_name,address_line_1,address_line_2,city';
        const client = new Client(path);
        const resource = client.go();
        let receivedState;
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        try{
            receivedState = await resource.get();
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            setLoadingState(false);
            return;
        }
        const variablesMap = receivedState.data;
        // alert(JSON.stringify(variables));
        setVariablesState(variablesMap.variables);
        setLoadingState(false);  
    }

    const loadSocialHandles = async () => {
        let path = serviceBaseURL + '/application/socialhandles';
        const client = new Client(path);
        const resource = client.go();
        let receivedState;
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        try{
            receivedState = await resource.get();
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            setLoadingState(false);
            return;
        }
        const socialHandlesMap = receivedState.data;
        // alert(JSON.stringify(variables));
        setSocialHandlesState(socialHandlesMap.variables);
        setLoadingState(false);  
    }

    if (variablesState != null)
    {
        return <IonPage>
                <IonHeader className="osahan-nav border-bottom border-white">
                    <BaseToolbar title="Contact Us"/>     
                </IonHeader> 
                <IonLoading isOpen={loadingState}/>                                           
                <IonContent className="ion-padding" color="dark">
                <IonGrid color="night">
                    <IonRow className="ion-text-left border-bottom border-secondary">
                        <IonCol className="p-3 ion-text-center"><IonText className="headtext" color="primary">Got a question? Call or Email Us</IonText></IonCol>
                    </IonRow>
                    <IonRow className="ion-text-left border-bottom border-secondary">
                        <IonCol>
                            <IonList className="bg-black menu-top-section">
                                <IonMenuToggle auto-hide="false" >
                                <IonItem color="night" detail="false">
                                    <IonIcon color="primary" icon={phoneIcon} slot="start"/>
                                    <IonText color="">{variablesState.contact_no}</IonText>
                                </IonItem>
                                </IonMenuToggle>
                                <IonMenuToggle auto-hide="false" >
                                <IonItem color="night" detail="false">
                                    <IonIcon color="primary" icon={mailIcon} slot="start"/>
                                    <IonText color="">{variablesState.contact_email}</IonText>
                                </IonItem>
                                </IonMenuToggle>
                            </IonList>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-text-left p-3">
                        <IonCol>
                            <div className="d-flex justify-content-around">
                                {socialHandlesState && socialHandlesState.youtube && 
                                <a href={socialHandlesState.youtube}><IonIcon  size="large" color="primary" icon={youtubeIcon}/></a>}
                                {socialHandlesState && socialHandlesState.twitter && 
                                <a href={socialHandlesState.twitter}><IonIcon  size="large" color="primary" icon={twitterIcon}/></a>}
                                {socialHandlesState && socialHandlesState.instagram && 
                                <a href={socialHandlesState.instagram}><IonIcon  size="large" color="primary" icon={instaIcon}/></a>}
                                {socialHandlesState && socialHandlesState.facebook && 
                                <a href={socialHandlesState.facebook}><IonIcon  size="large" color="primary" icon={fbIcon}/></a>}
                            </div>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-text-center border-bottom border-secondary">
                        <IonCol>
                            <IonText>STAY IN TOUCH</IonText>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonGrid className="address-card" color="night">
                                <IonRow className="ion-text-left">
                                    <IonCol size="1"></IonCol>
                                    <IonCol className="ion-text-wrap" size="11">
                                        <IonText className="maintext">Our Head office:</IonText>
                                        <IonText className="headtext" color="primary"><h5>{variablesState.company_name}</h5></IonText>
                                        <IonLabel className="ion-text-wrap">{variablesState.address_line_1}<br/>
                                                    {variablesState.address_line_2}<br/>
                                                    {variablesState.city}<br/>
                                                    {variablesState.contact_email}
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
    else
    {
        return  <IonPage>
                    <IonHeader className="osahan-nav border-white border-bottom">
                        <BaseToolbar title="Contact Us"/>     
                    </IonHeader> 
                    <IonLoading isOpen={loadingState}/>                                           
                    <IonContent className="ion-padding" color="dark">
                
                    </IonContent>
            </IonPage>
    }
}

export default Support;