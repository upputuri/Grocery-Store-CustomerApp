import { IonAlert, IonContent, IonHeader, IonLoading, IonPage } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { LoginContext } from '../../../App';
import AddressTile from '../../../components/Cards/AddessTile';
import AddressForm from '../../../components/forms/AddressForm';
import BaseToolbar from '../../../components/Menu/BaseToolbar';
import { serviceBaseURL } from '../../../components/Utilities/ServiceCaller';
import './address.css'

const AddressList = () => {
    const [addressListState, setAddressListState] = useState(null);
    const [editableAddressId, setEditableAddressId] = useState(0);
    const [loadingState, setLoadingState] = useState(false);
    const [serviceRequestAlertState, setServiceRequestAlertState] = useState({show: false, msg: ''});
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const [retryState, setRetryState] = useState(false);
    const loginContext = useContext(LoginContext);
    const history = useHistory();

    useEffect(() => {
        loadAddressList();
        loadStatesList();
    }, [retryState]);

    const loadStatesList = () => {
        
    }

    const loadAddressList = async () => {
        let path = serviceBaseURL + '/customers/'+loginContext.customer.id+'/addresses';
        const client = new Client(path);
        const resource = client.go();
        const authHeaderBase64Value = btoa(loginContext.customer.email+':'+loginContext.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        let receivedState;
        try{
            receivedState = await resource.get({
                headers: loginHeaders
            });
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            if (e.status && e.status === 401)//Unauthorized
            {
                history.push("/login");
                return;
            } 
            setLoadingState(false);
            setServiceRequestAlertState({show: true, msg: e.toString()});
            return;
        }
        // alert(JSON.stringify(receivedState));
        const addresses = receivedState.getEmbedded().map((addressState) => addressState.data);
        // alert(JSON.stringify(addresses));
        setAddressListState(addresses);
        console.log("Loaded addresses from server");
        setLoadingState(false);  
    }

    const editAddress = (addressId) => {
        console.log("Making address editable "+addressId);
        setEditableAddressId(addressId);
    }

    const saveEditedAddress = (address) => {
        //Send service request
    }

    if (addressListState !== null) {
        return (
            <IonPage>
                <IonHeader className="osahan-nav">
                    <BaseToolbar title="Shipping Addresses"/>     
                </IonHeader>
                <IonLoading isOpen={loadingState}/>
                <IonAlert isOpen={infoAlertState.show}
                            onDidDismiss={()=> setInfoAlertState(false)}
                            header={''}
                            message={infoAlertState.msg}
                            buttons={['OK']}/>
                <IonContent color="dark">
                    {addressListState && addressListState.map(
                        (address) =>{
                            console.log(editableAddressId+","+address.id)
                            return editableAddressId !== address.id ? <AddressTile 
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
                                    editClickHandler={editAddress.bind(this, address.id)}
                                    />
                                :
                                    <AddressForm 
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
                                    submitClickHandler={saveEditedAddress.bind(this, address.id)}
                                    />
        
                        }
                    )}
                </IonContent>
            </IonPage>            
        )
    }
    else {
        console.log("show alert "+serviceRequestAlertState.show);
            return (
            <IonPage>
                <IonHeader className="osahan-nav">
                    <BaseToolbar title="Shipping Addresses"/>     
                </IonHeader>
                <IonLoading isOpen={loadingState}/>                
                <IonContent color="dark">
                    <IonAlert
                        isOpen={serviceRequestAlertState.show}
                        header={'Error'}
                        subHeader={serviceRequestAlertState.msg}
                        message={'Failed to load'}
                        buttons={[{text: 'Cancel', 
                                    handler: ()=>{history.push('/home')}
                                }, {text: 'Retry', 
                                    handler: ()=>{setServiceRequestAlertState({show: false, msg: ''}); setRetryState(!retryState)}}]}
                    />
                </IonContent>
            </IonPage>
        )
    }        
        
}
export default AddressList;