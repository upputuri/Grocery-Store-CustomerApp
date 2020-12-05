import { IonBadge, IonCard, IonCardContent, IonCol, IonGrid, IonRow, IonSlide, IonSlides, IonText } from '@ionic/react';
import React from 'react';
import Poster from './Poster';
import PosterSkeleton from './PosterSkeleton';


const PosterSlider = (props) => {

    const sliderOptions = {
        initialSlide: 0,
        slidesPerView: props.slidesPerView,
        loop: props.loop,
        centeredSlides: props.centeredSlides,
        spaceBetween: props.spaceBetween
    }

    return (
            <IonSlides options={sliderOptions}>
                {props.posters && props.posters.map((poster)=>{
                    return  <IonSlide key={poster.id}>
                                {!props.showSkeleton ? 
                                <Poster
                                    title={poster.title}
                                    mainText={poster.mainText}
                                    subText={poster.subText}
                                    image={poster.image}
                                    leadQuery={poster.leadQuery}
                                    leadType={poster.leadType}/>
                                :
                                <PosterSkeleton/>}
                            </IonSlide>
                })}
            </IonSlides>
        )
}

export default PosterSlider;