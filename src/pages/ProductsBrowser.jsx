import Client from 'ketting';
import React from 'react';
import { Route, Switch } from 'react-router';
import { serviceBaseURL } from '../components/Utilities/ServiceCaller.ts';
import Cart from './Cart';
import Categories from './Categories';
import ProductList from './ProductList';
import SingleProduct from './SingleProduct';

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
        categories: {
            data: [],
            resource: {},
        }
    }

    componentDidMount(){
        console.log("ProductBrowser component mounted")
        this.loadCategories();
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
        this.props.history.push('/products/list?category='+id);
    }

    render() {
        return (
        <Switch>
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

        </Switch>
        )
    }
}

export default ProductsBrowser;