import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import mySiteImg from '../../../images/my-sites.png';
import myDeviceImg from '../../../images/my-devices.png';
import insightsImg from '../../../images/insights.png';
import userImg from '../../../images/user.png';
import feedbackImg from '../../../images/feedback.png';
import myReqimg from '../../../images/my-requests.png';

class LeftPart extends Component {
  state = {
    mysite: 'leftpart-menu',
    mydevice: 'leftpart-menu',
    myrequests: 'leftpart-menu',
    feedback: 'leftpart-menu',
    myprofile: 'leftpart-menu',
    portal: 'leftpart-menu'
  };

  componentDidMount() {
    //this function changes the highlighted menu according to url
    this.changeHighlighted();
  }

  //change according to the highlighted component
  changeHighlighted = () => {
    let url = window.location.href;
    url = url.split('/');

    if (url.includes('my-sites')) {
      this.setState({
        mysite: 'leftpart-menu bg-active'
      });
    } else if (url.includes('my-device')) {
      this.setState({
        mydevice: 'leftpart-menu bg-active'
      });
    } else if (url.includes('my-requests')) {
    } else if (url.includes('hot-charts')) {
      this.setState({
        mysite: 'leftpart-menu bg-active'
      });
    } else if (url.includes('my-requests')) {
      this.setState({
        myrequests: 'leftpart-menu bg-active'
      });
    } else if (url.includes('feedback')) {
      this.setState({
        feedback: 'leftpart-menu bg-active'
      });
    } else if (url.includes('new-connection')) {
      this.setState({
        mysite: 'leftpart-menu bg-active'
      });
    } else if (url.includes('portal')) {
      this.setState({
        portal: 'leftpart-menu bg-active'
      });
    } else {
      this.setState({
        myprofile: 'leftpart-menu bg-active'
      });
    }
  };

  render() {
    //get short name of the user to be displayed in the circle
    let shortName = '';
    if (typeof this.props.data !== 'undefined') {
      let nameArr = this.props.data.name.split(' ');
      nameArr.splice(0, 1);
      nameArr.forEach(e => {
        shortName += e[0].toUpperCase();
      });
    }
    return (
      <div className='left-part flex flex-col'>
        <div className='circle'>
          <p>{shortName}</p>
        </div>
        <Link
          style={{ width: '100%' }}
          className='link-p'
          to='/dashboard/my-sites'
        >
          <button
            style={{ display: 'flex', alignItems: 'center' }}
            className={this.state.mysite}
          >
            <img className='icons_sidebar' alt='custom logo' src={mySiteImg} />{' '}
            My Site
          </button>
        </Link>
        <Link
          style={{ width: '100%' }}
          className='link-p'
          to='/dashboard/my-device'
        >
          <button
            style={{ display: 'flex', alignItems: 'center' }}
            className={this.state.mydevice}
          >
            <img
              className='icons_sidebar my_device_icon'
              alt='custom logo'
              src={myDeviceImg}
            />{' '}
            My Devices
          </button>
        </Link>
        <Link
          style={{ width: '100%' }}
          className='link-p'
          to='/dashboard/my-requests'
        >
          <button
            style={{ display: 'flex', alignItems: 'center' }}
            className={this.state.myrequests}
          >
            <img className='icons_sidebar' alt='custom logo' src={myReqimg} />{' '}
            My Requests
          </button>
        </Link>
        <Link
          style={{ width: '100%' }}
          className='link-p'
          to='/dashboard/feedback'
        >
          <button
            style={{ display: 'flex', alignItems: 'center' }}
            className={this.state.feedback}
          >
            <img
              className='icons_sidebar'
              alt='custom logo'
              src={feedbackImg}
            />{' '}
            Feedback
          </button>
        </Link>

        <Link
          style={{ width: '100%' }}
          className='link-p'
          to='/dashboard/my-profile'
        >
          <button
            style={{ display: 'flex', alignItems: 'center' }}
            className={this.state.myprofile}
          >
            <img className='icons_sidebar' alt='custom logo' src={userImg} /> My
            Profile
          </button>
        </Link>
        <Link
          style={{ width: '100%' }}
          className='link-p'
          to='/dashboard/portal'
        >
          <button
            style={{ display: 'flex', alignItems: 'center' }}
            className={this.state.portal}
          >
            <img
              className='icons_sidebar'
              alt='custom logo'
              src={insightsImg}
            />{' '}
            Insights
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
