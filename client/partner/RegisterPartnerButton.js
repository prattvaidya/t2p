import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Button from 'material-ui/Button'
import {unregisterPartner} from '../user/api-user.js'

class RegisterPartnerButton extends Component {
  constructor() {
    super();
  }
  registerClick = () => {
    this.props.onButtonClick("register")
  }
  cancelClick = () => {
    this.props.onButtonClick("cancel")
  }
  unregisterClick = () => {
    this.props.onButtonClick(unregisterPartner)
  }
  render() {
    let markup = '';
    if (this.props.btnText == "Unregister")
      markup = <Button variant="raised" color="secondary" onClick={this.unregisterClick}>Unregister</Button>;
    else if (this.props.btnText == "Register")
      markup = <Button variant="raised" color="primary" onClick={this.registerClick}>Register</Button>;
    else
      markup = <Button variant="raised" color="default" onClick={this.cancelClick}>Cancel</Button>;

    return (<div>
      {markup}
    </div>)
  }
}
RegisterPartnerButton.propTypes = {
  btnText: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func.isRequired
}
export default RegisterPartnerButton
