import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import List, { ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import Divider from 'material-ui/Divider'
import Typography from 'material-ui/Typography'
import Grid from "material-ui/Grid";
import { Link } from 'react-router-dom'
import { myActivity } from '../transactions/api-transactions.js'
import auth from '../auth/auth-helper'
import Snackbar from 'material-ui/Snackbar'
import ViewIcon from 'material-ui-icons/Visibility'

const styles = theme => ({
    root: theme.mixins.gutters({
        padding: theme.spacing.unit,
        margin: 0
    }),
    title: {
        margin: `${theme.spacing.unit * 3}px ${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
        color: theme.palette.openTitle,
        fontSize: '1em'
    },
    avatar: {
        marginRight: theme.spacing.unit * 1
    },
    follow: {
        right: theme.spacing.unit * 2
    },
    snack: {
        color: theme.palette.protectedTitle
    },
    viewButton: {
        verticalAlign: 'middle'
    }
})
class Activity extends Component {
    state = {
        exchangeActivities: [],
        redeemActivities: []
    }
    componentDidMount = () => {
        const jwt = auth.isAuthenticated()
        myActivity({
            userId: jwt.user._id
        }, {
                t: jwt.token
            }).then((data) => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    const exchangeActivities = data.filter((p) => {
                        return p.activity_type == 'exchange';
                    });
                    const redeemActivities = data.filter((p) => {
                        return p.activity_type == 'redeem';
                    });
                    this.setState({
                        exchangeActivities: exchangeActivities,
                        redeemActivities: redeemActivities,
                    })
                }
            })
    }

    render() {
        const { classes } = this.props
        return (
            <div style={{ margin: 30 }}>
                <Grid container spacing={24}>
                    <Grid item xs={6} sm={6}>
                        <Paper className={classes.root} elevation={4}>
                            <Typography type="title" className={classes.title}>
                                Exchange History
                            </Typography>
                            <List>
                                {this.state.exchangeActivities.length == 0 && (
                                    <Typography variant="caption" align="center">
                                        Wow, such empty!
                                    </Typography>
                                )}
                                {this.state.exchangeActivities.map((item, i) => {
                                    return <span key={i}>
                                        <ListItem>
                                            <ListItemText primary={item.debit_points + " points from " + item.debit_partner.name} secondary="DEBITED" />
                                            <ListItemText style={{ textAlign: "right" }} primary={item.credit_points + " points to " + item.credit_partner.name} secondary="CREDITED" />
                                        </ListItem>
                                        {/* <ListItemSecondaryAction>
                                            <ListItemText primary={new Date(item.updated).getFullYear() + "-" + (new Date(item.updated).getMonth() + 1) + "-" + new Date(item.updated).getDate()} />
                                        </ListItemSecondaryAction> */}
                                    </span>
                                })
                                }
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Paper className={classes.root} elevation={4}>
                            <Typography type="title" className={classes.title}>
                                Redeemed Points History
                            </Typography>
                            <List>
                                {this.state.redeemActivities.length == 0 && (
                                    <Typography variant="caption" align="center">
                                        Wow, such empty!
                                    </Typography>
                                )}
                                {this.state.redeemActivities.map((item, i) => {
                                    return <span key={i}>
                                        <ListItem>
                                            <ListItemText primary={item.debit_points + " points from " + item.debit_partner.name} secondary="DEBITED" />
                                            <ListItemText style={{ textAlign: "right" }} primary={item.redeem_points + " points through " + item.redeem_partner.name} secondary="REDEEMED" />
                                        </ListItem>
                                        {/* <ListItemSecondaryAction>
                                            <ListItemText primary={new Date(item.updated).getFullYear() + "-" + (new Date(item.updated).getMonth() + 1) + "-" + new Date(item.updated).getDate()} />
                                        </ListItemSecondaryAction> */}
                                    </span>
                                })
                                }
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

Activity.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Activity)
