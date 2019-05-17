import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { setErrors } from "./errorActions";
import { SET_TODOS, TODOS_LOADING, REMOVE_TODO } from "./types";

// Get Todos
export const getTodos = (todoListId) => dispatch => {
    const token = localStorage.jwtToken
    dispatch({
        type: TODOS_LOADING
    })
    setAuthToken(token)
    axios
        .get("/api/todolists/" + todoListId + "/todos")
        .then(res => {
            // console.log(res.data)
            // res.data = Contains Collection of Todos
            dispatch({
                type: SET_TODOS,
                payload: res.data
            })
        })
        .catch(err => {
            // console.log(err)
            dispatch(setErrors(err.response.data))
        });
};

// Edit Todos
export const editTodo = (todoListId) => dispatch => {
    
};


// Delete a Todo
export const deleteTodo = (todoListId, todoId) => dispatch => {
    const token = localStorage.jwtToken
    setAuthToken(token)
    axios
        .delete("/api/todolists/" + todoListId + "/todos/" + todoId)
        .then(res => {
            // console.log(res.data)
            // Remove Todo  from current s of todos
            dispatch({
                type: REMOVE_TODO,
                payload: todoId
            })
        })
        .catch(err => {
            // console.log(err)
            dispatch(setErrors(err.response.data))
        });
};

