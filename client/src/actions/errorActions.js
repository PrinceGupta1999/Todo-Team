import { GET_ERRORS, CLEAR_ERRORS } from "./types";


// Set Errors
export const getErrors = error => {
    return {
        type: GET_ERRORS,
        payload: error
    }
}

// Clear Errors
export const clearErrors = error => {
    return {
        type: CLEAR_ERRORS,
    }
}