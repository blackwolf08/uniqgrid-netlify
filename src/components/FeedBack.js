import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";

class FeedBack extends Component {
  state = {
    onestar: "fas fa-star",
    twostar: "fas fa-star",
    threestar: "fas fa-star",
    fourstar: "fas fa-star",
    fivestar: "fas fa-star",
    numberOfStars: 0,
    isSubmitted: false
  };

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
        this.setState({
          isSubmitted: !this.state.isSubmitted
        });
      })
      .catch(function(res) {
        console.log(res);
      });
  };

  render() {
    return (
      <div className="feedback-root">
        <Helmet>
          <title>FeedBack</title>
        </Helmet>
        <h1 className="mysites-heading">FeedBack</h1>
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
              <>
                <h1>Thanks for your Feedback!</h1>
                <h4>
                  Your rating for us is {this.state.numberOfStars}{" "}
                  <i className="fas fa-star star-active" /> !
                </h4>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  vid: state.userdata.vid
});

export default connect(mapStateToProps)(FeedBack);
