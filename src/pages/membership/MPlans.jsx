import { IonAlert, IonContent, IonHeader, IonLoading, IonPage } from '@ionic/react';
import Client from 'ketting';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import GrocSearch from '../../components/Menu/GrocSearch';
import { clientConfig } from '../../components/Utilities/AppCommons';
import { serviceBaseURL } from '../../components/Utilities/ServiceCaller';
import MPlanTile from './MPlanTile';

const MPlans = () => {
    const [loadingState, setLoadingState] = useState(false);
    const [mPlansState, setMPlansState] = useState(undefined);
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const search = useLocation().search;
    const history = useHistory();
    const catId = new URLSearchParams(search).get('categoryid');
    const catName = new URLSearchParams(search).get('categoryname');
    
    useEffect(() => {
        loadPlans();
    },[]);

    const loadPlans = async () => {
        //Load plans of category from server
        let path = serviceBaseURL + '/membership/plans?category='+catId;
        const client = new Client(path);
        const resource = client.go();
        // const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
        // const loginHeaders = new Headers();
        // loginHeaders.append("Content-Type", "application/json");
        // loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        let receivedState;
        try{
            receivedState = await resource.get({
                // headers: loginHeaders,
            });
        }
        catch(e)
        {
            setLoadingState(false);
            setInfoAlertState({show: true, msg: clientConfig.connectivityErrorAlertMsg});
            return;
        }
        // console.log(JSON.stringify(receivedState));
        const plansListState = receivedState.getEmbedded();
        // console.log(JSON.stringify(plansListState));
        const mPlans = plansListState.map((planState) => planState.data)
        setMPlansState(mPlans);
        console.log("Request successful on server");
        setLoadingState(false); 
    }

    const viewPlanDetail = (planId) => {
        history.push("/mplans/"+planId);
    }

    return (
        <IonPage>
            <IonHeader className="osahan-nav border-white border-bottom">
                <BaseToolbar title={catName}/>
                <GrocSearch/>      
            </IonHeader>
            <IonAlert isOpen={infoAlertState.show}
                            onDidDismiss={()=> setInfoAlertState(false)}
                            header={''}
                            cssClass='groc-alert'
                            message={infoAlertState.msg}
                            buttons={['OK']}/>
            <IonLoading isOpen={loadingState}/>                
            <IonContent color="dark" className="ion-padding">
                {mPlansState && mPlansState.map((plan) =>{
                    return <MPlanTile key={plan.planId} planName={plan.planName} onViewPlanDetailClick={viewPlanDetail.bind(this, plan.planId)}/>
                })}
            </IonContent>
        </IonPage>
    )
}

export default MPlans;