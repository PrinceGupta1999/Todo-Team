import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import notificationReducer from "./notificationReducer";
import todoListReducer from "./todoListReducer";

export default combineReducers({
    auth: authReducer,
    error: errorReducer,
    notification: notificationReducer,
    todoList: todoListReducer
});
