import { IonContent, IonLabel } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router';
import AddressTile from '../Cards/AddressTile';
import InfoMessageTile from '../Cards/InfoMessageTile';

const DeliveryOptions = (props) => {
    const history = useHistory();
    const selectOption = (addressId) => {
        props.addressSelectHandler(addressId);
    }

    return (
        <IonContent className="ion-padding" color="dark">
            {props.addresses && props.addresses.length > 0 ? props.addresses.map((address)=>{
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
            })
            :
            <InfoMessageTile subject="You have not added any addresses yet!"
                            leftButtonText="Manage Addresses"
                            leftButtonClickHandler={()=>history.push("/account/addresslist")}/>}
        </IonContent>
    )
}

export default DeliveryOptions;