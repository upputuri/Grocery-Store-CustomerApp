import { IonCard, IonCardContent, IonCol, IonGrid, IonRow, IonSkeletonText, IonThumbnail } from '@ionic/react';
import React from 'react';
import './posterSlider.css';

const PosterSkeleton = (props) => {

    // const history = useHistory();
    
    // const itemClicked = () =>{
    //     if (props.leadType === "productlist")
    //     {
    //         let route = '/products/list';
    //         route = props.leadQuery && props.leadQuery.length >0 ? route+'?'+props.leadQuery : route;
    //         history.push(route);
    //     }
    //     else if (props.leadType === "product")
    //     {
    //         // alert(props.leadQuery)
    //         let route = '/products/single/'+props.leadQuery;
    //         history.push(route);
    //     }
    // }

    return  (
        <IonCard className="m-1 p-0">


                <div>

                    <IonSkeletonText animated style={{width: '120px', height: '40px'}}></IonSkeletonText>

                </div>

            <div className="d-flex justify-content-center">
            <IonThumbnail>
                <IonSkeletonText></IonSkeletonText>
            </IonThumbnail>
            </div>
            <IonCardContent className="p-1">
                <IonSkeletonText animated style={{width: '80%', height: '20px'}}></IonSkeletonText>
                <IonSkeletonText animated style={{width: '80%', height: '20px'}}></IonSkeletonText>
            </IonCardContent>
        </IonCard>
    )
}

export default PosterSkeleton;