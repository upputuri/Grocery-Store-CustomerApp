import { SET_BILLING_ADDRESS_ID, SET_COVER, SET_DELIVERY_ADDRESS_ID, RESET_BILLING_ADDRESS_ID, SET_PROMOCODES, SET_PAYMENT_OPTION, RESET_ORDER_CONTEXT } from '../reducerConstants';

const initialState = {
    cover: undefined,
    deliveryAddressId: undefined,
    billingAddressId: undefined,
    promoCodes: [],
    paymentOptionId: undefined,
}

const orderStateReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_DELIVERY_ADDRESS_ID:
            return {
                ...state,
                deliveryAddressId: action.value
            }
        case SET_BILLING_ADDRESS_ID:
            return {
                ...state,
                billingAddressId: action.value
            }
        case RESET_BILLING_ADDRESS_ID:
            return {
                ...state,
                billingAddressId: undefined
            }
        case SET_PROMOCODES:
            return {
                ...state,
                promocodes: action.value
            }
        case SET_PAYMENT_OPTION: 
            return {
                ...state,
                paymentOptionId: action.value
            }
        case RESET_ORDER_CONTEXT:
            return initialState;
    }
    return state;
}

export default orderStateReducer;