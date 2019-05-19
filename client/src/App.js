import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

import socketIOClient from 'socket.io-client';

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import Landing from "./components/layout/Landing";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";

var socket;
const theme = createMuiTheme({
    typography: {
        useNextVariants: true
    }
});
// Check for token to keep user logged in
if (localStorage.jwtToken) {
    // Set auth token header auth
    const token = localStorage.jwtToken;
    setAuthToken(token);
    // Decode token and get user info and exp
    const decoded = jwt_decode(token);
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));
    // Check for expired token
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
        // Logout user
        store.dispatch(logoutUser());
        window.location.href = '/';
    }
}
class App extends Component {
    constructor() {
        super();
        socket = socketIOClient('https://aqueous-caverns-72878.herokuapp.com/')
    }
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Provider store={store}>
                    <Router>
                        <div className="App">
                            <Route exact path="/" component={Landing} />
                            <Switch>
                                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                            </Switch>
                        </div>
                    </Router>
                </Provider>
            </MuiThemeProvider>
        );
    }
}
export { App, socket };
