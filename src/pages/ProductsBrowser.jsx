import { IonBadge, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonRouterLink, IonRouterOutlet, IonSearchbar, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import React from 'react';
import { Route } from 'react-router';
import ProductCard from '../components/Cards/ProductCard';
import Categories from './Categories';
import SingleProduct from './SingleProduct';
import { cartOutline as cartOutlineIcon} from 'ionicons/icons'
import { RouteComponentProps } from 'react-router-dom';
import Client, { Resource } from 'ketting';
import ProductList from './ProductList';
import { CartContext, LoginContext } from '../App';
import Cart from './Cart';
import BaseToolbar from '../components/Menu/BaseToolbar';
import { serviceBaseURL } from '../components/Utilities/ServiceCaller.ts'

// interface MyProps extends RouteComponentProps {

// }

// type MyState = {
//     resource: any,
//     products: any[],
//     query: string,
//     categories: any
// }

class ProductsBrowser extends React.Component {

    state = {
        resource: null,
        products: [],
        query: 'category=all',
        
        categories: {
            data: [],
            resource: {},
        }
    }

    componentDidMount(){
        this.loadCategories();
    }

    componentDidUpdate(){
        //Fetch products using query
        this.loadProducts();
    }
    
    async loadProducts(){
        const path = serviceBaseURL+'/products?'+this.state.query;
        if (this.state.resource !== null && path.localeCompare(this.state.resource.uri) === 0)
            return;

        const client = new Client(path);
        const resource = client.go();
        let productListState;
        try{
            productListState = await resource.get();
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            return;
        }
        const products = productListState.getEmbedded().map((productState) => productState.data);
        // alert(JSON.stringify(products));
        this.setState({
            products: products,
            resource: resource
        })
    }
    
    async loadCategories(){
        // let serviceRequest = new ServiceRequest();
        // let categories = await serviceRequest.listCategories();
        // categories && this.setState({categories});\
        const client = new Client(serviceBaseURL+'/products/categories');
        const resource = client.go();
        let categoriesState;
        try{
            categoriesState = await resource.get();
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            return;
        }
        // alert(JSON.stringify(categoriesState));
        const categoriesListState = categoriesState.getEmbedded();
        const categories = categoriesListState.map((categoryState) => categoryState.data)
        categories && (
            this.setState({
                categories:{
                    data: categories,
                    resource: resource
                }
            })
            );
            
            
    }
    
    listProductsOfCategory= (id) =>
    {
        // alert("listing products in categ: "+id);
        this.props.history.push('/products/list');
        let newQuery = 'category='+id;
        if (this.state.query.localeCompare(newQuery) != 0)
        {
            this.setState({query: newQuery});
        }
    }

    viewProductDetail = (id) =>
    {   
        this.props.history.push('/products/single/'+id);
    }

    render() {
        return (
        <IonRouterOutlet>
                    <Route path="/products/categories" render={
                                                        (props)=><Categories 
                                                                items={this.state.categories.data} 
                                                                categoryClickHandler={this.listProductsOfCategory}/>} exact={true} /> 

                    <Route path="/products/list" render={
                                                        (props)=><ProductList
                                                                items={this.state.products}
                                                                productClickHandler={this.viewProductDetail}/>} exact={true} />  

                    <Route path="/products/single/:productId" component={SingleProduct} exact={true} />

                    <Route path="/products/cart/:customerId" component={Cart} exact={true} />

        </IonRouterOutlet>
        )
    }
}

export default ProductsBrowser;