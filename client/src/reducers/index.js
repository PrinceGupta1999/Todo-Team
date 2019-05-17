import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import notificationReducer from "./notificationReducer";
import todoListReducer from "./todoListReducer";
import todoReducer from "./todoReducer";

export default combineReducers({
    auth: authReducer,
    error: errorReducer,
    notification: notificationReducer,
    todoList: todoListReducer,
    todo: todoReducer
});
