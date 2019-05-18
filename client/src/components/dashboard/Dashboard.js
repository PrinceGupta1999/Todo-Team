import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTodoLists } from "../../actions/todoListActions";
import { getNotifications } from "../../actions/notificationActions";
import Navbar from "./Navbar";
import TodoList from "./TodoList";
import socketIOClient from 'socket.io-client';
import {
    Grid,
    AppBar,
    Tabs,
    Tab,
    withStyles,
    Typography
} from '@material-ui/core';

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

const styles = theme => ({
    container: {
        marginTop: theme.spacing.unit * 3,
    },
});


class Dashboard extends Component {
    state = {
        server: "http://localhost:5000",
        value: 0
    }

    componentDidMount() {
        const socket = socketIOClient(this.state.server)
        this.props.getNotifications();
        this.props.getTodoLists();
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { user } = this.props.auth;
        const { value } = this.state;
        const { notifications } = this.props.notification;
        const { todoLists, loading } = this.props.todoList;
        const { classes } = this.props;
        return (
            <Fragment>
                <Navbar userName={user.name} notificationCount={notifications.length} />
                <Grid container justify="center">
                    <Grid item xs={11} sm={9} className={classes.container}>
                        <AppBar position="static">
                            <Tabs value={value} onChange={this.handleChange} variant="fullWidth">
                                <Tab label="Created" />
                                <Tab label="Editable" />
                                <Tab label="Viewable" />
                            </Tabs>
                        </AppBar>
                        {value === 0 &&
                            <TabContainer>
                                <TodoList
                                    loading={loading}
                                    todoLists={todoLists.admin}
                                    isAdmin={true}
                                    isEditor={true} />
                            </TabContainer>}
                        {value === 1 &&
                            <TabContainer>
                                <TodoList
                                    loading={loading}
                                    todoLists={todoLists.edit}
                                    isAdmin={false}
                                    isEditor={true} />
                            </TabContainer>}
                        {value === 2 &&
                            <TabContainer>
                                <TodoList
                                    loading={loading}
                                    todoLists={todoLists.view}
                                    isAdmin={false}
                                    isEditor={false} />
                            </TabContainer>}
                    </Grid>
                </Grid>
            </Fragment>
        );
    }
}

Dashboard.propTypes = {
    getTodoLists: PropTypes.func.isRequired,
    getNotifications: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    notification: PropTypes.object.isRequired,
    todoList: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    notification: state.notification,
    todoList: state.todoList
});

export default connect(
    mapStateToProps,
    { getNotifications, getTodoLists }
)(withStyles(styles)(Dashboard));
