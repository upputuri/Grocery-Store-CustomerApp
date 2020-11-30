import { IonButton, IonCheckbox, IonCol, IonContent, IonGrid, IonItem, IonRow, IonText, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import AddressTile from '../Cards/AddressTile';
import AddressForm from '../forms/AddressForm';

const DeliveryOptions = (props) => {
    const [editingState, setEditingState] = useState(false);

    const selectShippingAddress = (addressId) => {
        props.onDeliveryAddressSelected(addressId);
    }

    const selectBillingAddress = (addressId) => {
        props.onBillingAddressSelected(addressId);
    }

    const openNewAddressForm = () => {
        console.log("Opening address form for new address");
        setEditingState(true);
    }
    
    const addAddress = (newAddress) => {
        console.log("Opening address form for new address");
        props.addressAddHandler(newAddress);
        setEditingState(false);
    }

    const cancelEdit = (addressId) => {
        console.log("Cancelling edit operation for address +"+addressId);
        setEditingState(false); 
    }

    return (
        <IonContent className="ion-padding" color="dark">
            {/* <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonText color="light">Please select a shipping address</IonText>
                    </IonCol>
                </IonRow>
            </IonGrid> */}
            {!editingState ? <IonButton color="secondary" expand="block" onClick={openNewAddressForm} className="ion-no-margin">Add New Address</IonButton>
            :
            <AddressForm 
                    addressId={-1}
                    states={props.states}   
                    submitClickHandler={addAddress}
                    backClickHandler={cancelEdit.bind(this, -1)}/>}

            {props.addresses && props.addresses.length > 0 && props.addresses.map((address)=>{
                return  <div>
                            <AddressTile 
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
                                    selectedId={props.selectedDeliveryAddressId}
                                    selectedMessage='Selected for Delivery'
                                    selectClickHandler={selectShippingAddress.bind(this, address.id)} />
                            {address.id === props.selectedDeliveryAddressId &&                 
                            <IonGrid className="text-center">
                                <IonItem color="night">
                                    <IonCheckbox slot="start" onClick={selectBillingAddress.bind(this, address.id)} checked={address.id === props.selectedBillingAddressId} />
                                    <IonText className="maintext" color="primary">My Billing address is same</IonText>
                                </IonItem>
                            </IonGrid>}
                        </div>
                })}


        </IonContent>
    )
}

export default DeliveryOptions;