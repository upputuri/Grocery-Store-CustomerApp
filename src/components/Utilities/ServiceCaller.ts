// Login 
export { loginRequest }

const serviceBaseURL = "http://localhost:8080/groc";
interface UserCredentials{
    loginId: string,
    password: string
}

interface RequestParams{
    method: string,
    body: string,
    headers: object
}

const loginRequest = async (creds: UserCredentials) =>
{
    let response;
    try{
        response = await fetch(serviceBaseURL + '/me', buildPostBody(creds))
        let result = await response.json();
        if (response.ok)
        {
            return {
                isOkResponse: true, 
                responseObject: result
            };
        }
        else{
            return {
                isOkResponse: false,
                responseObject: result
            }
        }
    }
    catch(e){
        console.log(e);
    }
                
}

const handleRequestFailure = (error: PromiseRejectedResult) =>{
    console.log(error);
    return error.reason;
}

const buildPostBody = (data: object) =>
{
    return {
        method: 'POST', 
        body: JSON.stringify(data), 
        headers: getDefaultHeaders()
    };
}

const getDefaultHeaders = () =>
{
    return { 'Content-Type': 'application/json' };
}