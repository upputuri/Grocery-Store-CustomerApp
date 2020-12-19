import { IonButton, IonCol, IonGrid, IonIcon, IonRow, IonText } from '@ionic/react';
import { close as trashIcon } from 'ionicons/icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import RatingNReviewForm from '../forms/RatingNReviewForm';
import { defaultImageURL, thumbNailImageStoreURL } from '../Utilities/ServiceCaller';

const RateNReviewOrderItemTile = (props) =>
{
    const history = useHistory();

    const viewProduct = (productId) => {
        history.push('/products/single/'+productId);
    }

    const submitRatingNReview = (rating, reviewTitle, reviewDetail) => {
        props.ratingNReviewSubmitHandler(props.productId, rating, reviewTitle, reviewDetail);
    }

    return (
        <IonGrid className="p-2">
            <IonRow>
                <IonCol onClick={viewProduct.bind(this, props.productId)} size="auto">
                    <img alt="img" className="not-found-img m-2" width="70px" height="70px" src={props.image?thumbNailImageStoreURL+'/'+props.image:defaultImageURL}/>
                </IonCol>
                <IonCol>
                    <IonRow>
                        <IonCol onClick={viewProduct.bind(this, props.productId)}>
                            <IonText color="light"><strong>{props.name}</strong></IonText>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="7">
                            <IonText color="light">{props.unitLabel}</IonText>
                        </IonCol>                         
                        <IonCol size="5">
                            {props.status && props.status === 'delivered' && 
                            <div className="d-flex justify-content-end">
                                <IonButton onClick={props.onRateNReviewBegin} className="ml-2" color="tertiary" size="small">{'Rate & Review'}</IonButton>
                            </div>}
                        </IonCol>
                    </IonRow>
                </IonCol>
            </IonRow>
            {props.editingEnabledId === props.id && <IonRow>
                <IonCol>
                    <RatingNReviewForm maxRating={5}
                                    rating={props.rating}
                                    review={props.review}
                                    onCancel={props.cancelEdit}
                                    onSubmit={submitRatingNReview}/>
                </IonCol>
            </IonRow>}
        </IonGrid>
    )
}

export default RateNReviewOrderItemTile
;