import { IonButton, IonLabel, IonTitle } from '@ionic/react';
import React from 'react';

const ListingSection = (props) => {
    return (
        <React.Fragment>
            <div className="pt-4">
                <h5 className="mb-2 text-white text-center font-weight-bold">{props.title}</h5>
                <div className="text-center text-white-50 h6 mb-3">
                    <IonTitle color="secondary" size="small" class="ios button button-small ml-auto">View All</IonTitle>
                </div>            
                {props.children}
            </div>
        </React.Fragment>
    )
}

export default ListingSection;