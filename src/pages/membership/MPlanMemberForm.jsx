import { IonButton, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonPage, IonText } from '@ionic/react';
import React, { useState } from 'react';
import { getConfigFileParsingDiagnostics } from 'typescript';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import GrocSearch from '../../components/Menu/GrocSearch';

const MPlanMemberForm = () => {
    const [errorState, setErrorState] = useState('');

    const getFile = (event) => {
        alert(JSON.stringify(event.target.value));
    }
    
    return (
        <IonPage>
        <IonHeader className="osahan-nav border-white border-bottom">
            <BaseToolbar title="Copper Plans"/>
            <GrocSearch/>      
        </IonHeader>
        {/* <IonLoading isOpen={loadingState}/>               */}
        <IonContent color="dark" className="ion-padding">
        <IonGrid>
                <div className="p-2">
                    <form className="card">
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked">
                                Upload Adhaar 
                                <IonText color="danger">*</IonText>
                            </IonLabel>
                            <input type="file" accept="image/png, image/jpeg" onChange={getFile}></input>
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
                <div className="p-2 border-top">
                    <IonButton color="secondary" routerDirection="forward" expand="block" className="ion-no-margin">Submit</IonButton>
                    {/* <div className='ion-text-center m-3'>Registered User?</div>
                    <IonButton color="secondary" routerDirection="forward" expand="block" onClick={()=>history.goBack()} className="ion-no-margin">Login</IonButton> */}
                </div>
            </IonGrid>
        </IonContent>
    </IonPage>
    )
}

export default MPlanMemberForm;