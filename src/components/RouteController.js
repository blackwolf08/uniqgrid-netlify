import React, { Component, lazy, Suspense } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import withAuth from '../hocs/withAuth';
import { connect } from 'react-redux';
import { authUser } from '../actions/auth';
import Spinner from '../images/index';
const ResetPassword = lazy(() => import('./Auth/ResetPassword'));
const AuthLogin = lazy(() => import('./Auth/AuthLogin'));
const Dashboard = lazy(() => import('./Dashboard/Dashboard'));
// import Check from "./Dashboard/Test/check";
// this components defines our routes and based upon the routes renders component

class RouteController extends Component {
  render() {
    const { authUser } = this.props;
    //
    return (
      <Suspense fallback={Spinner}>
        <Switch>
          {/* login route */}
          {/* AuthLogin component */}
          <Route
            path='/'
            exact
            render={props => <AuthLogin signin onAuth={authUser} {...props} />}
          />
          <Route path='/forgot-password' render={props => <ResetPassword />} />
          {/* if routed to dashboard check with hocs, if authenticated then give access */}
          {/* Dashboard component */}
          <Route path='/dashboard' component={withAuth(Dashboard)} />
          {/* this check route is for development purposes only */}
          {/* <Route path="/check" component={Check} /> */}
        </Switch>
      </Suspense>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { authUser }
  )(RouteController)
);
