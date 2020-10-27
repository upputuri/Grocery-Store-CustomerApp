import { Client } from 'ketting'


// Login 

// const serviceBaseURL = "http://grocservicecustomer-env.eba-bpju9vw3.ap-south-1.elasticbeanstalk.com/groc";
const serviceBaseURL = "http://localhost:8080/groc";

const smallImageStoreURL = "http://lhhs.in/vegitfiles/item/small";
const mediumImageStoreURL = "http://lhhs.in/vegitfiles/item/medium";
const largeImageStoreURL = "http://lhhs.in/vegitfiles/item/large";
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
            response = await fetch(serviceBaseURL + '/me', buildBody('GET', {}, loginHeaders));
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
                if (response.ok) {
                    this.hasResponse = true;
                    this.isResponseOk = true;
                    this.responseObject = {};
                    return 1;
                }
                else {
                    this.hasResponse = true;
                    this.isResponseOk = false;
                    this.responseObject = {};
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
export { serviceBaseURL, smallImageStoreURL, mediumImageStoreURL, largeImageStoreURL };