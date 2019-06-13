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
import { refreshUser } from "../actions/auth";
import NavBarResponsive from "./NavBarResponsive";
import NewConnection from "./NewConnection";

//this is the parent component of all the logged in stuff

class Dashboard extends Component {
  componentDidMount() {
    //this function refreshes the user token every 100 sec
    setInterval(() => {
      refreshUser();
    }, 100000);
  }
  render() {
    if (this.props.isLoading) {
      this.props.fetchUserData();
      return (
        <div>
          <NavBar />
          <LeftPart />
          <NavBarResponsive />
          <div className="view">
            <Spinner />
          </div>
        </div>
      );
    }
    return (
      <div>
        <NavBar />
        {/*these two are static components and will not change in any route change */}
        <LeftPart />
        <NavBarResponsive />
        <div className="view">
          <Switch>
            {/* rendering components according to routes */}
            <Route
              key="my-sites"
              path="/dashboard/my-sites"
              exact
              render={props => <MySite {...props} />}
            />
            <Route
              key="new-connection"
              path="/dashboard/new-connection"
              exact
              render={props => <NewConnection {...props} />}
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

//this function connects our redux states to the props of this componets which are then passed on to all the children componets

const mapStateToProps = state => ({
  isLoading: state.userdata.isLoading
});

//exporting the component with a method of react-redux library to have acccesss to redux states

export default connect(
  mapStateToProps,
  { fetchUserData }
)(Dashboard);
