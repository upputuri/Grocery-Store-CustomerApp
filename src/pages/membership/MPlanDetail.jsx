import { IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonText } from '@ionic/react';
import React from 'react';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import GrocSearch from '../../components/Menu/GrocSearch';
import { getMembershipCardColorClass } from '../../components/Utilities/AppCommons';
// import {Editor, EditorState} from 'draft-js';

const MPlanDetail = (props) =>{
    // alert(props.categoryName)
    return (
        <div>
            <div className={getMembershipCardColorClass(props.categoryName)+'-canvas-dark m-2'}>
                <IonRow>
                    <IonCol>
                        <IonText color="light">My minimum monthly purchasing limit</IonText>
                    </IonCol>
                    <IonCol size="3">
                    {': '+props.minAmount+'/-'}
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                    <IonText color="light">My maximum monthly purchasing limit</IonText>
                    </IonCol>
                    <IonCol size="3">
                    {': '+props.maxAmount+'/-'}
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                    <IonText color="light">My membership time period</IonText>
                    </IonCol>
                    <IonCol size="3">
                        {': '+props.validity+' years'}
                    </IonCol>
                </IonRow>
            </div>
            <div className={getMembershipCardColorClass(props.categoryName)+'-canvas-dark m-2'}>
                <IonRow>
                    <IonCol>
                        <div
                            dangerouslySetInnerHTML={{__html: props.detail}}>
                        </div>
                    </IonCol>
                </IonRow>
        </div>
        </div>
    )
}

export default MPlanDetail;