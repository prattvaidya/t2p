import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './core/Home'
import Users from './user/Users'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import Verify from './auth/Verify'
import EditProfile from './user/EditProfile'
import Profile from './user/Profile'
import AddPartner from './partner/AddPartner'
import Partner from './partner/Partner'
import RedeemPartners from './redeem-partner/RedeemPartners'
import AddRedeemPartner from './redeem-partner/AddRedeemPartner'
import Exchange from './transactions/Exchange'
import Redeem from './transactions/Redeem'
import Activity from './transactions/Activity'
import PrivateRoute from './auth/PrivateRoute'
import Menu from './core/Menu'

class MainRouter extends Component {
  // Removes the server-side injected CSS when React component mounts
  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render() {
    return (<div>
      <Menu />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/users" component={Users} />
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={Signin} />
        <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
        <Route path="/user/:userId" component={Profile} />
        <Route path="/partner/add" component={AddPartner} />
        <Route path="/redeem-partners/add" component={AddRedeemPartner} />
        <Route path="/redeem-partners/" component={RedeemPartners} />
        <Route path="/partner/:partnerId" component={Partner} />
        <Route path="/exchange" component={Exchange} />
        <Route path="/redeem" component={Redeem} />
        <Route path="/activity" component={Activity} />
        <Route path="/verify/:verificationString" component={Verify} />
      </Switch>
    </div>)
  }
}

export default MainRouter
