import { IonBadge, IonCard, IonCardContent, IonCol, IonGrid, IonRow, IonSlide, IonText } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router';
import './posterSlider.css';

const Poster = (props) => {

    const history = useHistory();
    
    const itemClicked = () =>{
        if (props.leadType === "productlist")
        {
            let route = '/products/list';
            route = props.leadQuery && props.leadQuery.length >0 ? route+'?'+props.leadQuery : route;
            history.push(route);
        }
        else if (props.leadType === "product")
        {
            // alert(props.leadQuery)
            let route = '/products/single/'+props.leadQuery;
            history.push(route);
        }
    }

    return  (
        <IonCard onClick={itemClicked} color="night" className="m-1 p-0">
            <IonGrid>
                <div className="poster-title-section">
                    <IonRow>
                        <IonCol>
                            <IonBadge className="poster-subtext mt-1" color="success">{props.title}</IonBadge>
                        </IonCol>
                        <IonCol>
                        </IonCol>
                    </IonRow>
                </div>
            </IonGrid>
            <div className="side-crop">
                <img alt="img" className="not-found-img" src={props.image}/>
            </div>
            <IonCardContent className="p-1 poster-text-section">
                <IonText className="ion-text-nowrap" color="success"><small>{props.mainText}</small></IonText>
                <IonText className="poster-subtext ion-text-nowrap" color="primary"><div>{props.subText}</div></IonText>
            </IonCardContent>
        </IonCard>
    )
}

export default Poster;