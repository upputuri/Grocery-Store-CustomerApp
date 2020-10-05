import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonPage, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

import './global.css';
import './App.css';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { GrocMenu } from "./components/Menu/Menu";
import Categories from './pages/Categories';
import Login from './pages/Login';
import AppPages from './components/Utilities/AppPages';
import { resolve } from 'dns';
import { loginRequest } from './components/Utilities/ServiceCaller';

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
    // let result = await this.loginRequest(serviceBaseURL + '/me', {loginId: user, password: password});
    // alert(result);
    // alert("Success: "+result.isSuccessful + ",  failureMsg: "+result.failureMessage);

    let result = await loginRequest({loginId: user, password: password});
    if (result.isOkResponse)
    {
      const fetchedCustomer = {
        id: result.responseObject.customer.id,
        fname: result.responseObject.customer.fname,
        lname: result.responseObject.customer.lname,
        email: result.responseObject.customer.email,
        image: result.responseObject.customer.image
      }
  
      this.setState({
        isAuthenticated: true,
        customer: fetchedCustomer
      });
    }
    else{
      alert("Server error response- Status:"+result.responseObject.status+", error: "+result.responseObject.message);
    }
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
            <Route path="/categories" component={Categories} exact={true} />
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
export {LoginContext};
