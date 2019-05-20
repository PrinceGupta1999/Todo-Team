import React, { Component } from "react";
import Auth from "../auth/Auth";
import {
    Grid,
    Typography,
    withStyles
} from "@material-ui/core";
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
        flexGrow: 1,
        minHeight: '100vh',
        padding: theme.spacing.unit * 2,
    },
    text: {
        color: '#fff',
        textAlign: 'center'
    },
    list: {
        color: '#fff',
    }
});

class Landing extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Grid container className={classes.root} alignItems="center" justify="center">
                <Grid item xs={12} sm={6}>
                    <Grid container justify="center">
                        <Typography component="h3" variant="h3" className={classes.text}>Welcome to Todo Team</Typography>
                        <Typography variant="subtitle1" className={classes.text}>A Collaborative Todo and Todo List Management WebApp</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={10} sm={6} lg={5}>
                    <Auth />
                </Grid>
            </Grid>

        );
    }
}

Landing.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Landing);
