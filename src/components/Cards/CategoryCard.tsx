import { IonCard, IonCol, IonGrid, IonRow, IonText } from '@ionic/react';
import React, { MouseEventHandler } from 'react';
import { defaultImageURL, categoryImageStoreURL } from '../Utilities/ServiceCaller';

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
        <IonGrid id={props.id} onClick={()=>props.categoryClickHandler(props.id)} className="categories-item mb-2 card">
            <IonRow>
                <IonCol>
                    {/* <div className="gold-members p-3"> */}
                        <div className="media align-items-center p-2">
                            <div className="mr-3"><img alt="img" className="categories-img" src={props.image?categoryImageStoreURL+"/"+props.image:defaultImageURL}/></div>
                            <div className="media-body">
                            <p className="text-success m-0">{props.uspText}</p>
                            <IonText color="primary">
                                <h5 className="mb-2 font-weight-bold">{props.title}</h5>
                            </IonText>
                            </div>
                        </div>
                    {/* </div> */}
                </IonCol>
            </IonRow>           
        </IonGrid>
    );
}

export default CategoryCard;