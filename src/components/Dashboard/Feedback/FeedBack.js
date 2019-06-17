import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";

class FeedBack extends Component {
  state = {
    //Dynamic class to add to star array
    onestar: "fas fa-star",
    twostar: "fas fa-star",
    threestar: "fas fa-star",
    fourstar: "fas fa-star",
    fivestar: "fas fa-star",
    //number of stars to send to backend
    numberOfStars: 0,
    isSubmitted: false
  };

  //functions that set 1/2/3/4/5 stars

  oneStar = () => {
    this.setState({
      onestar: "fas fa-star star-active",
      twostar: "fas fa-star",
      threestar: "fas fa-star",
      fourstar: "fas fa-star",
      fivestar: "fas fa-star",
      numberOfStars: 1
    });
    this.mouseLeave = function() {};
  };

  twoStar = () => {
    this.setState({
      onestar: "fas fa-star star-active",
      twostar: "fas fa-star star-active",
      threestar: "fas fa-star",
      fourstar: "fas fa-star",
      fivestar: "fas fa-star",
      numberOfStars: 2
    });
    this.mouseLeave = function() {};
  };

  threeStar = () => {
    this.setState({
      onestar: "fas fa-star star-active",
      twostar: "fas fa-star star-active",
      threestar: "fas fa-star star-active",
      fourstar: "fas fa-star",
      fivestar: "fas fa-star",
      numberOfStars: 3
    });
    this.mouseLeave = function() {};
  };

  fourStar = () => {
    this.setState({
      onestar: "fas fa-star star-active",
      twostar: "fas fa-star star-active",
      threestar: "fas fa-star star-active",
      fourstar: "fas fa-star star-active",
      fivestar: "fas fa-star",
      numberOfStars: 4
    });
    this.mouseLeave = function() {};
  };

  fiveStar = () => {
    this.setState({
      onestar: "fas fa-star star-active",
      twostar: "fas fa-star star-active",
      threestar: "fas fa-star star-active",
      fourstar: "fas fa-star star-active",
      fivestar: "fas fa-star star-active",
      numberOfStars: 5
    });
    this.mouseLeave = function() {};
  };

  mouseLeave = () => {
    this.setState({
      onestar: "fas fa-star",
      twostar: "fas fa-star",
      threestar: "fas fa-star",
      fourstar: "fas fa-star",
      fivestar: "fas fa-star"
    });
  };

  handleSubmit = () => {
    //handle API calls here for feedback backend, then set state to static and dont allow for another rating!!
    fetch(
      `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/vid/${
        this.props.vid
      }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`,
      {
        method: "POST",
        body: `{  "properties": [    
          {      "property": "feedback",
            "value": ${JSON.stringify(this.state.numberOfStars)}
          } 
     ]}`
      }
    )
      .then(() => {
        //Do someting after successfull submitting
        this.setState({
          isSubmitted: !this.state.isSubmitted
        });
      })
      .catch(res => {
        if (res.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }
      });
  };

  render() {
    return (
      <div className="feedback-root">
        <Helmet>
          <title>Feedback</title>
        </Helmet>
        <h1 className="mysites-heading">
          <i style={{ color: "black" }} className="fas fa-star icon-heading" />{" "}
          Feedback
        </h1>
        <div className="feedback-hero flex">
          <div className="feedback-form">
            {!this.state.isSubmitted && (
              <>
                <h1 className="feedback-form-heading">How are we doing?</h1>
                <div className="feedback-form-stars">
                  <i
                    onMouseEnter={this.oneStar}
                    onMouseLeave={this.mouseLeave}
                    className={this.state.onestar}
                    onClick={this.oneStar}
                  />{" "}
                  <i
                    className={this.state.twostar}
                    onMouseEnter={this.twoStar}
                    onMouseLeave={this.mouseLeave}
                    onClick={this.twoStar}
                  />{" "}
                  <i
                    onMouseEnter={this.threeStar}
                    onMouseLeave={this.mouseLeave}
                    className={this.state.threestar}
                    onClick={this.threeStar}
                  />{" "}
                  <i
                    className={this.state.fourstar}
                    onMouseEnter={this.fourStar}
                    onMouseLeave={this.mouseLeave}
                    onClick={this.fourStar}
                  />{" "}
                  <i
                    onMouseEnter={this.fiveStar}
                    onMouseLeave={this.mouseLeave}
                    onClick={this.fiveStar}
                    className={this.state.fivestar}
                  />
                </div>
                <button
                  className="feedback-form-button"
                  onClick={this.handleSubmit}
                >
                  Submit
                </button>
              </>
            )}
            {this.state.isSubmitted && (
              <>{/* If we want to display another view after submitting */}</>
            )}
          </div>
        </div>
      </div>
    );
  }
}

//To get vid from redux store

const mapStateToProps = state => ({
  vid: state.userdata.vid
});

export default connect(mapStateToProps)(FeedBack);
