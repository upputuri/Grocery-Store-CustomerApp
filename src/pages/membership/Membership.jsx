import { IonAlert, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonLoading, IonPage, IonRow, IonText } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { LoginContext } from '../../App';
import InfoMessageTile from '../../components/Cards/InfoMessageTile';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import GrocSearch from '../../components/Menu/GrocSearch';
import { clientConfig } from '../../components/Utilities/AppCommons';
import { serviceBaseURL } from '../../components/Utilities/ServiceCaller';
import MPlanDetail from './MPlanDetail';

const Membership = () => {
    const [loadingState, setLoadingState] = useState(false);
    const [mPlanState, setMPlanState] = useState(undefined);
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const loginContext = useContext(LoginContext);
    const history = useHistory();

    useEffect(()=>{
        //Load membership plan of the current user
        loadMembershipPlan();
    },[]);

    const loadMembershipPlan = async () => {
        let path = serviceBaseURL + '/customers/'+loginContext.customer.id+'/membership';
        const client = new Client(path);
        const resource = client.go();
        const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        let receivedState;
        try{
            receivedState = await resource.get({
                headers: loginHeaders,
            });
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            if (e.status && e.status === 401)//Unauthorized
            {
                history.push("/login");
                return;
            }
            else {
                setLoadingState(false);
                setInfoAlertState({show: true, msg: clientConfig.connectivityErrorAlertMsg});
            }
            return;
        }
        const membership = receivedState.data;
        membership && membership.plan && membership.plan != null ? setMPlanState(membership.plan) : setMPlanState(null);
        console.log("Request successful on server");
        setLoadingState(false);   
        // setMPlanState(null);
    }

    const viewAllPlans = () => {
        history.push("/mplancategories");
    }

    return (
        <IonPage>
            <IonHeader className="osahan-nav border-white border-bottom">
                <BaseToolbar title="Your Plan"/>
            </IonHeader>
            <IonAlert isOpen={infoAlertState.show}
                            onDidDismiss={()=> setInfoAlertState(false)}
                            header={''}
                            cssClass='groc-alert'
                            message={infoAlertState.msg}
                            buttons={['OK']}/>
            <IonLoading isOpen={loadingState}/>              
            <IonContent color="dark" className="ion-padding">
                {mPlanState != null ?
                <IonGrid>
                    <IonRow className="ion-text-center">
                        <IonCol>
                            <IonText className="headtext" color="light">{mPlanState.planName}</IonText>
                        </IonCol>
                    </IonRow>
                    <MPlanDetail minAmount = {mPlanState.minPurchaseAmount} 
                            maxAmount = {mPlanState.maxPurchaseAmount}
                            validity = {mPlanState.validityInYears}
                            detail = {mPlanState.description}/>
                    <IonButton className="mt-2" onClick={()=>history.push("/mplancategories")} color="secondary" expand="block">View All Plans</IonButton>
                </IonGrid>                            
                :
                <InfoMessageTile
                    detail="You have not purchased any plans yet. Would you like to purchase one?"
                    leftButtonText="View All Plans"
                    leftButtonClickHandler={viewAllPlans}
                    />
                }

            </IonContent>
        </IonPage>
    )
}

export default Membership;