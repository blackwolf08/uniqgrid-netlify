import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { connect } from "react-redux";

class MysiteMap extends Component {
  state = {
    lat: "",
    lng: "",
    zoom: 19
  };

  componentWillMount() {
    if (navigator.geolocation) {
      let lat, lng;
      let pos = res => {
        lat = res.coords.latitude;
        lng = res.coords.longitude;
        this.setState({
          lat,
          lng
        });
      };
      navigator.geolocation.getCurrentPosition(pos);
    }
  }

  render() {
    if (this.state.lat && this.state.lng) {
      return (
        <div style={{ margin: "0 auto", width: "100%", height: "300px" }}>
          <Map
            style={{ margin: "0 auto", width: "100%", height: "300px" }}
            center={[this.state.lat, this.state.lng]}
            zoom={this.state.zoom}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[this.state.lat, this.state.lng]}>
              <Popup>Your Location.</Popup>
            </Marker>
          </Map>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Enable Location</h1>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  info: state.connectionInfo.data
});

export default connect(mapStateToProps)(MysiteMap);
