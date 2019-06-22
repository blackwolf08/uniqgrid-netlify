import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Progress } from 'reactstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import icon1 from '../../../../images/icon1.svg';
import icon2 from '../../../../images/icon2.svg';

class Connection extends Component {
  componentDidMount() {
    if (
      this.props.properties[`master_site${this.props.id}`] &&
      this.props.properties[`master_site${this.props.id}`].value !== '' &&
      this.props.properties[`master_site${this.props.id}`].value !== '{}'
    ) {
      let masterID = this.props.properties[`master_site${this.props.id}`].value;
      masterID = masterID.replace(/'/g, '"');
      masterID = JSON.parse(masterID);
      masterID = masterID.device.id;
      //0006 id 2d2d09280-efba-11e8-914d-7bf7fdeefec4/
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/plugins/telemetry/DEVICE/${masterID}values/timeseries?keys=active_power`
        )
        .then(res => {
          console.log(res);
        })
        .catch(res => {
          if (res.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
          }
        });
    }
  }

  toTitleCase = str => {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  render() {
    const {
      id,
      name,
      power,
      //powerPer,
      consumption
      //consumptionPer
    } = this.props;

    const redirect = `/dashboard/my-sites/${id}`;
    const redirectSmallChart = `/dashboard/hot-charts/${id}`;
    return (
      <div
        className='mysites-connections mobile_connection'
        onClick={this.handleClick}
      >
        <div className='my-col flex name_connection'>
          <p style={{ width: '100%', textAlign: 'left' }}>
            {this.toTitleCase(name)}
          </p>
        </div>
        <div className='my-col flex value_connection'>
          <div className='flex'>
            <img alt='' src={icon1} className='icon_mobile' />

            <span className='progress_span'>
              {power === ' kW' ? '--' : power}
            </span>
            <span className='progress_my' style={styles.progress}>
              <Progress
                color={
                  parseInt(power) < 25
                    ? 'danger'
                    : parseInt(power) < 75
                    ? 'warning'
                    : 'success'
                }
                value={
                  parseInt(power) > 100
                    ? parseInt(power) % 100
                    : parseInt(power)
                }
                className='progress_my'
              />{' '}
            </span>
          </div>
        </div>
        <div className='my-col flex value_connection'>
          <div className='flex'>
            <img alt='' src={icon2} className='icon_mobile' />
            <span className='progress_span'>
              {consumption === ' kW' ? '--' : consumption}
            </span>
            <span className='progress_my' style={{ width: '250px' }}>
              <Progress
                className='progress_my'
                color={
                  parseInt(consumption) < 25
                    ? 'danger'
                    : parseInt(consumption) < 75
                    ? 'warning'
                    : 'success'
                }
                value={
                  parseInt(consumption) > 100
                    ? parseInt(consumption) % 100
                    : parseInt(consumption)
                }
              />{' '}
            </span>
          </div>
        </div>
        <div
          className='my-col flex mysites-icons settings_connection'
          style={{ display: 'flex', justifyContent: 'space-around' }}
        >
          <Link to={redirectSmallChart}>
            <i
              className='far fa-chart-bar'
              style={{ color: 'black', fontSize: '1.6rem' }}
            />{' '}
          </Link>
          <Link to={redirect}>
            <i
              style={{ color: 'black', fontSize: '1.3rem' }}
              className='fas fa-cog'
            />{' '}
          </Link>
        </div>
      </div>
    );
  }
}

const styles = {
  progress: {
    width: '250px'
  }
};

const mapStateToProps = state => ({
  data: state.connectionInfo.data
});

export default connect(mapStateToProps)(Connection);
