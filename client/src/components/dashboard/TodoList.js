import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { deleteTodoList } from "../../actions/todoListActions";
import {
    Paper,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    IconButton
} from '@material-ui/core';
import DeleteIcon from "@material-ui/icons/Delete";
import PageviewIcon from "@material-ui/icons/Pageview";
import TodoDialog from "./TodoDialog.js";

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    paper: {
        minHeight: '60vh',
    },
    button: {
        margin: theme.spacing.unit,
    },
});

class TodoList extends Component {
    state = {
        selectedTodoList: {
            todoListId: "",
            todoListName: "",
            todoListDescription: ""
        },
        todoDialogOpen: false,
    }
    openTodoDialog = (todoListId, todoListName, todoListDescription) => {
        this.setState({
            selectedTodoList: {
                todoListId,
                todoListName,
                todoListDescription
            },
            todoDialogOpen: true
        })
    }
    closeTodoDialog = () => {
        this.setState({
            selectedTodoList: {
                todoListId: "",
                todoListName: "",
                todoListDescription: ""
            },
            todoDialogOpen: false
        })
    }
    render() {
        const { todoLists, isEditor, isAdmin, classes } = this.props;
        return (
            <Paper className={classes.paper}>
                <List>
                    <TodoDialog
                        isEditor={isEditor}
                        todoList={this.state.selectedTodoList}
                        closeTodoDialog={this.closeTodoDialog}
                        todoDialogOpen={this.state.todoDialogOpen}
                    />
                    {todoLists.map(({ _id, name, description }) => {
                        return (
                            <ListItem key={_id}>
                                <ListItemText
                                    primary={name}
                                    secondary={description}
                                />
                                {isAdmin ? (
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            color="primary"
                                            onClick={() => this.openTodoDialog(_id, name, description)}
                                        >
                                            <PageviewIcon />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => this.props.deleteTodoList(_id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                ) : null}
                            </ListItem>
                        )
                    })}
                </List>
            </Paper>
        )
    }
}

TodoList.propTypes = {
    classes: PropTypes.object.isRequired,
    deleteTodoList: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    todo: state.todo
})
export default connect(mapStateToProps, { deleteTodoList })(withStyles(styles)(TodoList));
