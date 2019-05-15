import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { logoutUser } from "../../actions/authActions";
import { clearErrors } from "../../actions/errorActions";
import { withStyles } from '@material-ui/core/styles';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Badge,
    Menu,
    MenuItem,
    Avatar,
    Fab,
} from '@material-ui/core';
import deepOrange from "@material-ui/core/colors/deepOrange"
import NotificationsIcon from '@material-ui/icons/Notifications';

const styles = theme => ({
    root: {
        width: '100%',
    },
    title: {
        flexGrow: 1,
    },
    button: {
        marginRight: theme.spacing.unit * 2
    },
    avatar: {
        backgroundColor: deepOrange[500]
    },
});

class Navbar extends React.Component {
    state = {
        accountAnchor: null,
        notificationAnchor: null
    }
    getNameInitials = name => {
        var initials = name.match(/\b\w/g) || [];
        initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
        return initials
    }
    handleOpen = name => e => {
        this.setState({
            [name + 'Anchor']: e.currentTarget
        })
        console.log(this.state)
    }
    handleClose = name => e => {
        this.setState({
            [name + 'Anchor']: null
        })
    }
    render() {
        const { classes } = this.props;
        const { notificationAnchor, accountAnchor } = this.state;
        const { user } = this.props.auth;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography className={classes.title} variant="h6" color="inherit">
                            TODO Team
                            </Typography>
                        <IconButton
                            className={classes.button}
                            color="inherit"
                            onClick={this.handleOpen('notification')}>
                            <Badge badgeContent={11} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Menu
                            anchorEl={notificationAnchor}
                            open={Boolean(notificationAnchor)}
                            onClose={this.handleClose('notification')}>
                            <MenuItem onClick={this.handleClose('notification')}>My account</MenuItem>
                            <MenuItem onClick={this.handleClose('notification')}>Logout</MenuItem>
                            <MenuItem onClick={this.handleClose('notification')}>Profile</MenuItem>
                        </Menu>
                        <Fab
                            className={classes.button}
                            onClick={this.handleOpen('account')}
                            size="small">
                            <Avatar className={classes.avatar}>{this.getNameInitials(user.name)}</Avatar>
                        </Fab>
                        <Menu
                            anchorEl={accountAnchor}
                            open={Boolean(accountAnchor)}
                            onClose={this.handleClose('account')}>
                            <MenuItem onClick={this.handleClose('account')}>Hi! {user.name}</MenuItem>
                            <MenuItem onClick={() => this.props.logoutUser()}>Logout</MenuItem>
                        </Menu>

                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

Navbar.propTypes = {
    classes: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
})
export default connect(
    mapStateToProps,
    {
        logoutUser,
        clearErrors
    }
)(withStyles(styles)(Navbar));