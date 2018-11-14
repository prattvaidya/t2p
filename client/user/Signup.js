import React, {Component} from 'react'
import Card, {CardActions, CardContent} from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import {create} from './api-user.js'
import Dialog, {DialogActions, DialogContent, DialogContentText, DialogTitle} from 'material-ui/Dialog'
import {Link} from 'react-router-dom'

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
  }
})

class Signup extends Component {
  state = {
      first_name: '',
      last_name: '',
      password: '',
      email: '',
      open: false,
      error: ''
  }

  handleChange = name => event => {
    this.setState({[name]: event.target.value})
  }

  handleKeyPress = () => event => {
    console.log(event)
    if (event.key == "Enter") {
      this.clickSubmit()
    }
  }

  clickSubmit = () => {
    const user = {
      first_name: this.state.first_name || undefined,
      last_name: this.state.last_name || undefined,
      email: this.state.email || undefined,
      password: this.state.password || undefined
    }
    create(user).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({error: '', open: true})
      }
    })
  }

  render() {
    const {classes} = this.props
    return (<div>
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            Sign Up
          </Typography>
          <TextField id="first_name" label="First Name" className={classes.textField} value={this.state.first_name} onChange={this.handleChange('first_name')} autoFocus="true" margin="normal"/><br/>
          <TextField id="last_name" label="Last Name" className={classes.textField} value={this.state._last_name} onChange={this.handleChange('last_name')} margin="normal"/><br/>
          <TextField id="email" type="email" label="Email" className={classes.textField} value={this.state.email} onChange={this.handleChange('email')} margin="normal"/><br/>
          <TextField id="password" type="password" label="Password" className={classes.textField} value={this.state.password} onChange={this.handleChange('password')} onKeyPress={this.handleKeyPress()} margin="normal"/>
          <br/> {
            this.state.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {this.state.error}</Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="raised" onClick={this.clickSubmit} className={classes.submit}>Submit</Button>
        </CardActions>
      </Card>
      <Dialog open={this.state.open} disableBackdropClick={true}>
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New account successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/signin">
            <Button color="primary" autoFocus="autoFocus" variant="raised">
              Sign In
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>)
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Signup)
