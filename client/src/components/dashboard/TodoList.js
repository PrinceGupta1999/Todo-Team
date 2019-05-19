import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { setErrors } from "../../actions/errorActions";
import ChipInput from 'material-ui-chip-input'
import { deleteTodoList, createTodoList } from "../../actions/todoListActions";
import {
    Paper,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    IconButton,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Typography,
    TextField,
    Grid,
    Button,
    Divider,
    CircularProgress
} from '@material-ui/core';
import DeleteIcon from "@material-ui/icons/Delete";
import PageviewIcon from "@material-ui/icons/Pageview";
import TodoDialog from "./TodoDialog.js";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
        margin: theme.spacing.unit * 2,
    },
    heading: {
        fontSize: theme.typography.pxToRem(20),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    progress: {
        margin: theme.spacing.unit * 2,
    },
});

class TodoList extends Component {
    state = {
        selectedTodoList: {
            todoListId: "",
            todoListName: "",
            todoListDescription: ""
        },
        createdTodoList: {
            name: "",
            description: "",
            view: [],
            edit: []
        },
        errors: {},
        todoDialogOpen: false,
    }


    componentWillReceiveProps(nextProps) {
        this.setState({
            errors: nextProps.error.errors
        })
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
    onChange = name => e => {
        if (Object.entries(this.state.errors).length !== 0) {
            this.props.setErrors({});
        }
        var newCreatedTodoList = { ...this.state.createdTodoList };
        newCreatedTodoList[name] = e.target.value;
        this.setState({
            createdTodoList: newCreatedTodoList
        })
    }

    addChip = (chip, name) => {
        if (Object.entries(this.state.errors).length !== 0) {
            this.props.setErrors({});
        }
        var newCreatedTodoList = { ...this.state.createdTodoList };
        newCreatedTodoList[name].push(chip);
        this.setState({
            createdTodoList: newCreatedTodoList
        })
    }

    deleteChip = (chip, index, name) => {
        if (Object.entries(this.state.errors).length !== 0) {
            this.props.setErrors({});
        }
        var newCreatedTodoList = { ...this.state.createdTodoList };
        newCreatedTodoList[name].splice(index, 1);
        this.setState({
            createdTodoList: newCreatedTodoList
        })
    }

    onSubmit = e => {
        e.preventDefault()
        this.props.createTodoList(this.state.createdTodoList)
    }
    render() {
        const { todoLists, isEditor, isAdmin, classes, loading } = this.props;
        const { errors } = this.state;
        return (
            <Paper className={classes.paper}>
                <TodoDialog
                    isEditor={isEditor}
                    todoList={this.state.selectedTodoList}
                    closeTodoDialog={this.closeTodoDialog}
                    todoDialogOpen={this.state.todoDialogOpen}
                />
                {loading ? (
                    <Grid container justify="center">
                        <CircularProgress className={classes.progress} />
                    </Grid>
                ) : null}

                {todoLists.length ? (
                    <List>
                        {todoLists.map(({ _id, name, description }) => {
                            return (
                                <ListItem key={_id}>
                                    <ListItemText
                                        primary={name}
                                        secondary={description}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            color="primary"
                                            onClick={() => this.openTodoDialog(_id, name, description)}
                                        >
                                            <PageviewIcon />
                                        </IconButton>
                                        {isAdmin ? (
                                            <IconButton
                                                color="secondary"
                                                onClick={() => this.props.deleteTodoList(_id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        ) : null}
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}
                    </List>
                ) : null}
                {isAdmin ? (
                    <ExpansionPanel defaultExpanded>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Create Todo List</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container justify="center">
                                <form noValidate onSubmit={this.onSubmit} autoComplete="off">
                                    <TextField
                                        fullWidth
                                        required
                                        helperText={errors.name}
                                        error={errors.name !== undefined}
                                        label="Name"
                                        value={this.state.createdTodoList.name}
                                        onChange={this.onChange("name")}
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        required
                                        helperText={errors.description}
                                        error={errors.description !== undefined}
                                        label="Description"
                                        value={this.state.createdTodoList.description}
                                        onChange={this.onChange("description")}
                                        margin="normal"
                                    />
                                    <ChipInput
                                        fullWidth
                                        value={this.state.createdTodoList.edit}
                                        label="Editors"
                                        onAdd={(chip) => this.addChip(chip, 'edit')}
                                        onDelete={(chip, index) => this.deleteChip(chip, index, 'edit')}
                                    />
                                    <ChipInput
                                        fullWidth
                                        value={this.state.createdTodoList.view}
                                        label="Viewers"
                                        onAdd={(chip) => this.addChip(chip, 'view')}
                                        onDelete={(chip, index) => this.deleteChip(chip, index, 'view')}
                                    />
                                    <Divider />
                                    <Grid container justify="flex-end">
                                        <Button
                                            size="large"
                                            type="submit"
                                            variant="outlined"
                                            color="primary"
                                            className={classes.button}
                                        >Submit
                                    </Button>
                                    </Grid>
                                </form>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                ) : null}

            </Paper>
        )
    }
}

TodoList.propTypes = {
    classes: PropTypes.object.isRequired,
    deleteTodoList: PropTypes.func.isRequired,
    createTodoList: PropTypes.func.isRequired,
    setErrors: PropTypes.func.isRequired,
    error: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    error: state.error
})
export default connect(
    mapStateToProps,
    {
        deleteTodoList,
        setErrors,
        createTodoList,
    }
)(withStyles(styles)(TodoList));
