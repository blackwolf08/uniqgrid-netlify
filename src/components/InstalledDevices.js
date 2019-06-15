import React, { Component } from "react";
import { connect } from "react-redux";
import uuid from "uuid";

class InstalledDevices extends Component {
  state = {
    deviceList: []
  };

  componentDidMount() {
    Object.keys(this.props.data).forEach(key => {
      if (key.match(/list/)) {
        if (this.props.data[key].value !== "") {
          this.setState({
            deviceList: JSON.parse(this.props.data[key].value).device_list
          });
        }
      }
    });
  }

  render() {
    console.log(this.props.data);
    let listOfDevices;
    if (this.state.deviceList.length >= 1) {
      listOfDevices = this.state.deviceList.map(device => {
        console.log(device);
        return (
          <button key={uuid.v4()} className="installed-device-buttons">
            {device.device.id}{" "}
            <i className="fas fa-times" style={{ color: "grey" }} />
          </button>
        );
      });
    }
    //console.log(this.props.devices);

    return <div className="installed-devices">{listOfDevices}</div>;
  }
}

const mapSateToProps = state => ({
  devices: state.userdata.data
});

export default connect(mapSateToProps)(InstalledDevices);
