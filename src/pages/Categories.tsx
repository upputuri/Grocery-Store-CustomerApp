import { IonContent, IonHeader, IonPage, IonSearchbar } from '@ionic/react';
import React from 'react';
import CategoryCard from '../components/Cards/CategoryCard';
import BaseToolbar from '../components/Menu/BaseToolbar';

interface MyProps {
    categoryClickHandler: Function
    items: any[]
}

type MyState = {

}

class Categories extends React.Component<MyProps, MyState> {

    componentDidMount(){
        console.log("Categories component mounted")
    }
    
    componentDidUpdate(){
        console.log("Categories component updated")
    }
    render(){
        return (
            <IonPage>
                <IonHeader className="osahan-nav">
                    <BaseToolbar title="Categories"/>
                    <IonSearchbar className="pt-1" placeholder="Search for products"></IonSearchbar>      
                </IonHeader>

                <IonContent className="ion-padding my-address-page" color="dark">
                    {this.props.items && this.props.items.map(
                        (category: any) => {
                            return ( 
                                // <IonRouterLink routerLink={'/products/categories/'+category.id}>
                                    <CategoryCard
                                    id={category.id}
                                    key={category.id} 
                                    title={category.title} 
                                    uspText={category.metaDescription} 
                                    description={category.description}
                                    categoryClickHandler={this.props.categoryClickHandler}/>
                                /* </IonRouterLink> */
                            )
                        }
                    )}
                {/* <Route path="/categories/products:" component={Login} exact={true} />   */}
                </IonContent>
            </IonPage>
        );
    }
}

export default Categories;