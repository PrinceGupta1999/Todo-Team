import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTodos, deleteTodo, editTodo, createTodo } from '../../actions/todoActions';
import { deleteTodoLocal, editTodoLocal, createTodoLocal, setTodos } from '../../actions/todoActions';
import classNames from 'classnames';
import { setErrors } from '../../actions/errorActions';
import { withStyles } from '@material-ui/core/styles';
import { socket } from '../../App';
import {
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    ListItemText,
    ListItem,
    List,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    TextField,
    Slide,
    Divider,
    Grid,
    Button,
    FormControl,
    FormGroup,
    FormControlLabel,
    Switch,
    CircularProgress,
} from '@material-ui/core';
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SaveIcon from "@material-ui/icons/Save";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropUp";


const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    button: {
        margin: theme.spacing.unit,
    },
    heading: {
        fontSize: theme.typography.pxToRem(20),
        flexBasis: '66%',
        flexShrink: 0,
    },
    root: {
        flexGrow: 1,
    },
    list: {
        padding: 0,
    },
    complete: {
        textDecoration: 'line-through'
    },
    progress: {
        margin: theme.spacing.unit * 2,
    },
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class TodoDialog extends React.Component {
    state = {
        editedTodo: {
            name: "",
            index: "",
            id: "",
            isComplete: false
        },
        createdTodo: {
            name: "",
        },
        errors: {},
        alertOpen: false
    }
    componentDidMount() {
        // Setting up socket events
        socket.on('edit-todo', todo => {
            var index = this.props.todos.findIndex(({ _id }) => _id.toString() === todo._id.toString())
            if (index !== -1)
                this.props.editTodoLocal({
                    todo,
                    index
                })
        })
        socket.on('delete-todo', todoId => {
            this.props.deleteTodoLocal(todoId)
        })
        socket.on('create-todo', ({ todoListId, todo }) => {
            if (this.props.todoList.todoListId === todoListId)
                this.props.createTodoLocal(todo)
        })
        socket.on('delete-todolist', todoListId => {
            if (this.props.todoList.todoListId === todoListId) {
                this.setState({
                    alertOpen: true
                })
                this.handleClose()
            }
        })
    }
    // Close Alert Dialog
    closeAlert = () => {
        this.setState({
            alertOpen: false
        })
    }
    // Fired on Closing The Dialog
    handleClose = () => {
        if (this.state.editedTodo.id !== "") {
            socket.emit('todo-edit-end', this.state.editedTodo.id)
        }
        this.setState({
            editedTodo: {
                name: "",
                index: "",
                id: "",
                isComplete: false
            },
            createdTodo: {
                name: "",
            },
            errors: {}
        })
        this.props.setTodos([])
        this.props.closeTodoDialog()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.todoList.todoListId === "")
            this.props.getTodos(this.props.todoList.todoListId);
    }

    // componentWillReceiveProps(nextProps) {
    //     this.setState({
    //         errors: nextProps.error.errors,
    //     })
    // }

    onChangePanel = (id, name, index, isComplete) => (event, expanded) => {
        // To handle event when changing panels
        if (this.state.editedTodo.id !== "" && this.state.editedTodo.id !== id) {
            socket.emit('todo-edit-end', this.state.editedTodo.id)
        }
        var newEditedTodo = { ...this.state.editedTodo }
        newEditedTodo.id = expanded ? id : ""
        newEditedTodo.name = expanded ? name : ""
        newEditedTodo.index = expanded ? index : ""
        newEditedTodo.isComplete = expanded ? isComplete : false
        this.setState({
            editedTodo: newEditedTodo
        })

        // Socket Events for handling other clients know todo state
        if (expanded) {
            socket.emit('todo-edit-begin', id)
        }
        else {
            socket.emit('todo-edit-end', id)
        }
    }

    onChangeCreate = name => e => {
        var newCreatedTodo = { ...this.state.createTodo }
        newCreatedTodo[name] = e.target.value
        this.setState({
            createdTodo: newCreatedTodo
        })
    }
    onRearrange = index => {
        var newEditedTodo = { ...this.state.editedTodo }
        newEditedTodo.index = index
        this.setState({
            editedTodo: newEditedTodo
        }, () => this.props.editTodo(this.props.todoList.todoListId, this.state.editedTodo))
        
    }
    onChangeEdit = name => e => {
        var newEditedTodo = { ...this.state.editedTodo }
        if (name === 'isComplete') {
            newEditedTodo[name] = e.target.checked
        }
        else
            newEditedTodo[name] = e.target.value
        this.setState({
            editedTodo: newEditedTodo
        })
    }
    onSubmitEdit = e => {
        e.preventDefault()
        this.props.editTodo(this.props.todoList.todoListId, this.state.editedTodo)
    }
    onSubmitCreate = e => {
        e.preventDefault()
        this.props.createTodo(this.props.todoList.todoListId, this.state.createdTodo)
    }

    render() {
        const { classes, todoDialogOpen, isEditor } = this.props;
        const { todos } = this.props.todo;
        const { errors } = this.state;
        // const userId = this.props.auth.id;
        const { todoListId, todoListName, todoListDescription } = this.props.todoList
        return (
            <Fragment>
                <Dialog
                    fullScreen
                    open={todoDialogOpen}
                    onClose={this.handleClose}
                    TransitionComponent={Transition}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                onClick={this.handleClose}
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
                    <List className={classes.list}>
                        <ListItem key={todoListId}>
                            <ListItemText
                                primary="Description"
                                secondary={todoListDescription}
                            />
                        </ListItem>
                        <Divider />
                    </List>
                    {this.props.todo.loading ? (
                        <Grid container justify="center">
                            <CircularProgress className={classes.progress} />
                        </Grid>
                    ) : null}
                    <Grid container justify="center">
                        <Grid item xs={12} sm={11} md={9}>
                            {todos.map(({ _id, name, isBeingEdited, isComplete }, index) => {
                                return (
                                    <ExpansionPanel
                                        key={_id}
                                        expanded={this.state.editedTodo.id === _id}
                                        disabled={(isBeingEdited && _id.toString() !== this.state.editedTodo.id)
                                            || !isEditor}
                                        onChange={this.onChangePanel(_id, name, index, isComplete)}>
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography
                                                className={classNames(classes.heading, isComplete ? classes.complete : null)}
                                            >
                                                {name}
                                            </Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            <form
                                                noValidate
                                                onSubmit={this.onSubmitEdit}
                                                autoComplete="off"
                                                className={classes.root}>
                                                <Grid container justify="center" spacing={16} className={classes.root}>
                                                    <Grid item xs={8} md={9}>
                                                        <TextField
                                                            required
                                                            fullWidth
                                                            helperText={errors.name}
                                                            error={errors.name !== undefined}
                                                            label="Name"
                                                            value={this.state.editedTodo.name}
                                                            onChange={this.onChangeEdit("name")}
                                                            margin="normal"
                                                        />
                                                    </Grid>
                                                    {/* <Grid item xs={2}>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            type="number"
                                                            helperText={errors.index}
                                                            error={errors.index !== undefined}
                                                            label="Index"
                                                            value={this.state.editedTodo.index}
                                                            onChange={this.onChangeEdit("index")}
                                                            margin="normal"
                                                        />
                                                    </Grid> */}
                                                    <Grid item xs={4} md={3}>
                                                        <FormControl
                                                            margin="normal">
                                                            <FormGroup>
                                                                <FormControlLabel
                                                                    control={
                                                                        <Switch
                                                                            checked={this.state.editedTodo.isComplete}
                                                                            onChange={this.onChangeEdit('isComplete')}
                                                                            value={this.state.editedTodo.isComplete}
                                                                        />
                                                                    }
                                                                    label={this.state.editedTodo.isComplete ? 'Complete' : 'Incomplete'}
                                                                />
                                                            </FormGroup>
                                                        </FormControl>
                                                    </Grid>
                                                    <Divider />
                                                    <Grid item xs={6}>
                                                        <Grid container>
                                                            <Button
                                                                variant="contained"
                                                                color="default"
                                                                className={classes.button}
                                                                onClick={() => this.onRearrange(index - 1)}
                                                            >
                                                                Move Up
                                                                <ArrowDropUpIcon className={classes.rightIcon} />
                                                            </Button>
                                                            <IconButton
                                                                variant="contained"
                                                                color="default"
                                                                className={classes.button}
                                                                onClick={() => this.onRearrange(index + 1)}
                                                            >
                                                                Move Down
                                                                <ArrowDropDownIcon className={classes.rightIcon} />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Grid container justify="flex-end">
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                className={classes.button}
                                                                type="submit"
                                                            >
                                                                Save
                                                                <SaveIcon className={classes.rightIcon} />
                                                            </Button>
                                                            <IconButton
                                                                variant="contained"
                                                                color="default"
                                                                className={classes.button}
                                                                onClick={() => this.props.deleteTodo(todoListId, _id)}
                                                            >
                                                                Delete
                                                                <DeleteIcon className={classes.rightIcon} />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </form>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                )
                            })}
                            {isEditor ? (
                                <ExpansionPanel defaultExpanded>
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography className={classes.heading}>Create Todo</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <form
                                            noValidate
                                            onSubmit={this.onSubmitCreate}
                                            autoComplete="off"
                                            className={classes.root}>
                                            <Grid container justify="center">
                                                <Grid item xs={8}>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        helperText={errors.name}
                                                        error={errors.name !== undefined}
                                                        label="Name"
                                                        value={this.state.createdTodo.name}
                                                        onChange={this.onChangeCreate("name")}
                                                        margin="normal"
                                                    />
                                                </Grid>
                                                <Grid item xs={3} sm={3} md={2}>
                                                    <Button
                                                        size="large"
                                                        type="submit"
                                                        variant="outlined"
                                                        color="primary"
                                                        className={classes.button}
                                                    >Create
                                            </Button>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            ) : null}
                        </Grid>
                    </Grid>
                </Dialog>
                <Dialog
                    open={this.state.alertOpen}
                    onClose={this.closeAlert}
                >
                    <DialogContent>
                        <DialogContentText>
                            This Todo List has been Deleted the Creator. You need to refresh the page
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeAlert} color="primary" autoFocus>
                            Refresh
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

TodoDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    todo: PropTypes.object.isRequired,
    // auth: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
    editTodo: PropTypes.func.isRequired,
    createTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired,
    editTodoLocal: PropTypes.func.isRequired,
    createTodoLocal: PropTypes.func.isRequired,
    deleteTodoLocal: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    todo: state.todo,
    // auth: state.auth,
    error: state.error
})

export default connect(mapStateToProps, {
    getTodos, editTodo, deleteTodo, createTodo, setErrors, setTodos,
    editTodoLocal, deleteTodoLocal, createTodoLocal
})(withStyles(styles)(TodoDialog));