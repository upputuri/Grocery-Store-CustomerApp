import { Client } from 'ketting'


// Login 

// const serviceBaseURL = "http://grocservicecustomer-env.eba-bpju9vw3.ap-south-1.elasticbeanstalk.com/groc";
// const serviceBaseURL = "http://vegitcustomerrunnerservice-env.eba-3gjvheqy.ap-south-1.elasticbeanstalk.com/groc";
const serviceBaseURL = "http://api.thevegitclub.com";
// const serviceBaseURL = "http://192.168.0.110:8080";
// const serviceBaseURL = "http://192.168.31.24:8080";
// const serviceBaseURL = "http://localhost:8080";

// const logoURL = "http://lhhs.in/vegit/themes/nyk/images/logo-1.jpeg";
const logoURL = "http://thevegitclub.com/themes/nyk/images/logo-1.jpeg";
const logoIconURL = "";
const profileImageStoreURL = "http://thevegitclub.com/vegitfiles/customer/small"

const smallImageStoreURL = "http://thevegitclub.com/vegitfiles/item/small";
const mediumImageStoreURL = "http://thevegitclub.com/vegitfiles/item/medium";
const largeImageStoreURL = "http://thevegitclub.com/vegitfiles/item/large";
const thumbNailImageStoreURL = "http://thevegitclub.com/vegitfiles/item/small_thumbnail";

const mediumVariantImageStoreURL = "http://thevegitclub.com/vegitfiles/variations/medium"

const coverImageStoreURL = "http://thevegitclub.com/vegitfiles/cover/small";
const categoryImageStoreURL = "http://thevegitclub.com/vegitfiles/category/small";

const defaultImageURL = "http://thevegitclub.com/vegitfiles/default.png";

const aboutUrl = "http://thevegitclub.com/?urlq=page/static/about-us";
const blogUrl = "http://thevegitclub.com/?urlq=blog";
const termsUrl = "http://thevegitclub.com/?urlq=page/static/Terms%20and%20Conditions";
const returnPolicyUrl = "https://thevegitclub.com/?urlq=page/static/Refund%20Policy";
const privacyPolicyUrl = "http://thevegitclub.com/?urlq=page/static/Privacy%20Policy";
const faqUrl = "http://thevegitclub.com/?urlq=page/static/FAQ";

const advertUrl1 = "http://thevegitclub.com/themes/nyk/images/e435af26d54ecd5b21d7a9af8ec58994.png";
const advertUrl2 = "http://thevegitclub.com/themes/nyk/images/15-Discount-on-Vegetables-1.png";
const advertUrl3 = "http://thevegitclub.com/themes/nyk/images/IMG-20200626-WA0009.png";

const invoiceLinkBaseUrl = "http://thevegitclub.com/?urlq=order/invoice/20";
const invoiceLinkPassPhrase = "RgUjXn2r5u8x/A?D(G+KbPeShVmYp3s6";

// interface RequestObj{
//     method: string,
//     body: string,
//     headers: object
// }

// const handleRequestFailure = (error: PromiseRejectedResult) =>{
//     console.log(error);
//     return error.reason;
// }

const buildBody = (method, data, headers) => {
    return method === 'GET' ? {
        method: 'GET',
        headers: headers
    } : {
            method: method,
            body: JSON.stringify(data),
            headers: headers
        }
}

const getDefaultHeaders = () => {
    return { 'Content-Type': 'application/json' };
}


class ServiceRequest {
    hasResponse;
    isResponseOk;
    responseObject;
    constructor() {
        this.hasResponse = false;
        this.isResponseOk = false;
        this.responseObject = {};
    }

    loginRequest = async (creds) => {
        let response;
        try {
            const authHeaderBase64Value = btoa(creds.loginId + ':' + creds.password);
            const loginHeaders = new Headers();
            loginHeaders.append("Content-Type", "application/json");
            loginHeaders.append("Authorization", "Basic " + authHeaderBase64Value);
            response = await fetch(serviceBaseURL + '/customers/me', buildBody('GET', {}, loginHeaders));
            let result = await response.json();
            if (response.ok) {
                this.hasResponse = true;
                this.isResponseOk = true;
                this.responseObject = result;
                return 1;
            }
            else {
                this.hasResponse = true;
                this.isResponseOk = false;
                this.responseObject = result;
                return 1;
            }
        }
        catch (e) {
            console.log(e);
            this.hasResponse = false;
            return 0;
        }

    }

    // serviceResponseUpdater = (response: ServiceRespose) =>{
    //     this.hasResponse = response.hasResponse;
    //     this.isResponseOk = response.isResponseOk;
    //     this.responseObject = response.responseObject;
    // }

    sendHttpRequest = async (url, requestObj) => {
        let response;
        try {
            response = await fetch(url, requestObj)
            let result = await response.json();
            if (response.ok) {
                this.hasResponse = true;
                this.isResponseOk = true;
                this.responseObject = result;
                return 1;
            }
            else {
                this.hasResponse = true;
                this.isResponseOk = false;
                this.responseObject = result;
                return 1;
            }
        }
        catch (e) {
            console.log(e);
            this.hasResponse = false;
            return 0;
        }
    }

    listCategories = async () => {
        const client = new Client(serviceBaseURL + '/products/categories');
        const resource = client.go();
        let categoriesState;
        try {
            categoriesState = await resource.get();
        }
        catch (e) {
            console.log("Service call failed with - " + e);
            return;
        }
        const categoriesListState = categoriesState.getEmbedded();
        const categories = categoriesListState.map((categoryState) => categoryState.data)
        return categories;
    }

    cancelOrder = async (orderId, creds) => {
        const url = serviceBaseURL + '/orders/'+orderId;
        const authHeaderBase64Value = btoa(creds.loginId + ':' + creds.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization", "Basic " + authHeaderBase64Value);
        try {
                let response = await fetch(url, {method: 'DELETE',
                                    headers: loginHeaders});
                let result = await response.json();                                    
                if (response.ok) {
                    this.hasResponse = true;
                    this.isResponseOk = true;
                    this.responseObject = result;
                    return 1;
                }
                else {
                    this.hasResponse = true;
                    this.isResponseOk = false;
                    this.responseObject = result;
                    return 1;
                }
            }
            catch (e) {
                console.log(e);
                this.hasResponse = false;
                return 0;
            }
    }
    // getCartItemsRequest = async (customerId: any, userName: any, password: any) =>
    // {
    //     const client = new Client(serviceBaseURL+'/customers/'+customerId+'/cart/items');
    //     const resource = client.go();
    //     let cartItemsState;
    //     const authHeaderBase64Value = btoa(userName+':'+password);
    //     const loginHeaders = new Headers();
    //     loginHeaders.append("Content-Type", "application/json");
    //     loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);
    //     try{
    //         cartItemsState = await resource.get();
    //     }
    //     catch(e)
    //     {
    //         console.log('Service call failed with - '+e);
    //         return;
    //     }
    // }
}

export default ServiceRequest;
export { defaultImageURL, serviceBaseURL, smallImageStoreURL, mediumImageStoreURL, mediumVariantImageStoreURL,
    largeImageStoreURL, logoURL, logoIconURL, thumbNailImageStoreURL, coverImageStoreURL, categoryImageStoreURL,
    profileImageStoreURL, invoiceLinkBaseUrl, invoiceLinkPassPhrase };

export {aboutUrl, termsUrl, returnPolicyUrl, privacyPolicyUrl, blogUrl, faqUrl};
export {advertUrl1, advertUrl2, advertUrl3};