import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles, colors} from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import List, {ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from 'material-ui/List'
import Card, {CardActions, CardContent} from 'material-ui/Card'
import Icon from 'material-ui/Icon'
import TextField from 'material-ui/TextField'
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
import {registerPartner} from '../user/api-user.js'

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
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing.unit * 2
  }
})

class Partner extends Component {
  constructor({match}) {
    super()
    this.state = {
      user: {},
      partner: {},
      redirectToSignin: false,
      btnText: '',
      email: '',
      password: '',
      error: '',
      showPartnerLogin: false
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
        this.setState({
          partner: data,
          email: jwt.user.email
        })
      }
    })

    read({
      userId: jwt.user._id
    }, {t: jwt.token}).then((data) => {
      if (data.error) {
        this.setState({redirectToSignin: true})
      } else {
        let btnText = this.checkRegistration(data)
        this.setState({user: data, btnText: btnText})
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
    return match == undefined ? "Register" : "Unregister";
  }

  handlePartnerLoginSubmit = () => {
    this.clickRegisterButton("submitRegistrationLogin");
  }

  clickRegisterButton = (callApi) => {
    debugger;
    if (callApi == "register") {
      this.setState({
        showPartnerLogin: true,
        btnText: "Cancel"
      });
    }
    else if (callApi == "cancel") {
      this.setState({
        showPartnerLogin: false,
        btnText: "Register"
      });
    }
    else if (callApi == "submitRegistrationLogin") {
      if (this.state.email != "" && this.state.password != "") {
        debugger;
        const partnerCredentials = {
          email: this.state.email,
          password: this.state.password
        }
        const jwt = auth.isAuthenticated()
        registerPartner({
            userId: jwt.user._id
          }, {
            t: jwt.token
          }, 
          this.state.partner._id,
          partnerCredentials
        ).then((data) => {
          if (data.error) {
            this.setState({error: data.error})
          } else {
            this.setState({
              showPartnerLogin: false,
              btnText: "Unregister"
            })
          }
        })
      }
    }
    else if (callApi.name == "unregisterPartner") {
      const jwt = auth.isAuthenticated()
      callApi({
        userId: jwt.user._id
      }, {
        t: jwt.token
      }, this.state.partner._id).then((data) => {
        if (data.error) {
          this.setState({error: data.error})
        } else {
          this.setState({btnText: "Register"})
        }
      })
    }
  }

  handleChange = name => event => {
    this.setState({[name]: event.target.value})
  }

  handleKeyPress = () => event => {
    console.log(event)
    if (event.key == "Enter") {
      this.clickRegisterButton("submitRegistrationLogin");
    }
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
      <React.Fragment>
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
              <RegisterPartnerButton btnText={this.state.btnText} onButtonClick={this.clickRegisterButton}/>
            </ListItem>
            <Divider/>
            <ListItem>
              <ListItemText primary={this.state.partner.about} secondary={"Joined: " + (
                new Date(this.state.partner.created)).toDateString()}/>
            </ListItem>
          </List>
        </Paper>
        {console.log(this.state.showPartnerLogin)}
        {this.state.showPartnerLogin && (
          <Card className={classes.card}>
            <CardContent>
              <Typography type="title" className={classes.title}>
                    Log in to Partner
              </Typography>
              <TextField id="email" type="email" label="Email" className={classes.textField} value={this.state.email} onChange={this.handleChange('email')} autoFocus margin="normal"/><br/>
              <TextField id="password" type="password" label="Password" className={classes.textField} value={this.state.password} onChange={this.handleChange('password')} onKeyPress={this.handleKeyPress()} margin="normal"/>
              <br/> 
              {this.state.error && (
                <Typography component="p" color="error">
                  <Icon color="error" className={classes.error}>error</Icon>
                  {this.state.error}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button color="primary" variant="raised" onClick={this.handlePartnerLoginSubmit} className={classes.submit}>Submit</Button>
            </CardActions>
          </Card>
        )}
      </React.Fragment>
    )
  }
}
Partner.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Partner)
