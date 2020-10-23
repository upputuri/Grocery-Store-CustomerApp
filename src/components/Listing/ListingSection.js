import { IonButton, IonLabel, IonTitle } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router';

const ListingSection = (props) => {
    const history=useHistory();
    const viewAllClicked = () => {
        history.push(props.viewAllRoute);
    }
    
    return (
        <React.Fragment>
            <div onClick={viewAllClicked} className="listing-section-canvas p-3">
                <h5 className="mb-2 text-white text-center">{props.title}</h5>
                <div className="text-center text-white-50 h6">
                    <IonTitle color="secondary" size="small" class="ios button button-small ml-auto">View All</IonTitle>
                </div>            
                {props.children}
            </div>
        </React.Fragment>
    )
}

export default ListingSection;