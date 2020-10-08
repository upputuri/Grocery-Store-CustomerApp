import { IonApp, IonRoute, IonRouterOutlet, IonSplitPane } from '@ionic/react';
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
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import './App.css';
import { GrocMenu } from "./components/Menu/Menu";
import AppPages from './components/Utilities/AppPages';
import ServiceRequest from './components/Utilities/ServiceCaller';
import './global.css';
import Categories from './pages/Categories';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductsBrowser from './pages/ProductsBrowser';
import SingleProduct from './pages/SingleProduct';
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
    addItem: ()=>{},
    removeItem: ()=>{}
  }
)

const appPages = AppPages;

class App extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = {
      isAuthenticated: false,
      customer: {
        id: '',
        fname: '',
        lname: '',
        email: '',
        image: '',
      }
    };
  }

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

  listProductsOfCategory = () => {
    //Route to products page. Pass query object that determines what products to list.
    // let queryObj = {
    //   categories: [categoryId],
    // }
    alert('hi')
    // history.pushState()
  }

  viewProductDetail(productId) {

  }

  render(){
    return (
    <IonReactRouter>
      <LoginContext.Provider value={{isAuthenticated: this.state.isAuthenticated, customer: this.state.customer, login: (u, p)=>this.loginHandler(u, p)}}>
      <IonApp>
        <IonSplitPane contentId="main-content">
          <GrocMenu entries={appPages}/>
          <IonRouterOutlet id="main-content">
            <Route path="/home" component={Home} exact={true} />
            <Route path="/products" component={ProductsBrowser} />
            {/* <Route path="/products" component={Products} productClickHandler={this.viewProductDetail} exact={true}/> */}
            {/* <Route path="/products/:id" component={SingleProduct} /> */}
            <Route path="/login" component={Login} exact={true} />            
            <Route exact path="/" render={() => <Redirect to="/home" />} />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonApp>
      </LoginContext.Provider>
    </IonReactRouter>
    );
  }
}

export default App;
export { LoginContext };

