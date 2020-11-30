import { invoiceLinkBaseUrl, serviceBaseURL, invoiceLinkPassPhrase } from "./ServiceCaller";

var CryptoJS = require("crypto-js");

const passwordFormatError = "Password must contain at least six characters, one lowercase, one uppercase and one numeric and can not be same as email!";

const productListPageSize = 15;

const isPasswordValid =(username, password) => {
    let re;
    if(password.length < 6) {
        return false;
    }
    if(password === username) {
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

export { isPasswordValid, sendEmailNotification, sendMobileNotification, generateOrderId, generateInvoiceLink, passwordFormatError, productListPageSize };
