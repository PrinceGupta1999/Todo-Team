import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { handleNotification } from '../../actions/notificationActions';
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
    Grid,
    Button,
    CircularProgress,
} from '@material-ui/core';
import CloseIcon from "@material-ui/icons/Close";

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    header: {
        marginTop: theme.spacing.unit * 4,
    },
    margin: {
        marginRight: theme.spacing.unit * 1,
    },
    progress: {
        margin: theme.spacing.unit * 2,
    },
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class NotificationDialog extends React.Component {

    render() {
        const { classes, notificationDialogOpen } = this.props;
        const { notifications } = this.props.notification;
        return (
            <Dialog
                fullScreen
                open={notificationDialogOpen}
                onClose={this.props.closeNotificationDialog}
                TransitionComponent={Transition}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            onClick={this.props.closeNotificationDialog}
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
                {this.props.notification.loading ? (
                    <Grid container justify="center">
                        <CircularProgress className={classes.progress} />
                    </Grid>
                ) : null}
                {notifications.length === 0 && !this.props.notification.loading ? (
                    <Grid
                        container
                        justify="center"
                        alignItems="center"
                    >
                        <Grid item>
                            <Typography variant="h6" className={classes.header}>
                                All Caught Up! Yeh!!!
                            </Typography>
                        </Grid>
                    </Grid>
                ) : (
                        <List>
                            {notifications.map(({ _id, todoListName, permission, userName }) => {
                                return (
                                    <ListItem key={_id}>
                                        <ListItemText
                                            primary={todoListName}
                                            secondary={userName + " invites you to "
                                                + permission + " his/her TodoList"}
                                        />
                                        <ListItemSecondaryAction>
                                            <Button
                                                className={classes.margin}
                                                color="primary"
                                                variant="outlined"
                                                onClick={() => this.props.handleNotification(_id, true)}
                                                size="small"
                                            >ACCEPT
                                            </Button>
                                            <Button
                                                className={classes.margin}
                                                color="secondary"
                                                variant="outlined"
                                                onClick={() => this.props.handleNotification(_id, false)}
                                                size="small"
                                            >DECLINE
                                            </Button>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            })}
                        </List>
                    )}
            </Dialog>
        );
    }
}

NotificationDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    notification: PropTypes.object.isRequired,
    handleNotification: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    notification: state.notification
})

export default connect(mapStateToProps, { handleNotification })(withStyles(styles)(NotificationDialog));