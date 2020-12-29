import React, { useState } from 'react';
import { star as starIcon} from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

const StarRating = (props) => {
    const [scoreState, setScoreState] = useState(props.score);
    
    const updateScore = (value) => {
        setScoreState(value);
        props.onRatingChange(value);
        // alert("Updating score to "+value);
    }

    return (
        <div>
            {Array.from(Array(props.maxScore).keys()).map((n) => {
                return <IonIcon key={n+1} color={scoreState && (n+1<=scoreState) ? 'tertiary': 'dark'} onClick={updateScore.bind(this, n+1)} icon={starIcon} size="small"></IonIcon>
            })}

        </div>
    )
}

export default StarRating;