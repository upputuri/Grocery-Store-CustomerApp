import { IonAlert, IonButton, IonButtons, IonCheckbox, IonContent, IonDatetime, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonList, IonLoading, IonMenuButton, IonPage, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { LoginContext, TransactionContext } from '../../App';
import { clientConfig, calculateAge } from '../../components/Utilities/AppCommons';
import RazorPayService from '../../components/Utilities/RazorPayService';
import { logoURL, serviceBaseURL } from '../../components/Utilities/ServiceCaller';
import NomineeForm from './NomineeForm';

const MembershipForm = () => {
    const loginContext = useContext(LoginContext);
    const transactionContext = useContext(TransactionContext);
    const history = useHistory();

    const [currentFormState, setCurrentFormState] = useState('member');
    const [relationshipsState, setRelationshipsState] = useState(undefined);

    const [memberEmailState, setMemberEmailState] = useState(loginContext.customer.email);
    const [memberMobileState, setMemberMobileState] = useState(loginContext.customer.mobile);
    const [memberAltMobileState, setMemberAltMobileState] = useState(undefined);
    const [memberFNameState, setMemberFNameState] = useState(loginContext.customer.fname);
    const [memberLNameState, setMemberLNameState] = useState(loginContext.customer.lname);
    const [memberDobState, setMemberDobState] = useState(loginContext.customer.dob);
    const [memberGenderState, setMemberGenderState] = useState(loginContext.customer.gender);
    const [memberPresentAddressState, setMemberPresentAddressState] = useState(undefined);
    const [memberPresentPinCodeState, setMemberPresentPinCodeState] = useState(undefined);
    const [memberAdhaarFrontImgState, setMemberAdhaarFrontImgState] = useState(undefined);
    const [memberAdhaarBackImgState, setMemberAdhaarBackImgState] = useState(undefined);
    const [memberPhotoImgState, setMemberPhotoImgState] = useState(undefined);

    const [nomineeEmailState, setNomineeEmailState] = useState(undefined);
    const [nomineeMobileState, setNomineeMobileState] = useState(loginContext.customer.mobile);
    const [nomineeAltMobileState, setNomineeAltMobileState] = useState(undefined);
    const [nomineeFNameState, setNomineeFNameState] = useState(undefined);
    const [nomineeLNameState, setNomineeLNameState] = useState(undefined);
    const [nomineeDobState, setNomineeDobState] = useState(undefined);
    const [nomineeGenderState, setNomineeGenderState] = useState(undefined);
    const [nomineeRelationshipState, setNomineeRelationshipState] = useState(undefined);
    // const [nomineePresentAddressState, setNomineePresentAddressState] = useState(undefined);
    // const [nomineePresentPinCodeState, setNomineePresentPinCodeState] = useState(undefined);
    const [nomineeAdhaarFrontImgState, setNomineeAdhaarFrontImgState] = useState(undefined);
    const [nomineeAdhaarBackImgState, setNomineeAdhaarBackImgState] = useState(undefined);
    const [nomineePhotoImgState, setNomineePhotoImgState] = useState(undefined);

    const [errorState, setErrorState] = useState('');
    const [acceptedState, setAcceptedState] = useState(false);
    const [loadingState, setLoadingState] = useState(false);
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const [submitConfirmAlertState, setSubmitConfirmAlertState] = useState({show: false, msg: 'Are you ready to make the payment?'});
    
    const [transactionState, setTransactionState] = useState(undefined);

    const search = useLocation().search;
    const planId = new URLSearchParams(search).get('planid');
    const planName = new URLSearchParams(search).get('planname');
    const catName = new URLSearchParams(search).get('categoryname');

    useEffect(()=>{
        loadRelationships();
    },[]);
    
    const loadRelationships = async () => {
        let path = serviceBaseURL + '/membership/relationships';
        const client = new Client(path);
        const resource = client.go();
        // const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
        // const loginHeaders = new Headers();
        // loginHeaders.append("Content-Type", "application/json");
        // loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        let receivedState;
        try{
            receivedState = await resource.get({
                // headers: loginHeaders,
            });
        }
        catch(e)
        {
            setLoadingState(false);
            setInfoAlertState({show: true, msg: clientConfig.connectivityErrorAlertMsg});
            return;
        }
        // console.log(JSON.stringify(receivedState));
        const relationshipsState = receivedState.getEmbedded();
        const relationships = relationshipsState.map((relationship) => relationship.data);
        setRelationshipsState(relationships);
        console.log("Request successful on server");
        setLoadingState(false); 
    }

    const toggleAccept = () => {
        setAcceptedState(!acceptedState);
    }

    const setMemberEmail = (event) => {
        setMemberEmailState(event.detail.value);
        setErrorState('');
    }

    const setMemberFirstName = (event) => {
        setMemberFNameState(event.detail.value);
        setErrorState('');
    }

    const setMemberLastName = (event) => {
        setMemberLNameState(event.detail.value);
        setErrorState('');
    }

    const setMemberDob = (event) => {
        let dateStr = event.detail.value;
        dateStr = dateStr ? dateStr.substring(0,10) : '';
        setMemberDobState(dateStr);
        // alert(isMemberAgeWithinRange(event.detail.value));
        setErrorState('');
    }

    const setNomineeDob = (event) => {
        let dateStr = event.detail.value;
        dateStr = dateStr ? dateStr.substring(0,10) : '';
        setNomineeDobState(dateStr);
        // alert(isMemberAgeWithinRange(event.detail.value));
        setErrorState('');
    }

    const setMemberGender = (event) => {
        // alert(event.detail.value)
        setMemberGenderState(event.detail.value);
        setErrorState('');
    }

    const setMemberMobile = (event) => {
        setMemberMobileState(event.detail.value);
        setErrorState('');
    }

    const setMemberAltMobile = (event) => {
        setMemberAltMobileState(event.detail.value);
        setErrorState('');
    }

    const setMemberPresentAddress = (event) => {
        setMemberPresentAddressState(event.detail.value);
        setErrorState('');
    }

    const setMemberPresentPinCode = (event) => {
        setMemberPresentPinCodeState(event.detail.value);
        setErrorState('');
    }
  
    const toggleForm = () => {
        if (currentFormState === 'member') {
            if(!isMemberFormInputValid())
            {
                return;
            }
        }
        setErrorState('');
        currentFormState === 'member' ? setCurrentFormState('nominee') : setCurrentFormState('member');
    }
    
    const isMemberAgeWithinRange = () => {
        const minAge = clientConfig.membershipMemberMinAge;
        const maxAge = clientConfig.membershipMemberMaxAge;
        console.log("member dob is "+memberDobState);
        const age = calculateAge(memberDobState);
        console.log("age is "+age);
        if (age >= minAge && age <= maxAge) {
            return true;
        }
        return false;
    }
 
    const isNomineeAgeWithinRange = () => {
        const minAge = clientConfig.membershipNomineeMinAge;
        const maxAge = clientConfig.membershipNomineeMaxAge;
        const age = calculateAge(memberDobState);
        if (age >= minAge && age <= maxAge) {
            return true;
        }
        return false;
    }

    
    const isMemberFormInputValid = () => {
        return ((memberFNameState && memberFNameState.trim().length > 1) || setErrorState("Please enter First Name")) &&
        ((memberLNameState && memberLNameState.trim().length > 0) || setErrorState("Please enter Last Name")) &&
        ((memberMobileState && memberMobileState.trim().length > 0) || setErrorState("Please enter Mobile No.")) &&
        ((memberDobState && memberDobState.trim().length > 0) || setErrorState("Please input date of birth")) &&
        ((isMemberAgeWithinRange()) || setErrorState("Member must be between 18 years and 29 years old")) &&
        ((memberGenderState && memberGenderState.trim().length > 0) || setErrorState("Please input valid Gender")) &&
        ((memberAltMobileState && memberAltMobileState.trim().length > 0) || setErrorState("Please input alternate Mobile No.")) &&
        ((memberPresentAddressState && memberPresentAddressState.trim().length > 0) || setErrorState("Please input present address")) &&
        ((memberPresentPinCodeState && memberPresentPinCodeState.trim().length > 0) || setErrorState("Please input present pin code")) &&
        ((memberAdhaarFrontImgState && memberAdhaarFrontImgState.trim().length > 0) || setErrorState("Please upload adhaar front page")) &&
        ((memberAdhaarBackImgState && memberAdhaarBackImgState.trim().length > 0) || setErrorState("Please upload adhaar back page")) &&
        ((memberPhotoImgState && memberPhotoImgState.trim().length > 0) || setErrorState("Please upload address proof"));
    }
    
    const isNomineeFormInputValid = () => {
        return ((nomineeFNameState && nomineeFNameState.trim().length > 1) || setErrorState("Please enter First Name")) &&
        ((nomineeLNameState && nomineeLNameState.trim().length > 0) || setErrorState("Please enter Last Name")) &&
        ((nomineeMobileState && nomineeMobileState.trim().length > 0) || setErrorState("Please enter Mobile No.")) &&
        ((nomineeDobState && nomineeDobState.trim().length > 0) || setErrorState("Please input date of birth")) &&
        ((isNomineeAgeWithinRange()) || setErrorState("Nominee must be between 18 years and 29 years old")) &&
        ((nomineeGenderState && nomineeGenderState.trim().length > 0) || setErrorState("Please input valid Gender")) &&
        ((nomineeAltMobileState && nomineeAltMobileState.trim().length > 0) || setErrorState("Please input alternate Mobile No.")) &&
        ((nomineeAdhaarFrontImgState && nomineeAdhaarFrontImgState.trim().length > 0) || setErrorState("Please upload adhaar front page")) &&
        ((nomineeAdhaarBackImgState && nomineeAdhaarBackImgState.trim().length > 0) || setErrorState("Please upload adhaar back page")) &&
        ((nomineePhotoImgState && nomineePhotoImgState.trim().length > 0) || setErrorState("Please upload address proof")) &&
        ((acceptedState == true) || setErrorState("Please accept terms & conditions"));
    }

    const confirmFormSubmission = async () => {
        if (currentFormState === 'nominee') {
            if (isNomineeFormInputValid()){
                // Initiate transaction
                let response;
                try{
                    response = await sendRegisterRequest();
                }
                catch(e)
                {
                    setLoadingState(false);
                    if (e.status && e.status === 401)//Unauthorized
                    {
                        history.push("/login");
                    }
                    else if (e.status && (e.status === 400))
                    {
                        setInfoAlertState({show: true, msg: "You are already a member! Please check your membership details in the Menu"});
                    } 
                    else if (e.status && (e.status === 500))
                    {
                        setInfoAlertState({show: true, msg: clientConfig.serverErrorAlertMsg});
                    } 
                    setInfoAlertState({show: true, msg: clientConfig.connectivityErrorAlertMsg});
                    return {membershipId: 0};
                }
                const membership = response.data;
                membership.transaction && transactionContext.setTransactionId(membership.transaction.id);
                setTransactionState(membership.transaction);
                setSubmitConfirmAlertState({...submitConfirmAlertState, show: true});
            }
        }
    }

    const submitForm = () => {
        // Invoke Payment Gateway call
        // alert(transaction.id);
        RazorPayService.processRazorPayment(transactionState, onPaymentComplete, onPaymentCancelled);
    }

    const onPaymentComplete = async (success) => {
        let response;
        try{
            response = await sendRegisterRequest(JSON.stringify(success));
        }
        catch(e)
        {
            setLoadingState(false);
            if (e.status && e.status === 401)//Unauthorized
            {
                history.push("/login");
            }
            else if (e.status && (e.status === 400 || e.status === 500))
            {
                setInfoAlertState({show: true, msg: clientConfig.serverErrorAlertMsg});
            } 
            setInfoAlertState({show: true, msg: clientConfig.connectivityErrorAlertMsg});
            return {membershipId: 0};
        }
        const membership = response.data;
        history.push('/memberregistered?membershipid='+membership.membershipId);
    }
    
    const onPaymentCancelled = () => {
        history.push('/memberregistered?membershipid=-1');
    }

    const sendRegisterRequest = async (payload) => {
        let path = serviceBaseURL + '/members';
        const client = new Client(path);
        const resource = client.go();
        const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        let membershipRequestObj = {
            customerId: loginContext.customer.id,
            plan: {
                planId: planId
            },
            member: {
                fname: memberFNameState,
                lname: memberLNameState,
                gender: memberGenderState,
                email: memberEmailState,
                dob: memberDobState,
                mobile: memberMobileState,
                altMobile: memberAltMobileState,
                presentAddress: memberPresentAddressState,
                presentPinCode: memberPresentPinCodeState,
                adhaarFrontImg: memberAdhaarFrontImgState,
                adhaarBackImg: memberAdhaarBackImgState,
                photoImg: memberPhotoImgState
            },
            nominee: {
                fname: nomineeFNameState,
                lname: nomineeLNameState,
                gender: nomineeGenderState,
                email: nomineeEmailState,
                dob: nomineeDobState,
                mobile: nomineeMobileState,
                altMobile: nomineeAltMobileState,
                adhaarFrontImg: nomineeAdhaarFrontImgState,
                adhaarBackImg: nomineeAdhaarBackImgState,
                photoImg: nomineePhotoImgState
            }
        }

        // alert(transactionContext.transactionId);

        if (transactionContext.transactionId) {
            membershipRequestObj = {
                ...membershipRequestObj, 
                transaction: {
                    id: transactionContext.transactionId,
                    clientResponse: payload 
                }
            }
        }

        // alert(JSON.stringify(membershipRequestObj));
        let responsePromise;
        responsePromise = resource.post({
            headers: loginHeaders,
            data: membershipRequestObj
        });
        setLoadingState(false);
        return responsePromise;
    }


    const uploadAndSetMemberAdhaarFrontImg = async (event) => {
        // console.log(JSON.stringify(event.target.files));
        if (event.target.files){
            const responseObj = await uploadImage(event.target.files[0]);
            if (responseObj.success === true) {
                // alert(responseObj.data.imageName);
                setMemberAdhaarFrontImgState(responseObj.data.imageName);
            }
        }
    }

    const uploadAndSetMemberAdhaarBackImg = async (event) => {
        // console.log(JSON.stringify(event.target.files));
        if (event.target.files){
            const responseObj = await uploadImage(event.target.files[0]);
            if (responseObj.success === true) {
                // alert(responseObj.data.imageName);
                setMemberAdhaarBackImgState(responseObj.data.imageName);
            }
        }
    }

    const uploadAndSetMemberPhotoImg = async (event) => {
        // console.log(JSON.stringify(event.target.files));
        if (event.target.files){
            const responseObj = await uploadImage(event.target.files[0]);
            if (responseObj.success === true) {
                // alert(responseObj.data.imageName);
                setMemberPhotoImgState(responseObj.data.imageName);
            }
        }
    }

    const uploadAndSetNomineeAdhaarFrontImg = async (event) => {
        // console.log(JSON.stringify(event.target.files));
        if (event.target.files){
            const responseObj = await uploadImage(event.target.files[0]);
            if (responseObj.success === true) {
                // alert(responseObj.data.imageName);
                setNomineeAdhaarFrontImgState(responseObj.data.imageName);
            }
        }
    }

    const uploadAndSetNomineeAdhaarBackImg = async (event) => {
        // console.log(JSON.stringify(event.target.files));
        if (event.target.files){
            const responseObj = await uploadImage(event.target.files[0]);
            if (responseObj.success === true) {
                // alert(responseObj.data.imageName);
                setNomineeAdhaarBackImgState(responseObj.data.imageName);
            }
        }
    }

    const uploadAndSetNomineePhotoImg = async (event) => {
        // console.log(JSON.stringify(event.target.files));
        if (event.target.files){
            const responseObj = await uploadImage(event.target.files[0]);
            if (responseObj.success === true) {
                // alert(responseObj.data.imageName);
                setNomineePhotoImgState(responseObj.data.imageName);
            }
        }
    }

    const uploadImage = async (file) => {
        setLoadingState(true);
        const path = clientConfig.fileUploadUrl;
        // let path = serviceBaseURL + '/customers/'+this.state.customer.id;
        // const authHeaderBase64Value = btoa(this.state.customer.mobile+':'+this.state.customer.password);
        // const loginHeaders = new Headers();
        // loginHeaders.append("Content-Type", "application/json");
        // loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
        console.log("Making service call: "+path);
        let formData = new FormData();
        console.log(file);
        formData.append("fileData", file);
        let response;
        try{
            response = await fetch(path, {
                method: 'POST',
                body: formData
                // body: JSON.stringify(mergedProfile),
                // headers: loginHeaders
            });
            setLoadingState(false);
        }
        catch(e)
        {
            setLoadingState(false);
            console.log("Service call failed with - "+e);
            throw e;
        }
        if (response.ok) {
          console.log("Service call completed successfully");
          let responseObj = await response.json();
          console.log(responseObj);
          if (responseObj.success === true){
              return Promise.resolve(responseObj);
          }
          else{
              setInfoAlertState({show: true, msg: 'There is an error uploading the file. Only jpg, png files less than 2MB are allowed. Please try again'});
              return Promise.resolve(responseObj);
          }
        }
    }

    const customPickerOptions = {
        cssClass: 'groc-date-picker'
    };

    return (
        <IonPage>
            <IonHeader className="osahan-nav border-bottom border-white">
            <IonToolbar>
                <IonButtons slot="start">
                    <IonMenuButton></IonMenuButton>
                </IonButtons>
                <IonTitle>{planName}
                </IonTitle>
            </IonToolbar>
            </IonHeader>
            <IonLoading isOpen={loadingState}/> 
            <IonAlert isOpen={infoAlertState.show}
                            onDidDismiss={()=> setInfoAlertState(false)}
                            header={''}
                            cssClass='groc-alert'
                            message={infoAlertState.msg}
                            buttons={['OK']}/>
            <IonAlert isOpen={submitConfirmAlertState.show}
                            onDidDismiss={()=> setSubmitConfirmAlertState({...submitConfirmAlertState, show: false})}
                            header={''}
                            cssClass='groc-alert'
                            message={submitConfirmAlertState.msg}
                            buttons={[{text: 'Yes', handler: submitForm}, {text: 'No'}]}/>  
            <IonContent className="ion-padding" color="dark">
            <IonGrid>
                <div className="border-bottom text-center p-2">
                    <IonText color="light" className="headtext">{'Please fill '+ currentFormState + ' details'}</IonText>
                </div>
                <div className="border-bottom text-center p-2">
                    <IonText color="light" className="subtext">
                        We recommend you to buy our membership plan in the name of your family member ranging from 1 year to 29 years of age for maximum benefits in the future
                    </IonText>
                </div>
                <div className="p-2">
                    {currentFormState === 'member' &&
                    <form className="card">
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked">First Name
                            </IonLabel>
                            <IonInput placeholder="First Name" type="text"
                             onIonChange={setMemberFirstName}
                             value={memberFNameState}></IonInput>
                        </IonItem>
                    </IonList>
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked">Last Name
                            </IonLabel>
                            <IonInput placeholder="Last Name" type="text"
                             onIonChange={setMemberLastName}
                             value={memberLNameState}></IonInput>
                        </IonItem>
                    </IonList>
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                            <IonItem>
                                <IonLabel position="stacked">Date of Birth
                                </IonLabel>
                                <IonDatetime pickerOptions={customPickerOptions}
                                onIonChange={setMemberDob} 
                                placeholder="Date of Birth" type="date"
                                value={memberDobState}></IonDatetime>
                            </IonItem>
                        </IonList>
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked">
                                Gender
                            </IonLabel>
                            <IonSelect value={memberGenderState} className="groc-select" placeholder="Select One" onIonChange={setMemberGender}>
                                <IonSelectOption value="female">Female</IonSelectOption>
                                <IonSelectOption value="male">Male</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </IonList>
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked">
                                Email
                            </IonLabel>
                            <IonInput placeholder="Enter Email" type="email" 
                                    onIonChange={setMemberEmail} 
                                    value={memberEmailState}></IonInput>
                        </IonItem>
                    </IonList>
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked">
                                Contact No. 
                                <IonText color="danger">*</IonText>
                            </IonLabel>
                            <IonInput placeholder="Mobile No." type="tel" maxlength="10" minlength="10"
                                    onIonChange={setMemberMobile} 
                                    value={memberMobileState}></IonInput>
                        </IonItem>
                    </IonList>
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked">
                                Alternate Contact No. 
                                <IonText color="danger">*</IonText>
                            </IonLabel>
                            <IonInput placeholder="Mobile No." type="tel" maxlength="10" minlength="10"
                                    onIonChange={setMemberAltMobile} 
                                    value={memberAltMobileState}></IonInput>
                        </IonItem>
                    </IonList>
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked">Present Address
                            </IonLabel>
                            <IonTextarea rows={5} wrap="soft" maxlength="300"  placeholder="Address" type="text"
                            onIonChange={setMemberPresentAddress}
                            value={memberPresentAddressState}></IonTextarea>
                        </IonItem>
                    </IonList>
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked">Pin Code
                            <IonText color="danger">*</IonText>
                            </IonLabel>
                            <IonInput placeholder="Pin Code" type="text"  minlength="6" maxlength="6"
                            onIonChange={setMemberPresentPinCode}
                            value={memberPresentPinCodeState}></IonInput>
                        </IonItem>
                    </IonList>
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel position="stacked" class="mb-2">
                                Upload Adhaar Front
                                <IonText color="danger">*</IonText>
                            </IonLabel>
                            <input type="file" name="adhaar" accept="image/png, image/jpeg" 
                                    onChange={uploadAndSetMemberAdhaarFrontImg}>
                                     {/* value={memberAdhaarFrontImgState}> */}
                            </input>
                            <IonLabel position="stacked" class="mb-2">
                                Upload Adhaar Back
                                <IonText color="danger">*</IonText>
                            </IonLabel>
                            <input type="file" name="adhaar" accept="image/png, image/jpeg" 
                                    onChange={uploadAndSetMemberAdhaarBackImg}>
                                     {/* value={memberAdhaarFrontImgState}> */}
                            </input>
                            <IonLabel position="stacked" class="mb-2">
                                Upload Address Proof 
                                <IonText color="danger">*</IonText>
                            </IonLabel>
                            <input type="file" name="adhaar" accept="image/png, image/jpeg" 
                                    onChange={uploadAndSetMemberPhotoImg}>
                                     {/* value={memberAdhaarFrontImgState}> */}
                            </input>
                        </IonItem>
                    </IonList> 
                    {/* <IonList lines="full" className="ion-no-margin ion-no-padding">
                      <IonItem>
                          <IonCheckbox slot="start" onClick={toggleAccept} checked={acceptedState} />
                          <IonText className="subtext" color="tertiary">{'I accept the terms & conditions'}</IonText>
                      </IonItem>
                    </IonList>                    */}

                    </form>

                    }
                    {currentFormState === 'nominee' && 
                    <NomineeForm nomineeFName={nomineeFNameState} onFNameChange={(e)=>setNomineeFNameState(e.target.value)}
                                nomineeLName={nomineeLNameState} onLNameChange={(e)=>setNomineeLNameState(e.target.value)}
                                nomineeDob={nomineeDobState} onDobChange={(e)=>setNomineeDob(e)}
                                nomineeGender={nomineeGenderState} onGenderChange={(e)=>setNomineeGenderState(e.target.value)}
                                nomineeMobile={nomineeMobileState} onMobileChange={(e)=>setNomineeMobileState(e.target.value)}
                                nomineeAltMobile={nomineeAltMobileState} onAltMobileChange={(e)=>setNomineeAltMobileState(e.target.value)}
                                nomineeEmail={nomineeEmailState} onEmailChange={(e)=>setNomineeEmailState(e.target.value)}
                                nomineeRelationship={nomineeRelationshipState} onRelationshipChange={(e)=>setNomineeRelationshipState(e.target.value)}
                                // nomineePresentAddress={nomineePresentAddressState} onPresentAddressChange={(e)=>setNomineePresentAddressState(e.target.value)}
                                // nomineePresentPinCode={nomineePresentPinCodeState} onPresentPinCodeChange={(e)=>setNomineePresentPinCodeState(e.target.value)}
                                nomineeAdhaarFrontImg={nomineeAdhaarFrontImgState} onAdhaarFrontImgChange={(e)=>uploadAndSetNomineeAdhaarFrontImg(e)}
                                nomineeAdhaarBackImg={nomineeAdhaarBackImgState} onAdhaarBackImgChange={(e)=>uploadAndSetNomineeAdhaarBackImg(e)}
                                nomineePhotoImg={nomineePhotoImgState} onPhotoImgChange={(e)=>uploadAndSetNomineePhotoImg(e)}
                                tncAccepted={acceptedState} onToggleAcceptTnc={()=>toggleAccept()}
                                relationships={relationshipsState}
                                
                                />
                    }   
                </div>
                {errorState !== '' &&
                    <IonList lines="full" className="ion-no-margin ion-no-padding">
                        <IonItem>
                            <IonLabel className="ion-text-center ion-text-wrap" color="danger">
                                <small>{errorState}</small>
                            </IonLabel>
                        </IonItem>
                    </IonList>}
                <div className="p-2 d-flex border-top">
                    {currentFormState === 'nominee' && 
                    <IonButton onClick={toggleForm} color="secondary" className="ion-no-margin">Back</IonButton>}
                    <IonButton onClick={currentFormState === 'member' ? toggleForm : confirmFormSubmission} color="secondary" routerDirection="forward" expand="block" className="ion-no-margin">
                        {currentFormState === 'member' ? 'Next' : 'Pay'}
                        </IonButton>
                    {/* <div className='ion-text-center m-3'>Registered User?</div>
                    <IonButton color="secondary" routerDirection="forward" expand="block" onClick={()=>history.goBack()} className="ion-no-margin">Login</IonButton> */}
                </div>
            </IonGrid>
            </IonContent>
        </IonPage>        
    )

}
export default MembershipForm;