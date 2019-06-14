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
  componentDidMount() {
    // const jwt = localStorage.jwtToken;
    // const header = `X-Authorization: Bearer ${jwt}`;
    // axios
    //   .get(
    //     `http://portal.uniqgridcloud.com:8080/api/v1/${
    //       this.props.id
    //     }/attributes`,
    //     { headers: { header } }
    //   )
    //   .then(res => {
    //     console.log(res);
    //   });
  }

  render() {
    const deviceList = this.state.devices.map(device => {
      let power = 0;
      if (device.additionalInfo) {
        power = device.additionalInfo.description;
      }
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
            <p>{power}</p>
          </div>
          <div className="my-col ">
            <p>{device.type || "Monitor"}</p>
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
