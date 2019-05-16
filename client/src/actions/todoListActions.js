import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { setErrors } from "./errorActions";
import { SET_TODOLISTS, TODOLISTS_LOADING } from "./types";

// Get TodoLists
export const getTodoLists = () => dispatch => {
    const token = localStorage.jwtToken
    dispatch(setTodoListsLoading())
    setAuthToken(token)
    axios
        .get("/api/todolists")
        .then(res => {
            // res.data = Contains Collection of TodoLists
            dispatch(setTodoLists(res.data))
        })
        .catch(err => {
            // console.log(err)
            dispatch(setErrors(err.response.data))
        });

};

export const setTodoLists = (todolists) => {
    return {
        type: SET_TODOLISTS,
        payload: todolists
    }
}

export const setTodoListsLoading = () => {
    return {
        type: TODOLISTS_LOADING
    }
}
