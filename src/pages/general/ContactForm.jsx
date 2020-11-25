import { IonAlert, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage, IonRow, IonText, IonTextarea } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { LoginContext } from '../../App';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import { serviceBaseURL } from '../../components/Utilities/ServiceCaller';

const ContactForm = () => {
    const [subjectState, setSubjectState] = useState('');
    const [loadingState, setLoadingState] = useState(false);
    const [serviceRequestAlertState, setServiceRequestAlertState] = useState({show: false, msg: ''});
    const [detailState, setDetailState] = useState('');
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const [errorState, setErrorState] = useState('');
    const loginContext = useContext(LoginContext);
    const history = useHistory();

    const setSubject = (event) => {
        setSubjectState(event.detail.value);
        setErrorState('');
    }

    const setDetail = (event) => {
        setDetailState(event.detail.value);
        setErrorState('');
    }

    const checkInput = () => {
        if (!subjectState || subjectState.trim().length<3)
        {
            // alert(subjectState.trim().length);
            setErrorState("Please enter some content in subject");
            return false;
        }
        return true;
    }
    const sendQuery = async () => {
        if (!checkInput())
            return;
        let path = serviceBaseURL + '/customers/'+loginContext.customer.id+'/queries';
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
            receivedState = await resource.post({
                headers: loginHeaders,
                data: {subject: subjectState, detail: detailState}
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
        console.log("Submitted query to server");
        setLoadingState(false); 
        setInfoAlertState({show: true, msg: "Thanks for writing to us. We will respond as necessary"});
    }

    const submitClicked = () => {
        sendQuery();
    }

    return (
        <IonPage>
            <IonHeader className="osahan-nav border-white border-bottom">
                <BaseToolbar title="Submit a Query"/>     
            </IonHeader>
            <IonLoading isOpen={loadingState}/>
            <IonAlert
                        isOpen={serviceRequestAlertState.show}
                        header={'Error'}
                        cssClass='groc-alert'
                        subHeader={serviceRequestAlertState.msg}
                        message={'Failed to load'}
                        buttons={[{text: 'Cancel', 
                                    handler: ()=>{history.push('/home')}
                                }, {text: 'Retry', 
                                    handler: ()=>{setServiceRequestAlertState({show: false, msg: ''}); submitClicked()}}]}
                    />
            <IonAlert isOpen={infoAlertState.show}
                        onDidDismiss={()=> {setInfoAlertState(false); history.push("/home")}}
                        header={''}
                        cssClass='groc-alert'
                        message={infoAlertState.msg}
                        buttons={['OK']}/>                                            
            <IonContent className="ion-padding" color="dark">
            <div>
                <form>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                                <IonList lines="full" className="ion-no-margin ion-no-padding">
                                    <IonItem>
                                        <IonLabel position="stacked">Subject
                                            <IonText color="danger">*</IonText>
                                        </IonLabel>
                                        <IonInput placeholder="Short summary" required type="text" minlength="2" maxlength="30" 
                                        onIonChange={setSubject}
                                        value={subjectState}></IonInput>
                                    </IonItem>
                                </IonList>
                                <IonList lines="full" className="ion-no-margin ion-no-padding">
                                    <IonItem>
                                        <IonLabel position="stacked">Detailed query
                                        </IonLabel>
                                        <IonTextarea rows={5} wrap="soft" maxlength="300"  placeholder="Details of your query" type="text"
                                        onIonChange={setDetail}
                                        value={detailState}></IonTextarea>
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
                            </IonCol>
                        </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonButton color="secondary" expand="block" onClick={submitClicked} className="ion-no-margin">Send</IonButton>
                                </IonCol>
                            </IonRow>
                    </IonGrid>
            </form>
            </div>
            </IonContent>
        </IonPage>
    )
}

export default ContactForm;