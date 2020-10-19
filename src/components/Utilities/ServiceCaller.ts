import { Client } from 'ketting'


// Login 

const serviceBaseURL = "http://grocservicecustomer-env.eba-bpju9vw3.ap-south-1.elasticbeanstalk.com/groc";
// const serviceBaseURL = "http://localhost:8080/groc";
interface UserCredentials{
    loginId: string,
    password: string
}

interface ServiceRespose{
    hasResponse: boolean
    isResponseOk: boolean
    responseObject: object
}
// interface RequestObj{
//     method: string,
//     body: string,
//     headers: object
// }

// const handleRequestFailure = (error: PromiseRejectedResult) =>{
//     console.log(error);
//     return error.reason;
// }

const buildBody = (method: string, data: any, headers: any) =>
{
    return method === 'GET' ? {
        method: 'GET', 
        headers: headers
    } : {
        method: method, 
        body: JSON.stringify(data), 
        headers: headers
    }
}

const getDefaultHeaders = () =>
{
    return { 'Content-Type': 'application/json' };
}


class ServiceRequest {
    hasResponse: boolean;
    isResponseOk: boolean;
    responseObject: any; 
    constructor(){
        this.hasResponse = false;
        this.isResponseOk = false;
        this.responseObject = {};
    }
    
    loginRequest = async (creds: UserCredentials) =>
    {
        let response;
        try{
            const authHeaderBase64Value = btoa(creds.loginId+':'+creds.password);
            const loginHeaders = new Headers();
            loginHeaders.append("Content-Type", "application/json");
            loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);
            response = await fetch(serviceBaseURL + '/me', buildBody('GET', {}, loginHeaders));
            let result = await response.json();
            if (response.ok)
            {
                this.hasResponse = true;
                this.isResponseOk = true;
                this.responseObject = result;
                return 1;
            }
            else{
                this.hasResponse = true;
                this.isResponseOk = false;
                this.responseObject = result;
                return 1;
            }
        }
        catch(e){
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

    sendHttpRequest = async (url: string, requestObj?: RequestInit) =>
    {
        let response;
        try{
            response = await fetch(url, requestObj)
            let result = await response.json();
            if (response.ok)
            {
                this.hasResponse = true;
                this.isResponseOk = true;
                this.responseObject = result;
                return 1;
            }
            else{
                this.hasResponse = true;
                this.isResponseOk = false;
                this.responseObject = result;
                return 1;
            }
        }
        catch(e){
            console.log(e);
            this.hasResponse = false;
            return 0;
        }
    }

    listCategories = async () =>
    {   
        const client = new Client(serviceBaseURL+'/products/categories');
        const resource = client.go();
        let categoriesState;
        try{
            categoriesState = await resource.get();
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            return;
        }
        const categoriesListState = categoriesState.getEmbedded();
        const categories = categoriesListState.map((categoryState) => categoryState.data)
        return categories;
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
export {serviceBaseURL};