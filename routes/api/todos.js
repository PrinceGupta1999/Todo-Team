const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../../middleware/auth');

// Models
const User = require('../../models/Item');
const TodoList = require('../../models/TodoList');
const Todo = require('../../models/Todo');

// @route GET api/todolists/:todoListId/todos
// @descr Get TodoList by Id
// @access Private
router.get('/', auth, (req, res) => {
    TodoList.findById(req.params.todoListId)
        .then(todoList => {
            Todo.find({
                '_id': {
                    $in: todoList.todos
                }
            }).then(todos => res.json({
                todos: todos
            }))

        })
        .catch(err => {
            res.json(404).json({
                msg: "TodoList Id is Invalid"
            })
        })
});

// @route POST api/todolists/:todoListId/todos
// @descr Add Todo
// @access Private
router.post('/', auth, (req, res) => {
    if (!req.body.name)
        return res.status(400).json({
            msg: "Name Field is Required"
        })
    const newTodo = new Todo({
        name: req.body.name,
        index: req.body.index
    })
    newTodo.save()
        .then(todo => {
            TodoList.findByIdAndUpdate(req.params.todoListId, {
                "$push": {
                    "todos": todo._id
                }
            }).then(todoList => res.json(todo))
                .catch(err => {
                    console.log(err)
                    todo.remove().then(() => res.status(400).json({
                        msg: "Invalid TodoList Id"
                    }))
                })
        })
})
TodoList.findById(req.params.todoListId)
    .then(todoList => {
        Todo.find({
            '_id': {
                $in: todoList.todos
            }
        }).then(todos => res.json({
            todos: todos
        }))

    })
    .catch(err => {
        res.json(404).json({
            msg: "TodoList Id is Invalid"
        })
    })
});
