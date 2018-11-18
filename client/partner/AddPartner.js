
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Card, {CardActions, CardContent} from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'

import {create} from './api-partner.js'
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

class AddPartner extends Component {
  state = {
      name: '',
      industry: '',
      about: '',
      conversion_rate: ''
  }

  handleChange = name => event => {
    this.setState({[name]: event.target.value})
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
            Add Partner
          </Typography>
          <TextField id="name" label="Name" className={classes.textField} value={this.state.name} onChange={this.handleChange('name')} autoFocus margin="normal"/><br/>
          <TextField id="industry" label="Industry" className={classes.textField} value={this.state.industry} onChange={this.handleChange('industry')} margin="normal"/><br/>
          <TextField id="conversion_rate" label="Conversion Rate" className={classes.textField} value={this.state.conversion_rate} onChange={this.handleChange('conversion_rate')} margin="normal"/><br/>
          <TextField
            id="multiline-flexible"
            label="About"
            multiline
            rows="2"
            value={this.state.about}
            onChange={this.handleChange('about')}
            className={classes.textField}
            margin="normal"
          />
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

AddPartner.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(AddPartner)
