import { SET_TODOS, TODOS_LOADING, REMOVE_TODO, EDIT_TODO, ADD_TODO } from '../actions/types';

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
        case EDIT_TODO:
            var newTodos = state.todos.filter(({ _id }) => _id !== action.payload.todo._id)
            newTodos.splice(action.payload.index, 0, action.payload.todo)
            return {
                ...state,
                todos: newTodos
            };
        case ADD_TODO:
            return {
                ...state,
                todos: [...state.todos, action.payload]
            };
        default:
            return state;
    }
}