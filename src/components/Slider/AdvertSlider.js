import { IonSlide, IonSlides } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { advertUrl1, advertUrl2, advertUrl3, coverImageStoreURL } from '../Utilities/ServiceCaller'

const AdvertSlider = (props) => {
    const slideOpts = {
        speed: 700,
        delay: 2000,
        loop: true,
        autoplay: true
      };

    return (
        <IonSlides className="homepage-slider" pager="true" options={slideOpts}>
            <IonSlide>
                <img alt="img" className="single-img" src={advertUrl1}/>
            </IonSlide>
            <IonSlide>
                <img alt="img" className="single-img" src={advertUrl2}/>
            </IonSlide>
            <IonSlide>
                <img alt="img" className="single-img" src={advertUrl3}/>
            </IonSlide>
        </IonSlides>
    )
}

export default AdvertSlider;