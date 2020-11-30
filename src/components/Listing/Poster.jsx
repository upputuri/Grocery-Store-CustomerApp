import { IonBadge, IonCard, IonCardContent, IonCol, IonGrid, IonNote, IonRow, IonSlide, IonText } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router';
import { defaultImageURL } from '../Utilities/ServiceCaller';

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
        // <IonCard onClick={itemClicked} color="night" className="m-1 p-0">
        //     <IonGrid>
        //         <div className="poster-title-section">
        //             <IonRow>
        //                 <IonCol>
        //                     <IonBadge className="poster-subtext mt-1" color="success">{props.title}</IonBadge>
        //                 </IonCol>
        //                 <IonCol>
        //                 </IonCol>
        //             </IonRow>
        //         </div>
        //     </IonGrid>
        //     <div className="side-crop">
        //         <img alt="poster" className="not-found-img" src={props.image?props.image:defaultImageURL}/>
        //     </div>
        //     <IonCardContent className="p-1 poster-text-section">
        //         <div className="d-inline-block text-truncate">
        //             {props.mainText}
        //         </div>
        //         <IonText className="text-truncate" color="light"><div>{props.subText}</div></IonText>
        //     </IonCardContent>
        // </IonCard>
        <div onClick={itemClicked} className="card poster">
            <div className="side-crop">
                <img className="card-img-top" src={props.image?props.image:defaultImageURL} alt="Card image cap"/>
            </div>
            <div className="card-body">
                <div className="maintext text-truncate">{props.mainText}</div>
                <div className="subtext text-truncate">{props.subText}</div>
                {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
            </div>
        </div>
    )
}

export default Poster;