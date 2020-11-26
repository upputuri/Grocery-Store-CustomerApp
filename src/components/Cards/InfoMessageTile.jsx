import { IonButton, IonCol, IonGrid, IonRow, IonText } from '@ionic/react';
import React from 'react';

const InfoMessageTile = (props) => {

    return (
        <IonGrid>
            {(props.headerTextLeft || props.headerTextRight) && 
            <IonRow className="border-bottom">
                <IonCol>
                    <div className="d-flex justify-content-around">
                        {props.headerTextLeft && 
                        <IonText color={props.headerTextColor ? props.headerTextColor : "primary"} className="headtext">{props.headerTextLeft}</IonText>}
                        {props.headerTextRight && 
                        <IonText color={props.headerTextColor ? props.headerTextColor : "primary"} className="subtext">{props.headerTextRight}</IonText>}
                    </div>
                </IonCol>
            </IonRow>}
            {props.subject && <IonRow className="p-2 ion-text-center">
                <IonCol>
                    <IonText color={props.subjectColor ? props.subjectColor : "light"} className="headtext">{props.subject}</IonText>
                </IonCol>
            </IonRow>}
            {props.detail && <IonRow className="p-1 ion-text-center">
                <IonCol>
                    <IonText color={props.detailColor ? props.detailColor : "light"} className="maintext">
                        {props.detail}
                    </IonText>
                </IonCol>
            </IonRow>}
            {(props.footerTextLeft || props.footerTextRight) && <IonRow>
                <IonCol>
                    <div className="d-flex justify-content-around">
                        {props.footerTextLeft && <IonText>{props.footerTextLeft}</IonText>}
                        {props.footerTextRight && <IonText>{props.footerTextRight}</IonText>}
                    </div>
                </IonCol>
            </IonRow>}          
            {(props.leftButtonClickHandler || props.rightButtonClickHandler) && <IonRow>
                <IonCol>
                    <div className="d-flex justify-content-around">
                        {props.leftButtonClickHandler && <IonButton color="secondary" onClick={props.leftButtonClickHandler}>{props.leftButtonText}</IonButton>}
                        {props.rightButtonClickHandler && <IonButton color="secondary" onClick={props.rightButtonClickHandler}>{props.rightButtonText}</IonButton>}
                    </div>
                </IonCol>
            </IonRow>}            
        </IonGrid>
    )
}

export default InfoMessageTile;