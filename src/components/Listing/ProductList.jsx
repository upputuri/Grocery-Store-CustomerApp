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
    const [pageOffset, setPageOffset] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [totalCount, setTotalCount] = useState(0);
    const [query, setQuery] = useState('');
    const history = useHistory();
    const search = useLocation().search;
    
    let loadProducts = async (query) => {
        let path = serviceBaseURL+'/products'+query;     
        
        console.log("Making service call: "+path);
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
        const products = productListState.data.products;
        console.log("Loaded products from server");
        // alert(JSON.stringify(products));
        setData(products);
    }
    
    useEffect(()=>{
        // const cat = new URLSearchParams(search).get('category');
        // const keywords = new URLSearchParams(search).get('keywords');
        // const sortKey = new URLSearchParams()
        // let queryString = cat && cat.length>0 ? 'category='+cat : 'category=';
        // queryString = keywords && keywords.length>0 ? queryString+'&keywords='+keywords : queryString+'&keywords=';
        let queryString = search;
        if (query.localeCompare(queryString) !== 0){
            setQuery(queryString);
            loadProducts(queryString);
        }
    });


    const viewProductDetail = (id) =>
    {   
        history.push('/products/single/'+id);
    }

    console.log("Rendering product list");
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
                                    image={product.images[0]}
                                    variationId={product.variations[0].id}
                                    originalPrice={product.variations[0].price}
                                    discountPrice={product.variations[0].priceAfterDiscount}
                                    discount={product.discount}
                                    inStock={product.variations[0].inStock}
                                    unitLabel={product.variations[0].name}   
                                    productClickHandler={viewProductDetail} />
        
                        }
                    )}
                </IonContent>
            </IonPage>        
        )

}

export default ProductList;