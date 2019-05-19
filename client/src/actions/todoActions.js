import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { setErrors } from "./errorActions";
import { SET_TODOS, TODOS_LOADING, REMOVE_TODO, EDIT_TODO, ADD_TODO } from "./types";
import { socket } from "../App";

// Get Todos
export const getTodos = (todoListId) => dispatch => {
    if (todoListId === "")
        return;
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

// Edit a Todo
export const editTodo = (todoListId, todo) => dispatch => {
    const token = localStorage.jwtToken
    setAuthToken(token)
    axios
        .patch("/api/todolists/" + todoListId + "/todos/" + todo.id, todo)
        .then(res => {
            // console.log(res.data)
            // res.data = Contains Collection of Todos
            dispatch({
                type: EDIT_TODO,
                payload: res.data
            })
        })
        .catch(err => {
            // console.log(err)
            dispatch(setErrors(err.response.data))
        });
};

// Create a Todo
export const createTodo = (todoListId, todo) => dispatch => {
    const token = localStorage.jwtToken
    setAuthToken(token)
    axios
        .post("/api/todolists/" + todoListId + "/todos/", todo)
        .then(res => {
            // console.log(res.data)
            // res.data = Created Todo
            socket.emit('todo-create', { todoListId, todo: res.data })
            dispatch({
                type: ADD_TODO,
                payload: res.data
            })
        })
        .catch(err => {
            // console.log(err)
            dispatch(setErrors(err.response.data))
        });
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
            socket.emit('todo-delete', todoId)
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

export const setTodos = todos => dispatch => {
    dispatch({
        type: SET_TODOS,
        payload: todos
    })
}

export const createTodoLocal = todo => dispatch => {
    dispatch({
        type: ADD_TODO,
        payload: todo
    })
}
// Replace data = {todo, index} => Replace todo from list and add at new index
export const editTodoLocal = data => dispatch => {
    dispatch({
        type: EDIT_TODO,
        payload: data
    })
}

export const deleteTodoLocal = todoId => dispatch => {
    dispatch({
        type: REMOVE_TODO,
        payload: todoId
    })
}