import { IonApp, IonButton, IonButtons, IonContent, IonPage, IonRouterLink, IonRouterOutlet, IonSplitPane, IonText } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React from 'react';
import { Redirect, Route, Router } from 'react-router';
import { BrowserRouter, Link } from 'react-router-dom';
import { LoginContext } from './App';
import { GrocMenu } from './components/Menu/Menu';
import AppPages from './components/Utilities/AppPages';
import Home from './pages/Home';
import Login from './pages/auth/Login';

const appPages = AppPages;

// const Login1Context = React.createContext(
//     {
//       isAuthenticated: 'false',
//       customer: {
//         id: '',
//         fname: '',
//         lname: '',
//         email: '',
//         image: '',
//       },
//       login: ()=> {}                                       
//   });

class AppTest extends React.Component {
    state = {
        isAuthenticated: false,
        customer: {
            id: 'dummy',
            name: '',
            email: '',
            show: false
        }
    }

    async loginHandler(){
        await Promise.resolve(1);
        this.setState({isAuthenticated: true, customer:{id:'618', name:'srikanth', fname:'Srikanth', email: 'usrikanth@gmail.com'}})
    }

    componentDidMount()
    {
        console.log("Component Mounted!")
    }

    componentWillUnmount(){
        alert("Unmounting")
        console.log("Component will unmount!")
    }

    componentDidUpdate(){
        console.log("Component Updated!")
    }

    render()
    {
        return (
        <IonPage>
            <IonReactRouter>
                    <IonApp>
                        <IonPage>

                            <IonButtons slot="right">
                                <IonButton size="small" slot="right" onClick={()=>this.loginHandler()}>Click</IonButton>
                                <IonButton size="small" slot="right" onClick={()=>this.setState({show: !this.state.show})}>Show</IonButton>                                
                                <IonRouterLink routerLink="/home">Home</IonRouterLink>
                                <IonRouterLink routerLink="/other">Other</IonRouterLink>                                
                                {this.state.show && 
                                <IonText>Showing</IonText>
                                }
                            <IonButton>
                                {this.state.customer.id}
                            </IonButton>                        
                            </IonButtons>
                            <IonRouterOutlet id="main-content">               
                                <Route path="/home" render={() => <div><h1/><h1>.</h1><h1>Hello</h1></div>} />
                                <Route path="/other" render={() => <div><h1/><h1>.</h1><h1>Other</h1></div>} />                                
                                <Route exact path="/" render={() => <Redirect to="/home" />}></Route>
                            </IonRouterOutlet>
                        </IonPage>
                    </IonApp>
            </IonReactRouter>
        </IonPage>
        )
    }
}

export default AppTest;