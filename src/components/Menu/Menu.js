import React, { useState } from 'react'
import { IonAvatar, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonNote, IonRouterLink, IonText } from "@ionic/react"
import { paperPlane as paperPlanceIcon, cafe as cafeIcon} from 'ionicons/icons'
import { home, list, grid, pricetag, basket, card, person, location, create, heart, mail, help, sad, logInOutline as logInIcon} from 'ionicons/icons';
import { LoginContext } from '../../App';
import '../../App.scss';

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
  sad: <IonIcon slot="start" icon={sad}></IonIcon>
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
                    <IonAvatar class="ion-margin-start ios hydrated mb-2"><img alt="img" src="assets/user.jpg"></img></IonAvatar>
                    <IonListHeader color="night">{context.customer.fname}</IonListHeader>
                    <IonNote color="night">{context.customer.email}</IonNote>
                  </IonList>   
                ) : (
                    <IonList className="bg-black menu-top-section">
                      <IonRouterLink routerLink="/login">
                        <IonMenuToggle auto-hide="false" >
                          <IonItem color="night" detail="false">
                            <IonIcon color="secondary" icon={logInIcon} slot="start"/>
                            <IonText color="secondary">Login</IonText>
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

        {/* <IonList id="labels-list">
          <IonListHeader>Trending</IonListHeader>

          <IonItem lines="none">
            <IonIcon slot="start" ios="trending-up-outline" md="trending-up-outline"></IonIcon>
              <IonLabel>{}</IonLabel>
          </IonItem>
        </IonList> */}
      </IonContent>
    </IonMenu>
  )
}


export { SampleMenu, GrocMenu };
