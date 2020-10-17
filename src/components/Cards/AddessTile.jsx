import { IonButton, IonButtons, IonCard, IonCol, IonIcon, IonLabel, IonRow, IonText } from '@ionic/react';
import React from 'react';
import { callOutline as phoneIcon } from 'ionicons/icons';
const AddressTile = (props) =>
{

    return (
        <IonCard className="m-3" onClick={props.selectClickHandler} color="night">
            <IonRow className="ion-text-left">
                <IonCol size="1"></IonCol>
                <IonCol size="auto">
                    <IonText color="primary"><h6>{props.fName+" "+props.lName}</h6></IonText>
                    <small>{props.line1}</small><br/>
                    <small>{props.line2}</small><br/>
                    <small>City: {props.city}, State: {props.state}</small><br/>
                    <small>{props.zipcode}</small><br/>
                    <h6><IonIcon className="mr-2" icon={phoneIcon} size="small" color="primary"/>{props.phone}</h6>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                        <IonButton color="secondary" routerDirection="forward" onClick={props.editClickHandler} className="ion-no-margin">Edit</IonButton>
                </IonCol>
            </IonRow>
        </IonCard>
    )
}

export default AddressTile;