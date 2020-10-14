import React from 'react'
import { IonAvatar, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonNote, IonRouterLink } from "@ionic/react"
import { paperPlane as paperPlanceIcon, cafe as cafeIcon} from 'ionicons/icons'
import { home, list, grid, pricetag, basket, card, person, location, create, heart, mail, help, sad} from 'ionicons/icons';
import { LoginContext } from '../../App';

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

  return (
      <IonMenu contentId="main-content" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <LoginContext.Consumer>
            {(context)=>{
              return (
                context.isAuthenticated ? 
                (
                  <div>           
                    <IonAvatar class="ion-margin-start ios hydrated mb-2"><img alt="img" src="assets/user.jpg"></img></IonAvatar>
                    <IonListHeader>{context.customer.fname}</IonListHeader>
                    <IonNote>{context.customer.email}</IonNote>

                    <IonMenuToggle auto-hide="false" >
                      <IonItem onClick={context.logout} detail="false">
                        <IonLabel>Logout</IonLabel>
                      </IonItem>
                    </IonMenuToggle>

                  </div>   
                ) : ( <IonRouterLink routerLink="/login">
                        <IonMenuToggle auto-hide="false" >
                          <IonItem detail="false">
                            <IonLabel>Login</IonLabel>
                          </IonItem>
                        </IonMenuToggle>
                      </IonRouterLink>)
              );
            }}
          </LoginContext.Consumer>
          {props.entries.map((entry) =>
          {
            return (
                    <IonRouterLink key={entry.title} routerLink={entry.url}>
                      <IonMenuToggle auto-hide="false" >
                        <IonItem lines="none" detail="false">
                          {menuIcons[`${entry.icon}`]}
                          <IonLabel>{entry.title}</IonLabel>
                        </IonItem>
                      </IonMenuToggle>
                    </IonRouterLink>
            );
          })}

        </IonList>

        <IonList id="labels-list">
          <IonListHeader>Trending</IonListHeader>

          <IonItem lines="none">
            <IonIcon slot="start" ios="trending-up-outline" md="trending-up-outline"></IonIcon>
              <IonLabel>{}</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  )
}


export { SampleMenu, GrocMenu };
