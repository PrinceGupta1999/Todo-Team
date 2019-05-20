import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Login from './Login';
import Register from './Register';
import {
    AppBar,
    Tabs,
    Tab,
    Typography,
} from '@material-ui/core';


function TabContainer(props) {
    return (
        <Typography component="div">
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

class Auth extends React.Component {
    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { value } = this.state;
        return (
            <Fragment>
                <AppBar position="static">
                    <Tabs value={value} onChange={this.handleChange} variant="fullWidth">
                        <Tab label="Login" />
                        <Tab label="Register" />
                    </Tabs>
                </AppBar>
                {value === 0 && <TabContainer><Login isSelected={value === 0} /></TabContainer>}
                {value === 1 && <TabContainer><Register isSelected={value === 1} /></TabContainer>}
            </Fragment>
        );
    }
}

export default Auth;
