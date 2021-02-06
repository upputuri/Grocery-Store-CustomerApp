import { IonAlert, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonList, IonLoading, IonPage, IonRow, IonText } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { LoginContext } from '../../App';
import InfoMessageTile from '../../components/Cards/InfoMessageTile';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import GrocSearch from '../../components/Menu/GrocSearch';
import { clientConfig, getMembershipCardColorClass, generateTransactionId } from '../../components/Utilities/AppCommons';
import { serviceBaseURL } from '../../components/Utilities/ServiceCaller';
import MPlanDetail from './MPlanDetail';
import { chevronDownOutline as arrowDownIcon, chevronForwardOutline as arrowRightIcon} from 'ionicons/icons';

const Membership = () => {
    const [loadingState, setLoadingState] = useState(false);
    const [mPlanState, setMPlanState] = useState(undefined);
    const [memberState, setMemberState] = useState(undefined);
    const [nomineeState, setNomineeState] = useState(undefined);
    const [memberId, setMemberId] = useState(undefined);
    const [transactionState, setTransactionState] = useState(undefined);
    const [startDateState, setStartDateState] = useState(undefined);
    const [endDateState, setEndDateState] = useState(undefined);
    const [renewalDateState, setRenewalDateState] = useState(undefined);
    const [isMemberDetailOpen, setIsMemberDetailOpen] = useState(false);
    const [isNomineeDetailOpen, setIsNomineeDetailOpen] = useState(false);
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
        // alert(JSON.stringify(membership.plan));
        if (membership && membership.plan && membership.plan != null) {
            setMPlanState(membership.plan);
            // alert(JSON.stringify(membership.member));
            setMemberState(membership.member);
            setMemberId(membership.membershipId);
            setNomineeState(membership.nominee);
            setTransactionState(membership.transaction);
            setStartDateState(membership.startDate);
            setEndDateState(membership.endDate);
            setRenewalDateState(membership.renewalDate);
        }
        else {
            setMPlanState(null);    
        }
        console.log("Request successful on server");
        setLoadingState(false);   
        // setMPlanState(null);
    }

    const viewAllPlans = () => {
        history.push("/mplancategories");
    }

    const getDisplayDate = (receivedDate) => {
        if (receivedDate){
            const date = new Date(receivedDate);
            return date.getDate().toString().padStart(2,0)+"-"+
                        (date.getMonth()+1).toString().padStart(2,0)+"-"+
                        date.getFullYear();
        }
        else{
            return "Unavailable";
        }
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
                {mPlanState &&
                <div className={getMembershipCardColorClass(mPlanState.categoryName)+'-canvas-light p-1'}>
                    <div>
                        <IonCol>
                            <IonText color="light">{mPlanState.planName}</IonText>
                        </IonCol>
                    </div>

                    <MPlanDetail minAmount = {mPlanState.minPurchaseAmount} 
                            maxAmount = {mPlanState.maxPurchaseAmount}
                            validity = {mPlanState.validityInYears}
                            detail = {mPlanState.description}
                            categoryName = {mPlanState.categoryName}/>

                    <div className={getMembershipCardColorClass(mPlanState.categoryName)+'-canvas-dark m-2'}>
                        <IonRow>
                            <IonCol>
                                <IonText color="light">Membership Id</IonText>
                            </IonCol>
                            <IonCol size="6">
                            {': '+memberId}
                            </IonCol>
                        </IonRow>
                        {transactionState && 
                        <IonRow>
                            <IonCol>
                                <IonText color="light">Transaction Id</IonText>
                            </IonCol>
                            <IonCol size="6">
                            {': '+generateTransactionId(transactionState.id, transactionState.createdTS)}
                            </IonCol>
                        </IonRow>}
                        <IonRow>
                            <IonCol>
                                <IonText color="light">Plan Start Date</IonText>
                            </IonCol>
                            <IonCol size="6">
                            {': '+getDisplayDate(startDateState)}
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                            <IonText color="light">Plan End Date</IonText>
                            </IonCol>
                            <IonCol size="6">
                            {': '+getDisplayDate(endDateState)}
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                            <IonText color="light">Renewal Date</IonText>
                            </IonCol>
                            <IonCol size="6">
                                {': '+getDisplayDate(renewalDateState)}
                            </IonCol>
                        </IonRow>
                    </div>

                    <div className={getMembershipCardColorClass(mPlanState.categoryName)+'-canvas-dark m-2'}>
                            <div className=" d-flex align-items-center" onClick={()=>setIsMemberDetailOpen(!isMemberDetailOpen)}>
                                <IonIcon className="mr-2" size="small" icon={isMemberDetailOpen ? arrowDownIcon : arrowRightIcon}/>
                                <IonText color="light">
                                Member Details<small>(Tap to open)</small></IonText>
                            </div>
                            {isMemberDetailOpen && 
                            <div>
                                <IonRow>
                                    <IonCol className="border-white border-bottom">
                                        <IonText className="subtext">(Contact us if the member details are to be changed)</IonText>
                                    </IonCol>
                                </IonRow>
                                {memberState && memberState.photoImg && 
                                <IonRow className="my-2">
                                    <IonCol className="border-white border-bottom">
                                        <IonImg src={"https://thevegitclub.com/vegitfiles/document/"+memberState.adhaarFrontImg}></IonImg>
                                    </IonCol>
                                </IonRow>}
                                {memberState && memberState.adhaarFrontImg && 
                                <IonRow className="my-2">
                                    <IonCol className="border-white border-bottom">
                                        <IonImg src={"https://thevegitclub.com/vegitfiles/document/"+memberState.adhaarFrontImg}></IonImg>
                                    </IonCol>
                                </IonRow>}
                                {memberState && memberState.adhaarBackImg && 
                                <IonRow className="my-2">
                                    <IonCol className="border-white border-bottom">
                                        <IonImg src={"https://thevegitclub.com/vegitfiles/document/"+memberState.adhaarFrontImg}></IonImg>
                                    </IonCol>
                                </IonRow>}
                                <IonRow>
                                    <IonCol>
                                        <IonText color="light">Full name</IonText>
                                    </IonCol>
                                    <IonCol size="8">
                                        <IonText className="subtext">{': '+memberState.fname +' '+memberState.lname}</IonText>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonText color="light">Email</IonText>
                                    </IonCol>
                                    <IonCol size="8">
                                    <IonText className="subtext">{': '+ (memberState.email !== null ? memberState.email : 'Unavailable')}</IonText>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                    <IonText color="light">DOB</IonText>
                                    </IonCol>
                                    <IonCol size="8">
                                    <IonText className="subtext">{': '+ (memberState.dob !== null ? memberState.dob : 'Unavailable')}</IonText>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                    <IonText color="light">Gender</IonText>
                                    </IonCol>
                                    <IonCol size="8">
                                        <IonText className="subtext">{': '+ (memberState.gender !== null ? memberState.gender : 'Unavailable')}</IonText>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                    <IonText color="light">Contact No.</IonText>
                                    </IonCol>
                                    <IonCol size="8">
                                        <IonText className="subtext">{': '+ (memberState.mobile !== null ? memberState.mobile : 'Unavailable')}</IonText>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                    <IonText color="light">Alternate Contact</IonText>
                                    </IonCol>
                                    <IonCol size="8">
                                        <IonText className="subtext">{': '+ (memberState.altMobile !== null ? memberState.altMobile : 'Unavailable')}</IonText>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                    <IonText color="light">Present Address</IonText>
                                    </IonCol>
                                    <IonCol size="8">
                                        <IonText className="subtext">{': '+ (memberState.presentAddress !== null ? memberState.presentAddress : 'Unavailable')}</IonText>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                    <IonText color="light">Pin Code</IonText>
                                    </IonCol>
                                    <IonCol size="8">
                                        <IonText className="subtext">{': '+ (memberState.presentPinCode !== null ? memberState.presentPinCode : 'Unavailable')}</IonText>
                                    </IonCol>
                                </IonRow>
                            </div>
                            }   
                    </div>

                    <div className={getMembershipCardColorClass(mPlanState.categoryName)+'-canvas-dark m-2'}>
                            <div className=" d-flex align-items-center" onClick={()=>setIsNomineeDetailOpen(!isNomineeDetailOpen)}>
                                <IonIcon className="mr-2" size="small" icon={isNomineeDetailOpen ? arrowDownIcon : arrowRightIcon}/>
                                <IonText color="light">
                                Nominee Details<small>(Tap to open)</small></IonText>
                            </div>
                            {isNomineeDetailOpen && 
                            <div>
                                <IonRow>
                                    <IonCol className="border-white border-bottom">
                                        <IonText className="subtext">(Contact us if the nominee details are to be changed)</IonText>
                                    </IonCol>
                                </IonRow>
                                {nomineeState && nomineeState.photoImg && 
                                <IonRow className="my-2">
                                    <IonCol className="border-white border-bottom">
                                        <IonImg src={"https://thevegitclub.com/vegitfiles/document/"+nomineeState.adhaarFrontImg}></IonImg>
                                    </IonCol>
                                </IonRow>}
                                {nomineeState && nomineeState.adhaarFrontImg && 
                                <IonRow className="my-2">
                                    <IonCol className="border-white border-bottom">
                                        <IonImg src={"https://thevegitclub.com/vegitfiles/document/"+nomineeState.adhaarFrontImg}></IonImg>
                                    </IonCol>
                                </IonRow>}
                                {nomineeState && nomineeState.adhaarBackImg && 
                                <IonRow className="my-2">
                                    <IonCol className="border-white border-bottom">
                                        <IonImg src={"https://thevegitclub.com/vegitfiles/document/"+nomineeState.adhaarFrontImg}></IonImg>
                                    </IonCol>
                                </IonRow>}
                                <IonRow>
                                    <IonCol>
                                        <IonText color="light">Full name</IonText>
                                    </IonCol>
                                    <IonCol size="8">
                                        <IonText className="subtext">{': '+nomineeState.fname +' '+nomineeState.lname}</IonText>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonText color="light">Email</IonText>
                                    </IonCol>
                                    <IonCol size="8">
                                    <IonText className="subtext">{': '+ (nomineeState.email !== null ? nomineeState.email : 'Unavailable')}</IonText>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                    <IonText color="light">DOB</IonText>
                                    </IonCol>
                                    <IonCol size="8">
                                    <IonText className="subtext">{': '+ (nomineeState.dob !== null ? nomineeState.dob : 'Unavailable')}</IonText>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                    <IonText color="light">Gender</IonText>
                                    </IonCol>
                                    <IonCol size="8">
                                        <IonText className="subtext">{': '+ (nomineeState.gender !== null ? nomineeState.gender : 'Unavailable')}</IonText>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                    <IonText color="light">Relationship</IonText>
                                    </IonCol>
                                    <IonCol size="8">
                                        <IonText className="subtext">{': '+ (nomineeState.relationshipName !== null ? nomineeState.relationshipName : 'Unavailable')}</IonText>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                    <IonText color="light">Contact No.</IonText>
                                    </IonCol>
                                    <IonCol size="8">
                                        <IonText className="subtext">{': '+ (nomineeState.mobile !== null ? nomineeState.mobile : 'Unavailable')}</IonText>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                    <IonText color="light">Alternate Contact</IonText>
                                    </IonCol>
                                    <IonCol size="8">
                                        <IonText className="subtext">{': '+ (nomineeState.altMobile !== null ? nomineeState.altMobile : 'Unavailable')}</IonText>
                                    </IonCol>
                                </IonRow>
                            </div>
                            }   
                    </div>

                    <IonButton className="mt-2" onClick={()=>history.push("/mplancategories")} color="secondary" expand="block">View All Plans</IonButton>
                </div>}                            
                {mPlanState === null &&
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