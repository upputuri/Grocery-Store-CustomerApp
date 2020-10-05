import { IonRouterLink, IonSlide, IonSlides } from '@ionic/react'
import React from 'react'
import { Link } from 'react-router-dom'

const Slider = () => {
    return (
        <IonSlides className="homepage-slider" pager="true">
            <IonSlide>
                <IonRouterLink routerLink="/categories"><img alt="img" className="single-img" src="assets/slider/slider1.jpg"/></IonRouterLink>
            </IonSlide>
            <IonSlide>
                <img alt="img" className="single-img" src="assets/slider/slider2.jpg"/>
            </IonSlide>
        </IonSlides>
    )
}

export default Slider