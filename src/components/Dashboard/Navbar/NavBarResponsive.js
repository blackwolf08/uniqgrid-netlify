import React from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem
} from "reactstrap";
import logo from "../../../images/logo.svg";
import { Link } from "react-router-dom";
import { logout } from "../../../actions/auth";
import { connect } from "react-redux";

class NavBarResponsive extends React.Component {
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  logout = () => {
    this.props.logout();
  };

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }
  render() {
    return (
      <div className="navbar-responsive-2" style={{ zIndex: "1000" }}>
        <Navbar
          color="faded"
          style={{
            backgroundColor: "rgb(38, 50, 56)",
            color: "white",
            position: "absolute",
            top: "0",
            width: "100%"
          }}
          light
        >
          <NavbarBrand href="/dashboard/my-sites" className="mr-auto">
            <img className="logo" alt="logo" src={logo} />
          </NavbarBrand>
          <NavbarToggler
            onClick={this.toggleNavbar}
            className="mr-2 ham-burger"
          />
          <Collapse
            style={{ color: "white", backgroundColor: "rgb(38, 50, 56)" }}
            className="collapse"
            isOpen={!this.state.collapsed}
            navbar
          >
            <Nav navbar>
              <Link to="/dashboard/my-sites">
                <NavItem className="res-nav">My Sites</NavItem>
              </Link>
              <Link to="/dashboard/my-device">
                <NavItem className="res-nav">My Device</NavItem>
              </Link>
              <Link to="/dashboard/my-requests">
                <NavItem className="res-nav">My Requests</NavItem>
              </Link>
              <Link to="/dashboard/feedback">
                <NavItem className="res-nav">Feedback</NavItem>
              </Link>
              <Link to="/dashboard/my-profile">
                <NavItem className="res-nav">My Profile</NavItem>
              </Link>
              <NavItem onClick={this.logout} className="res-nav">
                Logout
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { logout }
)(NavBarResponsive);
