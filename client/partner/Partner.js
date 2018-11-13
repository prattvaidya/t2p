import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles, colors} from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import List, {ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Edit from 'material-ui-icons/Edit'
import Divider from 'material-ui/Divider'
import auth from '../auth/auth-helper'
import {read} from '../user/api-user.js'
import {readPartner} from './api-partner.js'
import {Redirect, Link} from 'react-router-dom'
import RegisterPartnerButton from '../partner/RegisterPartnerButton'

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
  }
})

class Partner extends Component {
  constructor({match}) {
    super()
    this.state = {
      user: {},
      partner: {},
      redirectToSignin: false,
      registered: false
    }
    this.match = match
  }
  init = (partnerId) => {
    const jwt = auth.isAuthenticated()
    
    readPartner({
      partnerId: partnerId
    }, {t: jwt.token}).then((data) => {
      if (data.error) {
        this.setState({redirectToSignin: true})
      } else {
        this.setState({partner: data})
      }
    })

    read({
      userId: jwt.user._id
    }, {t: jwt.token}).then((data) => {
      if (data.error) {
        this.setState({redirectToSignin: true})
      } else {
        let registered = this.checkRegistration(data) === undefined ? false : true
        this.setState({user: data, registered: registered})
      }
    })
  }
  componentWillReceiveProps = (props) => {
    this.init(props.match.params.partnerId)
  }
  componentDidMount = () => {
    this.init(this.match.params.partnerId)
  }
  checkRegistration = (user) => {
    const jwt = auth.isAuthenticated()
    const match = user.partners.find((ptnr)=> {
      return ptnr._id == this.state.partner._id
    })
    return match
  }
  clickRegisterButton = (callApi) => {
    const jwt = auth.isAuthenticated()
    callApi({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, this.state.partner._id).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({registered: !this.state.registered})
      }
    })
  }
  render() {
    const {classes} = this.props
    const photoUrl = this.state.partner._id
              ? `/api/partners/photo/${this.state.partner._id}?${new Date().getTime()}`
              : '/api/partners/defaultphoto'
    const redirectToSignin = this.state.redirectToSignin
    if (redirectToSignin) {
      return <Redirect to='/signin'/>
    }
    return (
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Partner
        </Typography>
        <List dense>
          <ListItem>
            <ListItemAvatar>
              <Avatar src={photoUrl} className={classes.bigAvatar}/>
            </ListItemAvatar>
            <ListItemText primary={this.state.partner.name} secondary={this.state.partner.industry}/> 
            <RegisterPartnerButton registered={this.state.registered} onButtonClick={this.clickRegisterButton}/>
          </ListItem>
          <Divider/>
          <ListItem>
            <ListItemText primary={this.state.partner.about} secondary={"Joined: " + (
              new Date(this.state.partner.created)).toDateString()}/>
          </ListItem>
        </List>
      </Paper>
    )
  }
}
Partner.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Partner)
