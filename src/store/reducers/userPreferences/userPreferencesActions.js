import { SET_COVER } from "../reducerConstants"

export const setCover = (cover) => {
    return {
        type: SET_COVER,
        value: cover
    }
}