import { IonContent, IonHeader, IonItem, IonPage, IonSearchbar } from '@ionic/react';
import React from 'react'
import ProductCard from '../components/Cards/ProductCard';
import BaseToolbar from '../components/Menu/BaseToolbar';

const ProductList = (props) => {
    return (
        <IonPage>
            <IonHeader className="osahan-nav">
                <BaseToolbar title="Products"/>
                <IonSearchbar className="pt-1" placeholder="Search for products"></IonSearchbar>      
            </IonHeader>            

            <IonContent color="dark">
                {props.items && props.items.map(
                    (product) =>{
                        return <ProductCard 
                                id={product.id}
                                key={product.id}
                                name={product.name}
                                originalPrice={product.variations[0].mrp}
                                discountPrice={product.variations[0].price}
                                discount={product.discount}
                                unitLabel={product.unitLabel}   
                                productClickHandler={props.productClickHandler} />

                    }
                )}
            </IonContent>
        </IonPage>        
    )
}

export default ProductList;