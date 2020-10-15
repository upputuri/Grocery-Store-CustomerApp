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
import Client, { basicAuth } from 'ketting';
import { getMaxListeners } from 'process';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import { GrocMenu } from "./components/Menu/Menu";
import AppPages from './components/Utilities/AppPages';
import ServiceRequest, { serviceBaseURL } from './components/Utilities/ServiceCaller.ts';
import './global.css';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductsBrowser from './pages/ProductsBrowser';
import Registration from './pages/Registration';
/* Theme variables */
import './theme/variables.css';

const LoginContext = React.createContext(
  {
    isAuthenticated: false,
    customer: {
      id: '',
      fname: '',
      lname: '',
      email: '',
      image: '',
    },
    login: () => {},
    register: () => {}                                    
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
        id: '',
        fname: '',
        lname: '',
        email: '',
        password: '',
        image: '',
      },
      cart: {
        itemCount: 0,
      }
  }

  loginHandler = async (user, password) =>
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

      // alert(JSON.stringify(fetchedCustomer));
      this.setState({
        isAuthenticated: true,
        customer: {...fetchedCustomer, password: password},
        cart: {
          itemCount: serviceRequest.responseObject.cartItemCount
        }
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

  logoutHandler = () => {
    this.setState( {
      isAuthenticated: false,
      customer: {
        id: '',
        fname: '',
        lname: '',
        email: '',
        password: '',
        password: '',
        image: '',
      },
      cart: {
        itemCount: 0,
      }
    });
  }

  async addItemToCart(productId, variationId, qty)
  {
    //alert('adding to cart'+productId+variationId+qty);
    // alert(JSON.stringify(this.state.customer));

    let path = serviceBaseURL + '/customers/'+this.state.customer.id+'/cart';
    // alert(this.state.customer.email+","+this.state.customer.password);
    const client = new Client(path);

    const resource = client.go();
    let receivedState;
    try{
        console.log("Making service call: "+resource.uri);  
        const authHeaderBase64Value = btoa(this.state.customer.email+':'+this.state.customer.password);
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
        return;
    }
    console.log("Received response from service call: "+resource.uri);
    this.setState({
      cart: {
        itemCount: this.state.cart.itemCount + qty
      }
    });
  }

  async registerNewUserWithEmail(emailId, fName, lName, password)
  {
    console.log("Sending registration request for: "+emailId+","+fName+","+lName+",");
    let path = serviceBaseURL + '/customers';

    const client = new Client(path);
    const resource = client.go();
    let receivedState;
    try{
        receivedState = await resource.post(
          {
            data: {
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
        alert(JSON.stringify(e));
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
        password: password
      }
    });
    return Promise.resolve(200);
  }

  render(){
    return (
    <IonReactRouter>
      <LoginContext.Provider value={{isAuthenticated: this.state.isAuthenticated, 
                                    customer: this.state.customer, 
                                    login: (u, p)=>this.loginHandler(u, p),
                                    logout: this.logoutHandler, 
                                    register: this.registerNewUserWithEmail.bind(this)
                                    }}>
        <CartContext.Provider value={{itemCount: this.state.cart.itemCount, addItem: (pId, vId, qty)=>this.addItemToCart(pId, vId, qty)}}>
          <IonApp>
            <IonSplitPane contentId="main-content">
              <GrocMenu entries={appPages}/>
              <IonRouterOutlet id="main-content">
                <Switch>
                  <Route path="/home" component={Home} exact={true} />
                  <Route path="/products" component={ProductsBrowser} />
                  <Route path="/register" component={Registration} />
                  <Route path="/login" component={Login} exact={true} />  
                  <Route exact path="/" render={() => <Redirect to="/home" />} />
                </Switch>
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

