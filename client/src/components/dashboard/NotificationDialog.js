import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
    Dialog,
    ListItemText,
    ListItem,
    List,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Slide,
    ListItemSecondaryAction,
} from '@material-ui/core';
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from '@material-ui/icons/Delete';

const styles = {
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
};

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class NotificationDialog extends React.Component {

    render() {
        const { classes, notificationDialogOpen } = this.props;
        const { notifications } = this.props.notification;
        return (
            <div>
                <Dialog
                    fullScreen
                    open={notificationDialogOpen}
                    onClose={this.props.toggleNotificationDialog}
                    TransitionComponent={Transition}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                onClick={this.props.toggleNotificationDialog}
                                aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography
                                variant="h6"
                                color="inherit"
                                className={classes.flex}
                            >Notifications
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <List>
                        {notifications.map(({ todoListName, permission, userName }) => {
                            return (
                                <ListItem>
                                    <ListItemText
                                        primary={todoListName}
                                        secondary={userName + " invites you to "
                                            + permission + "his/her TodoList"}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}
                    </List>
                </Dialog>
            </div >
        );
    }
}

NotificationDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    notification: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    notification: state.notification
})

export default connect(mapStateToProps)(withStyles(styles)(NotificationDialog));