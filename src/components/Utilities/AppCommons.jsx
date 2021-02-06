import { invoiceLinkBaseUrl, serviceBaseURL, invoiceLinkPassPhrase } from "./ServiceCaller";

var CryptoJS = require("crypto-js");

const passwordFormatError = "Password must contain at least eight characters, one lowercase, one uppercase and one numeric and can not be same as email!";

const clientConfig ={
    productListPageSize: 15,
    otpTimout : 60000,
    wrongCityAddressSelectedErrorMsg: 'The item(s) in your order are not deliverable to the shipping address(pincode) you provided. You can update your address and try checkout again.',
    cityChangeCheckoutResetAlertMsg: 'You have items in your cart. If you change the city, item prices and availability may change. Are you sure you want to proceed?',
    submitReviewSuccessAlertMsg: 'Your review has been received successfully. We will publish it once verified',
    connectivityErrorAlertMsg: 'Unable to reach server. Please check your internet connectivity and try again!',
    serverErrorAlertMsg: 'Something went wrong! We are working on a resolution. Please try again after some time or contact support',
    passwordFormatError: "Password must contain at least eight characters, one lowercase, one uppercase and one numeric and can not be same as email!",

    fileUploadUrl: 'https://thevegitclub.com/tvcwebapi/index.php/?responsetype=json&service=user/userDocumentSavePicture',

    membershipMemberMinAge: 18,
    membershipMemberMaxAge: 29,
    membershipNomineeMinAge: 18,
    membershipNomineeMaxAge: 29
}

const calculateAge = (dateString) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age--;
    }
    return age;
}

const isPasswordValid =(username, password) => {
    let re;
    if(password.length < 8) {
        return false;
    }
    if(username && password === username) {
        return false;
    }
    re = /[0-9]/;
    if(!re.test(password)) {
        return false;
    }
    re = /[a-z]/;
    if(!re.test(password)) {
        return false;
    }
    re = /[A-Z]/;
    if(!re.test(password)) {
        return false;
    }
    return true;
}

const getMembershipCardColorClass = (categoryName) => {
    let colorClass = 'membership-gold';
    switch (categoryName) {
        case 'Copper':
            colorClass = "membership-copper";
            break;
        case 'Silver':
            colorClass = "membership-silver";
            break;
        case 'Gold':
            colorClass = "membership-gold";
            break;
        case 'Platinum':
            colorClass = "membership-platinum";
            break;
        case 'Emerald':
            colorClass = "membership-emerald";
            break;
        default:
            colorClass = "membership-gold"
            break;
        }
        // alert(colorClass);
    return colorClass;
}

const sendEmailNotification = (loginContext, subject, message) => {
    const notification = {
        subject: subject,
        message: message,
        type: "email"
    };
    sendNotificationRequest(loginContext, notification);
}

const sendMobileNotification = (loginContext, message) => {
    const notification = {
        message: message,
        type: "mobile"
    };
    sendNotificationRequest(loginContext, notification);
}

const generateOrderId = (oid, orderTS) => {
    const date = new Date(orderTS);
    let orderId = 'VEGI'+
                (date.getMonth()+1).toString().padStart(2, 0)+
                date.getDate().toString().padStart(2, 0)+
                oid.padStart(10,0);
    return orderId;
}

const generateTransactionId = (tid, tranTS) => {
    const date = new Date(tranTS);
    let tranId = 'VEGI'+ tid.padStart(10,0) +
                (date.getMonth()+1).toString().padStart(2, 0)+
                date.getDate().toString().padStart(2, 0);
    return tranId;
}

const sendNotificationRequest = async (loginContext, notification) => {
    let path = serviceBaseURL + '/customers/'+loginContext.customer.id+'/notifications';
    const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
    const loginHeaders = new Headers();
    loginHeaders.append("Content-Type", "application/json");
    loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
    console.log("Making service call: "+path);
    let response;
    try{
        response = await fetch(path, {
            method: 'POST',
            body: JSON.stringify(notification),
            headers: loginHeaders
        });
    }
    catch(e)
    {
        console.log("Service call failed with - "+e);
        throw e;
    }
    if (response.ok) {
      console.log("Notification request sent successfully");
    }
}

const generateInvoiceLink = (mobile, oid) => {
    const encryptedString = CryptoJS.AES.encrypt(mobile+':'+oid, invoiceLinkPassPhrase).toString();
    const base64String = btoa(encryptedString);
    const link = invoiceLinkBaseUrl+"/"+base64String;
    // const toDecrypt = atob(base64String).toString();
    // const bytes = CryptoJS.AES.decrypt(toDecrypt, invoiceLinkPassPhrase);
    // console.log(bytes.toString(CryptoJS.enc.Utf8));
    return link;
}

export { isPasswordValid, sendEmailNotification, sendMobileNotification, generateTransactionId,
        generateOrderId, generateInvoiceLink, calculateAge, getMembershipCardColorClass, 
        passwordFormatError, clientConfig };
