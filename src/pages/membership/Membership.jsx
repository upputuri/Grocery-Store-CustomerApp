import { IonCol, IonContent, IonGrid, IonHeader, IonLoading, IonPage, IonRow, IonText } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { LoginContext } from '../../App';
import InfoMessageTile from '../../components/Cards/InfoMessageTile';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import GrocSearch from '../../components/Menu/GrocSearch';
import { serviceBaseURL } from '../../components/Utilities/ServiceCaller';

const Membership = () => {
    const [loadingState, setLoadingState] = useState(false);
    const [mPlanState, setMPlanState] = useState(undefined);
    const loginContext = useContext(LoginContext);
    const history = useHistory();

    useEffect(()=>{
        //Load membership plan of the current user
        loadMembershipPlan();
    });

    const loadMembershipPlan = async () => {
        // let path = serviceBaseURL + '/customers/'+loginContext.customer.id+'/membership';
        // const client = new Client(path);
        // const resource = client.go();
        // const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
        // const loginHeaders = new Headers();
        // loginHeaders.append("Content-Type", "application/json");
        // loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
        // setLoadingState(true);
        // console.log("Making service call: "+resource.uri);
        // let receivedState;
        // try{
        //     receivedState = await resource.get({
        //         headers: loginHeaders,
        //     });
        // }
        // catch(e)
        // {
        //     console.log("Service call failed with - "+e);
        //     if (e.status && e.status === 401)//Unauthorized
        //     {
        //         history.push("/login");
        //         return;
        //     } 
        //     setLoadingState(false);
        //     return;
        // }
        // const membership = receivedState.data;
        // membership && membership.plan && membership.plan != null ? setMPlanState(membership.plan) : setMPlanState(null);
        // console.log("Request successful on server");
        // setLoadingState(false);   
        setMPlanState(null);
    }

    const viewAllPlans = () => {
        history.push("/mplancategories");
    }

    return (
        <IonPage>
            <IonHeader className="osahan-nav border-white border-bottom">
                <BaseToolbar title="Your Plan"/>
                <GrocSearch/>      
            </IonHeader>
            <IonLoading isOpen={loadingState}/>              
            <IonContent color="dark" className="ion-padding">
                {mPlanState != null ?
                <div>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                                <IonText color="primary">My minimum monthly monthly purchasing</IonText>
                            </IonCol>
                            <IonCol>
                            {': '+mPlanState && mPlanState.minPurchaseAmount}
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                            <IonText color="primary">My maximum monthly monthly purchasing limit</IonText>
                            </IonCol>
                            <IonCol>
                            {': '+mPlanState.maxPurchaseAmount}
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                            <IonText color="primary">My membership time period</IonText>
                            </IonCol>
                            <IonCol>
                                {': '+mPlanState.validityInYears}
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                                <div
                                    dangerouslySetInnerHTML={{__html: mPlanState.description}}>
                                </div>
                            </IonCol>
                        </IonRow>

                    </IonGrid>
                </div>
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