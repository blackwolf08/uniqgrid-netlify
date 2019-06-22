import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';
import Spinner from '../../../images';

class FeedBack extends Component {
  state = {
    //Dynamic class to add to star array
    onestar: 'fas fa-star',
    twostar: 'fas fa-star',
    threestar: 'fas fa-star',
    fourstar: 'fas fa-star',
    fivestar: 'fas fa-star',
    //number of stars to send to backend
    numberOfStars: 0,
    isSubmitted: false,
    show: false,
    spinner: true //remove this varible and if condition in render lifecycle to remove spinner
  };

  componentDidMount() {
    if (typeof localStorage.jwtToken !== 'undefined') {
      let jwt = localStorage.jwtToken;
      jwt = jwtDecode(jwt);

      const URL = `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/email/${
        jwt.sub
      }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`;

      axios.get(URL).then(res => {
        let vid = res.data.vid;
        this.setState({
          vid,
          spinner: false
        });
        let stars = parseInt(res.data.properties.feedback.value);
        if (stars === 1) {
          this.setState({
            onestar: 'fas fa-star star-active',
            twostar: 'fas fa-star',
            threestar: 'fas fa-star',
            fourstar: 'fas fa-star',
            fivestar: 'fas fa-star',
            numberOfStars: 1
          });
        } else if (stars === 2) {
          this.setState({
            onestar: 'fas fa-star star-active',
            twostar: 'fas fa-star star-active',
            threestar: 'fas fa-star',
            fourstar: 'fas fa-star',
            fivestar: 'fas fa-star',
            numberOfStars: 2
          });
        } else if (stars === 3) {
          this.setState({
            onestar: 'fas fa-star star-active',
            twostar: 'fas fa-star star-active',
            threestar: 'fas fa-star star-active',
            fourstar: 'fas fa-star',
            fivestar: 'fas fa-star',
            numberOfStars: 3
          });
        } else if (stars === 4) {
          this.setState({
            onestar: 'fas fa-star star-active',
            twostar: 'fas fa-star star-active',
            threestar: 'fas fa-star star-active',
            fourstar: 'fas fa-star star-active',
            fivestar: 'fas fa-star',
            numberOfStars: 4
          });
        } else if (stars === 5) {
          this.setState({
            onestar: 'fas fa-star star-active',
            twostar: 'fas fa-star star-active',
            threestar: 'fas fa-star star-active',
            fourstar: 'fas fa-star star-active',
            fivestar: 'fas fa-star star-active',
            numberOfStars: 5
          });
        }
      });
    }
  }

  //functions that set 1/2/3/4/5 stars

  oneStar = () => {
    this.setState({
      onestar: 'fas fa-star star-active',
      twostar: 'fas fa-star',
      threestar: 'fas fa-star',
      fourstar: 'fas fa-star',
      fivestar: 'fas fa-star',
      numberOfStars: 1
    });
    this.mouseLeave = function() {};
  };

  twoStar = () => {
    this.setState({
      onestar: 'fas fa-star star-active',
      twostar: 'fas fa-star star-active',
      threestar: 'fas fa-star',
      fourstar: 'fas fa-star',
      fivestar: 'fas fa-star',
      numberOfStars: 2
    });
    this.mouseLeave = function() {};
  };

  threeStar = () => {
    this.setState({
      onestar: 'fas fa-star star-active',
      twostar: 'fas fa-star star-active',
      threestar: 'fas fa-star star-active',
      fourstar: 'fas fa-star',
      fivestar: 'fas fa-star',
      numberOfStars: 3
    });
    this.mouseLeave = function() {};
  };

  fourStar = () => {
    this.setState({
      onestar: 'fas fa-star star-active',
      twostar: 'fas fa-star star-active',
      threestar: 'fas fa-star star-active',
      fourstar: 'fas fa-star star-active',
      fivestar: 'fas fa-star',
      numberOfStars: 4
    });
    this.mouseLeave = function() {};
  };

  fiveStar = () => {
    this.setState({
      onestar: 'fas fa-star star-active',
      twostar: 'fas fa-star star-active',
      threestar: 'fas fa-star star-active',
      fourstar: 'fas fa-star star-active',
      fivestar: 'fas fa-star star-active',
      numberOfStars: 5
    });
    this.mouseLeave = function() {};
  };

  mouseLeave = () => {
    this.setState({
      onestar: 'fas fa-star',
      twostar: 'fas fa-star',
      threestar: 'fas fa-star',
      fourstar: 'fas fa-star',
      fivestar: 'fas fa-star'
    });
  };

  handleSubmit = () => {
    //handle API calls here for feedback backend, then set state to static and dont allow for another rating!!
    fetch(
      `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/vid/${
        this.state.vid
      }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`,
      {
        method: 'POST',
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
          window.location.href = '/login';
        }
      });
  };

  render() {
    if (this.state.spinner) return <Spinner />;
    return (
      <div className='feedback-root'>
        <Helmet>
          <title>Feedback</title>
        </Helmet>
        <h1 className='mysites-heading'>
          <i style={{ color: 'black' }} className='fas fa-star icon-heading' />{' '}
          Feedback
        </h1>
        <div className='feedback-hero flex'>
          {!this.state.isSubmitted && (
            <>
              <div className='feedback-form'>
                <h1 className='feedback-form-heading'>How are we doing?</h1>
                <div className='feedback-form-stars'>
                  <i
                    onMouseEnter={this.oneStar}
                    onMouseLeave={this.mouseLeave}
                    className={this.state.onestar}
                    onClick={this.oneStar}
                  />{' '}
                  <i
                    className={this.state.twostar}
                    onMouseEnter={this.twoStar}
                    onMouseLeave={this.mouseLeave}
                    onClick={this.twoStar}
                  />{' '}
                  <i
                    onMouseEnter={this.threeStar}
                    onMouseLeave={this.mouseLeave}
                    className={this.state.threestar}
                    onClick={this.threeStar}
                  />{' '}
                  <i
                    className={this.state.fourstar}
                    onMouseEnter={this.fourStar}
                    onMouseLeave={this.mouseLeave}
                    onClick={this.fourStar}
                  />{' '}
                  <i
                    onMouseEnter={this.fiveStar}
                    onMouseLeave={this.mouseLeave}
                    onClick={this.fiveStar}
                    className={this.state.fivestar}
                  />
                </div>
                <button
                  className='feedback-form-button'
                  onClick={this.handleSubmit}
                >
                  Submit
                </button>
              </div>
            </>
          )}
          {this.state.isSubmitted && (
            <div>
              <SweetAlert
                success
                title='Feedback Recieved!'
                onConfirm={() => {
                  this.setState({
                    isSubmitted: false
                  });
                }}
              >
                Thanks for feedback!
              </SweetAlert>
            </div>
          )}
        </div>
      </div>
    );
  }
}

//To get vid from redux store

const mapStateToProps = state => ({
  vid: state.userdata.vid,
  data: state.connectionInfo.data
});

export default connect(mapStateToProps)(FeedBack);
