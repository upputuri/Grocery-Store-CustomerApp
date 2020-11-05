import { IonBadge, IonCard, IonCardContent, IonCol, IonGrid, IonRow, IonSlide, IonSlides, IonText } from '@ionic/react';
import React from 'react';
import Poster from './Poster';


const PosterSlider = (props) => {

    const sliderOptions = {
        initialSlide: 1,
        slidesPerView: props.slidesPerView,
        loop: props.loop,
        centeredSlides: props.centeredSlides,
        spaceBetween: props.spaceBetween
    }

    return (

            <IonSlides options={sliderOptions}>
                {props.posters && props.posters.map((poster)=>{
                    return  <IonSlide key={poster.id}>
                                <Poster
                                    title={poster.title}
                                    mainText={poster.mainText}
                                    subText={poster.subText}
                                    image={poster.image}
                                    leadQuery={poster.leadQuery}
                                    leadType={poster.leadType}/>
                            </IonSlide>
                })}
            </IonSlides>
        )
}

export default PosterSlider;