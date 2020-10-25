import { IonContent, IonHeader, IonPage, IonSearchbar } from '@ionic/react';
import Client from 'ketting';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import ProductCard from '../Cards/ProductCard';
import BaseToolbar from '../Menu/BaseToolbar';
import GrocSearch from '../Menu/GrocSearch';
import { serviceBaseURL } from '../Utilities/ServiceCaller';

const ProductList = () => {

    const [data, setData] = useState(null);
    const [resource, setResource] = useState(null);
    const [query, setQuery] = useState('');
    const history = useHistory();

    const search = useLocation().search;

    let loadProducts = async (query) => {
        let path = serviceBaseURL+'/products?'+query;     

        console.log("Loading products from server");
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
        console.log("Loaded products from server");
        // alert(JSON.stringify(products));
        setData(products);
        setResource(resource);
    }

    useEffect(()=>{
        const cat = new URLSearchParams(search).get('category');
        const keywords = new URLSearchParams(search).get('keywords');
        let query = cat && cat.length>0 ? 'category='+cat : 'category=';
        query = keywords && keywords.length>0 ? query+'&keywords='+keywords : query+'&keywords=';
        loadProducts(query);
    },[query]);


    const viewProductDetail = (id) =>
    {   
        history.push('/products/single/'+id);
    }

 
    return (
            <IonPage>
                <IonHeader className="osahan-nav">
                    <BaseToolbar title="Products"/>
                    <GrocSearch/>      
                </IonHeader>            
        
                <IonContent color="dark">
                    {data && data.map(
                        (product) =>{
                            return <ProductCard 
                                    productId={product.id}
                                    key={product.id}
                                    name={product.name}
                                    variationId={product.variations[0].id}
                                    originalPrice={product.variations[0].price}
                                    discountPrice={product.variations[0].priceAfterDiscount}
                                    discount={product.discount}
                                    unitLabel={product.variations[0].name}   
                                    productClickHandler={viewProductDetail} />
        
                        }
                    )}
                </IonContent>
            </IonPage>        
        )

}

export default ProductList;