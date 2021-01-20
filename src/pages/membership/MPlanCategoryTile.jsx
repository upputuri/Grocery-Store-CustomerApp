import { IonButton, IonButtons, IonCol, IonGrid, IonRow, IonText } from '@ionic/react';
import React from 'react';
import { getMembershipCardColorClass } from '../../components/Utilities/AppCommons';

const MPlanCategoryTile = (props) => {
    return (
        <div className="mb-2">
            <div id={props.id} onClick={()=>props.onViewPlansClick(props.id)} 
                className={getMembershipCardColorClass(props.categoryName)+"-card-top"}>
                <IonRow>
                    <IonCol>
                        {/* <div className="gold-members p-3"> */}
                            <div className="media p-2">
                                <div className="media-body d-flex justify-content-center">
                                <IonText color="light">
                                    <h5 className="mb-2 font-weight-bold">{props.categoryName}</h5>
                                </IonText>
                                </div>
                            </div>
                        {/* </div> */}
                    </IonCol>
                </IonRow>        
            </div>
            <div id={props.id} onClick={()=>props.onViewPlansClick(props.id)} 
                className={getMembershipCardColorClass(props.categoryName)+"-card-bottom"}>
                <IonRow>
                    <IonCol className="d-flex justify-content-center">
                        <IonButton color="secondary">View Plans</IonButton>
                    </IonCol>    
                </IonRow>           
            </div>
        </div>
    )
}

export default MPlanCategoryTile;