import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Progress } from 'reactstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import icon1 from '../../../../images/icon1.svg';
import icon2 from '../../../../images/icon2.svg';

class Connection extends Component {
  state = {
    power: 0,
    load: '',
    solar: 0
  };
  componentDidMount() {
    if (parseInt(this.props.id) === 1) {
      this.setState({
        load: parseFloat(this.props.properties[`connected_load_kw_`]),
        solar: parseFloat(this.props.properties[`total_capacity_kwp`])
      });
    } else {
      this.setState({
        load: parseFloat(
          this.props.properties[`connected_load_kw_site_${this.props.id}_`]
        ),
        solar: parseFloat(
          this.props.properties[`solar_capacity_kwp_site_${this.props.id}_`]
        )
      });
    }
    if (
      this.props.properties[`master_site${this.props.id}`] &&
      this.props.properties[`master_site${this.props.id}`].value !== '' &&
      this.props.properties[`master_site${this.props.id}`].value !== '{}' &&
      this.props.properties[`master_key_site_${this.props.id}`] &&
      this.props.properties[`master_key_site_${this.props.id}`].value !== '' &&
      this.props.properties[`master_key_site_${this.props.id}`].value !== '{}'
    ) {
      console.log('object');
      let masterID = this.props.properties[`master_site${this.props.id}`].value;
      let master_key = this.props.properties[`master_key_site_${this.props.id}`]
        .value;
      masterID = masterID.replace(/'/g, '"');
      masterID = JSON.parse(masterID);
      masterID = masterID.device.id;
      //0006 id 2d2d09280-efba-11e8-914d-7bf7fdeefec4/
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/plugins/telemetry/DEVICE/${masterID}/values/timeseries?keys=${master_key}`
        )
        .then(res => {
          if (
            res.data[master_key][0] &&
            res.data[master_key][0].value &&
            res.data[master_key][0].value !== ''
          ) {
            this.setState({
              power: parseFloat(res.data[master_key][0].value)
            });
          }
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
      name
      //parseInt(power)Per,
      //consumptionPer
    } = this.props;
    let numLoad = parseFloat(this.state.power);
    let denoLoad = parseFloat(this.state.load);
    let solar = parseFloat(this.state.solar);
    let solarPower = 0;
    let consumption = 0;
    let power = 0;
    if (denoLoad !== '' && denoLoad !== 0) {
      power = (numLoad / denoLoad) * 100;
    }
    if (isNaN(power)) {
      power = 0;
    }
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
              {parseInt(power) === ' kW' ? '--' : parseInt(power)}
            </span>
            <span className='progress_my' style={styles.progress}>
              <Progress
                color={
                  parseInt(parseInt(power)) < 25
                    ? 'danger'
                    : parseInt(parseInt(power)) < 75
                    ? 'warning'
                    : 'success'
                }
                value={
                  parseInt(parseInt(power)) > 100
                    ? parseInt(parseInt(power)) % 100
                    : parseInt(parseInt(power))
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
