
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { redeemPoints, fetchRedeemPartners } from './api-transactions'
import { myPartners } from '../user/api-user'
import auth from './../auth/auth-helper'

import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import Grid from "material-ui/Grid";
import Select from 'react-select'
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
  },
  select: {
    fontFamily: 'Roboto',
    marginTop: '2%'
  }
})

class Exchange extends Component {
  state = {
    partners: [],
    redeemPartners: [],

    fromPartnerList: [],
    redeemPartnerList: [],
    redeemPartnerDenominations: [],

    fromPartner: {},
    redeemPartner: {},
    selectedDenomination: {},

    points: '',
    conversionFactor: 0,
    partner1balance: 0,
    requiredPoints: 0,

    displayExchangeFields: false,
    error: '',
    open: false
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
    // if (name == "points") {
    //debugger;
    // this.convertPoints((event.target.value == "" ? 1 : event.target.value), this.state.fromPartner, this.state.redeemPartner);
    // }
  }

  handleRedeemPartnerDropdownChange = (selectedOption) => {
    this.setState({ redeemPartner: selectedOption });

    this.convertPoints(this.state.points, this.state.fromPartner, selectedOption, this.state.partner1balance);

    this.toggleExchangeFieldsDisplay(this.state.fromPartner, selectedOption);

    //this.fetchBalance(undefined, selectedOption);
    this.populateDenominations(selectedOption)
    this.setState({ selectedDenomination: {} })
  }

  handleDenominationDropdownChange = (selectedOption) => {
    this.setState({ selectedDenomination: selectedOption })

    this.convertPoints(this.state.points, this.state.fromPartner, this.state.redeemPartner, this.state.partner1balance);
  }

  handlePartnerDropdownChange = (selectedOption) => {
    this.setState({ fromPartner: selectedOption });
    // let toPartners = [];
    // toPartners = this.state.fromPartnerList.filter((p) => {
    //   return p.value != selectedOption.value;
    // });
    // this.setState({ toPartnerList: toPartners });
    //this.setState({ toPartnerList: this.state.fromPartnerList });

    this.toggleExchangeFieldsDisplay(selectedOption, this.state.redeemPartner);

    const balance = this.fetchBalance(selectedOption, undefined);

    this.convertPoints(this.state.points, selectedOption, this.state.redeemPartner, balance);
  }

  convertPoints(points, fromPartner, redeemPartner, balance) {
    //debugger;
    let partner1 = this.state.partners.find((p) => {
      return p._id == (fromPartner.value != undefined ? fromPartner.value : "");
    });

    let partner2 = this.state.redeemPartners.find((p) => {
      return p._id == (redeemPartner.value != undefined ? redeemPartner.value : "");
    });

    if (partner1 != undefined && partner2 != undefined) {
      let fromPartnerRate = partner1.partner.conversion_rate;
      let redeemPartnerRate = partner2.conversion_rate;

      let conversionFactor = ((fromPartnerRate * (points == "" ? 1 : points)) / redeemPartnerRate).toFixed(2)
      // console.log(conversionFactor)
      this.setState({ conversionFactor: conversionFactor });

      let requiredPoints = ((parseFloat(this.state.selectedDenomination.value)) / conversionFactor).toFixed(2)
      this.setState({ requiredPoints: requiredPoints });
      // console.log(requiredPoints, this.state.partner1balance, requiredPoints > parseFloat(this.state.partner1balance))
      if (requiredPoints > parseFloat(balance)) {
        this.setState({ error: 'Unsufficient balance!' })
      }
      else {
        this.setState({ error: '' })
      }
    }
  }

  fetchBalance(fromPartner, toPartner) {
    let partner = this.state.partners.find((p) => {
      return p._id == (fromPartner != undefined ? fromPartner.value : "");
    });

    if (partner != undefined) {
      this.setState({ partner1balance: partner.points });
    }

    return partner.points
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

  populateDenominations(redeemPartner) {
    let partner = this.state.redeemPartners.find((p) => {
      return p._id == (redeemPartner.value != undefined ? redeemPartner.value : "");
    });

    let denominationList = [];
    partner.denominations.forEach(p => {
      denominationList.push({
        value: p,
        label: p
      })
    })
    this.setState({ redeemPartnerDenominations: denominationList })
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

    fetchRedeemPartners({
      t: jwt.token
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        this.setState({ redeemPartners: data })
        let redeemPartnerList = [];
        this.state.redeemPartners.forEach(p => {
          redeemPartnerList.push({
            value: p._id,
            label: p.name
          })
        })

        this.setState({ redeemPartnerList: redeemPartnerList });
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

      let redeem_partner = this.state.redeemPartners.find((p) => {
        return p._id == (this.state.redeemPartner.value != undefined ? this.state.redeemPartner.value : "");
      })._id;

      const info = {
        userPartner1XRId: this.state.fromPartner.value || undefined,
        redeemPartnerId: this.state.redeemPartner.value || undefined,
        debit_partner: debit_partner,
        redeem_partner: redeem_partner,
        user: jwt.user,
        // partner1points: (this.state.partner1balance - this.state.points).toFixed(2),
        // partner2points: (parseFloat(this.state.partner2balance) + parseFloat(this.state.conversionFactor)).toFixed(2)
        partner1points: (parseFloat(this.state.requiredPoints)).toFixed(2),
        redeemPoints: (parseFloat(this.state.selectedDenomination.value)).toFixed(2)
      }
      // console.log(info)
      redeemPoints(info, {
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
            <Grid item xs={12} sm={6} lg={4}></Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <div style={{ paddingLeft: "5%", paddingRight: "5%", paddingTop: "5%" }}>
                <Typography type="headline" component="h2" className={classes.title}>
                  Step 1 - Select Gift Card:
            </Typography>
                <Select className={classes.select}
                  options={this.state.redeemPartnerList}
                  onChange={this.handleRedeemPartnerDropdownChange}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}></Grid>

            <Grid item xs={12} sm={6} lg={4}></Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <div style={{ paddingLeft: "5%", paddingRight: "5%" }}>
                <Typography type="headline" component="h2" className={classes.title}>
                  Step 2 - Select a Denomination:
            </Typography>
                <Select className={classes.select}
                  value={this.state.selectedDenomination}
                  options={this.state.redeemPartnerDenominations}
                  onChange={this.handleDenominationDropdownChange}
                  placeholder="Select..."
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}></Grid>

            <Grid item xs={12} sm={6} lg={4}></Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <div style={{ paddingLeft: "5%", paddingRight: "5%", paddingBottom: "5%" }}>
                <Typography type="headline" component="h2" className={classes.title}>
                  Step 3 - Redeem points from:
            </Typography>
                <Select className={classes.select}
                  options={this.state.fromPartnerList}
                  onChange={this.handlePartnerDropdownChange}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}></Grid>

          </Grid>
          {this.state.displayExchangeFields && (
            <div className={classes.card}>
              <Typography type="headline" component="h2" className={classes.card} style={{ textAlign: "left", marginLeft: "25%" }}>
                <b>{this.state.points == "" ? 1 : this.state.points}</b> {this.state.fromPartner.label} point(s) = <b>{this.state.conversionFactor}</b> {this.state.redeemPartner.label} point(s)
        </Typography>
              <Typography type="headline" component="h2" style={{ textAlign: "left", marginLeft: "25%" }}>
                Available Balance: <b>{this.state.partner1balance.toFixed(2)}</b>
              </Typography>
              <Typography type="headline" component="h2" style={{ textAlign: "left", marginLeft: "25%" }}>
                Required Points: <b>{this.state.requiredPoints}</b>
              </Typography>
              {/* <TextField id="points" label="Enter points to redeem" className={classes.textField} value={this.state.points} onChange={this.handleChange('points')} autoFocus margin="normal" style={{ marginTop: "10%" }} /> */}

              <br /> {
                this.state.error && (<Typography component="p" color="error">
                  <Icon color="error" className={classes.error}>error</Icon>
                  {this.state.error}</Typography>)
              }

              <br /><br />
              <Button color="primary" variant="raised" onClick={this.clickSubmit} className={classes.submit} disabled={this.state.error != ''}>Redeem</Button>
            </div>
          )}
        </div>
        <Dialog open={this.state.open} disableBackdropClick={true}>
          <DialogTitle>Redeem</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Points redeemed successfully.
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
