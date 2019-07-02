import React, { Component } from 'react';
import NavBar from './Navbar/NavBar';
import LeftPart from './Sidebar/LeftPart';
import { Route, Switch } from 'react-router-dom';
import MySite from './MySite/MySite';
import MyDevice from './MyDevices/MyDevice';
import MyRequests from './MyRequests/MyRequests';
import MyProfile from './MyProfile/MyProfile';
import FeedBack from './Feedback/FeedBack';
import ConnectionInfo from './MySite/TabComponents/ConnectionInfo';
import { fetchUserData } from '../../actions/userData';
import { connect } from 'react-redux';
import Spinner from '../../images/index';
import { refreshUser } from '../../actions/auth';
import NavBarResponsive from './Navbar/NavBarResponsive';
import NewConnection from './MySite/New Connection/NewConnection';
import Charts from './MySite/HotCharts/Charts';
import Portal from './iFrame/Portal';

//this is the parent component of all the logged in stuff

class Dashboard extends Component {
  componentDidMount() {
    //this function refreshes the user token every 100 sec
    setInterval(() => {
      refreshUser();
    }, 100000);
  }
  render() {
    // if lodading then return spinner navbar and sidebar
    if (this.props.isLoading) {
      this.props.fetchUserData();
      return (
        <div>
          <NavBar />
          <NavBarResponsive />
          <LeftPart />
          <div className='view'>
            <Spinner />
          </div>
        </div>
      );
    }
    // this code would be executed when the content is loaded
    return (
      <div>
        <NavBar />
        {/*these two are static components and will not change in any route change */}
        <LeftPart />
        <NavBarResponsive />
        <div className='view'>
          <Switch>
            {/* rendering components according to routes */}
            <Route
              key='my-sites'
              path='/dashboard/my-sites'
              exact
              render={props => <MySite {...props} />}
            />
            <Route
              key='new-connection'
              path='/dashboard/new-connection'
              exact
              render={props => <NewConnection {...props} />}
            />
            <Route
              key='my-sites'
              path='/dashboard/my-device'
              render={props => <MyDevice {...props} />}
            />
            <Route
              key='my-requests'
              path='/dashboard/my-requests'
              render={props => <MyRequests {...props} />}
            />
            <Route
              key='my-feedback'
              path='/dashboard/feedback'
              render={props => <FeedBack {...props} />}
            />
            <Route
              key='my-profile'
              path='/dashboard/my-profile'
              render={props => <MyProfile {...props} />}
            />
            {/* :id is a dymaic parameter that's why ':' with id */}
            <Route
              key='my-sites/:id'
              path='/dashboard/my-sites/:id'
              render={props => <ConnectionInfo {...props} />}
            />
            <Route
              key='my-sites/:id'
              path='/dashboard/hot-charts/:id'
              render={props => <Charts {...props} />}
            />
            <Route
              key='my-sites/:id'
              path='/dashboard/portal'
              render={props => <Portal {...props} />}
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
