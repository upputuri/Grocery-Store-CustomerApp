import { IonButton, IonButtons, IonCol, IonGrid, IonRow, IonText } from '@ionic/react';
import React from 'react';

const MPlanTile = (props) => {
    return (
        <IonGrid id={props.id} onClick={()=>props.onViewPlanDetailClick(props.planId)} className="categories-item mb-2 card">
            <IonRow>
                <IonCol>
                    {/* <div className="gold-members p-3"> */}
                        <div className="media align-items-center p-2">
                            <div className="media-body">
                            <IonText color="light">
                                <h5 className="mb-2 font-weight-bold">{props.planName}</h5>
                            </IonText>
                            </div>
                        </div>
                    {/* </div> */}
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonButton onClick={()=>props.onViewPlanDetailClick(props.planId)} color="secondary">View Plan</IonButton>
                </IonCol>    
            </IonRow>           
        </IonGrid>
    )
}

export default MPlanTile;