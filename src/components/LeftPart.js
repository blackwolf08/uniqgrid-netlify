import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class LeftPart extends Component {
  state = {
    mysite: "leftpart-menu",
    mydevice: "leftpart-menu",
    myrequests: "leftpart-menu",
    feedback: "leftpart-menu",
    myprofile: "leftpart-menu"
  };

  componentDidMount() {
    let url = window.location.href;
    url = url.split("/");

    if (url.includes("my-sites")) {
      this.setState({
        mysite: "leftpart-menu bg-active"
      });
    } else if (url.includes("my-device")) {
      this.setState({
        mydevice: "leftpart-menu bg-active"
      });
    } else if (url.includes("my-requests")) {
      this.setState({
        myrequests: "leftpart-menu bg-active"
      });
    } else if (url.includes("feedback")) {
      this.setState({
        feedback: "leftpart-menu bg-active"
      });
    } else {
      this.setState({
        myprofile: "leftpart-menu bg-active"
      });
    }
  }

  render() {
    let shortName = "";
    if (typeof this.props.data !== "undefined") {
      let nameArr = this.props.data.name.split(" ");
      nameArr.forEach(e => {
        shortName += e[0].toUpperCase();
      });
    }
    return (
      <div className="left-part flex flex-col">
        <div className="circle">
          <p>{shortName}</p>
        </div>
        <button className={this.state.mysite}>
          <Link
            style={{ width: "100%", height: "100%" }}
            className="link-p"
            to="/dashboard/my-sites"
          >
            My Site
          </Link>
        </button>
        <button className={this.state.mydevice}>
          <Link
            style={{ width: "100%", height: "100%" }}
            className="link-p"
            to="/dashboard/my-device"
          >
            My Device
          </Link>
        </button>
        <button className={this.state.myrequests}>
          <Link
            style={{ width: "100%", height: "100%" }}
            className="link-p"
            to="/dashboard/my-requests"
          >
            My Requests
          </Link>
        </button>
        <button className={this.state.feedback}>
          <Link
            style={{ width: "100%", height: "100%" }}
            className="link-p"
            to="/dashboard/feedback"
          >
            FeedBack
          </Link>
        </button>
        <button className={this.state.myprofile}>
          <Link
            style={{ width: "100%", height: "100%" }}
            className="link-p"
            to="/dashboard/my-profile"
          >
            My Profile
          </Link>
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.userdata.customerInfo.data
});

export default connect(mapStateToProps)(LeftPart);
