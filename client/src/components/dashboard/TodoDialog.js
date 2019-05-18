import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTodos, deleteTodo, editTodo } from '../../actions/todoActions'
import { setErrors } from '../../actions/errorActions'
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
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    TextField,
    Slide,
    Divider,
    Grid,
    Button
} from '@material-ui/core';
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    button: {
        margin: theme.spacing.unit * 2,
    },
    heading: {
        fontSize: theme.typography.pxToRem(20),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    root: {
        flexGrow: 1,
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
            id: ""
        },
        createdTodo: {
            name: "",
        },
        errors: {}
    }
    componentDidUpdate(prevProps) {
        if (prevProps.todoList.todoListId === "")
            this.props.getTodos(this.props.todoList.todoListId);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            errors: nextProps.error.errors
        })
    }

    onChangePanel = todoId => (event, expanded) => {
        var newEditedTodo = { ...this.state.editedTodo }
        newEditedTodo.id = expanded ? todoId : ""
        newEditedTodo.name = ""
        newEditedTodo.index = ""
        this.setState({
            editedTodo: newEditedTodo
        })
    }

    onChangeCreate = name => e => {
        var newCreatedTodo = { ...this.state.createTodo }
        newCreatedTodo[name] = e.target.value
        this.setState({
            createdTodo: newCreatedTodo
        })
    }
    onChangeEdit = name => e => {
        var newEditedTodo = { ...this.state.editedTodo }
        newEditedTodo[name] = e.target.value
        this.setState({
            editedTodo: newEditedTodo
        })
    }

    onSubmitCreate = e => {
        e.preventDefault()
        this.props.createTodo(this.props.todoList.todoListId, this.state.editedTodo)
    }
    onSubmitCreate = e => {
        e.preventDefault()
        this.props.createTodo(this.props.todoList.todoListId, this.state.createTodo)
    }

    render() {
        const { classes, todoDialogOpen, isEditor } = this.props;
        const { todos } = this.props.todo;
        const { errors } = this.state;
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
                    </List>
                    {todos.map(({ _id, name, isBeingEdited, isComplete }, index) => {
                        return (
                            <ExpansionPanel
                                key={_id}
                                expanded={this.state.editedTodo.id === _id}
                                disabled={isBeingEdited || !isEditor}
                                onChange={this.onChangePanel(_id)}>
                                <ExpansionPanelSummary expandIcon={<EditIcon color="primary" />}>
                                    <Typography className={classes.heading}>{name}</Typography>
                                    {isEditor && !isBeingEdited ? (
                                        <Grid container justify="flex-end">
                                            <IconButton
                                                color="secondary"
                                                onClick={() => this.props.deleteTodo(todoListId, _id)}
                                                size="small"
                                            ><DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                    ) : null}
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <form
                                        noValidate
                                        onSubmit={this.onSubmitEdit}
                                        autoComplete="off"
                                        className={classes.root}>
                                        <Grid container justify="center" spacing={16} className={classes.root}>
                                            <Grid item xs={4}>
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
                                            <Grid item xs={4}>
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
                                            </Grid>
                                            <Grid item xs={4} sm={3} md={2}>
                                                <Button
                                                    size="large"
                                                    type="submit"
                                                    variant="outlined"
                                                    color="secondary"
                                                    className={classes.button}
                                                >Edit
                                                </Button>
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
                                        <Grid item xs={4} sm={3} md={2}>
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
                </Dialog>
            </Fragment>
        );
    }
}

TodoDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    todo: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
    editTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    todo: state.todo,
    auth: state.auth,
    error: state.error
})

export default connect(mapStateToProps, { getTodos, editTodo, deleteTodo, setErrors })(withStyles(styles)(TodoDialog));