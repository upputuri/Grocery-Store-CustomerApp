import { IonCard, IonText } from '@ionic/react';
import React, { MouseEventHandler } from 'react';
import thumbNailImageStoreURL from '../Utilities/ServiceCaller';

type CategoryProps = {
    id: string,
    title: string,
    image: string,
    uspText: string,
    description: string,
    categoryClickHandler: Function
}
const CategoryCard = (props: CategoryProps) => {
    return (
        <div id={props.id} onClick={()=>props.categoryClickHandler(props.id)} className="categories-item mb-2 card">
            <div className="gold-members p-3">
                <div className="media align-items-center">
                    <div className="mr-3"><img alt="img" className="categories-img" src={thumbNailImageStoreURL+"/"+props.image}/></div>
                    <div className="media-body">
                    <p className="text-success m-0">{props.uspText}</p>
                    <IonText color="primary">
                        <h5 className="mb-2 font-weight-bold">{props.title}</h5>
                    </IonText>
                    <p className="mb-0 small text-secondary">{props.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryCard;