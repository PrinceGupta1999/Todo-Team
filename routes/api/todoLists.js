const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// Models
const User = require('../../models/Item');
const TodoList = require('../../models/TodoList');
const Todo = require('../../models/Todo');


// Nested Routes
const todos = require("./todos");
router.use("/:todoListId/todos", todos);


// @route GET api/todolists
// @descr Get All TodoLists applicable
// @access Private
router.get('/', auth, (req, res) => {
    User.findById(req.user.id)
        .then(user => {
            const userTodoLists = [].concat(user.todoLists.adminPermissions,
                user.todoLists.editPermissions, user.todoLists.viewPermissions);
            TodoList.find({
                '_id': {
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