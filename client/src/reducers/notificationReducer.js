import { SET_NOTIFICATIONS, NOTIFICATIONS_LOADING, REMOVE_NOTIFICATION } from '../actions/types';

const initialState = {
    notifications: [],
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_NOTIFICATIONS:
            return {
                loading: false,
                notifications: action.payload
            };
        case NOTIFICATIONS_LOADING:
            return {
                loading: true,
                notifications: []
            };
        case REMOVE_NOTIFICATION:
            const notifications = state.notifications.filter(notification => notification._id !== action.payload);
            console.log(notifications)
            return {
                ...state,
                notifications
            };
        default:
            return state;
    }
}