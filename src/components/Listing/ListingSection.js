import { IonButton, IonLabel, IonText, IonTitle } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router';

const ListingSection = (props) => {
    const history=useHistory();
    const viewAllClicked = () => {
        history.push(props.viewAllRoute);
    }
    
    return (
        <React.Fragment>
            <div className="listing-section-canvas p-2">
                <div className="d-flex justify-content-around">
                    <IonText className="headtext mb-2 text-white text-center">{props.title}</IonText>
                    {props.viewAllRoute && <IonText onClick={viewAllClicked} color="light" size="small" class="ios button button-small ml-auto">View All</IonText>}
                </div>
                {props.children}
            </div>
        </React.Fragment>
    )
}

export default ListingSection;