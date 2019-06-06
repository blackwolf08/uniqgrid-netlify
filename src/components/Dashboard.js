import React, { Component } from "react";
import NavBar from "./NavBar";
import LeftPart from "./LeftPart";
import { Route, Switch } from "react-router-dom";
import MySite from "./MySite";
import MyDevice from "./MyDevice";
import MyRequests from "./MyRequests";
import MyProfile from "./MyProfile";
import FeedBack from "./FeedBack";
import ConnectionInfo from "./ConnectionInfo";
import { fetchUserData } from "../actions/userData";
import { connect } from "react-redux";
import Spinner from "../images/index";

class Dashboard extends Component {
  render() {
    if (this.props.isLoading) {
      this.props.fetchUserData();
      return (
        <div>
          <NavBar />
          <LeftPart />
          <div className="view">
            <Spinner />
          </div>
        </div>
      );
    }
    return (
      <div>
        <NavBar />
        <LeftPart />
        <div className="view">
          <Switch>
            <Route
              key="my-sites"
              path="/dashboard/my-sites"
              exact
              render={props => <MySite {...props} />}
            />
            <Route
              key="my-sites"
              path="/dashboard/my-device"
              render={props => <MyDevice {...props} />}
            />
            <Route
              key="my-requests"
              path="/dashboard/my-requests"
              render={props => <MyRequests {...props} />}
            />
            <Route
              key="my-feedback"
              path="/dashboard/feedback"
              render={props => <FeedBack {...props} />}
            />
            <Route
              key="my-profile"
              path="/dashboard/my-profile"
              render={props => <MyProfile {...props} />}
            />
            <Route
              key="my-sites/:id"
              path="/dashboard/my-sites/:id"
              render={props => <ConnectionInfo {...props} />}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.userdata.isLoading
});

export default connect(
  mapStateToProps,
  { fetchUserData }
)(Dashboard);
