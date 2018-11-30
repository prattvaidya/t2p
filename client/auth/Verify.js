import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles, colors } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import List, { ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Icon from 'material-ui/Icon'
import TextField from 'material-ui/TextField'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Edit from 'material-ui-icons/Edit'
import Divider from 'material-ui/Divider'
import auth from './auth-helper'
import { verify } from './api-auth'
import { Redirect, Link } from 'react-router-dom'


const styles = theme => ({
    root: theme.mixins.gutters({
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 5
    }),
    title: {
        margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px 0`,
        color: theme.palette.protectedTitle,
        fontSize: '1em'
    },
    bigAvatar: {
        width: 60,
        height: 60,
        margin: 10
    },
    card: {
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        padding: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 5
    },
    error: {
        verticalAlign: 'middle'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 300
    },
    signin: {
        margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px 0`,
        marginBottom: theme.spacing.unit * 2
    }
})

class Verify extends Component {
    constructor({ match }) {
        super()
        this.state = {
            verified: undefined,
            error: ''
        }
        this.match = match
    }
    init = (verificationString) => {

        verify({
            verificationString: verificationString
        }).then((data) => {
            if (data.error) {
                this.setState({
                    error: data.error,
                    verified: false
                })
            } else {
                this.setState({
                    verified: true
                })
            }
        })
    }
    componentWillReceiveProps = (props) => {
        this.init(props.match.params.verificationString)
    }
    componentDidMount = () => {
        this.init(this.match.params.verificationString)
    }


    render() {
        const { classes } = this.props

        return (
            <React.Fragment>
                <Paper className={classes.root} elevation={4}>
                    <Typography type="title" className={classes.title}>
                        {this.state.verified == true && 'Verification successful!'}
                        {this.state.verified == false && 'Verification failed!'}
                    </Typography>
                    {this.state.verified == true && (
                        <span>
                            <br />
                            <Link to="/signin" className={classes.signin}>
                                <Button color="primary" autoFocus="autoFocus" variant="raised">
                                    Sign In
            </Button>
                            </Link>
                        </span>
                    )}

                </Paper>

            </React.Fragment>
        )
    }
}
Verify.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Verify)
