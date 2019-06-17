import React, { Component } from "react";
import { connect } from "react-redux";
import uuid from "uuid";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

class InstalledDevices extends Component {
  state = {
    deviceList: []
  };

  componentWillMount() {
    Object.keys(this.props.data).forEach(key => {
      if (key.match(/list/)) {
        if (this.props.data[key].value !== "") {
          // replace any single quotes with double quotes for proper json parse
          //get data from device_pool key in API
          let name = this.props.data[key].value.replace(/'/g, '"');
          JSON.parse(name);
          this.setState({
            deviceList: JSON.parse(name)
          });
        }
      }
    });
  }

  handleChange = () => {};

  render() {
    let listOfDevices;
    let listOfPool;

    if (
      this.state.deviceList.device_list &&
      this.state.deviceList.device_list
    ) {
      listOfDevices = this.state.deviceList.device_list.map(device => {
        return (
          <button key={uuid.v4()} className="installed-device-buttons">
            {device.device.id}{" "}
            <i className="fas fa-times" style={{ color: "grey" }} />
          </button>
        );
      });

      listOfPool = this.props.device_pool.map(device => {
        return <MenuItem value={device.device.id}>{device.device.id}</MenuItem>;
      });
    }

    return (
      <div className="installed-devices">
        <FormControl className="">
          <InputLabel htmlFor="age-simple">Devices</InputLabel>
          <Select
            value="Device"
            onChange={this.handleChange}
            inputProps={{
              name: "devices",
              id: "devices"
            }}
          >
            {listOfPool}
          </Select>
        </FormControl>
        {listOfDevices}
      </div>
    );
  }
}

const mapSateToProps = state => ({
  devices: state.userdata.data,
  device_pool: state.connectionInfo.device_pool
});

export default connect(mapSateToProps)(InstalledDevices);
