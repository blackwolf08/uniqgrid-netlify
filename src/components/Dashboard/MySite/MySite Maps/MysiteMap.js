import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { connect } from "react-redux";

class MysiteMap extends Component {
  // Default Lat & Long is Spaze i-Tech park, change here if you want to set diff location default
  state = {
    lat: 28.41344,
    lng: 77.04237,
    zoom: 17,
    data: {}
  };

  componentWillReceiveProps() {
    this.setState({
      data: this.props.data
    });
    if (this.state.data) {
      Object.keys(this.state.data).forEach(key => {
        if (key.match(/^gps.*$/)) {
          let data = this.props.info[key].value;
          data = data.split("/");
          if (this.props.info[key].value.length >= 2) {
            this.setState({
              lng: data[1],
              lat: data[0]
            });
          }
        }
      });
    }
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      // set custom height and with of map
      <div style={{ margin: "0 auto", width: "100%", height: "300px" }}>
        <Map
          style={{ margin: "0 auto", width: "100%", height: "300px" }}
          center={position}
          zoom={this.state.zoom}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position}>
            <Popup>Your Location</Popup>
          </Marker>
        </Map>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  info: state.connectionInfo.data
});

export default connect(mapStateToProps)(MysiteMap);
