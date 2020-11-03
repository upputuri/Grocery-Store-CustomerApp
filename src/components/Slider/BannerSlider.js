import { IonSlide, IonSlides } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { smallImageStoreURL } from '../Utilities/ServiceCaller'

const BannerSlider = (props) => {
    const slideOpts = {
        speed: 200,
        loop: true,
        autoplay: true
      };

    return (
        <IonSlides className="homepage-slider" pager="true" options={slideOpts}>
            {/* <IonSlide>
                <img alt="img" className="single-img" src="assets/slider/slider1.jpg"/>
            </IonSlide>
            <IonSlide>
                <img alt="img" className="single-img" src="assets/slider/slider2.jpg"/>
            </IonSlide> */}
            {props.images && props.images.map((image) => {
                return  <IonSlide key={image}>
                            <img alt="img" className="single-img" src={smallImageStoreURL+"/"+image}/>
                        </IonSlide>
            })}
        </IonSlides>
    )
}

export default BannerSlider