import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../actions/authActions";
import { withStyles } from '@material-ui/core/styles';
import { clearErrors } from "../../actions/errorActions";
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

        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onChange = name => e => {
        if (this.props.errors)
            this.props.clearErrors();
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
                            required={isSelected}
                            error={errors.email !== undefined}
                            label="Email"
                            value={this.state.email}
                            onChange={this.onChange("email")}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
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
    clearErrors: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    {
        loginUser,
        clearErrors
    }
)(withStyles(styles)(withRouter(Login)));
