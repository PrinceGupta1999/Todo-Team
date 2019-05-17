const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// Models
const User = require('../../models/User');
const TodoList = require('../../models/TodoList');
const Todo = require('../../models/Todo');


// Nested Routes
const todos = require("./todos");
router.use("/:todoListId/todos", todos.router);


// @route GET api/todolists
// @descr Get All TodoLists
// @access Private
router.get('/', auth, (req, res) => {
    User.findById(req.user.id)
        .then(user => {
            // console.log(user)
            var promises = [];
            var admin, edit, view;
            promises.push(new Promise((resolve, reject) => {
                TodoList.find(
                    {
                        _id: {
                            $in: user.todoLists.admin
                        }
                    }).then(todoLists => {
                        admin = todoLists
                        resolve(todoLists)
                    })
                    .catch(err => {
                        reject(err)
                    })
            }))
            promises.push(new Promise((resolve, reject) => {
                TodoList.find(
                    {
                        _id: {
                            $in: user.todoLists.edit
                        }
                    }).then(todoLists => {
                        edit = todoLists
                        resolve(todoLists)
                    })
                    .catch(err => {
                        reject(err)
                    })
            }))
            promises.push(new Promise((resolve, reject) => {
                TodoList.find(
                    {
                        _id: {
                            $in: user.todoLists.view
                        }
                    }).then(todoLists => {
                        view = todoLists
                        resolve(todoLists)
                    })
                    .catch(err => {
                        reject(err)
                    })
            }))
            Promise.all(promises)
                .then(values => {
                    if (admin)
                        user.admin = admin.map(({ _id }) => _id);
                    if (edit)
                        user.edit = edit.map(({ _id }) => _id);
                    if (view)
                        user.view = view.map(({ _id }) => _id);
                    user.save().then(() => {
                        res.json({
                            admin: admin,
                            edit: edit,
                            view: view
                        })
                    })

                })
                .catch(err => {
                    res.status(500).json({
                        ...err
                    })
                })
        })
        .catch(err => {
            // console.log(err)
            res.status(404).json({
                msg: "User Does Not Exist",
                ...err
            })
        })

});

// @route POST api/todolists
// @descr Create a New TodoList
// @access Private
router.post('/', auth, (req, res) => {
    // Basic Validation
    console.log(req.body)
    if (!req.body.name || !req.body.description)
        return res.status(400).json({
            msg: "Complete all Fields"
        })
    const newTodoList = new TodoList({
        name: req.body.name,
        description: req.body.description
    })
    newTodoList.save()
        .then(todoList => {
            var promises = [];
            // Pushing todolist id to its editors 
            if (req.body.edit.length > 0) {
                // console.log(req.body.edit)
                promises.push(new Promise((resolve, reject) => {
                    const notification = {
                        permission: 'EDIT',
                        userName: req.user.name,
                        todoList: todoList._id,
                        todoListName: todoList.name
                    }
                    User.update(
                        {
                            email: {
                                $in: req.body.edit
                            }
                        },
                        {
                            $push: {
                                notifications: notification
                            }
                        },
                        {
                            multi: true
                        })
                        .then(users => resolve(users))
                        .catch(err => reject(err))
                }))
            }
            // Pushing todolist id to its viewers
            if (req.body.view.length > 0) {
                promises.push(new Promise((resolve, reject) => {
                    const notification = {
                        permission: 'VIEW',
                        userName: req.user.name,
                        todoList: todoList._id,
                        todoListName: todoList.name
                    }
                    User.update(
                        {
                            email: {
                                $in: req.body.view
                            }
                        },
                        {
                            $push: {
                                notifications: notification
                            }
                        },
                        {
                            multi: true
                        })
                        .then(users => resolve(users))
                        .catch(err => reject(err))
                }))
            }
            // Pushing todolist id to its creator
            promises.push(new Promise((resolve, reject) => {
                User.findById(req.user.id)
                    .then(user => {
                        user.todoLists.admin.push(todoList._id)
                        user.save()
                            .then(doc => resolve(doc))
                            .catch(err => reject(err))
                    })
                    .catch(err => reject(err))
            }))
            Promise.all(promises)
                .then((values) => {
                    // console.log(values)
                    res.json({
                        todoList
                    })
                })
                .catch(err => {
                    // console.log(err)
                    res.status(500).json({
                        err
                    })
                })
        })
});

// @route DELETE api/todolists/:todoListId
// @descr Delete TodoList
// @access Private
router.delete('/:todoListId', auth, (req, res) => {
    console.log(req.params)
    TodoList.findById(req.params.todoListId)
        .then(todoList => todoList.remove()
            .then(() => {
                Todo.deleteMany(
                    {
                        _id: {
                            $in: todoList.todos
                        }
                    })
                    .then(() => res.json({
                        success: true
                    }))
                    .catch(err => {
                        // console.log(err);
                        res.status(500).json({
                            success: false,
                            ...err
                        })
                    })
            })
        )
        .catch(err => res.status(404).json({
            ...err,
            success: false
        }))
});

// Setting up socket.io event listeners for this module
const io = function (io, client) {
    // Calling Todo socket handler
    todos.io(io, client);

    // Set Up Personal Events

    // When a todoList is deleted
    client.on('todolist-delete', todoListId => {
        client.broadcast.emit('todolist-delete', todoListId);
    })
}

module.exports = {
    router,
    io
}