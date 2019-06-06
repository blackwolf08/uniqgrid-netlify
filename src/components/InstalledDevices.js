import React, { Component } from "react";
import { connect } from "react-redux";
import uuid from "uuid";

class InstalledDevices extends Component {
  render() {
    const listOfDevices = this.props.devices.map(device => {
      return (
        <button key={uuid.v4()} className="installed-device-buttons">
          {device.name} <i className="fas fa-times" style={{ color: "grey" }} />
        </button>
      );
    });
    //console.log(this.props.devices);

    return <div className="installed-devices">{listOfDevices}</div>;
  }
}

const mapSateToProps = state => ({
  devices: state.userdata.data
});

export default connect(mapSateToProps)(InstalledDevices);
