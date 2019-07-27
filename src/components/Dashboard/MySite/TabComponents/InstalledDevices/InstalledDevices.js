import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid';
import { updatePool } from '../../../../../actions/fetchConnectionInfo';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Axios from 'axios';

class InstalledDevices extends Component {
  state = {
    deviceList: [],
    device_pool: [],
    masterDevice: '',
    masterDeviceToSend: {},
    masterKey: '',
    device_id: '',
    device_key: '',
    master_key: '',
    device_name: ''
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
        this.props.data['device_id'] &&
        this.props.data['device_id'].value !== ''
      ) {
        let name = this.props.data['device_id'].value.replace(/'/g, '"');
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
      name = this.props.data['master_site1'].value.replace(/'/g, '"');
      if (
        this.props.data['master_site1'] &&
        this.props.data['master_site1'].value !== '{}' &&
        this.props.data['master_site1'].value !== ''
      ) {
        let masterDeviceNew = this.props.data[
          `master_site${this.props.id}`
        ].value.replace(/'/g, '"');
        let send = JSON.parse(masterDeviceNew);
        this.setState({
          masterDevice: send.device.name,
          device_id: send.device.id
        });
      }
    }
    if (parseInt(this.props.id) > 1) {
      if (
        this.props.data[`master_site${this.props.id}`] &&
        this.props.data[`master_site${this.props.id}`].value !== '' &&
        this.props.data[`master_site${this.props.id}`].value !== '{}'
      ) {
        let masterDeviceNew = this.props.data[
          `master_site${this.props.id}`
        ].value.replace(/'/g, '"');
        let send = JSON.parse(masterDeviceNew);
        this.setState({
          masterDevice: send.device.name,
          device_id: send.device.id
        });
        console.log(send.device.name, send.device.name !== '');
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

  componentDidMount() {
    console.log(this.state.device);
    if (this.state.masterDevice !== '') {
      if (this.state.device_id !== '') {
        console.log('object');
        Axios.get(
          `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/plugins/telemetry/DEVICE/${
            this.state.device_id
          }/keys/timeseries`
        ).then(res => {
          //storing keys to display in dropdown, E.g. keys array === [current, ac power, ...]
          this.setState({
            device_key: res.data
          });
        });
      }
    }
  }

  handleMasterKeyChange = e => {
    let key = e.target.value;
    this.setState({
      master_key: key
    });
  };

  handleClick = e => {
    //console.log(e.target.value, e.target.id, e.target.id);
    let name = e.target.name;
    let new_device_arr = [];
    console.log(this.state.device);
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
    if (e.target.value !== 'No Device') {
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
        },
        device_name: `${e.target.value[1]}`
      });
      this.setState({
        deviceList: {
          device_list: [...this.state.deviceList.device_list, newDevice]
        }
      });
    }
  };

  handleChangeMaster = e => {
    if (e.target.value !== 'No Device') {
      let newMaster = {
        device: {
          additionalInfo: '',
          id: `${e.target.value[0]}`,
          name: `${e.target.value[1]}`
        }
      };
      this.setState({
        masterDevice: `${e.target.value[1]}`,
        masterDeviceToSend: newMaster
      });
    }
  };

  handleSubmit = () => {
    let toSend;
    if (parseInt(this.props.id) === 1) {
      let masterDeviceToSend = {
        device: {
          name: `${this.state.masterDevice}`
        }
      };
      if (this.state.masterDeviceToSend !== {}) {
        masterDeviceToSend = this.state.masterDeviceToSend;
      }
      toSend = [
        {
          property: 'device_pool',
          value: JSON.stringify(this.state.device_pool)
        },
        {
          property: 'device_id',
          value: JSON.stringify(this.state.deviceList)
        },
        {
          property: 'master_site1',
          value: JSON.stringify(masterDeviceToSend)
        },
        {
          property: 'master_key_site_1',
          value: JSON.stringify(this.state.master_key)
        }
      ];
    } else {
      let masterDeviceToSend = {
        device: {
          name: `${this.state.masterDevice}`
        }
      };
      if (this.state.masterDeviceToSend !== {}) {
        masterDeviceToSend = this.state.masterDeviceToSend;
      }
      toSend = [
        {
          property: 'device_pool',
          value: JSON.stringify(this.state.device_pool)
        },
        {
          property: `device_list_site_${this.props.id}_`,
          value: JSON.stringify(this.state.deviceList)
        },
        {
          property: `master_site${this.props.id}`,
          value: JSON.stringify(masterDeviceToSend)
        },
        {
          property: `master_key_site_${this.props.id}`,
          value: JSON.stringify(this.state.master_key)
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
          window.location.href = '/';
        }
      });
  };

  render() {
    let listOfDevices;
    let listOfPool;
    let listOfDevicesSelect;
    let listOfKeys;

    if (this.state.device_key !== '') {
      listOfKeys = this.state.device_key.map(key => {
        if (key.match(/power/gm) || key.match(/kW_/) || key.match(/kw_/)) {
          return (
            <MenuItem key={uuid.v4()} value={key}>
              {key}
            </MenuItem>
          );
        }
      });
    }

    if (this.state.deviceList.device_list) {
      listOfDevices = this.state.deviceList.device_list.map(device => {
        return (
          <div style={{ position: 'relative' }} key={uuid.v4()}>
            <button
              value={device.device.id}
              name={device.device.name}
              onClick={this.handleClick}
              className='installed-device-buttons'
            >
              {device.device.name}
            </button>
            <div
              className='master-device'
              style={
                this.state.masterDevice === device.device.name
                  ? styles.masterDevice
                  : styles.normalDevice
              }
            >
              {' '}
            </div>
          </div>
        );
      });
      if (this.state.deviceList.device_list.length === 0) {
        listOfDevicesSelect = (
          <MenuItem key={uuid.v4()} value='No Device'>
            No Device
          </MenuItem>
        );
      } else {
        listOfDevicesSelect = this.state.deviceList.device_list.map(device => {
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
    }

    if (this.state.device_pool) {
      if (this.state.device_pool.device_list.length === 0) {
        listOfPool = (
          <MenuItem key={uuid.v4()} value='No Device'>
            No Device
          </MenuItem>
        );
      } else {
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
    }

    return (
      <div className='installed-devices'>
        <FormControl className=''>
          <InputLabel htmlFor='age-simple'>Devices</InputLabel>
          <Select
            style={{ height: '50px', width: '250px' }}
            onChange={this.handleChange}
            value={this.state.device_name}
            placeholder={this.state.device_name}
            inputProps={{
              name: 'devices',
              id: 'devices'
            }}
          >
            {listOfPool}
          </Select>
        </FormControl>
        <FormControl className=''>
          <InputLabel htmlFor='age-simple'>Master Device</InputLabel>
          <Select
            style={{ height: '50px', width: '250px' }}
            onChange={this.handleChangeMaster}
            value={this.state.masterDevice}
            placeholder={this.state.masterDevice}
            inputProps={{
              name: `master_site${this.props.id}`,
              id: `master_site${this.props.id}`
            }}
          >
            {listOfDevicesSelect}
          </Select>
        </FormControl>
        {this.state.device_key !== '' && (
          <FormControl className=''>
            <InputLabel htmlFor='age-simple'>Master Key</InputLabel>
            <Select
              style={{ height: '50px', width: '250px' }}
              onChange={this.handleMasterKeyChange}
              value={this.state.device_key}
              placeholder={this.state.master_key}
              inputProps={{
                name: `master_key_site_${this.props.id}`,
                id: `master_key_site_${this.props.id}`
              }}
            >
              {listOfKeys}
            </Select>
          </FormControl>
        )}
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

const styles = {
  masterDevice: {
    height: '20px',
    position: 'absolute',
    zIndex: '10000',
    width: '20px',
    borderRadius: '50%',
    backgroundColor: '#5bc232',
    transform: 'translate(0,-50%)',
    left: '200px',
    top: '50%',
    border: '5px solid white'
  },
  normalDevice: {
    height: '20px',
    position: 'absolute',
    zIndex: '10000',
    width: '20px',
    borderRadius: '50%',
    backgroundColor: 'grey',
    transform: 'translate(0,-50%)',
    left: '200px',
    top: '50%',
    border: '5px solid white'
  }
};

const mapSateToProps = state => ({
  devices: state.userdata.data,
  device_pool: state.connectionInfo.device_pool,
  vid: state.userdata.vid
});

export default connect(
  mapSateToProps,
  { updatePool }
)(InstalledDevices);
