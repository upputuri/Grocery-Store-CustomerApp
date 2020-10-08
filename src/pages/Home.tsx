import { IonBadge, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import './Home.css';
import { cartOutline as cartOutlineIcon, createOutline as createOutlineIcon } from 'ionicons/icons'

import Slider from '../components/Slider/Slider';
import ListingSection from '../components/Listing/ListingSection';
import ItemListing1 from '../components/Listing/ItemListing1';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader class="osahan-nav">
        <IonToolbar>
          <IonButtons slot="start">
              <IonMenuButton/>
          </IonButtons>
          <IonTitle>
              <div><small>Delivery Location</small></div>Bengaluru, India
              <IonIcon icon={createOutlineIcon}></IonIcon>
          </IonTitle>
          <IonButtons slot="primary">
              <IonButton class="top-cart" color="primary">
                <IonBadge color="primary">3</IonBadge>
                <IonIcon slot="start" icon={cartOutlineIcon}></IonIcon>
              </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonSearchbar className="pt-1" placeholder="Search for products"></IonSearchbar>        
      </IonHeader>
      <IonContent color="dark">
        <Slider/>
        <ListingSection title="Best of Everyday essentials">
          <ItemListing1/>
        </ListingSection>
      </IonContent>
    </IonPage>
  );
};

export default Home;
