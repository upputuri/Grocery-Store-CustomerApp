import Client from "ketting";
import { serviceBaseURL } from "../../../components/Utilities/ServiceCaller";
import { REQUEST_FAILED, REQUEST_START, REQUEST_SUCCESS } from "../../../store/reducers/storeConstants";
import { COVERS_FETCHED, COVERS_FETCH_FAILED, COVERS_FETCH_START } from "./coversDataConstants";

const coversFetched = (covers) => {
    return {
        type: COVERS_FETCHED,
        payload: {
            covers: covers,
            status: REQUEST_SUCCESS,
            error: null
        }
    }
}

const startRequest = () => {
    return {
        type: COVERS_FETCH_START,
        status: REQUEST_START
    }
}

const failed = (error) => {
    return {
        type: COVERS_FETCH_FAILED,
        payload: {
            status: REQUEST_FAILED,
            error: error
        }
    }
}

export const fetchCovers = () => {
    return async (dispatch, getState) => {
        // alert(JSON.stringify(getState()));
        if (getState().coversData.covers){ // If data is already available in store, return.
            return getState().coversData.covers;
        }
        const client = new Client(serviceBaseURL+'/stores/covers');
        const resource = client.go();
        console.log("Making service call: "+resource.uri);
        dispatch(startRequest());
        let receivedData;
        try{
            receivedData = await resource.get();
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            dispatch(failed());
            return;
        }
        // alert(JSON.stringify(receivedData));
        console.log("Received response from service call: "+resource.uri);
        const covers = receivedData.getEmbedded().map((coverState) => coverState.data);
        return dispatch(coversFetched(covers));
    }
}