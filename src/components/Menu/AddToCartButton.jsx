import { IonButton } from '@ionic/react';
import React from 'react';
import { withCartUpdateOps } from './HOCs';


const AddToCartButton = (props) => {
    return (
        <div className="">
            <IonButton 
                onClick={(event) => {props.addQty(1); event.stopPropagation()}} 
                color="secondary" shape="round">Add</IonButton>
        </div>
    )
}

export default withCartUpdateOps(AddToCartButton);