import { IonApp, IonLoading, IonRouterOutlet, IonSplitPane, IonToast } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/typography.css';
import Client from 'ketting';
import { getMaxListeners } from 'process';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.scss';
import { GrocMenu } from "./components/Menu/Menu";
import AppPages from './components/Utilities/AppPages';
import ServiceRequest, { serviceBaseURL } from './components/Utilities/ServiceCaller';
import './global.scss';
import Login from './pages/auth/Login';
import Registration from './pages/auth/Registration';
import Security from './pages/auth/Security';
import Checkout from './pages/checkout/Checkout';
import ContactForm from './pages/general/ContactForm';
import FAQ from './pages/general/FAQ';
import Home from './pages/Home';
import ProductsBrowser from './pages/ProductsBrowser';
import Account from './pages/userdata/account/Account';
import Profile from './pages/userdata/account/Profile';
import AddressList from './pages/userdata/address/AddressList';
import OrderDetail from './pages/userdata/orders/OrderDetail';
import Orders from './pages/userdata/orders/Orders';
import { Plugins } from '@capacitor/core';
/* Theme variables */
import './theme/variables.css';
import Policies from './pages/general/Policies';
import Support from './pages/general/Support';
import OTPLogin from './pages/auth/OTPLogin';
import PasswordReset from './pages/auth/PasswordReset';

const { Storage } = Plugins;
const LoginContext = React.createContext(
  {
    isAuthenticated: true,
    customer: {
      id: '',
      password: '',
      fname: '',
      lname: '',
      email: '',
      mobile: '',
      image: '',
    },
    login: () => {},
    register: () => {},
    updateProfile: () => {},
});

const CartContext = React.createContext(
  {
    itemCount: 0,
    addItem: (p,v,q)=>{},
    removeItem: (p,v,q)=>{},
    placeOrder: () =>{},
    setDeliveryAddress: ()=>{},
    setPromoCodes: ()=>{},
    setPaymentOption: ()=>{},
    order: {
      id: '',
      deliveryAddressId: 0,
      promoCodes: [],
      paymentOptionId: '',
      transactionId: '',
      instructions: '',
    }
  }
)

const appPages = AppPages;

class App extends React.Component {

  constructor(props){
    super(props);
    
    this.retrieveUser();
    this.retrieveCart();

    this.state =
      {
        isAuthenticated: false,
        customer: {
          id: '',
          fname: '',
          lname: '',
          email: '',
          password: '',
          mobile: '',
          image: '',
        },
        cart: {
          itemCount: 0,
        },
        order: {
          id: '',
          deliveryAddressId: 0,
          promoCodes: [],
          paymentOptionId: 0,
          transactionId: '',
          instructions: ''
        },
        showToast: false,
        toastMsg: 'Happy shopping!',
        showLoading: false
    }
  }

  async registerNewUser(mobile, emailId, fName, lName, password)
  {
    this.setState({showLoading: true});
    console.log("Sending registration request for: "+mobile+","+emailId+","+fName+","+lName+",");
    let path = serviceBaseURL + '/customers';

    const client = new Client(path);
    const resource = client.go();
    let receivedState;
    try{
        receivedState = await resource.post(
          {
            data: {
              mobile: mobile,
              email: emailId,
              password: password,
              fname: fName,
              lname: lName
            }
          }
        );
    }
    catch(e)
    {
        console.log("Service call failed with - "+e);
        // alert(JSON.stringify(e));
        this.setState({showLoading: false});
        return Promise.resolve(e.status);
    }
    const receivedData = receivedState.data;
    this.setState({
      isAuthenticated: true,
      customer: {
        id: receivedData.id,
        fname: receivedData.fname,
        lname: receivedData.lname,
        email: receivedData.email,
        mobile: receivedData.mobile,
        password: password
      },
      cart: {
        itemCount: 0
      },
      showToast: true,
      toastMsg: 'Registration successful!'
    });
    this.setState({showLoading: false});
    return Promise.resolve(200);
  }

  async saveEditedProfile (newData) {
    let path = serviceBaseURL + '/customers/'+this.state.customer.id;
    const authHeaderBase64Value = btoa(this.state.customer.mobile+':'+this.state.customer.password);
    const loginHeaders = new Headers();
    loginHeaders.append("Content-Type", "application/json");
    loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
    console.log("Making service call: "+path);
    let mergedProfile = {...this.state.customer, ...newData};
    let response;
    try{
        response = await fetch(path, {
            method: 'PUT',
            body: JSON.stringify(mergedProfile),
            headers: loginHeaders
        });
    }
    catch(e)
    {
        console.log("Service call failed with - "+e);
        throw e;
    }
    if (response.ok) {
      console.log("Service call completed successfully");
      this.setState({customer: mergedProfile});
      this.storeUser(mergedProfile);
    }
    // console.dir(result);
    console.log(response.status);
    return Promise.resolve(response.status);
  }

  loginWithOTP = async (mobile) => {
    
  }

  loginHandler = async (user, password) =>
  {
    this.setState({showLoading: true});
    let serviceRequest = new ServiceRequest();
    await serviceRequest.loginRequest({loginId: user, password: password});

    //let result = await loginRequest({loginId: user, password: password});
    if (serviceRequest.hasResponse && serviceRequest.isResponseOk)
    {
      const fetchedCustomer = {
        id: serviceRequest.responseObject.customer.id,
        fname: serviceRequest.responseObject.customer.fname,
        lname: serviceRequest.responseObject.customer.lname,
        email: serviceRequest.responseObject.customer.email,
        mobile: serviceRequest.responseObject.customer.mobile,
        image: serviceRequest.responseObject.customer.image
      }

      // alert(JSON.stringify(fetchedCustomer));
      const authenticatedCustomer = {...fetchedCustomer, password: password};
      const cart = {
        itemCount: serviceRequest.responseObject.cartItemCount
      };
      this.setState({
        isAuthenticated: true,
        customer: authenticatedCustomer,
        cart: cart,
        toastMsg: 'Login Successful!',
        showToast: true
      });
      this.storeUser(authenticatedCustomer);
      this.storeCart(cart);
      this.setState({showLoading: false});
      return serviceRequest;
    }
    else if (serviceRequest.hasResponse){
      // alert("Server responded with error - Status:"+serviceRequest.responseObject.status+", error: "+serviceRequest.responseObject.message);
      this.setState({showLoading: false});
      return serviceRequest;
    }
    else
    {
      // alert("Failed to make service call!!")
      this.setState({showLoading: false});
      return serviceRequest;
    }
  }

  logoutHandler = () => {
    this.setState( {
      isAuthenticated: false,
      customer: {
        id: '',
        fname: '',
        lname: '',
        email: '',
        password: '',
        mobile: '',
        image: '',
      },
      cart: {
        itemCount: 0,
      },
      order: {
        id: '',
        deliveryAddressId: 0,
        promoCodes: [],
        paymentOptionId: 0,
        transactionId: '',
        instructions: ''
      },
      showToast: true,
      toastMsg: 'You are logged out!'
    });

    this.storeUser({
      id: '',
      fname: '',
      lname: '',
      email: '',
      password: '',
      mobile: '',
      image: '',
    });

    this.storeCart({
      itemCount: 0
    })
  }

  async storeUser(user) {
    console.log("Storing in app: "+JSON.stringify(user));
    await Storage.set({
      key: "user",
      value: JSON.stringify(user)
    })
  }

  async storeCart(cart) {
    console.log("Storing in app: "+JSON.stringify(cart));
    await Storage.set({
      key: "cart",
      value: JSON.stringify(cart)
    })
  }

  async retrieveUser() {
    const ret = await Storage.get({key: "user"});
    // console.log("Retrieved user from storage: "+ret.value);
    const user = JSON.parse(ret.value);
    // alert(JSON.parse(JSON.stringify(user)).fname);
    let customer = (user === null) ? {
      id: '',
      fname: '',
      lname: '',
      email: '',
      mobile: '',
      password: '',
      image: ''
    }:{
      id: user.id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      mobile: user.mobile,
      password: user.password,
      image: user.image
    }
    this.setState({customer: customer});
    this.setState({isAuthenticated: 
                  (user && user.email && user.email.length>0) || 
                  (user && user.mobile && user.mobile.length>0)});
    // alert(JSON.stringify(ret));
    // JSON.parse(ret);
  }

  async retrieveCart() {
    const ret = await Storage.get({key: "cart"});
    const cart = JSON.parse(ret.value);
    let cartState = (cart === null) ? {
      itemCount: 0
    }:cart;
    this.setState({cart: cartState});
  }

  async addItemToCart(productId, variationId, qty)
  {
    //alert('adding to cart'+productId+variationId+qty);
    // alert(JSON.stringify(this.state.customer));
    this.setState({showLoading: true});
    let path = serviceBaseURL + '/customers/'+this.state.customer.id+'/cart';
    // alert(this.state.customer.email+","+this.state.customer.password);
    const client = new Client(path);

    const resource = client.go();
    let receivedState;
    try{
        console.log("Making service call: "+resource.uri);  
        const authHeaderBase64Value = btoa(this.state.customer.mobile+':'+this.state.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);
        receivedState = await resource.post(
          {
            data: {
              productId: productId,
              variationId: variationId,
              qty: qty
            },
            headers: loginHeaders
          }
        );
    }
    catch(e)
    {
        console.log("Service call failed with - "+e);
        this.setState({showLoading: false});
        return;
      }
      console.log("Received response from service call: "+resource.uri);
      const newCartCount = this.state.cart.itemCount + qty;
      this.setState({
        cart: {
          itemCount: newCartCount
        }
      });
      this.storeCart({itemCount: newCartCount});
      this.setState({
        showToast: true,
        toastMsg: qty>0?'One item added to cart':'One item removed from cart',
        showLoading: false
      })
    }

  setDeliveryAddress(addressId){
    this.setState({order: {
      ...this.state.order, deliveryAddressId: addressId
    }})
  }

  setPromoCodes(promoCodes){
    this.setState({order: {
      ...this.state.order, promoCodes: promoCodes
    }})
  }

  setPaymentOption(paymentOptionId){
    this.setState({order: {
      ...this.state.order, paymentOptionId: paymentOptionId
    }})
  }

  setOrderId(orderId){
    this.setState({order: {
      ...this.state.order, id: orderId
    }})
  }

  resetCart(){
    this.setState({
      cart: {
        itemCount: 0
      },
      order: {
        id : 0,
        promoCodes : []
      }
    })
  }

  // clearOrderId(){
  //   this.setState({
  //     order: {
  //       id: 0
  //     }
  //   })
  // }

  async placeOrder(){
    this.setState({showLoading: true});
    let path = serviceBaseURL + '/orders';
    const client = new Client(path);
    const resource = client.go();
    //Clear previous order Id;
    this.setOrderId(0);
    let receivedState;
    try{
      console.log("Making service call: "+resource.uri);  
      const authHeaderBase64Value = btoa(this.state.customer.mobile+':'+this.state.customer.password);
      const loginHeaders = new Headers();
      loginHeaders.append("Content-Type", "application/json");
      loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);
      receivedState = await resource.post(
        {
          data: {...this.state.order, customerId: this.state.customer.id},
          headers: loginHeaders
        }
        );
      }
      catch(e)
      {
        console.log("Service call failed with - "+e);
        this.setState({showLoading: false});
        return 0;
      }
      console.log("Received response from service call: "+resource.uri);
      console.log("Order successfully created on server - Order Id: "+receivedState.data.id);
      // alert(JSON.stringify(receivedState));
      // this.setOrderId(receivedState.data.id);
      this.resetCart();
      this.setState({showLoading: false});
      return receivedState.data.id;
    }
    
  render(){
    console.log("Rendering App");
    return (
    <IonReactRouter>
      <LoginContext.Provider value={{isAuthenticated: this.state.isAuthenticated, 
                                    customer: this.state.customer, 
                                    login: (u, p)=>this.loginHandler(u, p),
                                    logout: this.logoutHandler, 
                                    register: this.registerNewUser.bind(this),
                                    updateProfile: this.saveEditedProfile.bind(this),
                                    }}>
        <CartContext.Provider value={{itemCount: this.state.cart.itemCount, 
                                      order: this.state.order,
                                      setDeliveryAddress: this.setDeliveryAddress.bind(this),
                                      setPromoCodes: this.setPromoCodes.bind(this),
                                      setPaymentOption: this.setPaymentOption.bind(this),
                                      placeOrder: this.placeOrder.bind(this),
                                      // resetOrderState: this.clearOrderId.bind(this),
                                      addItem: (pId, vId, qty)=>this.addItemToCart(pId, vId, qty)
                                      }}>
          <IonApp>
            <IonSplitPane contentId="main-content">
              <GrocMenu entries={appPages}/>
              <IonRouterOutlet id="main-content">
                <Switch>
                  <Route path="/home" component={Home} exact={true} />
                  <Route path="/products" component={ProductsBrowser} />
                  <Route path="/register" component={Registration} />
                  <Route path="/login" component={Login} exact={true} />
                  <Route path="/resetpass" component={PasswordReset} exact={true} />
                  <Route path="/contactus" component={ContactForm} exact={true} />
                  <Route path="/faq" component={FAQ} exact={true} />
                  <Route path="/policies" component={Policies} exact={true} />
                  <Route path="/support" component={Support} exact={true} />
                  <Route exact path="/" render={() => <Redirect to="/home" />} />
                  {this.state.isAuthenticated?
                  <Switch>
                    <Route path="/account" component={Account} exact={true} />
                    <Route path="/account/profile" component={Profile} exact={true} />
                    <Route path="/account/addresslist" component={AddressList} exact={true} />
                    <Route path="/account/security" component={Security} exact={true} />
                    <Route path="/checkout" component={Checkout} exact={true} />
                    <Route path="/orders" component={Orders} exact={true} />
                    <Route path="/orders/:id" component={OrderDetail} exact={true} />
                  </Switch>
                  :
                  <Redirect to={"/login"}/>
                  }
                </Switch>
              </IonRouterOutlet>
              <IonToast color="tertiary"
                  isOpen={this.state.showToast}
                  position="middle"
                  onDidDismiss={() => this.setState({showToast: false})}
                  message={this.state.toastMsg}
                  duration={500}
                />
              <IonLoading isOpen={this.state.showLoading}/>
            </IonSplitPane>
          </IonApp>
        </CartContext.Provider>
      </LoginContext.Provider>
    </IonReactRouter>
    );
  }
}

export default App;
export { LoginContext, CartContext };

