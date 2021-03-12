import { RESET_BILLING_ADDRESS_ID, RESET_ORDER_CONTEXT, SET_BILLING_ADDRESS_ID, SET_DELIVERY_ADDRESS_ID, SET_PAYMENT_OPTION, SET_PROMOCODES } from "../reducerConstants"

export const setDeliveryAddressId = (id) => {
    return {
        type: SET_DELIVERY_ADDRESS_ID,
        value: id
    }
}

export const setBillingAddressId = (id) => {
    return {
        type: SET_BILLING_ADDRESS_ID,
        value: id
    }
}

export const resetBillingAddressId = () => {
    return {
        type: RESET_BILLING_ADDRESS_ID
    }
}

export const setPromoCodes = (codes) => {
    return {
        type: SET_PROMOCODES,
        value: codes
    }
}

export const setPaymentOption = (id) => {
    return {
        type: SET_PAYMENT_OPTION,
        value: id
    }
}

export const resetOrderContext = () => {
    return {
        type: RESET_ORDER_CONTEXT,
    }
}