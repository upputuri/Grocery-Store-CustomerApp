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
import { categoryImageStoreURL, defaultImageURL, logoURL, serviceBaseURL, smallImageStoreURL } from '../components/Utilities/ServiceCaller';
import { Plugins } from '@capacitor/core';
import { CartContext, LoginContext } from '../App';
import AdvertSlider from '../components/Slider/AdvertSlider';
import { clientConfig } from '../components/Utilities/AppCommons';
import { useHistory } from 'react-router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faTruck } from "@fortawesome/free-solid-svg-icons";
import { faGift } from '@fortawesome/free-solid-svg-icons';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
//
/*  document.addEventListener('ionBackButton', (ev) => {
    alert('registering app closer');
    // ev.detail.register(-1, () => {
          // MobileApp.exitApp();

    // });
  });
*/
const Home = () => {
  const loginContext = useContext(LoginContext);
  const cartContext = useContext(CartContext);
  const [posterListsState, setPosterListsState] = useState(null);
  const [bannersState, setBannersState] = useState([]);
  const [coversState, setCoversState] = useState(undefined);
  const [widgetDataState, setWidgetDataState] = useState(undefined);
  const [showCoverOptions, setShowCoverOptions] = useState(false);
  const [checkoutResetAlertState, setCheckoutResetAlertState] = useState({show: false, msg: clientConfig.cityChangeCheckoutResetAlertMsg, coverId: undefined});
  const [citySelectionPrompt, setCitySelectionPrompt] = useState({show: false, msg: ''});
  const history = useHistory();

  Plugins.App.addListener('backButton', Plugins.App.exitApp);

  useEffect(() => {
    // refreshAccount();
    initializeData();
    return ()=>Plugins.App.removeAllListeners();
  }, []);
  
  const initializeData = async () => {
    loadCovers();
    loadWidgetData();
    if (cartContext.order.cover){
      loadBanners(cartContext.order.cover.coverId);
      loadPosters(cartContext.order.cover.coverId);
    }
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
    // alert(JSON.stringify(covers[0]));
    // console.log(images);
    setCoversState(covers);
    if (!cartContext.order.cover){
      setCitySelectionPrompt({show: true, msg: 'Please set your delivery location to start shopping!'});
    }
  }

  const loadWidgetData = async () => {
    const client = new Client(serviceBaseURL+'/application/widgetdata');
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
    setWidgetDataState(receivedData.data);
  }

  const loadCoverPicker = () => {
    setShowCoverOptions(true);
  }

  const onPickerCancel = () => {
    setShowCoverOptions(false);
  }

  const onPickerDone = (picker) => {
      // alert(JSON.stringify(picker['coverpicker'].value));
      setShowCoverOptions(false);
      checkAndProceedToCityChange(picker['coverpicker'].value);
    }
    
  const checkAndProceedToCityChange = (coverId) => {
    if (cartContext.order.cover && coverId !== cartContext.order.cover.coverId && cartContext.itemCount > 0) {
      setCheckoutResetAlertState({...checkoutResetAlertState, show: true, coverId: coverId});
    }
    else{
      cartContext.setDeliveryCover(coversState.find((cover) => cover.coverId === coverId));
      history.go();
    }
  }
  
  const resetCheckoutAndChangeCity = (coverId) => {
    //reset cart
    cartContext.resetOrderContext();
    //change city
    cartContext.setDeliveryCover(coversState.find((cover) => cover.coverId === coverId));
    history.go();
  }

  const loadBanners = async (coverId) => {
    const client = new Client(serviceBaseURL+'/application/coverimages?coverid='+coverId);
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
    console.log(images);
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
      // console.log(JSON.stringify(result));
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
    categories.splice(categories.findIndex((cat)=>cat.name === 'All Categories'), 1);
    const posters = categories.map((cat) =>{
      return {
        id: cat.id,
        title: '',
        mainText: cat.metaDescription,
        image: cat.image ? (categoryImageStoreURL + "/" + cat.image) : defaultImageURL,
        leadType: 'productlist',
        leadQuery: 'category='+cat.id
      }
    });
    const posterList = {slot: 1, title: 'Categories', posters: posters};
    const newPosterLists = [...posterLists, posterList];
    return Promise.resolve(newPosterLists);      
  }

  const loadBestSellingItemPosters = async (coverId, posterLists) => {
    const query = '?sortkey=sales&sortorder=desc&coverid='+coverId;
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
              image: product.images.length>0?(smallImageStoreURL+"/"+product.images[0]) : defaultImageURL,
              leadType: 'product',
              leadQuery: product.id
            }
    });
    const posterList = {slot: 2, title: 'Most Selling', viewAllRoute: "products/list"+query, posters: posters};
    const newPosterLists = [...posterLists, posterList];
    return Promise.resolve(newPosterLists);       
  }

  const loadNewlyArrivedItemPosters = async (coverId, posterLists) => {
    const query = '?sortkey=created_ts&sortorder=desc&coverid='+coverId;
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
        image: product.images.length>0?(smallImageStoreURL+"/"+product.images[0]) : defaultImageURL,
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
        </IonToolbar>
        <GrocSearch/>
        <div className="d-flex justify-content-center pb-1">
            <IonText className="maintext" color="light">Delivery Location:</IonText>
            <div className="d-flex" onClick={loadCoverPicker}>
              <IonText className="maintext ml-2" color="secondary">
                {cartContext.order.cover ? cartContext.order.cover.coverCity : 'Select'}
              </IonText>
              <IonIcon color="secondary" size="small" icon={pullDownIcon}></IonIcon>
            </div>
        </div>      
      </IonHeader>
      <IonContent color="dark">
        <IonAlert isOpen={citySelectionPrompt.show}
                              onDidDismiss={()=> setCitySelectionPrompt(false)}
                              header={''}
                              cssClass='groc-alert'
                              message={citySelectionPrompt.msg}
                              buttons={[{text: 'OK', handler: loadCoverPicker}]}/>
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

        {/*Slot 1 posterslider*/}
        {posterListsState &&
        <div>
          <BannerSlider images={bannersState}/>
          <div className="home-page-slide p-2 my-2">
          <IonRow className="ion-text-center">
            <IonCol className="p-1 border-right border-bottom border-white">
              <IonText color="light" className="headtext">
                <FontAwesomeIcon icon={faUsers} />
                <section><em>Happy Customers</em></section>
                <section>42835+</section>
                {/* <section>{widgetDataState && widgetDataState.customersCount+'+'}</section> */}
              </IonText>
            </IonCol>
            <IonCol className="p-1 border-bottom border-white">
              <IonText color="light" className="headtext">
                <FontAwesomeIcon icon={faTruck} />
                <section><em>Orders Delivered</em></section>
                <section>49081+</section>
                {/* <section>{widgetDataState && widgetDataState.ordersCount+'+'}</section> */}
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow className="ion-text-center">
            <IonCol className="p-1">
              <IonText color="light" className="headtext">
                <FontAwesomeIcon icon={faLeaf} />
                <section><em>No of Products</em></section>
                <section>103+</section>
                {/* <section>{widgetDataState && widgetDataState.productsCount+'+'}</section> */}
                </IonText>
            </IonCol>
            <IonCol className="p-1 border-left border-white">
              <IonText color="light" className="headtext">
                <FontAwesomeIcon icon={faGift} />
                <section><em>Club Members</em></section>
                <section>10708+</section></IonText>
                {/* <section>{widgetDataState && widgetDataState.membersCount+'+'}</section></IonText> */}
            </IonCol>
          </IonRow>
        </div>
        {posterListsState[0].posters.length > 0 && <ListingSection title={posterListsState[0].title}>
            <PosterSlider slidesPerView={posterListsState[0].posters.length < 3 ? 2 : 2.6} 
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
        <div className="home-page-slide p-2 my-2">
          <IonRow className="ion-text-center">
            <IonCol className="p-1 border-right border-bottom border-white">
              {/* <IonText color="light" className="headtext"> */}
                <FontAwesomeIcon icon={faTruck} />
                <section><strong>Free Delivery</strong></section>
                <section><IonText className="subheadtext">{'Fast & Accurate at your doorstep'}</IonText></section>
              {/* </IonText> */}
            </IonCol>
            <IonCol className="p-1 border-bottom border-white">
              {/* <IonText color="light" className="headtext"> */}
                <FontAwesomeIcon icon={faThumbsUp} />
                <section><strong>{'Fresh & Healthy'}</strong></section>
                <section><IonText className="subheadtext">Sourced directly from the farms</IonText></section>
              {/* </IonText> */}
            </IonCol>
          </IonRow>
          <IonRow className="ion-text-center">
            <IonCol className="p-1">
              {/* <IonText color="light" className="headtext"> */}
                <FontAwesomeIcon icon={faCreditCard} />
                <section><strong>Payment</strong></section>
                <section><IonText className="subheadtext">{'Safe, Secure & Cash On Delivery'}</IonText></section>
                {/* </IonText> */}
            </IonCol>
            <IonCol className="p-1 border-left border-white">
              {/* <IonText color="light" className="headtext"> */}
                <FontAwesomeIcon icon={faClock} />
                <section><strong>Customer Care</strong></section>
                <section><IonText className="subheadtext">Dedicated support team at your service</IonText></section>
                {/* </IonText> */}
            </IonCol>
          </IonRow>
        </div>

        <div className="d-flex mt-3 mb-1 justify-content-center">
          <IonText className="headtext">The Vegit Club</IonText>
        </div>
        <div onClick={()=>history.push(loginContext.customer.membershipId && loginContext.customer.membershipId > 0 ? "/membership" : "/mplancategories")}className="home-page-slide ion-padding">
          <IonRow className="ion-text-center">
            <IonCol className="p-1">
              {/* <IonIcon className="mr-1" icon={peopleIcon} size="small" color="light"/> */}
              <IonText color="light" className="headtext">Exclusive Membership</IonText>
            </IonCol>
          </IonRow>
          <IonRow className="ion-text-center">
            <IonCol>
              <IonButton color="secondary" size="small"><IonIcon className="mr-1" icon={cardIcon} size="small"/>Buy Now</IonButton>
            </IonCol>
          </IonRow>
        </div>
                  
        <div  className="ion-text-center mt-3"><IonText>Thanks for scrolling till the end!</IonText></div>
        {/*Slot 2 posterslider*/}
        {/* <ListingSection title="Everyday essentials">
          <PosterSlider/>
        </ListingSection> */}
      </IonContent>
    </IonPage>
  );
};

export default Home;
