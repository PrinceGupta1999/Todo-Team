import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { setErrors } from "./errorActions";
import { getTodoLists } from "./todoListActions";
import { SET_NOTIFICATIONS, NOTIFICATIONS_LOADING, REMOVE_NOTIFICATION } from "./types";

// Get Notifications
export const getNotifications = () => dispatch => {
    const token = localStorage.jwtToken
    dispatch(setNotificationsLoading())
    setAuthToken(token)
    axios
        .get("/api/notifications")
        .then(res => {
            // res.data = Contains Collection of TodoLists
            dispatch(setNotifications(res.data.notifications))
        })
        .catch(err => {
            // console.log(err)
            dispatch(setErrors(err.response.data))
        });

};

export const setNotificationsLoading = () => {
    return {
        type: NOTIFICATIONS_LOADING
    }
}

export const handleNotification = (notificationId, accept) => dispatch => {
    axios
        .delete('/api/notifications/' + notificationId, {
            data: {
                accept
            }
        })
        .then(res => {
            dispatch({
                type: REMOVE_NOTIFICATION,
                payload: notificationId
            })
            getTodoLists()
        })
        .catch(err => dispatch(setErrors(err)))

}

export const setNotifications = (notifications) => {
    return {
        type: SET_NOTIFICATIONS,
        payload: notifications
    }
}