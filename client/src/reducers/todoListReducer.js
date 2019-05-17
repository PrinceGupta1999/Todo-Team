import { SET_TODOLISTS, TODOLISTS_LOADING, REMOVE_TODOLIST } from '../actions/types';

const initialState = {
    todoLists: {
        admin: [],
        edit: [],
        view: []
    },
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
                ...state,
                loading: true,
            };
        case REMOVE_TODOLIST:
            return {
                ...state,
                todoLists: {
                    admin: state.todoLists.admin.filter(({ _id }) => _id !== action.payload),
                    edit: state.todoLists.edit.filter(({ _id }) => _id !== action.payload),
                    view: state.todoLists.view.filter(({ _id }) => _id !== action.payload)
                }
            };
        default:
            return state;
    }
}