import { IonContent, IonLabel } from '@ionic/react';
import React from 'react';
import AddressTile from '../../components/Cards/AddessTile';

const DeliveryOptions = (props) => {

    const selectOption = (addressId) => {
        props.addressSelectHandler(addressId);
    }

    return (
        <IonContent color="dark">
            {props.addresses && props.addresses.map((address)=>{
                return <AddressTile 
                        addressId={address.id}
                        key={address.id}
                        fName={address.firstName}
                        lName={address.lastName}
                        line1={address.line1}
                        line2={address.line2}
                        city={address.city}
                        state={address.state}
                        stateId={address.stateId}
                        zipCode={address.zipcode}
                        phone={address.phoneNumber} 
                        selectedId={props.selectedAddressId}
                        selectClickHandler={selectOption.bind(this, address.id)}
                />
            })}
        </IonContent>
    )
}

export default DeliveryOptions;