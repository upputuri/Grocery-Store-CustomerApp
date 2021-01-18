import { IonButton, IonButtons, IonCol, IonGrid, IonRow, IonText } from '@ionic/react';
import React from 'react';

const MPlanCategoryTile = (props) => {
    return (
        <IonGrid id={props.id} onClick={()=>props.onViewPlansClick(props.id)} className="categories-item mb-2 card">
            <IonRow>
                <IonCol>
                    {/* <div className="gold-members p-3"> */}
                        <div className="media p-2">
                            <div className="media-body d-flex justify-content-center ">
                            <IonText color="light">
                                <h5 className="mb-2 font-weight-bold">{props.categoryName}</h5>
                            </IonText>
                            </div>
                        </div>
                    {/* </div> */}
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol className="d-flex justify-content-center">
                    <IonButton onClick={()=>props.onViewPlansClick()} color="secondary">View Plans</IonButton>
                </IonCol>    
            </IonRow>           
        </IonGrid>
    )
}

export default MPlanCategoryTile;