import { IonContent } from '@ionic/react';
import React from 'react';
import CategoryCard from '../components/Cards/CategoryCard';

interface MyProps {
    categoryClickHandler: Function
    items: any[]
}

type MyState = {

}

class Categories extends React.Component<MyProps, MyState> {

    
    render(){
        return (
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
        );
    }
}

export default Categories;