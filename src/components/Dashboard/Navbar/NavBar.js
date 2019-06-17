import React, { Component } from "react";
import logo from "../../../images/logo.svg";
import { logout } from "../../../actions/auth";
import { fetchUserData } from "../../../actions/userData";
import { connect } from "react-redux";

class NavBar extends Component {
  //this logout function calls the logout function from the redux
  logout = e => {
    e.preventDefault();
    this.props.logout();
  };
  render() {
    return (
      <div className="flex navbar-responsive-1" style={style.root}>
        <div className="navbar-logo-div">
          <img src={logo} className="navbar-logo" alt="Uniqgrid" />
        </div>
        <div className="navbar-logout">
          <p onClick={this.logout}>Logout</p>
        </div>
      </div>
    );
  }
}

const style = {
  root: {
    height: "60px",
    width: "100%",
    backgroundColor: "rgb(38, 50, 56)",
    position: "fixed",
    top: 0
  }
};

const mapStateToProps = state => ({
  currentUser: state.currentUser
});

export default connect(
  mapStateToProps,
  { logout, fetchUserData }
)(NavBar);
