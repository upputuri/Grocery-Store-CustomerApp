import { IonAlert, IonButton, IonContent, IonHeader, IonLoading, IonPage } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { LoginContext } from '../../../App';
import AddressTile from '../../../components/Cards/AddressTile';
import AddressForm from '../../../components/forms/AddressForm';
import BaseToolbar from '../../../components/Menu/BaseToolbar';
import { clientConfig } from '../../../components/Utilities/AppCommons';
import { serviceBaseURL } from '../../../components/Utilities/ServiceCaller';

const AddressList = () => {
    const [addressListState, setAddressListState] = useState(null);
    // const [statesList, setStatesList] = useState(null);
    const [citiesList, setCitiesList] = useState([]);
    const [addressTypesState, setAddressTypesState] = useState({});
    const [pinCodesList, setPinCodesList] = useState([]);
    const [editableAddressId, setEditableAddressId] = useState(0);
    const [loadingState, setLoadingState] = useState(false);
    const [serviceRequestAlertState, setServiceRequestAlertState] = useState({show: false, msg: ''});
    const [deleteAlertState, setDeleteAlertState] = useState({show: false, msg: 'Are you sure you want to delete the address?', addressId: 0});
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const [retryState, setRetryState] = useState(false);
    const loginContext = useContext(LoginContext);
    const history = useHistory();

    useEffect(() => {
        loadAddressList();
        loadCities();
        loadLabels();
        // loadStatesList();

    }, [retryState]);

    // const loadStatesList = async () => {
    //     let path = serviceBaseURL + '/application/states';
    //     const client = new Client(path);
    //     const resource = client.go();
    //     setLoadingState(true);
    //     console.log("Making service call: "+resource.uri);
    //     let receivedState;
    //     try{
    //         receivedState = await resource.get();
    //     }
    //     catch(e)
    //     {
    //         console.log("Service call failed with - "+e);
    //         setLoadingState(false);
    //         setServiceRequestAlertState({show: true, msg: e.toString()});
    //         return;
    //     }
    //     // alert(JSON.stringify(receivedState));
    //     const states = receivedState.getEmbedded().map((state) => state.data);
    //     console.log("Loaded states from server");
    //     // alert(JSON.stringify(states));
    //     setStatesList(states);
    // }

    const loadCities = async () => {
        const client = new Client(serviceBaseURL+'/stores/covers/cities');
        const resource = client.go();
        console.log("Making service call: "+resource.uri);
        let receivedData;
        try{
            receivedData = await resource.get();
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            return;
        }
        // alert(JSON.stringify(receivedData));
        console.log("Received response from service call: "+resource.uri);
        const cities = receivedData.getEmbedded().map((cityState) => cityState.data);
        // alert(JSON.stringify(cities));
        // console.log(images);
        setCitiesList(cities);
    }

    const loadLabels = async () => {
        const client = new Client(serviceBaseURL+'/application/addresstypes');
        const resource = client.go();
        console.log("Making service call: "+resource.uri);
        let receivedData;
        try{
            receivedData = await resource.get();
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            return;
        }
        // alert(JSON.stringify(receivedData));
        console.log("Received response from service call: "+resource.uri);
        const addressTypes = receivedData.data.types;
        // alert(JSON.stringify(cities));
        // console.log(images);
        setAddressTypesState(addressTypes);
        // alert(JSON.stringify(addressTypes));
    }
    // const loadPinCodes = async (city) => {
    //     const client = new Client(serviceBaseURL+'/stores/covers/'+city+'/pincodes');
    //     const resource = client.go();
    //     console.log("Making service call: "+resource.uri);
    //     let receivedData;
    //     try{
    //         receivedData = await resource.get();
    //     }
    //     catch(e)
    //     {
    //         console.log("Service call failed with - "+e);
    //         return;
    //     }
    //     // alert(JSON.stringify(receivedData));
    //     console.log("Received response from service call: "+resource.uri);
    //     const pinCodes = receivedData.getEmbedded().map((pinCodeState) => pinCodeState.data);
    //     // alert(JSON.stringify(covers));
    //     // console.log(images);
    //     setPinCodesList(pinCodes);
    // }

    const loadAddressList = async () => {
        let path = serviceBaseURL + '/customers/'+loginContext.customer.id+'/addresses';
        const client = new Client(path);
        const resource = client.go();
        const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
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
        const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
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
    }

    const updateAddressRequest = async (address) => {
        console.log("Updating address: "+JSON.stringify(address));
        let path = serviceBaseURL + '/customers/'+loginContext.customer.id+'/addresses/'+address.id;
        const client = new Client(path);
        const resource = client.go();
        const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
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
    }

    const deleteAddressRequest = async (addressId) => {
        console.log("Updating addressId: "+JSON.stringify(addressId));
        let path = serviceBaseURL + '/customers/'+loginContext.customer.id+'/addresses/'+addressId;
        const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
        setLoadingState(true);
        let response;
        try{
            response = await fetch(path, {method: 'DELETE',
                            headers: loginHeaders});
        }
        catch(e)
        {
            console.log("Service call failed with - "+e); 
            setLoadingState(false);
            setInfoAlertState({show: true, msg: clientConfig.connectivityErrorAlertMsg});
            return;
        }
        if (response.ok){
            console.log("Deleted address on server - address Id "+addressId);
            setInfoAlertState({show: true, msg: "Address deleted!"});
            setLoadingState(false);   
            return Promise.resolve(true);       
        }
        else {
            let responseObj = await response.json();
            console.log("Server returned a failure response to address delete request :"+responseObj.message);
            setInfoAlertState({show: true, msg: responseObj.message});
            setLoadingState(false); 
            return Promise.resolve(false);         
        }
    }

    const addAddress = () => {
        console.log("Opening address form for new address, addressId is -1");
        setEditableAddressId(-1);
    }

    const editAddress = (addressId) => {
        console.log("Making address editable "+addressId);
        setEditableAddressId(addressId);
    }

    const deleteAddress = async (addressId) => {
        console.log("Deleting address :"+addressId);
        await deleteAddressRequest(addressId);
        loadAddressList();
    }

    const checkAndProceedToDeletion = (addressId) => {
        setDeleteAlertState({...deleteAlertState, show: true, addressId: addressId});
    }

    const cancelEdit = (addressId) => {
        console.log("Cancelling edit operation for address +"+addressId);
        setEditableAddressId(0);
    }

    const saveEditedAddress = async (address) => {
        setLoadingState(true);
        //Send service request
        console.log("Saving edited address with Id "+ address.id);
        if (address.id === -1){
            await createAddressRequest(address);
            loadAddressList();
        }
        else{
            await updateAddressRequest(address);
            loadAddressList(); 
        }
        setEditableAddressId(0);
        setLoadingState(false);
    }

    if (addressListState !== null) {
        return (
            <IonPage>
                <IonHeader className="osahan-nav border-white border-bottom">
                    <BaseToolbar title="Manage Addresses"/>     
                </IonHeader>
                <IonLoading isOpen={loadingState}/>
                <IonAlert isOpen={infoAlertState.show}
                            onDidDismiss={()=> setInfoAlertState(false)}
                            header={''}
                            cssClass='groc-alert'
                            message={infoAlertState.msg}
                            buttons={['OK']}/>
                <IonAlert isOpen={deleteAlertState.show}
                            onDidDismiss={()=> setDeleteAlertState({...deleteAlertState, show: false})}
                            header={''}
                            cssClass='groc-alert'
                            message={deleteAlertState.msg}
                            buttons={[{text: 'Yes', handler: deleteAddress.bind(this, deleteAlertState.addressId)}, 'No']}/>             
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
                                    // states={statesList}
                                    citiesList={citiesList}   
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
                                default={address.default}
                                label={address.type}
                                labelId={address.typeId}
                                addressTypes={addressTypesState}
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
                                deleteClickHandler={checkAndProceedToDeletion.bind(this, address.id)}
                                updateAddressHandler={saveEditedAddress}
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
                                // state={address.state}
                                // stateId={address.stateId}
                                zipCode={address.zipcode}
                                phone={address.phoneNumber}
                                // states={statesList}
                                citiesList={citiesList}   
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
                <IonHeader className="osahan-nav border-white border-bottom">
                    <BaseToolbar title="Manage Addresses"/>     
                </IonHeader>
                <IonLoading isOpen={loadingState}/>                
                <IonContent color="dark">
                    <IonAlert
                        isOpen={serviceRequestAlertState.show}
                        header={'Error'}
                        cssClass='groc-alert'
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