import React, { useContext, useState } from 'react'
import { IonAvatar, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonNote, IonRouterLink, IonText, IonTitle } from "@ionic/react"
import { pencil, paperPlane as paperPlanceIcon, cafe as cafeIcon} from 'ionicons/icons'
import { people, lockClosed as privacy, home, informationCircle as aboutus, documentText as document, call as phone, list, grid, pricetag, basket, card, person, location, create, heart, mail, helpCircle as help, sadOutline as sad, refresh as refund, logOut as logOutIcon, logIn as logInIcon} from 'ionicons/icons';
import { LoginContext } from '../../App';
import '../../App.scss';
import { aboutUrl, blogUrl, faqUrl, privacyPolicyUrl, profileImageStoreURL, returnPolicyUrl, termsUrl } from '../Utilities/ServiceCaller';
import Login from '../../pages/auth/Login';
import { useHistory } from 'react-router';

const menuIcons = {
  home: <IonIcon slot="start" icon={home}></IonIcon>,
  list: <IonIcon slot="start" icon={list}></IonIcon>,
  grid: <IonIcon slot="start" icon={grid}></IonIcon>,
  pricetag: <IonIcon slot="start" icon={pricetag}></IonIcon>,
  basket: <IonIcon slot="start" icon={basket}></IonIcon>,
  card: <IonIcon slot="start" icon={card}></IonIcon>,
  person: <IonIcon slot="start" icon={person}></IonIcon>,
  location: <IonIcon slot="start" icon={location}></IonIcon>,
  create: <IonIcon slot="start" icon={create}></IonIcon>,
  heart: <IonIcon slot="start" icon={heart}></IonIcon>,
  mail: <IonIcon slot="start" icon={mail}></IonIcon>,
  help: <IonIcon slot="start" icon={help}></IonIcon>,
  people: <IonIcon slot="start" icon={people}></IonIcon>,
  document: <IonIcon slot="start" icon={document}></IonIcon>,
  phone: <IonIcon slot="start" icon={phone}></IonIcon>,
};

const SampleMenu = () => {
    return (
    <IonMenu contentId="main-content">
        <IonContent>
            <IonItem>
                <IonIcon icon={paperPlanceIcon} slot="start"></IonIcon>
                Mangoes    
            </IonItem>
            <IonItem>
                <IonIcon icon={cafeIcon} slot="start"></IonIcon>
                Apples
            </IonItem>
        </IonContent>        
    </IonMenu>
    )
}

const GrocMenu = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const loginContext = useContext(LoginContext);
  const history = useHistory();

  const handleLogout = () => {
    loginContext.logout();
    history.push("/home");
  }

  return (
      <IonMenu contentId="main-content" type="overlay">
      <IonContent color="dark">
        <IonList className="bg-black" id="inbox-list">
          <LoginContext.Consumer>
            {(context)=>{
              return (
                context.isAuthenticated ? 
                (
                  <IonList className="bg-black menu-top-section">
                    <IonRouterLink routerLink="/account">
                      <IonMenuToggle auto-hide="false" >
                      <IonAvatar class="ion-margin-start ios hydrated mb-2">
                        <img alt="img" src={context.customer.image ? profileImageStoreURL + "/" + context.customer.image : "assets/user/blank_profile.png"}>
                        </img></IonAvatar>
                      {(context.customer.fname || context.customer.lname) && <IonItem color="night" detail="false">  
                        <IonText color="primary">{"Hello, "+context.customer.fname+" "+context.customer.lname}</IonText>
                      </IonItem>}
                      {/* {context.customer.email && <IonItem color="night" detail="false">
                        <IonNote>{context.customer.email}</IonNote>
                      </IonItem> } */}
                      </IonMenuToggle>
                    </IonRouterLink>
                  </IonList>   
                ) : (
                    <IonList className="bg-black menu-top-section">
                      <IonRouterLink routerLink="/login">
                        <IonMenuToggle auto-hide="false" >
                          <IonItem color="night" detail="false">
                            <IonIcon color="secondary" icon={logInIcon} slot="start"/>
                            <IonText color="secondary">Login/Register</IonText>
                          </IonItem>
                        </IonMenuToggle>
                      </IonRouterLink>
                    </IonList>  
                    )
              );
            }}
          </LoginContext.Consumer>
          {props.entries.map((entry, index) =>
          {
            return (
                    <IonRouterLink key={entry.title} routerLink={entry.url}>
                      <IonMenuToggle auto-hide="false" >
                        <IonItem className={index==selectedIndex ? "selected": "none"} onClick={()=>setSelectedIndex(index)} color="night" detail="false">
                          {menuIcons[`${entry.icon}`]}
                          <IonText>{entry.title}</IonText>
                        </IonItem>
                      </IonMenuToggle>
                    </IonRouterLink>
            );
          })}

        </IonList>

        <IonList className="bg-black menu-top-section">
          <IonRouterLink href={termsUrl}>
            <IonMenuToggle auto-hide="false" >
              <IonItem color="night" detail="false">
                <IonIcon icon={pencil} slot="start"/>
                <IonText>{'Terms & Conditions'}</IonText>
              </IonItem>
            </IonMenuToggle>
          </IonRouterLink>
          <IonRouterLink href={privacyPolicyUrl}>
            <IonMenuToggle auto-hide="false" >
              <IonItem color="night" detail="false">
                <IonIcon icon={privacy} slot="start"/>
                <IonText>Privacy Policy</IonText>
              </IonItem>
            </IonMenuToggle>
          </IonRouterLink>
          <IonRouterLink href={returnPolicyUrl}>
            <IonMenuToggle auto-hide="false" >
              <IonItem color="night" detail="false">
                <IonIcon icon={refund} slot="start"/>
                <IonText>Return/Refund Policy</IonText>
              </IonItem>
            </IonMenuToggle>
          </IonRouterLink>
          <IonRouterLink href={faqUrl}>
            <IonMenuToggle auto-hide="false" >
              <IonItem color="night" detail="false">
                <IonIcon icon={help} slot="start"/>
                <IonText>FAQ</IonText>
              </IonItem>
            </IonMenuToggle>
          </IonRouterLink>
          <IonRouterLink href={blogUrl}>
            <IonMenuToggle auto-hide="false" >
              <IonItem color="night" detail="false">
                <IonIcon icon={document} slot="start"/>
                <IonText>Blog</IonText>
              </IonItem>
            </IonMenuToggle>
          </IonRouterLink>
        </IonList>

        <IonList className="bg-black menu-top-section">
          <IonRouterLink href={aboutUrl}>
            <IonMenuToggle auto-hide="false" >
              <IonItem color="night" detail="false">
                <IonIcon icon={aboutus} slot="start"/>
                <IonText>About Us</IonText>
              </IonItem>
            </IonMenuToggle>
          </IonRouterLink>
          <IonRouterLink routerLink="/support">
            <IonMenuToggle auto-hide="false" >
              <IonItem color="night" detail="false">
                <IonIcon icon={phone} slot="start"/>
                <IonText>Contact Us</IonText>
              </IonItem>
            </IonMenuToggle>
          </IonRouterLink>

          {loginContext.isAuthenticated && <IonMenuToggle auto-hide="false" >
            <IonItem onClick={handleLogout} color="night" detail="false">
              <IonIcon color="danger" icon={logOutIcon} slot="start"/>
              <IonText>Logout</IonText>
            </IonItem>
          </IonMenuToggle>}
        </IonList>

      </IonContent>
    </IonMenu>
  )
}


export { SampleMenu, GrocMenu };
