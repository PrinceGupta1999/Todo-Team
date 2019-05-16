import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTodoLists } from "../../actions/todoListActions";
import { getNotifications } from "../../actions/notificationActions";
import Navbar from "./Navbar";
import socketIOClient from 'socket.io-client';

class Dashboard extends Component {
    state = {
        server: "http://localhost:5000"
    }

    componentDidMount() {
        const socket = socketIOClient(this.state.server)
        this.props.getNotifications();
        this.props.getTodoLists();
    }

    render() {
        const { user } = this.props.auth;
        const { notifications } = this.props.notification;
        const { todoLists } = this.props.todoList;
        return (
            <div>
                <Navbar userName={user.name} notificationCount={notifications.length} />
            </div>
        );
    }
}

Dashboard.propTypes = {
    getTodoLists: PropTypes.func.isRequired,
    getNotifications: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    notification: PropTypes.object.isRequired,
    todoList: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    notification: state.notification,
    todoList: state.todoList
});

export default connect(
    mapStateToProps,
    { getNotifications, getTodoLists }
)(Dashboard);
