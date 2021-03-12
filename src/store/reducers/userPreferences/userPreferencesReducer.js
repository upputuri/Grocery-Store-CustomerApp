import { SET_COVER } from "../reducerConstants"

const initialState = {
    cover: undefined
}

const userPreferencesReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_COVER:         
            return {
                ...state,
                cover: action.value
            }
    }
    return state;
}

export default userPreferencesReducer;