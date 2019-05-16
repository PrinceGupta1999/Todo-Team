import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { setErrors } from "./errorActions";
import { SET_NOTIFICATIONS, NOTIFICATIONS_LOADING } from "./types";

// Get Notifications
export const getNotifications = () => dispatch => {
    const token = localStorage.jwtToken
    dispatch(setNotificationsLoading())
    setAuthToken(token)
    axios
        .get("/api/notifications")
        .then(res => {
            console.log(res.data)
            // res.data = Contains Collection of TodoLists
            dispatch(setNotifications(res.data.notifications))
        })
        .catch(err => {
            console.log(err)
            // console.log(err)
            dispatch(setErrors(err.response.data))
        });

};

export const setNotificationsLoading = () => {
    return {
        type: NOTIFICATIONS_LOADING
    }
}

export const setNotifications = (notifications) => {
    return {
        type: SET_NOTIFICATIONS,
        payload: notifications
    }
}