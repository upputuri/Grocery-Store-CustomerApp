import { IonAlert, IonButton, IonButtons, IonCheckbox, IonContent, IonDatetime, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonList, IonLoading, IonMenuButton, IonPage, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import React, { useContext, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { LoginContext } from '../../App';
import { clientConfig, calculateAge } from '../../components/Utilities/AppCommons';
import { logoURL } from '../../components/Utilities/ServiceCaller';


const NomineeForm = (props) => {


    const customPickerOptions = {
        cssClass: 'groc-date-picker'
    };

    const customAlertOptions = {
        cssClass: 'groc-select'
    };

    return (
        <form className="card">
            <IonList lines="full" className="ion-no-margin ion-no-padding">
                <IonItem>
                    <IonLabel position="stacked">First Name
                        <IonText color="danger">*</IonText>
                    </IonLabel>
                    <IonInput placeholder="First Name" type="text"
                    onIonChange={props.onFNameChange}
                    value={props.nomineeFName}></IonInput>
                </IonItem>
            </IonList>
            <IonList lines="full" className="ion-no-margin ion-no-padding">
                <IonItem>
                    <IonLabel position="stacked">Last Name
                        <IonText color="danger">*</IonText>
                    </IonLabel>
                    <IonInput placeholder="Last Name" type="text"
                    onIonChange={props.onLNameChange}
                    value={props.nomineeLName}></IonInput>
                </IonItem>
            </IonList>
            <IonList lines="full" className="ion-no-margin ion-no-padding">
                <IonItem>
                    <IonLabel position="stacked">
                        Email
                    </IonLabel>
                    <IonInput placeholder="Enter Email" type="email" 
                            onIonChange={props.onEmailChange} 
                            value={props.nomineeEmail}></IonInput>
                </IonItem>
            </IonList>
            <IonList lines="full" className="ion-no-margin ion-no-padding">
                    <IonItem>
                        <IonLabel position="stacked">Date of Birth
                            <IonText color="danger">*</IonText>
                        </IonLabel>
                        <IonDatetime pickerOptions={customPickerOptions}
                        onIonChange={props.onDobChange} 
                        placeholder="Date of Birth" type="date"
                        value={props.nomineeDob}></IonDatetime>
                    </IonItem>
                </IonList>
            <IonList lines="full" className="ion-no-margin ion-no-padding">
                <IonItem>
                    <IonLabel position="stacked">
                        Gender
                        <IonText color="danger">*</IonText>
                    </IonLabel>
                    <IonSelect className="groc-select" placeholder="Select One" value={props.nomineeGender} onIonChange={props.onGenderChange}>
                        <IonSelectOption value="female">Female</IonSelectOption>
                        <IonSelectOption value="male">Male</IonSelectOption>
                    </IonSelect>
                </IonItem>
            </IonList>
            <IonList lines="full" className="ion-no-margin ion-no-padding">
                    <IonItem>
                        <IonLabel position="stacked">Relationship with member
                        <IonText color="danger">*</IonText>
                        </IonLabel>
                        <IonSelect interfaceOptions={customAlertOptions} value={props.nomineeRelationship} placeholder="Select One" onIonChange={props.onRelationshipChange}>
                            {props.relationships && props.relationships.map((relation)=>{
                                return <IonSelectOption key={relation.relationshipId} value={relation.relationshipId}>{relation.relationshipName}</IonSelectOption>
                            })}
                        </IonSelect>
                    </IonItem>
            </IonList>
            <IonList lines="full" className="ion-no-margin ion-no-padding">
                <IonItem>
                    <IonLabel position="stacked">
                        Contact No. 
                        <IonText color="danger">*</IonText>
                    </IonLabel>
                    <IonInput placeholder="Mobile No." type="tel" maxlength="10" minlength="10"
                            onIonChange={props.onMobileChange} 
                            value={props.nomineeMobile}></IonInput>
                </IonItem>
            </IonList>
            <IonList lines="full" className="ion-no-margin ion-no-padding">
                <IonItem>
                    <IonLabel position="stacked">
                        Alternate Contact No. 
                    </IonLabel>
                    <IonInput placeholder="Mobile No." type="tel" maxlength="10" minlength="10"
                            onIonChange={props.onAltMobileChange} 
                            value={props.nomineeAltMobile}></IonInput>
                </IonItem>
            </IonList>
            {/* <IonList lines="full" className="ion-no-margin ion-no-padding">
                <IonItem>
                    <IonLabel position="stacked">Present Address
                    </IonLabel>
                    <IonTextarea rows={5} wrap="soft" maxlength="300"  placeholder="Address" type="text"
                    onIonChange={props.onPresentAddressChange}
                    value={props.nomineePresentAddress}></IonTextarea>
                </IonItem>
            </IonList>
            <IonList lines="full" className="ion-no-margin ion-no-padding">
                <IonItem>
                    <IonLabel position="stacked">Pin Code
                    <IonText color="danger">*</IonText>
                    </IonLabel>
                    <IonInput placeholder="Pin Code" type="text" minlength="6" maxlength="6"
                    onIonChange={props.onPresentPinCodeChange}
                    value={props.nomineePresentPinCode}></IonInput>
                </IonItem>
            </IonList> */}
            <IonList lines="full" className="ion-no-margin ion-no-padding">
                <IonItem>
                    <IonLabel position="stacked" class="mb-2">
                        Upload Adhaar Front
                        <IonText color="danger">*</IonText>
                    </IonLabel>
                    <input type="file" name="adhaar" accept="image/png, image/jpeg" 
                            onChange={props.onAdhaarFrontImgChange}>
                            {/* value={NomineeAdhaarFrontImgState}> */}
                    </input>
                    <IonLabel position="stacked" class="mb-2">
                        Upload Adhaar Back
                        <IonText color="danger">*</IonText>
                    </IonLabel>
                    <input type="file" name="adhaar" accept="image/png, image/jpeg" 
                            onChange={props.onAdhaarBackImgChange}>
                            {/* value={NomineeAdhaarFrontImgState}> */}
                    </input>
                    <IonLabel position="stacked" class="mb-2">
                        Upload Photo 
                    </IonLabel>
                    <input type="file" name="adhaar" accept="image/png, image/jpeg" 
                            onChange={props.onPhotoImgChange}>
                            {/* value={NomineeAdhaarFrontImgState}> */}
                    </input>
                </IonItem>
            </IonList> 
            <IonList lines="full" className="ion-no-margin ion-no-padding">
            <IonItem>
                <IonCheckbox slot="start" onClick={props.onToggleAcceptTnc} checked={props.tncAccepted} />
                <IonText className="subtext" color="tertiary">{'I accept the terms & conditions'}</IonText>
            </IonItem>
            </IonList>                   
            {/* {errorState !== '' &&
            <IonList lines="full" className="ion-no-margin ion-no-padding">
                <IonItem>
                    <IonLabel className="ion-text-center ion-text-wrap" color="danger">
                        <small>{errorState}</small>
                    </IonLabel>
                </IonItem>
            </IonList>} */}
        </form>
    )
}

export default NomineeForm;