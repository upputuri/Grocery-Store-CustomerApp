import { IonAlert, IonButton, IonContent, IonDatetime, IonHeader, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage, IonSearchbar, IonText } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { LoginContext } from '../../App';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import { serviceBaseURL } from '../../components/Utilities/ServiceCaller';
import './account.css';

const Profile = () => {
    const [profileState, setProfileState] = useState(null);
    const [loadingState, setLoadingState] = useState(false);
    const [serviceRequestAlertState, setServiceRequestAlertState] = useState({show: false, msg: ''});
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const [retryState, setRetryState] = useState(false);
    const [fNameState, setFNameState] = useState('');
    const [lNameState, setLNameState] = useState('');
    const [dobState, setDobState] = useState('');
    const [mobileState, setMobileState] = useState('');
    const [errorState, setErrorState] = useState('');
    const [editableState, setEditableState] = useState(false);
    const loginContext = useContext(LoginContext);
    const history = useHistory();

    useEffect(() => {
        loadProfile();
    }, [retryState]);

    const setFirstName = (event) => {
        setFNameState(event.target.value);
        setErrorState('');
    }

    const setLastName = (event) => {
        setLNameState(event.target.value);
        setErrorState('');
    }
    const setDob = (event) => {
        setDobState(event.target.value);
        setErrorState('');
    }

    const setMobile = (event) => {
        setMobileState(event.target.value);
        setErrorState('');
    }

    const loadProfile = async () => {
        let path = serviceBaseURL + '/customers/'+loginContext.customer.id;
        const client = new Client(path);
        const resource = client.go();
        const authHeaderBase64Value = btoa(loginContext.customer.email+':'+loginContext.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        let receivedState;
        try{
            receivedState = await resource.get({
                headers: loginHeaders
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
            setLoadingState(false);
            setServiceRequestAlertState({show: true, msg: e.toString()});
            return;
        }
        const profile = receivedState.data;
        // alert(JSON.stringify(profile));
        setProfileState(profile);
        setFNameState(profile.fname);
        setLNameState(profile.lname);
        setMobileState(profile.mobile);
        setDobState(profile.dob);
        setLoadingState(false);  
    }

    const makeProfileEditable = () =>{
        setEditableState(true);
    }

    const updateclicked = () => {
        if (!editableState)
            return;
        if (checkInput() === true)
        {
            // alert(fNameState+lNameState+mobileState+","+dobState)
            sendEditProfileRequest();
        }
    }

    const sendEditProfileRequest = async () => {
        let path = serviceBaseURL + '/customers/'+loginContext.customer.id;
        const client = new Client(path);
        const resource = client.go();
        const authHeaderBase64Value = btoa(loginContext.customer.email+':'+loginContext.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        let receivedState;
        // alert(dobState);
        try{
            receivedState = await resource.put({
                data: {
                    "mobile": mobileState,
                    "fname": fNameState,
                    "lname": lNameState,
                    "dob": new Date(dobState.substr(0,10)+"T00:00:00"),
                },
                headers: loginHeaders
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
            setLoadingState(false);
            setServiceRequestAlertState({show: true, msg: e.toString()});
            return;
        }
        setEditableState(false);
        setInfoAlertState({show: true, msg: 'Profile updated!'});
        setLoadingState(false);          
    }

    const checkInput = () => {

        if ((fNameState && fNameState.trim().length<1)
                || (lNameState && lNameState.trim().length<1)
                || (mobileState && mobileState.trim().length<1)
                || (dobState && dobState.trim().length<1) )
        {
            setErrorState('Invalid input. Please enter valid details.');
            return false;
        }
        else{
            return true;
        }
    }

    if (profileState !== null) {
        return (
            <IonPage>
                <IonHeader className="osahan-nav">
                    <BaseToolbar title="Profile"/>     
                </IonHeader>
                <IonLoading isOpen={loadingState}/>
                <IonAlert isOpen={infoAlertState.show}
                            onDidDismiss={()=> setInfoAlertState(false)}
                            header={''}
                            message={infoAlertState.msg}
                            buttons={['OK']}/>
                <IonAlert
                    isOpen={serviceRequestAlertState.show}
                    header={'Error'}
                    subHeader={serviceRequestAlertState.msg}
                    message={'Failed to load'}
                    buttons={[{text: 'Cancel', 
                                handler: ()=>{history.push('/home')}
                            }, {text: 'Retry', 
                                handler: ()=>{setServiceRequestAlertState({show: false, msg: ''}); setRetryState(!retryState)}}]}
                />
                <IonContent className="ion-padding" color="dark">
                    <div className="card mb-2">
                    <div className="border-bottom text-center p-3">We will not share your personal details with anyone</div>
                        <div className="p-3">
                            <form className="card">
                            <IonList lines="full" className="ion-no-margin ion-no-padding">
                                <IonItem>
                                    <IonLabel position="stacked">
                                        Email Id 
                                    </IonLabel>
                                    <IonInput type="email" value={profileState.email} disabled></IonInput>
                                </IonItem>
                            </IonList>
                            <IonList lines="full" className="ion-no-margin ion-no-padding">
                                <IonItem>
                                    <IonLabel position="stacked">First Name
                                        <IonText color="danger">*</IonText>
                                    </IonLabel>
                                    <IonInput placeholder="First Name" required type="text" disabled={!editableState}
                                    onIonChange={setFirstName}
                                    value={fNameState}></IonInput>
                                </IonItem>
                            </IonList>
                            <IonList lines="full" className="ion-no-margin ion-no-padding">
                                <IonItem>
                                    <IonLabel position="stacked">Last Name
                                        <IonText color="danger">*</IonText>
                                    </IonLabel>
                                    <IonInput placeholder="Last Name" required type="text" disabled={!editableState}
                                    onIonChange={setLastName}
                                    value={lNameState}></IonInput>
                                </IonItem>
                            </IonList>
                            <IonList lines="full" className="ion-no-margin ion-no-padding">
                                <IonItem>
                                    <IonLabel position="stacked">Mobile Number
                                        <IonText color="danger">*</IonText>
                                    </IonLabel>
                                    <IonInput placeholder="Mobile Num" required type="text" disabled={!editableState}
                                    onIonChange={setMobile}
                                    value={mobileState}></IonInput>
                                </IonItem>
                            </IonList>                            
                            <IonList lines="full" className="ion-no-margin ion-no-padding">
                                <IonItem>
                                    <IonLabel position="stacked">Date of Birth
                                    </IonLabel>
                                    <IonDatetime placeholder="Date of Birth" required type="date" disabled={!editableState}
                                    onIonChange={setDob}
                                    value={dobState}></IonDatetime>
                                </IonItem>
                            </IonList>
                  
                            {errorState !== '' &&
                            <IonList lines="full" className="ion-no-margin ion-no-padding">
                                <IonItem>
                                    <IonLabel className="ion-text-center ion-text-wrap" color="danger">
                                        <small>{errorState}</small>
                                    </IonLabel>
                                </IonItem>
                            </IonList>}
                            </form>
                        </div>
                        <div className="p-3 border-top">
                            {editableState ? 
                                <IonButton color="secondary" routerDirection="forward" expand="block" onClick={updateclicked} className="ion-no-margin">Update</IonButton>
                                :                            
                                <IonButton color="secondary" routerDirection="forward" expand="block" onClick={makeProfileEditable} className="ion-no-margin">Edit</IonButton>
                            }   
                        </div>
                    </div>
                </IonContent>
            </IonPage>            
        )
    }
    else {
        console.log("show alert "+serviceRequestAlertState.show);
            return (
            <IonPage>
                <IonHeader className="osahan-nav">
                    <BaseToolbar title="Profile"/>
                    <IonSearchbar className="pt-1" placeholder="Search for products"></IonSearchbar>      
                </IonHeader>
                <IonLoading isOpen={loadingState}/>                
                <IonContent color="dark">
                    <IonAlert
                        isOpen={serviceRequestAlertState.show}
                        header={'Error'}
                        subHeader={serviceRequestAlertState.msg}
                        message={'Failed to load'}
                        buttons={[{text: 'Cancel', 
                                    handler: ()=>{history.push('/home')}
                                }, {text: 'Retry', 
                                    handler: ()=>{setServiceRequestAlertState({show: false, msg: ''}); setRetryState(!retryState)}}]}
                    />
                </IonContent>
            </IonPage>
        )
    }        
        
}
export default Profile;