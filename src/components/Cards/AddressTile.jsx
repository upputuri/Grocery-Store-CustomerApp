import { IonAlert, IonBadge, IonButton, IonButtons, IonCard, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonPopover, IonRippleEffect, IonRouterLink, IonRow, IonText } from '@ionic/react';
import React, { useState } from 'react';
import { callOutline as phoneIcon, checkmarkCircleOutline as checkMarkIcon } from 'ionicons/icons';
const AddressTile = (props) =>
{
    const [showLabelOptions, setShowLabelOptions] = useState(false);
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    console.log("Rendering address tile");

    const loadLabelPicker = () => {
        setShowLabelOptions(true);
    }

    const assignLabel = (labelId) => {
        setShowLabelOptions(false);
        // alert(labelId);
        props.updateAddressHandler({
            id: props.addressId,
            default: props.default,
            firstName: props.fName,
            lastName: props.lName,
            line1: props.line1,
            line2: props.line2,
            city: props.city,
            stateId: props.stateId,
            zipcode: props.zipCode,
            phone: props.phone,
            typeId: labelId
        });
    }

    const setDefault = () => {
        props.updateAddressHandler({
            id: props.addressId,
            firstName: props.fName,
            lastName: props.lName,
            line1: props.line1,
            line2: props.line2,
            city: props.city,
            stateId: props.stateId,
            zipcode: props.zipCode,
            phone: props.phone,
            typeId: props.labelId,
            default: true
        });
    }

    return (
        <IonGrid className="address-card" color="night">
            {props.updateAddressHandler && <IonPopover
                cssClass='groc-popover'
                isOpen={showLabelOptions}
                onDidDismiss={() => setShowLabelOptions(false)}>
                    {showLabelOptions && props.addressTypes && Object.entries(props.addressTypes).map((entry) => {
                    return <IonList key={entry[0]} color="dark" className="ion-no-padding bg-black">
                                <IonItem onClick={assignLabel.bind(this, entry[0])} color="dark" detail="false" className="ion-no-padding ion-activatable ripple-parent">
                                    <IonText className="m-3">{entry[1]}</IonText>
                                    <IonRippleEffect></IonRippleEffect>
                                </IonItem>
                            </IonList>
                    })}
            </IonPopover>}
            <IonAlert isOpen={infoAlertState.show}
                            onDidDismiss={()=> setInfoAlertState(false)}
                            header={''}
                            cssClass='groc-alert'
                            message={infoAlertState.msg}
                            buttons={['OK']}/>
            {props.updateAddressHandler && <IonRow>
                <IonCol className="d-flex justify-content-between">
                    {props.default ? 
                    <IonBadge color="secondary">Default</IonBadge>
                    :
                    <IonText color="secondary" onClick={setDefault}>Set default</IonText>}
                    {props.label ?
                    <IonBadge color="secondary" onClick={loadLabelPicker}>{props.label}</IonBadge>
                    :
                    <IonText color="secondary" onClick={loadLabelPicker}>Add Label</IonText>}
                </IonCol>
            </IonRow>}
            <IonRow className="ion-text-left">
                <IonCol size="1"></IonCol>
                <IonCol className="ion-text-wrap" size="11">
                    <IonText color="light"><h6>{props.fName+" "+props.lName}</h6></IonText>
                    <div className="ion-text-wrap">{props.line1}</div>
                    <div className="ion-text-wrap">{props.line2}</div>
                    <div className="ion-text-wrap">{props.city}, {props.state}</div>
                    <div className="ion-text-wrap">{props.zipCode}
                    </div>
                    <h6><IonIcon className="mr-2" icon={phoneIcon} size="small" color="light"/>{props.phone}</h6>
                </IonCol>
            </IonRow>
             <IonRow>
                <IonCol>
                <div className="d-flex align-items-center justify-content-between">
                    {props.deleteClickHandler && 
                        <IonButton color="secondary" onClick={props.deleteClickHandler} className="ion-no-margin">Delete</IonButton>
                    }
                    {props.editClickHandler && 
                        <IonButton  color="secondary" onClick={props.editClickHandler} className="ion-no-margin">Edit</IonButton>
                    }
                    </div>
                </IonCol>
            </IonRow>
            {props.selectClickHandler && props.selectedId === props.addressId && <IonRow>
                <IonCol>
                    <IonItem color="night">
                        <IonIcon color="success" size="large" icon={checkMarkIcon}/>
                        <IonText color="success">{props.selectedMessage}</IonText>
                    </IonItem>
                </IonCol>
            </IonRow>}
            {props.selectClickHandler && props.selectedId !== props.addressId && <IonRow>
                <IonCol>
                    <IonButton color="secondary" onClick={props.selectClickHandler} className="ion-no-margin">Select</IonButton>
                </IonCol>
            </IonRow>}
        </IonGrid>
    )
}

export default AddressTile;