import { IonAlert, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonMenuButton, IonPage, IonPicker, IonRow, IonSlide, IonSlides, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { card as cardIcon, people as peopleIcon, chevronDown as pullDownIcon } from 'ionicons/icons';
import Client from 'ketting';
import React, { useContext, useEffect, useState } from 'react';
import '../App.scss';
import ListingSection from '../components/Listing/ListingSection';
import PosterSlider from '../components/Listing/PosterSlider';
import CartButton from '../components/Menu/CartButton';
import GrocSearch from '../components/Menu/GrocSearch';
import BannerSlider from '../components/Slider/BannerSlider';
import { categoryImageStoreURL, defaultImageURL, logoURL, serviceBaseURL, thumbNailImageStoreURL } from '../components/Utilities/ServiceCaller';
import { Plugins } from '@capacitor/core';
import { CartContext } from '../App';
import AdvertSlider from '../components/Slider/AdvertSlider';
import { clientConfig } from '../components/Utilities/AppCommons';

  // document.addEventListener('ionBackButton', (ev) => {
  //   alert('registering app closer');
  //   // ev.detail.register(-1, () => {
  //         // MobileApp.exitApp();

  //   // });
  // });

const Home = () => {
  const cartContext = useContext(CartContext);
  const [posterListsState, setPosterListsState] = useState(null);
  const [bannersState, setBannersState] = useState([]);
  const [coversState, setCoversState] = useState(undefined);
  const [showCoverOptions, setShowCoverOptions] = useState(false);
  const [checkoutResetAlertState, setCheckoutResetAlertState] = useState({show: false, msg: clientConfig.cityChangeCheckoutResetAlertMsg, coverId: undefined});

  Plugins.App.addListener('backButton', Plugins.App.exitApp);

  useEffect(() => {
    // refreshAccount();
    initializeData();
    return ()=>Plugins.App.removeAllListeners();
  }, []);
  
  const initializeData = async () => {
    const coverId = await loadCovers();
    loadBanners(coverId);
    loadPosters(coverId);
  }

  const loadCovers = async () => {
    const client = new Client(serviceBaseURL+'/stores/covers');
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
    const covers = receivedData.getEmbedded().map((coverState) => coverState.data);
    // alert(JSON.stringify(covers[0].coverId));
    // console.log(images);
    setCoversState(covers);
    if (!cartContext.order.cover){
      cartContext.setDeliveryCover(covers[0]);
    }
    return Promise.resolve(covers[0].coverId);
  }

  const loadCoverPicker = () => {
    setShowCoverOptions(true);
  }

  const onPickerCancel = () => {
    setShowCoverOptions(false);
  }

  const onPickerDone = (picker) => {
      // alert(JSON.stringify(picker['sortpicker'].value));
      setShowCoverOptions(false);
      checkAndProceedToCityChange(picker['coverpicker'].value);
    }
    
  const checkAndProceedToCityChange = (coverId) => {
    if (coverId !== cartContext.order.cover.coverId && cartContext.itemCount > 0) {
      setCheckoutResetAlertState({...checkoutResetAlertState, show: true, coverId: coverId});
    }
    else{
      cartContext.setDeliveryCover(coversState.find((cover) => cover.coverId === coverId));
    }
  }
  
  const resetCheckoutAndChangeCity = (coverId) => {
    //reset cart
    cartContext.resetOrderContext();
    //change city
    cartContext.setDeliveryCover(coversState.find((cover) => cover.coverId === coverId));
  }

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

  const loadPosters = async (coverId) =>{
    //Categories posters
    try{
      let result = await loadCategoryPosters(coverId, []);
      // alert(JSON.stringify(result));
      result = await loadBestSellingItemPosters(coverId, result);
      // alert(JSON.stringify(result));
      result = await loadNewlyArrivedItemPosters(coverId, result);
      // alert(JSON.stringify(result));
      setPosterListsState(result);
    }catch(e) {
      console.log("Service call failed with - "+e);
      return;
    }
  }

  const loadCategoryPosters = async (coverId, posterLists) => {
    // let serviceRequest = new ServiceRequest();
    // let categories = await serviceRequest.listCategories();
    // categories && this.setState({categories});\
    const client = new Client(serviceBaseURL+'/products/categories?coverid='+coverId);
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
        subText: cat.name,
        image: cat.image ? (categoryImageStoreURL + "/" + cat.image) : defaultImageURL,
        leadType: 'productlist',
        leadQuery: 'category='+cat.id
      }
    });
    const posterList = {slot: 1, title: 'Categories', posters: posters}
    const newPosterLists = [...posterLists, posterList];
    return Promise.resolve(newPosterLists);      
  }

  const loadBestSellingItemPosters = async (coverId, posterLists) => {
    const query = '?offset=0&size=12&sortkey=sales&sortorder=desc&coverid='+coverId;
    const client = new Client(serviceBaseURL+'/products'+query);
    const resource = client.go();
    let receivedData;
    try{
        console.log("Making service call: "+resource.uri);
        receivedData = await resource.post();
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
              subText: '₹'+product.variations[0].priceAfterDiscount,
              image: product.images.length>0?(thumbNailImageStoreURL+"/"+product.images[0]) : defaultImageURL,
              leadType: 'product',
              leadQuery: product.id
            }
    });
    const posterList = {slot: 2, title: 'Most Selling', viewAllRoute: "products/list"+query, posters: posters};
    const newPosterLists = [...posterLists, posterList];
    return Promise.resolve(newPosterLists);       
  }

  const loadNewlyArrivedItemPosters = async (coverId, posterLists) => {
    const query = '?offset=0&size=12&sortkey=created_ts&sortorder=desc&coverid='+coverId;
    const client = new Client(serviceBaseURL+'/products'+query);
    const resource = client.go();
    let receivedData;
    try{
        console.log("Making service call: "+resource.uri);
        receivedData = await resource.post();
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
        subText: '₹'+product.variations[0].priceAfterDiscount,
        image: product.images.length>0?(thumbNailImageStoreURL+"/"+product.images[0]) : defaultImageURL,
        leadType: 'product',
        leadQuery: product.id
      }
    });
    const posterList = {slot: 3, title: 'New Arrivals', viewAllRoute: "products/list"+query, posters: posters}
    const newPosterLists = [...posterLists, posterList];
    return Promise.resolve(newPosterLists);  
  }

  const CoversColumn = coversState ? {
    name: "coverpicker",
    options: coversState.map((cover) => {return {text: cover.coverCity, value: cover.coverId}})
    // [
    //     { text: "Name: Ascending", value: "itemname-asc" },
    //     { text: "Name: Descending", value: "itemname-desc" },
    //     { text: "Price: Low to High", value: "itemprice-asc" },
    //     { text: "Price: High to Low", value: "itemprice-desc" },
    // ]
  }: undefined;

  return (
    <IonPage>
      <IonHeader class="osahan-nav border-white border-bottom">
        <IonToolbar>
          <IonButtons slot="start">
              <IonMenuButton/>
          </IonButtons>
          <IonImg alt="img" className="single-img" src={logoURL}/>
          <CartButton/>
          <div className="d-flex justify-content-center p-0">
            <IonText className="maintext">Delivery Location:</IonText>
            <div className="d-flex" onClick={loadCoverPicker}>
              <IonText className="maintext ml-2" color="secondary">
                {cartContext.order.cover ? cartContext.order.cover.coverCity : 'Select'}
              </IonText>
              <IonIcon color="secondary" size="small" icon={pullDownIcon}></IonIcon>
            </div>
          </div>
        </IonToolbar>
        <GrocSearch/>      
      </IonHeader>
      <IonContent color="dark">
        <IonAlert isOpen={checkoutResetAlertState.show}
                            onDidDismiss={()=> setCheckoutResetAlertState({...checkoutResetAlertState, show: false})}
                            header={''}
                            cssClass='groc-alert'
                            message={checkoutResetAlertState.msg}
                            buttons={[{text: 'Yes', handler: resetCheckoutAndChangeCity.bind(this, checkoutResetAlertState.coverId)}, 'No']}/> 
        <IonPicker cssClass="groc-option-picker" isOpen={showCoverOptions} columns={[CoversColumn]} buttons={[
                        {
                            text: "Cancel",
                            role: "cancel",
                            handler: onPickerCancel
                        },
                        {
                            text: "Done",
                            handler: onPickerDone
                        }
                    ]}>

        </IonPicker>
        <BannerSlider images={bannersState}/>
        {/*Slot 1 posterslider*/}
        {posterListsState &&
        <div>
          {posterListsState[0].posters.length > 0 && <ListingSection title={posterListsState[0].title} viewAllRoute={"/products/categories"}>
            <PosterSlider slidesPerView={2.6} 
                          loop={false} 
                          centeredSlides={false} 
                          spaceBetween={10} 
                          posters={posterListsState[0].posters}/>
          </ListingSection>}
          <AdvertSlider/>
          {posterListsState[1].posters.length > 0 && <ListingSection title={posterListsState[1] && posterListsState[1].title} 
                          viewAllRoute={(posterListsState[1]  && posterListsState[1].viewAllRoute)}>
            <PosterSlider slidesPerView={2.6} 
                          loop={false} 
                          centeredSlides={false} 
                          spaceBetween={10} 
                          posters={posterListsState[1] && posterListsState[1].posters}/>
          </ListingSection>} 
          {posterListsState[2].posters.length > 0 && <ListingSection title={posterListsState[2] && posterListsState[2].title} 
                          viewAllRoute={(posterListsState[2] && posterListsState[2].viewAllRoute)}>
            <PosterSlider slidesPerView={2.6} 
                          loop={false} 
                          centeredSlides={false} 
                          spaceBetween={10} 
                          posters={posterListsState[2] && posterListsState[2].posters}/>
          </ListingSection>}
        </div>}
            <div className="home-page-slide ion-padding">
              <IonRow className="ion-text-center">
                <IonCol className="p-1">
                  <IonIcon className="mr-1" icon={peopleIcon} size="small" color="light"/>
                  <IonText color="light" className="headtext">Membership</IonText>
                </IonCol>
              </IonRow>
              <IonRow className="ion-text-center">
                <IonCol>
                  <IonButton color="secondary" size="small"><IonIcon className="mr-1" icon={cardIcon} size="small"/>Buy Now</IonButton>
                </IonCol>
              </IonRow>
            </div>
        <div  className="ion-text-center"><IonText>Thanks for scrolling till the end!</IonText></div>
        {/*Slot 2 posterslider*/}
        {/* <ListingSection title="Everyday essentials">
          <PosterSlider/>
        </ListingSection> */}
      </IonContent>
    </IonPage>
  );
};

export default Home;
