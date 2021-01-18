import { IonAlert, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonLoading, IonPage, IonRow, IonText } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { setOriginalNode } from 'typescript';
import { LoginContext } from '../../App';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import GrocSearch from '../../components/Menu/GrocSearch';
import { clientConfig } from '../../components/Utilities/AppCommons';
import { serviceBaseURL } from '../../components/Utilities/ServiceCaller';
import MPlanDetail from './MPlanDetail';

const MPlan = (props) => {
    const [mPlanState, setMPlanState] = useState(undefined);
    const [detailMode, setDetailMode] = useState(false);
    const [loadingState, setLoadingState] = useState(false);
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const [wholeSalerAlertState, setWholeSalerAlertState] = useState({show: false, msg: 'For membership offers for wholesalers, please contact us!'});
    const loginContext = useContext(LoginContext);
    const history = useHistory();
    
    useEffect(()=> {
        loadPlanBrief();
    }, []);

    const isMember = () => {
        let path = serviceBaseURL + '/customers/'+loginContext.customer.id+'/membership';
        const client = new Client(path);
        const resource = client.go();
        const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        let responsePromise;
        responsePromise = resource.get({
            headers: loginHeaders,
        });
        setLoadingState(false);
        return responsePromise;
    }

    const loadPlanBrief = async () => {
        const { id } = props.match.params;
        //Load plan brief
        let path = serviceBaseURL + '/membership/plans/'+id;
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
        const mPlan = receivedState.data;
        setMPlanState(mPlan);
        console.log("Request successful on server");
        setLoadingState(false);
    }

    const toggleDetailMode = () =>{
        setDetailMode(!detailMode);
    }

    const viewMembershipForm = async () => {
        let response;
        try{
            response = await isMember();
            // alert(JSON.stringify(response.data));
        }
        catch(e)
        {
            setInfoAlertState({show: true, msg: clientConfig.connectivityErrorAlertMsg});
            return;
        }
        if (response.data && response.data.membershipId && response.data.membershipId > 0){
            setInfoAlertState({show: true, msg: "You are already a member!"});
            return;
        }
        history.push("/membershipform?planid="+mPlanState.planId+"&planname="+mPlanState.planName+"&categoryname="+mPlanState.categoryName);
    }

    const showWholeSalerMsg = () => {
        setWholeSalerAlertState({...wholeSalerAlertState, show: true})
    }

    return (
        <IonPage>
            <IonHeader className="osahan-nav border-white border-bottom">
                <BaseToolbar title={mPlanState && mPlanState.categoryName}/>
                <GrocSearch/>      
            </IonHeader>
            <IonLoading isOpen={loadingState}/> 
            <IonAlert isOpen={infoAlertState.show}
                            onDidDismiss={()=> setInfoAlertState({show: false, msg: ''})}
                            header={''}
                            cssClass='groc-alert'
                            message={infoAlertState.msg}
                            buttons={['OK']}/>
            <IonAlert isOpen={wholeSalerAlertState.show}
                            onDidDismiss={()=> setWholeSalerAlertState({show: false, msg: ''})}
                            header={''}
                            cssClass='groc-alert'
                            message={wholeSalerAlertState.msg}
                            buttons={[{text: 'Contact Us', handler: ()=>history.push("/support")}, {text: 'Cancel'}]}/>
            {/* <IonLoading isOpen={loadingState}/>               */}
            {mPlanState ?
            <IonContent color="dark" className="ion-padding">
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonText color="light">{mPlanState.planName}</IonText>
                        </IonCol>
                    </IonRow>

                    <MPlanDetail minAmount = {mPlanState.minPurchaseAmount} 
                                maxAmount = {mPlanState.maxPurchaseAmount}
                                validity = {mPlanState.validityInYears}
                                detail = {!detailMode ? mPlanState.shortDescription : mPlanState.description}/>
                    <IonButton onClick={viewMembershipForm} className="mt-2" color="secondary" expand="block">{'Rs. '+mPlanState.planPrice+'/- (One time amount)'}</IonButton>
                    <IonButton onClick={showWholeSalerMsg} className="mt-2" color="secondary" expand="block">For Wholesaler</IonButton>
                    {!detailMode &&<IonButton className="mt-2" onClick={toggleDetailMode} color="secondary" expand="block">View Details</IonButton>}
                </IonGrid>
            </IonContent>
            :
            <IonContent color="dark" className="ion-padding">

            </IonContent>}

        </IonPage>
    )
}

export default MPlan;