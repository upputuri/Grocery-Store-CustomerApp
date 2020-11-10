import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonMenuButton, IonPage, IonRow, IonSearchbar, IonSlide, IonSlides, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { createOutline as createOutlineIcon } from 'ionicons/icons';
import Client from 'ketting';
import React, { useEffect, useState } from 'react';
import ListingSection from '../components/Listing/ListingSection';
import PosterSlider from '../components/Listing/PosterSlider';
import CartButton from '../components/Menu/CartButton';
import BannerSlider from '../components/Slider/BannerSlider';
import { logoURL, serviceBaseURL } from '../components/Utilities/ServiceCaller';
import {card as cardIcon, people as peopleIcon} from 'ionicons/icons';
import '../App.scss';
import GrocSearch from '../components/Menu/GrocSearch';
import { Plugins } from '@capacitor/core';
import PosterSkeleton from '../components/Listing/PosterSkeleton';
import { defaultImageURL, thumbNailImageStoreURL, categoryImageStoreURL } from '../components/Utilities/ServiceCaller';

const { MobileApp } = Plugins;

  document.addEventListener('ionBackButton', (ev) => {
    ev.detail.register(-1, () => {
          MobileApp.exitApp();
    });
  });

const Home = () => {

  const [posterListsState, setPosterListsState] = useState(null);
  const [bannersState, setBannersState] = useState([]);

  useEffect(() => {
    loadBanners();
    loadPosters();
  }, []);

  const loadBanners = async () => {
    const client = new Client(serviceBaseURL+'/application/coverimages');
    const resource = client.go();
    console.log("Making service call: "+resource.uri);
    let receivedData;
    try{
        receivedData = await resource.get();
    }
    catch(e)
    {
        console.log("Service call failed with - "+e);
        return;
    }
    // alert(JSON.stringify(receivedData));
    console.log("Received response from service call: "+resource.uri);
    const images = receivedData.getEmbedded().map((imageState) => imageState.data.image);
    // console.log(images);
    setBannersState(images);
  }

  const loadPosters = async () =>{
    //Categories posters
    try{
      let result = await loadCategoryPosters([]);
      // alert(JSON.stringify(result));
      result = await loadBestSellingItemPosters(result);
      // alert(JSON.stringify(result));
      result = await loadNewlyArrivedItemPosters(result);
      // alert(JSON.stringify(result));
      setPosterListsState(result);
    }catch(e) {
      console.log("Service call failed with - "+e);
      return;
    }
  }

  const loadCategoryPosters = async (posterLists) => {
    // let serviceRequest = new ServiceRequest();
    // let categories = await serviceRequest.listCategories();
    // categories && this.setState({categories});\
    const client = new Client(serviceBaseURL+'/products/categories');
    const resource = client.go();
    let categoriesState;
    try{
        console.log("Making service call: "+resource.uri);
        categoriesState = await resource.get();
    }
    catch(e)
    {
        console.log("Service call failed with - "+e);
        Promise.reject(e);
    }
    // alert(JSON.stringify(categoriesState));
    console.log("Received response from service call: "+resource.uri);
    const categoriesListState = categoriesState.getEmbedded();
    const categories = categoriesListState.map((categoryState) => categoryState.data)
    const posters = categories.map((cat) =>{
      return {
        id: cat.id,
        title: '',
        mainText: cat.metaDescription,
        subText: 'on all '+cat.name,
        image: cat.image ? (categoryImageStoreURL + "/" + cat.image) : defaultImageURL,
        leadType: 'productlist',
        leadQuery: 'category='+cat.id
      }
    });
    const posterList = {slot: 1, title: 'Everyday Essentials', posters: posters}
    const newPosterLists = [...posterLists, posterList];
    return Promise.resolve(newPosterLists);      
  }

  const loadBestSellingItemPosters = async (posterLists) => {
    const query = '?offset=0&size=12&sortkey=sales&sortorder=desc';
    const client = new Client(serviceBaseURL+'/products'+query);
    const resource = client.go();
    let receivedData;
    try{
        console.log("Making service call: "+resource.uri);
        receivedData = await resource.get();
    }
    catch(e)
    {
        console.log("Service call failed with - "+e);
        Promise.reject(e);
    }
    // alert("TWO"+JSON.stringify(receivedData));
    console.log("Received response from service call: "+resource.uri);
    const products = receivedData.data.products;
    const posters = products.filter(product=>product.variations.length>0).map((product) =>{
      return {
              id: product.id,
              title: product.discount ? product.discount+"% off": '',
              mainText: product.name,
              subText: product.variations[0].priceAfterDiscount,
              image: product.images.length>0?(thumbNailImageStoreURL+"/"+product.images[0]) : defaultImageURL,
              leadType: 'product',
              leadQuery: product.id
            }
    });
    const posterList = {slot: 2, title: 'Best Selling Products', viewAllRoute: "products/list"+query, posters: posters};
    const newPosterLists = [...posterLists, posterList];
    return Promise.resolve(newPosterLists);       
  }

  const loadNewlyArrivedItemPosters = async (posterLists) => {
    const query = '?offset=0&size=12&sortkey=created_ts&sortorder=desc';
    const client = new Client(serviceBaseURL+'/products'+query);
    const resource = client.go();
    let receivedData;
    try{
        console.log("Making service call: "+resource.uri);
        receivedData = await resource.get();
    }
    catch(e)
    {
        console.log("Service call failed with - "+e);
        Promise.reject(e);
    }
    // alert(JSON.stringify(receivedData));
    console.log("Received response from service call: "+resource.uri);
    const products = receivedData.data.products;
    const posters = products.filter(product=>product.variations.length>0).map((product) =>{
      return {
        id: product.id,
        title: product.discount ? product.discount+"% off": '',
        mainText: product.name,
        subText: product.variations[0].priceAfterDiscount,
        image: product.images.length>0?(thumbNailImageStoreURL+"/"+product.images[0]) : defaultImageURL,
        leadType: 'product',
        leadQuery: product.id
      }
    });
    const posterList = {slot: 3, title: 'New Arrivals', viewAllRoute: "products/list"+query, posters: posters}
    const newPosterLists = [...posterLists, posterList];
    return Promise.resolve(newPosterLists);  
  }

  return (
    <IonPage>
      <IonHeader class="osahan-nav">
        <IonToolbar>
          <IonButtons slot="start">
              <IonMenuButton/>
          </IonButtons>
          <IonTitle>
              {/* <div><small>Delivery Location</small></div>Bengaluru, India
              <IonIcon icon={createOutlineIcon}></IonIcon> */}
                <div className="text-center p-3">
                  <img alt="img" className="single-img" src={logoURL}/>
                </div>
          </IonTitle>
          <CartButton/>
        </IonToolbar>
        <GrocSearch/>      
      </IonHeader>
      <IonContent color="dark">
        <BannerSlider images={bannersState}/>
        {/*Slot 1 posterslider*/}
        {posterListsState &&
        <div>
          <ListingSection title={posterListsState[0].title} viewAllRoute={"/products/categories"}>
            <PosterSlider slidesPerView={2.6} 
                          loop={false} 
                          centeredSlides={false} 
                          spaceBetween={10} 
                          posters={posterListsState[0].posters}/>
          </ListingSection>
          <ListingSection title={posterListsState[1] && posterListsState[1].title} 
                          viewAllRoute={(posterListsState[1]  && posterListsState[1].viewAllRoute)}>
            <PosterSlider slidesPerView={2.6} 
                          loop={false} 
                          centeredSlides={false} 
                          spaceBetween={10} 
                          posters={posterListsState[1] && posterListsState[1].posters}/>
          </ListingSection> 
          <ListingSection title={posterListsState[2] && posterListsState[2].title} 
                          viewAllRoute={(posterListsState[2] && posterListsState[2].viewAllRoute)}>
            <PosterSlider slidesPerView={2.6} 
                          loop={false} 
                          centeredSlides={false} 
                          spaceBetween={10} 
                          posters={posterListsState[2] && posterListsState[2].posters}/>
          </ListingSection>
        </div>}
        <IonSlides options={{watchOverflow : true}}>
          <IonSlide>
            <div className="content-banner-canvas">
              <IonGrid className="ion-padding">
                <IonRow className="ion-text-center">
                  <IonCol className="p-1">
                    <IonIcon className="mr-1" icon={peopleIcon} size="small" color="primary"/>
                    <IonText color="primary">Membership</IonText>
                  </IonCol>
                </IonRow>
                <IonRow className="ion-text-center">
                  <IonCol className="p-1">
                    <div className="poster-subtext">Enrol as a member and become a part of the Vegit family. Apply now for great offers and enjoy a plethora of benefits as a member. </div>
                  </IonCol>
                </IonRow>
                <IonRow className="ion-text-center">
                  <IonCol>
                    <IonButton color="secondary" size="small"><IonIcon className="mr-1" icon={cardIcon} size="small"/>Apply here</IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>
          </IonSlide>
                        
        </IonSlides>
        {/*Slot 2 posterslider*/}
        {/* <ListingSection title="Everyday essentials">
          <PosterSlider/>
        </ListingSection> */}
      </IonContent>
    </IonPage>
  );
};

export default Home;
