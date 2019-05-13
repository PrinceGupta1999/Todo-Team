const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// Models
const User = require('../../models/User');
const TodoList = require('../../models/TodoList');
const Todo = require('../../models/Todo');


// Nested Routes
const todos = require("./todos");
router.use("/:todoListId/todos", todos);


// @route GET api/todolists
// @descr Get All TodoLists
// @access Private
router.get('/', auth, (req, res) => {
    User.findById(req.user.id)
        .then(user => {
            const userTodoLists = [].concat(user.todoLists.admin,
                user.todoLists.edit, user.todoLists.view);
            TodoList.find(
                {
                    _id: {
                        $in: userTodoLists
                    }
                }).then(todoLists => res.json({
                    todolists: todoLists
                }))
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                msg: "Invalid User"
            })
        })
});

// @route POST api/todolists
// @descr Create a New TodoList
// @access Private
router.post('/', auth, (req, res) => {
    // Basic Validation
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
                console.log(req.body.edit)
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
                        msg: err
                    })
                })
        })
});

// @route DELETE api/todolists/:id
// @descr Delete TodoList
// @access Private
// router.delete('/:id', auth, (req, res) => {
// TodoList.findById(req.params.id)
//     .then(todoList => todoList.remove()
//         .then(() => res.json({ success: true }))
//     )
//     .catch(() => res.status(404).json({ success: false }))
// });

module.exports = router;