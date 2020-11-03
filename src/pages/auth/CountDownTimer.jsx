import { IonText } from '@ionic/react';
import React, { useEffect, useState } from 'react';

const CountDownTimer = (props) => {
    const [timerState, setTimerState] = useState(props.seconds);

    useEffect(() => {
        let ticker = setTimeout(()=> setTimerState(timerState-1), 1000);
        if (timerState <= 0){
            clearInterval(ticker);
            props.onTimeOut();
        }

        return ()=>clearInterval(ticker);
    });
    return (
        <IonText className="subtext" color="danger">{"00:"+timerState}</IonText>
    )
}

export default CountDownTimer;