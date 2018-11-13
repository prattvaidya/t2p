import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Button from 'material-ui/Button'
import {unregisterPartner, registerPartner} from '../user/api-user.js'

class RegisterPartnerButton extends Component {
  registerClick = () => {
    this.props.onButtonClick(registerPartner)
  }
  unregisterClick = () => {
    this.props.onButtonClick(unregisterPartner)
  }
  render() {
    return (<div>
      { this.props.registered
        ? (<Button variant="raised" color="secondary" onClick={this.unregisterClick}>Unregister</Button>)
        : (<Button variant="raised" color="primary" onClick={this.registerClick}>Register</Button>)
      }
    </div>)
  }
}
RegisterPartnerButton.propTypes = {
  registered: PropTypes.bool.isRequired,
  onButtonClick: PropTypes.func.isRequired
}
export default RegisterPartnerButton
