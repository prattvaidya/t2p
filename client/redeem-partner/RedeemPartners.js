
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import auth from '../auth/auth-helper'
import { list } from './api-redeem-partner.js'

import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import AddIcon from 'material-ui-icons/Add'
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog'
import List, { ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'

const styles = theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing.unit * 5,
        paddingBottom: theme.spacing.unit * 2
    },
    error: {
        verticalAlign: 'middle'
    },
    title: {
        marginTop: theme.spacing.unit * 2,
        color: theme.palette.openTitle
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 300
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing.unit * 2
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing.unit * 15,
        right: theme.spacing.unit * 15,
    },
    avatar: {
        marginRight: theme.spacing.unit * 1
    }
})

class RedeemPartners extends Component {
    state = {
        redeemPartners: [],
        open: false
    }

    clickSubmit = () => {
        const partner = {
            name: this.state.name || undefined,
            industry: this.state.industry || undefined,
            about: this.state.about || undefined,
            conversion_rate: this.state.conversion_rate || undefined
        }
        create(partner).then((data) => {
            if (data.error) {
                this.setState({ error: data.error })
            } else {
                this.setState({ error: '', open: true })
            }
        })
    }

    componentDidMount = () => {
        const jwt = auth.isAuthenticated()
        list({
            t: jwt.token
        }).then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({ redeemPartners: data })
            }
        })
    }

    render() {
        const { classes } = this.props
        return (<div>
            <Link to="/redeem-partners/add">
                <Button variant="fab" color="primary" aria-label="Add" className={classes.fab}>
                    <AddIcon />
                </Button>
            </Link>
            <Card className={classes.card}>
                <CardContent>
                    <Typography type="headline" component="h2" className={classes.title}>Redeem Partners</Typography>

                    <List>
                        {this.state.redeemPartners.map((item, i) => {
                            return <span key={i}>
                                <ListItem>
                                    <ListItemAvatar className={classes.avatar}>
                                        <Avatar src={'/api/redeem-partners/photo/' + item._id} />
                                    </ListItemAvatar>
                                    <Link to={"/redeem-partner/" + item._id}>
                                        <ListItemText primary={item.name} />
                                    </Link>
                                </ListItem>
                            </span>
                        })
                        }
                    </List>

                </CardContent>
                <CardActions>

                </CardActions>
            </Card>
            <Dialog open={this.state.open} disableBackdropClick={true}>
                <DialogTitle>New Partner</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        New partner successfully created.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Link to="/">
                        <Button color="primary" autoFocus="autoFocus" variant="raised">
                            Dashboard
                        </Button>
                    </Link>
                </DialogActions>
            </Dialog>
        </div>)
    }
}

RedeemPartners.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(RedeemPartners)
