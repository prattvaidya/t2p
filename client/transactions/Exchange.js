
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import Grid from "material-ui/Grid";
import Select from 'react-select'
import { exchangePoints } from './api-transactions'
import { myPartners } from '../user/api-user'
import auth from './../auth/auth-helper'
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog'
import { Link } from 'react-router-dom'

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
  select: {
    fontFamily: 'Roboto'
  }
})

class Exchange extends Component {
  state = {
    partners: [],
    fromPartnerList: [],
    toPartnerList: [],
    fromPartner: {},
    toPartner: {},
    points: '',
    conversionFactor: 0,
    displayExchangeFields: false,
    partner1balance: 0,
    partner2balance: 0,
    error: '',
    open: false
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
    if (name == "points") {
      //debugger;
      this.convertPoints((event.target.value == "" ? 1 : event.target.value), this.state.fromPartner, this.state.toPartner);
    }
  }

  handleFromDropdownChange = (selectedOption) => {
    this.setState({ fromPartner: selectedOption });
    let toPartners = [];
    toPartners = this.state.fromPartnerList.filter((p) => {
      return p.value != selectedOption.value;
    });
    this.setState({ toPartnerList: toPartners });
    //this.setState({ toPartnerList: this.state.fromPartnerList });

    this.convertPoints(this.state.points, selectedOption, this.state.toPartner);

    this.toggleExchangeFieldsDisplay(selectedOption, this.state.toPartner);

    this.fetchBalance(selectedOption, undefined);
  }

  handleToDropdownChange = (selectedOption) => {
    this.setState({ toPartner: selectedOption });

    this.convertPoints(this.state.points, this.state.fromPartner, selectedOption);

    this.toggleExchangeFieldsDisplay(this.state.fromPartner, selectedOption);

    this.fetchBalance(undefined, selectedOption);
  }

  convertPoints(points, fromPartner, toPartner) {
    //debugger;
    let partner1 = this.state.partners.find((p) => {
      return p._id == (fromPartner.value != undefined ? fromPartner.value : "");
    });

    let partner2 = this.state.partners.find((p) => {
      return p._id == (toPartner.value != undefined ? toPartner.value : "");
    });

    if (partner1 != undefined && partner2 != undefined) {
      let fromPartnerRate = partner1.partner.conversion_rate;
      let toPartnerRate = partner2.partner.conversion_rate;

      this.setState({ conversionFactor: ((fromPartnerRate * (points == "" ? 1 : points)) / toPartnerRate).toFixed(2) });
    }
  }

  fetchBalance(fromPartner, toPartner) {
    let partner = this.state.partners.find((p) => {
      return p._id == (fromPartner != undefined ? fromPartner.value : "");
    });

    if (partner != undefined) {
      this.setState({ partner1balance: partner.points });
    }

    let partner2 = this.state.partners.find((p) => {
      return p._id == (toPartner != undefined ? toPartner.value : "");
    });

    if (partner2 != undefined) {
      this.setState({ partner2balance: partner2.points });
    }
  }

  toggleExchangeFieldsDisplay(fromPartner, toPartner) {
    //debugger;
    let fromPartnerValue = fromPartner.value;
    let toPartnerValue = toPartner.value;
    if (fromPartnerValue != undefined && toPartnerValue != undefined) {
      this.setState({ displayExchangeFields: true });
    }
    else {
      this.setState({ displayExchangeFields: false });
    }
  }

  componentDidMount = () => {
    //this.userData = new FormData()
    const jwt = auth.isAuthenticated()
    myPartners({
      userId: jwt.user._id
    }, {
        t: jwt.token
      }).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          this.setState({ partners: data })
          let partnerList = [];
          this.state.partners.forEach(p => {
            partnerList.push({
              value: p._id,
              label: p.partner.name
            })
          })

          this.setState({ fromPartnerList: partnerList });
        }
      })
  }
  clickSubmit = () => {

    if (this.state.points > this.state.partner1balance) {
      this.setState({ error: 'Points are greater than the Available Balance' })
    }
    else {

      const jwt = auth.isAuthenticated();

      let debit_partner = this.state.partners.find((p) => {
        return p._id == (this.state.fromPartner.value != undefined ? this.state.fromPartner.value : "");
      }).partner._id;

      let credit_partner = this.state.partners.find((p) => {
        return p._id == (this.state.toPartner.value != undefined ? this.state.toPartner.value : "");
      }).partner._id;

      const info = {
        userPartner1XRId: this.state.fromPartner.value || undefined,
        userPartner2XRId: this.state.toPartner.value || undefined,
        debit_partner: debit_partner,
        credit_partner: credit_partner,
        user: jwt.user,
        // partner1points: (this.state.partner1balance - this.state.points).toFixed(2),
        // partner2points: (parseFloat(this.state.partner2balance) + parseFloat(this.state.conversionFactor)).toFixed(2)
        partner1points: (parseFloat(this.state.points)).toFixed(2),
        partner2points: (parseFloat(this.state.conversionFactor)).toFixed(2)
      }

      exchangePoints(info, {
        t: jwt.token
      }).then((data) => {
        if (data.error) {
          this.setState({ error: data.error })
        } else {
          this.setState({ error: '', open: true })
        }
      })

    }
  }

  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <div>
          <Grid container spacing={24}>
            <Grid item xs={6} sm={6}>
              <div style={{ padding: "10%" }}>
                <Typography type="headline" component="h2" className={classes.title}>
                  Exchange points from:
            </Typography>
                <Select className={classes.select}
                  options={this.state.fromPartnerList}
                  onChange={this.handleFromDropdownChange}
                />
              </div>
            </Grid>
            <Grid item xs={6} sm={6}>
              <div style={{ padding: "10%" }}>
                <Typography type="headline" component="h2" className={classes.title}>
                  Exchange points to:
            </Typography>
                <Select className={classes.select}
                  options={this.state.toPartnerList}
                  onChange={this.handleToDropdownChange}
                />
              </div>
            </Grid>
          </Grid>
          {this.state.displayExchangeFields && (
            <div className={classes.card}>
              <Typography type="headline" component="h2" className={classes.card} style={{ textAlign: "left", marginLeft: "25%" }}>
                <b>{this.state.points == "" ? 1 : this.state.points}</b> {this.state.fromPartner.label} point(s) = <b>{this.state.conversionFactor}</b> {this.state.toPartner.label} point(s)
        </Typography>
              <Typography type="headline" component="h2" style={{ textAlign: "left", marginLeft: "25%" }}>
                Available Balance: <b>{this.state.partner1balance.toFixed(2)}</b>
              </Typography>
              <TextField id="points" label="Enter points to exchange" className={classes.textField} value={this.state.points} onChange={this.handleChange('points')} autoFocus margin="normal" style={{ marginTop: "10%" }} />

              <br /> {
                this.state.error && (<Typography component="p" color="error">
                  <Icon color="error" className={classes.error}>error</Icon>
                  {this.state.error}</Typography>)
              }

              <br /><br />
              <Button color="primary" variant="raised" onClick={this.clickSubmit} className={classes.submit}>Submit</Button>
            </div>
          )}
        </div>
        <Dialog open={this.state.open} disableBackdropClick={true}>
          <DialogTitle>Exchange</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Points exchanged successfully.
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
      </React.Fragment>
    )
  }
}

Exchange.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Exchange)
