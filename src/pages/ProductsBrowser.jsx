import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import ProductList from '../components/Listing/ProductList';
import Categories from './Categories';
import SingleProduct from './SingleProduct';
import Cart from './userdata/Cart';

class ProductsBrowser extends React.Component {
    
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
                                                                categoryClickHandler={this.listProductsOfCategory}/>} exact={true} /> 

                    <Route path="/products/list" component={ProductList} exact={true} />

                    {/* <Redirect path="/products/list/reload" to={ProductList} exact={true} /> */}
                    {/* <Route exact path="/products/list/reload" render={() => <Redirect to="/products/list" />} />    */}

                    <Route path="/products/single/:productId" component={SingleProduct} exact={true} />
                    
                    <Route path="/products/cart/:customerId" component={Cart} exact={true} />

        </Switch>
        )
    }
}

export default ProductsBrowser;