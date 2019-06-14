import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { connect } from "react-redux";

class MysiteMap extends Component {
  state = {
    lat: 28.41344,
    lng: 77.04237,
    zoom: 17
  };

  componentDidMount() {
    console.log(this.props.info);
    if (this.props.keys) {
      Object.keys(this.props.info).forEach(key => {
        if (key.includes("gps")) {
          console.log(this.props.info[key].value);
          let data = this.props.info[key].value;
          data = data.split("/");
          this.setState({
            lng: data[1],
            lat: data[0]
          });
        }
      });
    }
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <div style={{ margin: "0 auto", width: "100%", height: "300px" }}>
        <Map
          style={{ margin: "0 auto", width: "100%", height: "300px" }}
          center={position}
          zoom={this.state.zoom}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>Your Location.</Popup>
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
