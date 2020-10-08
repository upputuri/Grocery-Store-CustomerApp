import { IonContent, IonItem } from '@ionic/react';
import React from 'react'
import ProductCard from '../components/Cards/ProductCard';

const ProductList = (props) => {
    return (
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
    )
}

export default ProductList;