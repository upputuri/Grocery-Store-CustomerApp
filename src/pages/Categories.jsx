import { IonContent, IonHeader, IonLoading, IonPage, IonSearchbar } from '@ionic/react';
import Client from 'ketting';
import React, { useEffect, useState } from 'react';
import CategoryCard from '../components/Cards/CategoryCard';
import BaseToolbar from '../components/Menu/BaseToolbar';
import GrocSearch from '../components/Menu/GrocSearch';
import { serviceBaseURL } from '../components/Utilities/ServiceCaller';


const Categories = (props) => {

    const [categoriesState, setCategoriesState] = useState(null);
    const [showLoading, setShowLoading] = useState(false);
    useEffect(()=>{
        loadCategories();
    }, [])
    
    const loadCategories = async () => {
        // let serviceRequest = new ServiceRequest();
        // let categories = await serviceRequest.listCategories();
        // categories && this.setState({categories});\
        setShowLoading(true);
        const client = new Client(serviceBaseURL+'/products/categories');
        const resource = client.go();
        let categoriesState;
        try{
            console.log("Making service call: "+resource.uri);
            categoriesState = await resource.get();
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            setShowLoading(false);
            return;
        }
        // alert(JSON.stringify(categoriesState));
        console.log("Received response from service call: "+resource.uri);
        const categoriesListState = categoriesState.getEmbedded();
        const categories = categoriesListState.map((categoryState) => categoryState.data)
        setCategoriesState(categories);
        setShowLoading(false);       
    }

    return (
        <IonPage>
            <IonHeader className="osahan-nav border-white border-bottom">
                <BaseToolbar title="Categories"/>
                <GrocSearch/>     
            </IonHeader>
            <IonLoading isOpen={showLoading}/>
            <IonContent className="ion-padding" color="dark">
                {categoriesState && categoriesState.map(
                    (category) => {
                        return ( 
                            // <IonRouterLink routerLink={'/products/categories/'+category.id}>
                                <CategoryCard
                                id={category.id}
                                key={category.id} 
                                title={category.title}
                                image={category.image} 
                                uspText={category.metaDescription} 
                                categoryClickHandler={props.categoryClickHandler}/>
                            /* </IonRouterLink> */
                        )
                    }
                )}
            {/* <Route path="/categories/products:" component={Login} exact={true} />   */}
            </IonContent>
        </IonPage>
    );

}

export default Categories;