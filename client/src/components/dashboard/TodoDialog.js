import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTodos, deleteTodo, editTodo } from '../../actions/todoActions'
import { withStyles } from '@material-ui/core/styles';
import {
    Dialog,
    ListItemText,
    ListItem,
    List,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Slide,
    ListItemSecondaryAction,
    Divider
} from '@material-ui/core';
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    header: {
        marginTop: theme.spacing.unit * 4,
    }
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class TodoDialog extends React.Component {

    componentDidUpdate(prevProps) {
        if (prevProps.todoList.todoListId === "")
            this.props.getTodos(this.props.todoList.todoListId);
    }

    render() {
        const { classes, todoDialogOpen } = this.props;
        const { todos } = this.props.todo;
        const userId = this.props.auth.id;
        const { todoListId, todoListName, todoListDescription } = this.props.todoList
        return (
            <Fragment>
                <Dialog
                    fullScreen
                    open={todoDialogOpen}
                    onClose={this.props.closeTodoDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                onClick={this.props.closeTodoDialog}
                                aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography
                                variant="h6"
                                color="inherit"
                                className={classes.flex}
                            >{todoListName}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <List>
                        <ListItem key={todoListId}>
                            <ListItemText
                                primary="Description"
                                secondary={todoListDescription}
                            />
                        </ListItem>
                        <Divider />
                        {todos.map(({ _id, name, isBeingEdited, editorId, isComplete }) => {
                            return (
                                <ListItem key={_id}>
                                    {isBeingEdited && editorId !== userId ? (
                                        <Fragment>
                                            <ListItemText
                                                primary="Currently Being Edited"
                                            />
                                        </Fragment>
                                    ) : (
                                            <Fragment>
                                                <ListItemText
                                                    primary={name}
                                                />
                                                {this.props.isEditor ? (
                                                    <ListItemSecondaryAction>
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => this.editTodo(todoListId, _id)}
                                                            size="small"
                                                        ><EditIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            color="secondary"
                                                            onClick={() => this.props.deleteTodo(todoListId, _id)}
                                                            size="small"
                                                        ><DeleteIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                ) : null}
                                            </Fragment>
                                        )}
                                </ListItem>
                            )
                        })}
                    </List>
                </Dialog>
            </Fragment>
        );
    }
}

TodoDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    todo: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    editTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    todo: state.todo,
    auth: state.auth
})

export default connect(mapStateToProps, { getTodos, editTodo, deleteTodo })(withStyles(styles)(TodoDialog));