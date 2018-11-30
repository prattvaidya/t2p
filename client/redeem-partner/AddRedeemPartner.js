
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import auth from '../auth/auth-helper'
import { create } from './api-redeem-partner.js'

import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import Chip from 'material-ui/Chip'
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog'

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

class AddRedeemPartner extends Component {
  state = {
    name: '',
    category: '',
    tnc: '',
    conversion_rate: '',
    denominations: [],
    chipData: [
      // { key: 0, label: 'Angular' },
      // { key: 1, label: 'jQuery' }
    ],
    open: false,
    enteredDenomination: ''
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  handleKeyPress = () => event => {
    if (event.key == "Enter") {
      this.addDenomination(event.target.value)
    }
  }

  handleBlur = () => event => {
    this.addDenomination(event.target.value)
  }

  addDenomination = (denomination) => {
    if (denomination != '' && parseInt(denomination) > 0) {
      if (!isNaN(denomination)) {
        if (!this.state.denominations.includes(parseInt(denomination))) {
          let chipDataCopy = this.state.chipData
          chipDataCopy.push({
            key: this.state.chipData.length,
            label: parseInt(denomination)
          })

          let denominationsCopy = this.state.denominations
          denominationsCopy.push(parseInt(denomination))

          this.setState({
            chipData: chipDataCopy,
            denominations: denominationsCopy,
            enteredDenomination: ''
          })
        }
      }
    }
  }

  clickSubmit = () => {
    const jwt = auth.isAuthenticated()
    const redeemPartner = {
      name: this.state.name || undefined,
      category: this.state.category || undefined,
      tnc: this.state.tnc || undefined,
      conversion_rate: this.state.conversion_rate || undefined,
      denominations: this.state.denominations || undefined
    }
    create(redeemPartner, {
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        this.setState({ error: data.error })
      } else {
        this.setState({ error: '', open: true })
      }
    })
  }

  handleDelete = data => () => {
    this.setState(state => {
      const chipData = [...state.chipData];
      const chipToDelete = chipData.indexOf(data);
      chipData.splice(chipToDelete, 1);
      return { chipData };
    });
  };

  render() {
    const { classes } = this.props
    return (<div>
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            Add Redeem Partner
          </Typography>
          <TextField id="name" label="Name" className={classes.textField} value={this.state.name} onChange={this.handleChange('name')} autoFocus margin="normal" /><br />
          <TextField id="category" label="Category" className={classes.textField} value={this.state.category} onChange={this.handleChange('category')} margin="normal" /><br />
          <TextField id="conversion_rate" label="Conversion Rate" className={classes.textField} value={this.state.conversion_rate} onChange={this.handleChange('conversion_rate')} margin="normal" /><br />
          <TextField
            id="multiline-flexible"
            label="TnC"
            multiline
            rows="2"
            value={this.state.tnc}
            onChange={this.handleChange('tnc')}
            className={classes.textField}
            margin="normal"
          />
          <TextField id="denominations" label="Denominations" className={classes.textField} value={this.state.enteredDenomination} onChange={this.handleChange('enteredDenomination')} onKeyPress={this.handleKeyPress()} onBlur={this.handleBlur()} margin="normal" /><br />
          {this.state.chipData.map(data => {
            // let icon = null;

            // if (data.label === 'React') {
            //   icon = <TagFacesIcon />;
            // }

            return (
              <Chip
                key={data.key}
                // icon={icon}
                label={data.label}
                onDelete={this.handleDelete(data)}
              // className={classes.chip}
              />
            );
          })}
          <br /> {
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
        <DialogTitle>New Redeem Partner</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New Redeem Partner successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/redeem-partners">
            <Button color="primary" autoFocus="autoFocus" variant="raised">
              Dashboard
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>)
  }
}

AddRedeemPartner.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(AddRedeemPartner)
