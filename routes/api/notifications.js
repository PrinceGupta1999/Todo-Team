const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();

// Models
const User = require('../../models/User');

// @route GET api/notifications
// @descr View all Notifications
// @access Private
router.get('/', auth, (req, res) => {
    User.findById(req.user.id)
        .then(user => res.json({
            notifications: user.notifications
        }))
        .catch(err => res.status(404).json({
            ...err,
            msg: 'Invalid User ID'
        }))
})


// @route DELETE api/notifications/:notificationId
// @descr Accept or Decline an Invitation for TodoList
// @access Private
router.delete('/:notificationId', auth, (req, res) => {
    User.findById(req.user.id)
        .then(user => {
            var todoListId = null;
            user.notifications = user.notifications.filter(notification => {
                if (notification._id == req.params.notificationId) {
                    todoListId = notification.todoList;
                    if (req.body.accept) {
                        switch (notification.permission) {
                            case 'EDIT':
                                user.todoLists.edit.push(notification.todoList);
                                break;
                            case 'VIEW':
                                user.todoLists.view.push(notification.todoList);
                                break;
                            default:
                                break;
                        }
                    }
                    return false
                }
                return true
            })
            user.save()
                .then(user => res.json({
                    success: true,
                    todoListId
                })).catch(err => res.status(500).json({
                    success: false,
                    ...err
                }))


        })
        .catch(err => res.status(404).json({
            success: false,
            err,
            msg: 'Invalid User ID'
        }))

})

module.exports = {
    router
};
