import { SET_NOTIFICATIONS, NOTIFICATIONS_LOADING } from '../actions/types';

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
        default:
            return state;
    }
}