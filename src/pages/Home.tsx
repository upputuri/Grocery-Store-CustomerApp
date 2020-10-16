import { IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { createOutline as createOutlineIcon } from 'ionicons/icons';
import React from 'react';
import ItemListing1 from '../components/Listing/ItemListing1';
import ListingSection from '../components/Listing/ListingSection';
import CartButton from '../components/Menu/CartButton';
import Slider from '../components/Slider/Slider';
import './Home.css';


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
          {/* <IonButtons slot="primary">
              <IonButton href="/customer/cart" class="top-cart" color="primary">
                <IonBadge color="primary">
                <CartContext.Consumer>{(context) => context.itemCount}</CartContext.Consumer>
                </IonBadge>
                <IonIcon slot="start" icon={cartOutlineIcon}></IonIcon>
              </IonButton>
          </IonButtons> */}
          <CartButton/>
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
