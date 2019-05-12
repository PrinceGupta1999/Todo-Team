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
        adminPermissions: [{
            type: Schema.Types.ObjectId,
            ref: 'TodoList'
        }],
        editPermissions: [{
            type: Schema.Types.ObjectId,
            ref: 'TodoList'
        }],
        viewPermissions: [{
            type: Schema.Types.ObjectId,
            ref: 'TodoList'
        }]
    },
    notifications: [{
        permission: String,
        enum: ['EDIT', 'VIEW']

    }]
});

module.exports = User = mongoose.model("User", UserSchema);
