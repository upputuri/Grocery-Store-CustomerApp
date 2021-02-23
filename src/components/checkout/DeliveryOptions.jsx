import { IonButton, IonCheckbox, IonContent, IonGrid, IonItem, IonText } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CartContext } from '../../App';
import AddressTile from '../Cards/AddressTile';
import AddressForm from '../forms/AddressForm';

const DeliveryOptions = (props) => {
    const [editingState, setEditingState] = useState(false);

    useEffect(()=>{
            if (!props.selectedDeliveryAddressId && props.addresses){
                const defaultAddress = props.addresses.find((e)=>e.default === true);
                if (defaultAddress) {
                    // alert(JSON.stringify(defaultAddress));
                    props.onDeliveryAddressSelected(defaultAddress.id, defaultAddress.zipcode, false);
                }
            }
    },[props.selectedDeliveryAddressId])

    const toggleBillingAddressSameSelection = (addressId) => {
        props.selectedBillingAddressId && props.selectedBillingAddressId === addressId ? props.onBillingAddressSelected(undefined) : props.onBillingAddressSelected(addressId);
    }

    const selectShippingAddress = (addressId, zipcode) => {
        props.onDeliveryAddressSelected(addressId, zipcode, true);
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
                    statesList={props.statesList} 
                    citiesList = {props.citiesList}  
                    submitClickHandler={addAddress}
                    backClickHandler={cancelEdit.bind(this, -1)}/>}

            {props.addresses && props.addresses.length > 0 && props.addresses.map((address)=>{
                return  <div key={address.id}>
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
                                    country={address.country}
                                    countryId={address.countryId}
                                    zipCode={address.zipcode}
                                    phone={address.phoneNumber} 
                                    selectedId={props.selectedDeliveryAddressId}
                                    selectedMessage='Selected for Delivery'
                                    selectClickHandler={selectShippingAddress.bind(this, address.id, address.zipcode)} />
                            {address.id === props.selectedDeliveryAddressId &&                 
                            <IonGrid className="text-center">
                                <IonItem color="night">
                                    <IonCheckbox slot="start" onClick={toggleBillingAddressSameSelection.bind(this, address.id)} checked={address.id === props.selectedBillingAddressId} />
                                    <IonText className="maintext" color="light">My Billing address is same</IonText>
                                </IonItem>
                            </IonGrid>}
                        </div>
                })}
        </IonContent>
    )
}

const mapStateToProps = (state) => {
    return {
        selectedDeliveryAddressId: state.orderState.deliveryAddressId,
        selectedBillingAddressId: state.orderState.billingAddressId
    }
}

export default connect(mapStateToProps)(DeliveryOptions);