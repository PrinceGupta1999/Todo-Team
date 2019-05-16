import React from 'react';
import PropTypes from 'prop-types';
import NotificationsDialog from './NotificationDialog';
import { logoutUser } from "../../actions/authActions";
import { connect } from "react-redux";
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
        notificationDialogOpen: false
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
    }
    handleClose = name => e => {
        this.setState({
            [name + 'Anchor']: null
        })
    }

    toggleNotificationDialog = () => {
        this.setState({
            notificationDialogOpen: !this.state.notificationDialogOpen
        })
    }
    render() {
        const { classes, userName } = this.props;
        const { accountAnchor } = this.state;
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
                            onClick={this.toggleNotificationDialog}>
                            <Badge badgeContent={11} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                            <NotificationsDialog toggleNotificationDialog={this.toggleNotificationDialog} notificationDialogOpen={this.state.notificationDialogOpen} />
                        </IconButton>
                        <Fab
                            className={classes.button}
                            onClick={this.handleOpen('account')}
                            size="small">
                            <Avatar className={classes.avatar}>{this.getNameInitials(userName)}</Avatar>
                        </Fab>
                        <Menu
                            anchorEl={accountAnchor}
                            open={Boolean(accountAnchor)}
                            onClose={this.handleClose('account')}>
                            <MenuItem onClick={this.handleClose('account')}>Hi! {userName}</MenuItem>
                            <MenuItem onClick={this.props.logoutUser}>Logout</MenuItem>
                        </Menu>

                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

Navbar.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({

})

export default connect(mapStateToProps, { logoutUser })(withStyles(styles)(Navbar));