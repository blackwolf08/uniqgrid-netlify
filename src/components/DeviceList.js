import React, { Component } from "react";
import { connect } from "react-redux";

class DeviceList extends Component {
  state = {
    //Device list for current connection
    devices: this.props.devices,
    selected: ""
  };

  handleClick = e => {
    this.setState({
      selected: "#eee"
    });
    this.props.handleMethod(e.id.id, e.name);
  };

  render() {
    const deviceList = this.state.devices.map(device => {
      return (
        <div
          key={device.id.id}
          style={{
            display: "flex",
            paddingLeft: "10px",
            paddingTop: "10px",
            cursor: "pointer"
          }}
          className={"device-list " + this.state.selected}
          onClick={() => {
            this.handleClick(device);
          }}
        >
          <div className="my-col bold">
            <p>{device.name}</p>
          </div>
          <div className="my-col ">
            <p>{device.createdAt}</p>
          </div>
          <div className="my-col ">
            <p>2000 Watts</p>
          </div>
          <div className="my-col ">
            <p>Monitor</p>
          </div>
        </div>
      );
    });

    return <div className="mydevice-list">{deviceList}</div>;
  }
}

const mapSateToProps = state => ({
  devices: state.userdata.data
});

export default connect(mapSateToProps)(DeviceList);
