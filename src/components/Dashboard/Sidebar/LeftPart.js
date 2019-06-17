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
    //this function changes the highlighted menu according to url
    this.changeHighlighted();
  }

  //change according to the highlighted component
  changeHighlighted = () => {
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
    } else if (url.includes("new-connection")) {
      this.setState({
        mysite: "leftpart-menu bg-active"
      });
    } else {
      this.setState({
        myprofile: "leftpart-menu bg-active"
      });
    }
  };

  render() {
    //get short name of the user to be displayed in the circle
    let shortName = "";
    if (typeof this.props.data !== "undefined") {
      let nameArr = this.props.data.name.split(" ");
      nameArr.splice(0, 1);
      nameArr.forEach(e => {
        shortName += e[0].toUpperCase();
      });
    }
    return (
      <div className="left-part flex flex-col">
        <div className="circle">
          <p>{shortName}</p>
        </div>
        <Link
          style={{ width: "100%" }}
          className="link-p"
          to="/dashboard/my-sites"
        >
          <button className={this.state.mysite}>
            <i className="fas fa-house-damage" /> My Site
          </button>
        </Link>
        <Link
          style={{ width: "100%" }}
          className="link-p"
          to="/dashboard/my-device"
        >
          <button className={this.state.mydevice}>
            <i className="fas fa-mobile-alt" /> My Device
          </button>
        </Link>
        <Link
          style={{ width: "100%" }}
          className="link-p"
          to="/dashboard/my-requests"
        >
          <button className={this.state.myrequests}>
            <i className="fas fa-ticket-alt" /> My Requests
          </button>
        </Link>
        <Link
          style={{ width: "100%" }}
          className="link-p"
          to="/dashboard/feedback"
        >
          <button className={this.state.feedback}>
            <i className="fas fa-star" /> FeedBack
          </button>
        </Link>

        <Link
          style={{ width: "100%" }}
          className="link-p"
          to="/dashboard/my-profile"
        >
          <button className={this.state.myprofile}>
            <i className="fas fa-user" /> My Profile
          </button>
        </Link>
      </div>
    );
  }
}

// we bring in this data to get the name of the user logged in

const mapStateToProps = state => ({
  data: state.userdata.customerInfo.data
});

export default connect(mapStateToProps)(LeftPart);
