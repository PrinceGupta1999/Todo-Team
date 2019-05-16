import { SET_TODOLISTS, TODOLISTS_LOADING } from '../actions/types';

const initialState = {
    todoLists: {},
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_TODOLISTS:
            return {
                loading: false,
                todoLists: action.payload
            };
        case TODOLISTS_LOADING:
            return {
                loading: true,
                todoLists: {}
            };
        default:
            return state;
    }
}