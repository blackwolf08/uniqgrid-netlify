import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';
import { updatePool } from '../../../../../actions/fetchConnectionInfo';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class InstalledDevices extends Component {
  state = {
    deviceList: [],
    device_pool: []
  };

  componentWillMount() {
    this.setState({
      device_pool: this.props.device_pool
    });
    let name = {
      device_list: []
    };
    this.setState({
      deviceList: name
    });
    if (parseInt(this.props.id) === 1) {
      if (
        this.props.data['device id'] &&
        this.props.data['device id'].value !== ''
      ) {
        let name = this.props.data['device id'].value.replace(/'/g, '"');
        JSON.parse(name);
        this.setState({
          deviceList: JSON.parse(name)
        });
      } else {
        let name = {
          device_list: []
        };
        this.setState({
          deviceList: name
        });
      }
    }

    Object.keys(this.props.data).forEach(key => {
      if (key.match(/list/)) {
        if (this.props.data[key].value !== '') {
          // replace any single quotes with double quotes for proper json parse
          //get data from device_pool key in API
          let name = this.props.data[key].value.replace(/'/g, '"');

          JSON.parse(name);
          this.setState({
            deviceList: JSON.parse(name)
          });
        } else {
          let name = {
            device_list: []
          };
          this.setState({
            deviceList: name
          });
        }
      }
    });
  }

  handleClick = e => {
    let name = e.target.name;
    let new_device_arr = [];
    this.state.deviceList.device_list.forEach(device => {
      if (device.device.name !== name) {
        new_device_arr.push(device);
      }
    });
    let newDevice = {
      device: {
        additionalInfo: '',
        id: `${e.target.value}`,
        name: `${name}`
      }
    };
    this.setState({
      device_pool: {
        device_list: [...this.state.device_pool.device_list, newDevice]
      }
    });
    this.setState({
      deviceList: {
        device_list: new_device_arr
      }
    });
  };

  handleChange = e => {
    let newDevice = {
      device: {
        additionalInfo: '',
        id: `${e.target.value[0]}`,
        name: `${e.target.value[1]}`
      }
    };
    let new_pool_arr = [];
    this.state.device_pool.device_list.forEach(device => {
      if (device.device.name !== e.target.value[1]) {
        new_pool_arr.push(device);
      }
    });
    this.setState({
      device_pool: {
        device_list: new_pool_arr
      }
    });
    this.setState({
      deviceList: {
        device_list: [...this.state.deviceList.device_list, newDevice]
      }
    });
  };

  handleSubmit = () => {
    let toSend;
    if (parseInt(this.props.id) === 1) {
      toSend = [
        {
          property: 'device_pool',
          value: JSON.stringify(this.state.device_pool)
        },
        {
          property: 'device_id',
          value: JSON.stringify(this.state.deviceList)
        }
      ];
    } else {
      toSend = [
        {
          property: 'device_pool',
          value: JSON.stringify(this.state.device_pool)
        },
        {
          property: `device_list_site_${this.props.id}_`,
          value: JSON.stringify(this.state.deviceList)
        }
      ];
    }
    fetch(
      `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/vid/${
        this.props.vid
      }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`,
      {
        method: 'POST',
        body: `{  "properties": ${JSON.stringify(toSend)}
              }`
      }
    )
      .then(res => {
        this.props.handleUpdateButtonClick();
      })
      .catch(res => {
        if (res.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
        }
      });
  };

  render() {
    let listOfDevices;
    let listOfPool;

    if (this.state.deviceList.device_list) {
      listOfDevices = this.state.deviceList.device_list.map(device => {
        return (
          <button
            name={device.device.name}
            onClick={this.handleClick}
            key={uuid.v4()}
            className='installed-device-buttons'
            value={device.device.id}
          >
            {device.device.name}{' '}
            <i className='fas fa-times' style={{ color: 'grey' }} />
          </button>
        );
      });
    }

    if (this.state.device_pool) {
      listOfPool = this.state.device_pool.device_list.map(device => {
        return (
          <MenuItem
            key={uuid.v4()}
            value={[device.device.id, device.device.name]}
          >
            {device.device.name}
          </MenuItem>
        );
      });
    }

    return (
      <div className='installed-devices'>
        <FormControl className=''>
          <InputLabel htmlFor='age-simple'>Devices</InputLabel>
          <Select
            style={{ height: '50px', width: '250px' }}
            onChange={this.handleChange}
            inputProps={{
              name: 'devices',
              id: 'devices'
            }}
          >
            {listOfPool}
          </Select>
        </FormControl>
        {listOfDevices}
        <div className='row'>
          <div className='col'>
            <button className='update-button' onClick={this.handleSubmit}>
              Update
            </button>
            <br />
            <br />
          </div>
        </div>
      </div>
    );
  }
}

const mapSateToProps = state => ({
  devices: state.userdata.data,
  device_pool: state.connectionInfo.device_pool,
  vid: state.userdata.vid
});

export default connect(
  mapSateToProps,
  { updatePool }
)(InstalledDevices);
