import { IonButton, IonCol, IonContent, IonInput, IonItem, IonLabel, IonList, IonRow, IonTextarea } from '@ionic/react';
import React, { useState } from 'react';
import StarRating from '../Utilities/StarRating';

const RatingNReviewForm = (props) =>{
    const [ratingState, setRatingState] = useState(props.rating);
    const [reviewTitleState, setReviewTitleState] = useState(props.review ? props.review.title : undefined);
    const [reviewDetailState, setReviewDetailState] = useState(props.review ? props.review.detail : undefined);
    const [errorState, setErrorState] = useState('');
    
    const setReviewTitle = (event) => {
        setReviewTitleState(event.detail.value);
    }

    const setReviewDetail = (event) => {
        setReviewDetailState(event.detail.value);
    }

    const isInputValid = () => {
        if (!(ratingState && ratingState > 0 && ratingState <= props.maxRating)) {
            setErrorState("Please provide a rating");
            return false;
        }
        else if ((!reviewTitleState || reviewTitleState.trim().length === 0) && (reviewDetailState && reviewDetailState.trim().length > 0)) {
            setErrorState("Please enter a valid review title");
            return false;
        }
        return true;
    }

    const submitRatingNReview = () => {
        if (isInputValid())
            props.onSubmit(ratingState, reviewTitleState, reviewDetailState);
    }

    return (
        <form>
            <StarRating maxScore={props.maxRating} score={ratingState} onRatingChange={setRatingState}/>
            <IonList lines="full" className="ion-no-margin ion-no-padding">
                <IonItem>
                    <IonLabel position="stacked">Review Title
                    </IonLabel>
                    <IonInput placeholder="Review" required type="text" minlength="2" maxlength="30" 
                    onIonChange={setReviewTitle}
                    value={reviewTitleState}></IonInput>
                </IonItem>
            </IonList>
            <IonList lines="full" className="ion-no-margin ion-no-padding">
                <IonItem>
                    <IonLabel position="stacked">Add Review Comments
                    </IonLabel>
                    <IonTextarea rows={10} wrap="soft" maxlength="300"  placeholder="Comments" type="text"
                    onIonChange={setReviewDetail}
                    value={reviewDetailState}></IonTextarea>
                </IonItem>
            </IonList>
                            
            {errorState !== '' &&
            <IonList lines="full" className="ion-no-margin ion-no-padding">
                <IonItem>
                    <IonLabel className="ion-text-center ion-text-wrap" color="danger">
                        <small>{errorState}</small>
                    </IonLabel>
                </IonItem>
            </IonList>}
            <IonRow>
                <IonCol>
                <div className="d-flex justify-content-around mt-2">
                    <IonButton size="small" color="secondary" expand="block" onClick={props.onCancel} className="ion-no-margin">Cancel</IonButton>
                    <IonButton size="small" color="secondary" expand="block" onClick={submitRatingNReview} className="ion-no-margin">Submit</IonButton>
                </div>
                </IonCol>
            </IonRow>
        </form>
    )
}

export default RatingNReviewForm;