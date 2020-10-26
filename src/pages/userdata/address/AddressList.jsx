import { IonAlert, IonButton, IonContent, IonHeader, IonLoading, IonPage } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { LoginContext } from '../../../App';
import AddressTile from '../../../components/Cards/AddessTile';
import AddressForm from '../../../components/forms/AddressForm';
import BaseToolbar from '../../../components/Menu/BaseToolbar';
import { serviceBaseURL } from '../../../components/Utilities/ServiceCaller';

const AddressList = () => {
    const [addressListState, setAddressListState] = useState(null);
    const [statesList, setStatesList] = useState(null);
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

    const loadStatesList = async () => {
        let path = serviceBaseURL + '/application/states';
        const client = new Client(path);
        const resource = client.go();
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        let receivedState;
        try{
            receivedState = await resource.get();
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            setLoadingState(false);
            setServiceRequestAlertState({show: true, msg: e.toString()});
            return;
        }
        // alert(JSON.stringify(receivedState));
        const states = receivedState.getEmbedded().map((state) => state.data);
        console.log("Loaded states from server");
        // alert(JSON.stringify(states));
        setStatesList(states);
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

    const createAddressRequest = async (address) => {
        console.log("Creating address: "+JSON.stringify(address));
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
            receivedState = await resource.post({
                data: address,
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
        console.log("Updated address on server - address Id "+address.id);
        setLoadingState(false);          
    }

    const updateAddressRequest = async (address) => {
        console.log("Updating address: "+JSON.stringify(address));
        let path = serviceBaseURL + '/customers/'+loginContext.customer.id+'/addresses/'+address.id;
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
            receivedState = await resource.put({
                data: address,
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
        console.log("Updated address on server - address Id "+address.id);
        setLoadingState(false);          
    }

    const addAddress = () => {
        console.log("Opening address form for new address, addressId is -1");
        setEditableAddressId(-1);
    }

    const editAddress = (addressId) => {
        console.log("Making address editable "+addressId);
        setEditableAddressId(addressId);
    }

    const cancelEdit = (addressId) => {
        console.log("Cancelling edit operation for address +"+addressId);
        setEditableAddressId(0);
    }

    const saveEditedAddress = (address) => {
        //Send service request
        console.log("Saving edited address with Id "+ address.id);
        address.id === -1 ?
        createAddressRequest(address).then(()=>{loadAddressList(); setEditableAddressId(0)})
        :
        updateAddressRequest(address).then(()=>{loadAddressList(); setEditableAddressId(0)});
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
                <IonContent className="ion-padding" color="dark">
                {editableAddressId !== -1 ?
                <IonButton color="secondary" expand="block" onClick={addAddress} className="ion-no-margin">Add New Address</IonButton>
                :
                <AddressForm 
                                    addressId={-1}
                                    // key={address.id}
                                    // fName={address.firstName}
                                    // lName={address.lastName}
                                    // line1={address.line1}
                                    // line2={address.line2}
                                    // city={address.city}
                                    // state={address.state}
                                    // stateId={address.stateId}
                                    // zipCode={address.zipcode}
                                    // phone={address.phoneNumber}
                                    states={statesList}   
                                    submitClickHandler={saveEditedAddress}
                                    backClickHandler={cancelEdit.bind(this, -1)}
                                    />
                }
                {addressListState && addressListState.map(
                    (address) =>{
                        // console.log(editableAddressId+","+address.id)
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
                                states={statesList}   
                                submitClickHandler={saveEditedAddress}
                                backClickHandler={cancelEdit.bind(this, address.id)}
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