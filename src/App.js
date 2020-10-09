import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
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
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import './App.css';
import { GrocMenu } from "./components/Menu/Menu";
import AppPages from './components/Utilities/AppPages';
import ServiceRequest from './components/Utilities/ServiceCaller.ts';
import './global.css';
import Cart from './pages/Cart';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductsBrowser from './pages/ProductsBrowser';
/* Theme variables */
import './theme/variables.css';

const serviceBaseURL = "http://localhost:8080/groc";

const LoginContext = React.createContext(
  {
    isAuthenticated: 'false',
    customer: {
      id: '',
      fname: '',
      lname: '',
      email: '',
      image: '',
    },
    login: ()=> {}                                       
});

const CartContext = React.createContext(
  {
    itemCount: 0,
    addItem: (p,v,q)=>{},
    removeItem: (p,v,q)=>{}
  }
)

const appPages = AppPages;

class App extends React.Component {

  state =
    {
      isAuthenticated: false,
      customer: {
        id: 618,
        fname: '',
        lname: '',
        email: '',
        image: '',
      },
      cart: {
        itemCount: 0,
      }
  }

  // constructor(props)
  // {
  //   super(props);
  //   this.state = {
  //     isAuthenticated: false,
  //     customer: {
  //       id: '',
  //       fname: '',
  //       lname: '',
  //       email: '',
  //       image: '',
  //     },
  //     cart: {
  //       itemCount: 0,
  //     }
  //   };
  // }

  loginHandler = async (user, password)=>
  {
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
        image: serviceRequest.responseObject.customer.image
      }
      alert(JSON.stringify(fetchedCustomer));
      this.setState({
        isAuthenticated: true,
        customer: fetchedCustomer
      });

      return serviceRequest;
    }
    else if (serviceRequest.hasResponse){
      // alert("Server responded with error - Status:"+serviceRequest.responseObject.status+", error: "+serviceRequest.responseObject.message);
      return serviceRequest;
    }
    else
    {
      // alert("Failed to make service call!!")
      return serviceRequest;
    }
  }

  async addItemToCart(productId, variationId, qty)
  {
    // alert('adding to cart'+productId+variationId+qty);
    // alert(JSON.stringify(this.state.customer));
    let path = serviceBaseURL + '/customers/'+this.state.customer.id+'/cart';

    const client = new Client(path);
    const resource = client.go();
    let receivedState;
    try{
        receivedState = await resource.post(
          {
            data: {
              productId: productId,
              variationId: variationId,
              qty: qty
            }
          }
        );
    }
    catch(e)
    {
        console.log("Service call failed with - "+e);
        return;
    }
    
    this.setState({
      cart: {
        itemCount: this.state.cart.itemCount + qty
      }
    });
    // alert(this.state.cart.itemCount);
    //const product = receivedState.data;
    // alert(JSON.stringify(products));
    // this.setState({
    //     data: product,
    //     resource: resource
    // })  
  }



  render(){
    return (
    <IonReactRouter>
      <LoginContext.Provider value={{isAuthenticated: this.state.isAuthenticated, customer: this.state.customer, login: (u, p)=>this.loginHandler(u, p)}}>
        <CartContext.Provider value={{itemCount: this.state.cart.itemCount, addItem: (pId, vId, qty)=>this.addItemToCart(pId, vId, qty)}}>
          <IonApp>
            <IonSplitPane contentId="main-content">
              <GrocMenu entries={appPages}/>
              <IonRouterOutlet id="main-content">
                <Route path="/home" component={Home} exact={true} />               
                <Route path="/products" component={ProductsBrowser} />
                {/* <Route path="/products" component={Products} productClickHandler={this.viewProductDetail} exact={true}/> */}
                {/* <Route path="/products/:id" component={SingleProduct} /> */}
                <Route path="/login" component={Login} exact={true} />  
                {/* <Route path="/customer/cart" render={(props)=><Cart customerId={this.state.customer.id}></Cart>} exact={true} />                           */}
                <Route exact path="/" render={() => <Redirect to="/home" />} />
              </IonRouterOutlet>
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

