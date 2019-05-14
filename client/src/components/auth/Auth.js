import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Login from './Login';
import Register from './Register';
import {
    AppBar,
    Tabs,
    Tab,
    Typography,
    Grid
} from '@material-ui/core';


function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
});

class Auth extends React.Component {
    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { classes } = this.props;
        const { value } = this.state;

        return (
            <div className={classes.root}>
                <Grid container>
                    <Grid item xs={6}>
                        <AppBar position="static">
                            <Tabs value={value} onChange={this.handleChange} variant="fullWidth">
                                <Tab label="Login" />
                                <Tab label="Register" />
                            </Tabs>
                        </AppBar>
                        {value === 0 && <TabContainer><Login isSelected={value === 0} /></TabContainer>}
                        {value === 1 && <TabContainer><Register isSelected={value === 1} /></TabContainer>}
                    </Grid>
                </Grid>
            </div>
        );
    }
}

Auth.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Auth);
