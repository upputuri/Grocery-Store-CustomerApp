import { IonSlide, IonSlides } from '@ionic/react'
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import React, { useEffect, useState } from 'react'
import { coverImageStoreURL } from '../Utilities/ServiceCaller'

const BannerSlider = (props) => {
    const slideOpts = {
        speed: 700,
        delay: 2000,
        loop: true,
        autoplay: {
            disableOnInteraction: false
        }
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
                            <img alt="img" className="single-img" src={coverImageStoreURL+"/"+image}/>
                        </IonSlide>
            })}
        </IonSlides>
    )
}

export default BannerSlider