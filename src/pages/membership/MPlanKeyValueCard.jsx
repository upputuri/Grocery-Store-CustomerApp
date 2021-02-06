import React from 'react';

const MPlanKeyValueCard = () => {
    return (
        <div>
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
                <IonText className="subtext">{': '+memberState.email}</IonText>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                <IonText color="light">DOB</IonText>
                </IonCol>
                <IonCol size="8">
                <IonText className="subtext">{': '+memberState.dob}</IonText>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                <IonText color="light">Gender</IonText>
                </IonCol>
                <IonCol size="8">
                    <IonText className="subtext">{': '+memberState.gender}</IonText>
                </IonCol>
            </IonRow>
        </div>
    )
}

export default MPlanKeyValueCard;