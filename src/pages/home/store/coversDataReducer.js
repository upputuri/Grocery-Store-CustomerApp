import { REQUEST_IDLE } from "../../../store/reducers/storeConstants";
import { COVERS_FETCHED } from "./coversDataConstants";

const initialState = {
    covers: undefined,
    status: REQUEST_IDLE,
    error: null
}

const coversDataReducer = (state = initialState, action) => {
    switch(action.type){
        case COVERS_FETCHED:
            return {
                ...state,
                covers: action.payload.covers
            }
    }
    return state;
}

export default coversDataReducer;