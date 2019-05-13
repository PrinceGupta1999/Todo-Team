const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    todoLists: {
        admin: [{
            type: Schema.Types.ObjectId,
            ref: 'TodoList'
        }],
        edit: [{
            type: Schema.Types.ObjectId,
            ref: 'TodoList'
        }],
        view: [{
            type: Schema.Types.ObjectId,
            ref: 'TodoList'
        }]
    },
    notifications: [{
        permission: {
            type: String,
            enum: ['EDIT', 'VIEW'],
            required: true
        },
        todoList: {
            type: Schema.Types.ObjectId,
            ref: 'TodoList',
            required: true
        },
        todoListName: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        }
    }]
});

module.exports = User = mongoose.model("User", UserSchema);
