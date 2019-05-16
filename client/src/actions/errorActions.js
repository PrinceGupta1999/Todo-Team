import { SET_ERRORS } from "./types";


// Set Errors
export const setErrors = error => {
    return {
        type: SET_ERRORS,
        payload: error
    }
}
