import React, { Component, lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { refreshUser } from '../../actions/auth';
import { fetchUserData } from '../../actions/userData';
import { connect } from 'react-redux';
import Spinner from '../../images/index';
const NavBar = lazy(() => import('./Navbar/NavBar'));
const LeftPart = lazy(() => import('./Sidebar/LeftPart'));
const MySite = lazy(() => import('./MySite/MySite'));
const MyDevice = lazy(() => import('./MyDevices/MyDevice'));
const MyRequests = lazy(() => import('./MyRequests/MyRequests'));
const MyProfile = lazy(() => import('./MyProfile/MyProfile'));
const FeedBack = lazy(() => import('./Feedback/FeedBack'));
const ConnectionInfo = lazy(() =>
  import('./MySite/TabComponents/ConnectionInfo')
);
const NavBarResponsive = lazy(() => import('./Navbar/NavBarResponsive'));
const NewConnection = lazy(() =>
  import('./MySite/New Connection/NewConnection')
);
const Charts = lazy(() => import('./MySite/HotCharts/Charts'));
const Portal = lazy(() => import('./iFrame/Portal'));

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
          <Suspense fallback={Spinner}>
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
          </Suspense>
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
