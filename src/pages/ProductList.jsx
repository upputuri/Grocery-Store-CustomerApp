import { IonContent, IonHeader, IonPage, IonSearchbar } from '@ionic/react';
import Client from 'ketting';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import ProductCard from '../components/Cards/ProductCard';
import BaseToolbar from '../components/Menu/BaseToolbar';
import { serviceBaseURL } from '../components/Utilities/ServiceCaller';

const ProductList = () => {

    const [data, setData] = useState(null);
    const [resource, setResource] = useState(null);
    const history = useHistory();

    const search = useLocation().search;

    let loadProducts = async (category) => {
        let path = serviceBaseURL+'/products?category='+category;

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
        let path = serviceBaseURL+'/products?category='+cat;
        if (resource !== null && path.localeCompare(resource.uri) === 0)
            return;        
        loadProducts(cat);
    });


    const viewProductDetail = (id) =>
    {   
        history.push('/products/single/'+id);
    }

 
    return (
            <IonPage>
                <IonHeader className="osahan-nav">
                    <BaseToolbar title="Products"/>
                    <IonSearchbar className="pt-1" placeholder="Search for products"></IonSearchbar>      
                </IonHeader>            
        
                <IonContent color="dark">
                    {data && data.map(
                        (product) =>{
                            return <ProductCard 
                                    productId={product.id}
                                    key={product.id}
                                    name={product.name}
                                    variationId={product.variations[0].id}
                                    originalPrice={product.variations[0].mrp}
                                    discountPrice={product.variations[0].price}
                                    discount={product.discount}
                                    unitLabel={product.unitLabel}   
                                    productClickHandler={viewProductDetail} />
        
                        }
                    )}
                </IonContent>
            </IonPage>        
        )

}

export default ProductList;