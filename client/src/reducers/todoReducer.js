import { SET_TODOS, TODOS_LOADING, REMOVE_TODO } from '../actions/types';

const initialState = {
    todos: [],
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_TODOS:
            return {
                loading: false,
                todos: action.payload
            };
        case TODOS_LOADING:
            return {
                ...state,
                loading: true,
            };
        case REMOVE_TODO:
            return {
                ...state,
                todos: state.todos.filter(({ _id }) => _id !== action.payload)
            };
        default:
            return state;
    }
}