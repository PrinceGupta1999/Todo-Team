import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../actions/authActions";
import { setErrors } from "../../actions/errorActions";
import { withStyles } from '@material-ui/core/styles';
import {
    Paper,
    Button,
    TextField,
    Grid
} from '@material-ui/core';


const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    button: {
        margin: theme.spacing.unit,
    }
});
class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }
        this.setState({
            errors: nextProps.error.errors
        });
    }

    onChange = name => e => {
        if (Object.entries(this.state.errors).length !== 0) {
            this.props.setErrors({});
        }

        this.setState({ [name]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();

        const userData = {
            email: this.state.email,
            password: this.state.password
        };

        this.props.loginUser(userData);
    };

    render() {
        const { errors } = this.state;
        const { classes, isSelected } = this.props;
        return (
            <Grid item xs={11}>
                <Paper className={classes.root} elevation={1}>
                    <form noValidate onSubmit={this.onSubmit} autoComplete="off">
                        <TextField
                            fullWidth
                            helperText={errors.email}
                            required={isSelected}
                            error={errors.email !== undefined}
                            label="Email"
                            value={this.state.email}
                            onChange={this.onChange("email")}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            helperText={errors.password}
                            required={isSelected}
                            type="password"
                            error={errors.password !== undefined}
                            label="Password"
                            value={this.state.password}
                            onChange={this.onChange("password")}
                            margin="normal"
                        />
                        <Grid container justify="flex-end">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.button}
                            >Login
                            </Button>
                        </Grid>
                    </form>
                </Paper>
            </Grid>
        );
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    setErrors: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    error: state.error
});

export default connect(
    mapStateToProps,
    {
        loginUser,
        setErrors
    }
)(withStyles(styles)(withRouter(Login)));
