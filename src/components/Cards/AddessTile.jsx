import { IonButton, IonButtons, IonCard, IonCol, IonIcon, IonItem, IonLabel, IonRow, IonText } from '@ionic/react';
import React from 'react';
import { callOutline as phoneIcon, checkmarkCircleOutline as checkMarkIcon } from 'ionicons/icons';
const AddressTile = (props) =>
{
    console.log("Rendering address tile");
    return (
        <IonCard className="address-card" color="night">
            <IonRow className="ion-text-left">
                <IonCol size="1"></IonCol>
                <IonCol className="ion-text-wrap" size="11">
                    <IonText color="primary"><h6>{props.fName+" "+props.lName}</h6></IonText>
                    <IonLabel className="ion-text-wrap">{props.line1}<br/>
                                {props.line2}<br/>
                                City: {props.city}, State: {props.state}<br/>
                                Pin: {props.zipCode}
                    </IonLabel><br/>
                    <h6><IonIcon className="mr-2" icon={phoneIcon} size="small" color="primary"/>{props.phone}</h6>
                </IonCol>
            </IonRow>
            {props.editClickHandler && <IonRow>
                <IonCol>
                        <IonButton color="secondary" onClick={props.editClickHandler} className="ion-no-margin">Edit</IonButton>
                </IonCol>
            </IonRow>}
            {props.selectClickHandler && props.selectedId === props.addressId && <IonRow>
                <IonCol>
                    <IonItem color="night">
                        <IonIcon color="success" size="large" icon={checkMarkIcon}/>
                        <IonText color="success">Selected for delivery</IonText>
                    </IonItem>
                </IonCol>
            </IonRow>}
            {props.selectClickHandler && props.selectedId !== props.addressId && <IonRow>
                <IonCol>
                    <IonButton color="secondary" onClick={props.selectClickHandler} className="ion-no-margin">Select</IonButton>
                </IonCol>
            </IonRow>}
        </IonCard>
    )
}

export default AddressTile;