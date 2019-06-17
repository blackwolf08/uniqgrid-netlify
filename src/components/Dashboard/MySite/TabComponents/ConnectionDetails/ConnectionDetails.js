import React, { Component } from "react";
import { connect } from "react-redux";

class ConnectionDetails extends Component {
  state = {
    electricity_connection_name: "-",
    connected_load_kw: "-",
    segment: "",
    sub_segment: "",
    average_monthly_energy_cost: "",
    electricity_quality: ""
  };

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    Object.keys(this.props.data).forEach(key => {
      if (key.indexOf("connected") === 0) {
        this.setState({
          connected_load_kw: this.props.data[key].value.toString()
        });
      }
      if (key.indexOf("connection") === 12) {
        this.setState({
          electricity_connection_name: this.props.data[key].value.toString()
        });
      }
      if (key.indexOf("segment") === 0) {
        this.setState({
          segment: this.props.data[key].value.toString()
        });
      }
      if (key.indexOf("sub") === 0) {
        this.setState({
          sub_segment: this.props.data[key].value.toString()
        });
      }
      if (key.indexOf("average") === 0) {
        this.setState({
          average_monthly_energy_cost: this.props.data[key].value.toString()
        });
      }
      if (key.indexOf("quality") === 12) {
        this.setState({
          electricity_quality: this.props.data[key].value.toString()
        });
      }
    });
    this.setState({
      isLoading: false
    });
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    this.props.handleChildrenChange({
      [e.target.name]: e.target.value
    });
  };

  handleSelectChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    this.props.handleChildrenChange({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <div className="address-details">
        {!this.state.isLoading && (
          <>
            <div className="address-details-div">
              <p>Connection Name</p>
              <input
                className="address-details-input "
                type="text"
                value={this.state.electricity_connection_name}
                placeholder={this.state.electricity_connection_name}
                onChange={this.handleChange}
                name="electricity_connection_name"
              />{" "}
            </div>
            <div className="address-details-div ">
              <p>Connected Load</p>
              <input
                className="address-details-input "
                type="text"
                value={this.state.connected_load_kw}
                placeholder={this.state.connected_load_kw}
                onChange={this.handleChange}
                name="connected_load_kw"
              />{" "}
            </div>
            <div className="address-details-div ">
              <p>Segment</p>
              <select
                className="address-details-select "
                name="segment"
                onChange={this.handleSelectChange}
                placeholder={this.state.segment}
                value={this.state.segment}
              >
                <option>Industrial</option>
                <option>Institutional</option>
                <option>Commercial</option>
                <option>Residential</option>
                <option>Others</option>
              </select>
            </div>
            <div className="address-details-div ">
              <p>Sub Segment</p>
              <select
                className="address-details-select "
                name="sub_segment"
                onChange={this.handleSelectChange}
                placeholder={this.state.sub_segment}
                value={this.state.sub_segment}
              >
                <option>Pre-School</option>
                <option>School</option>
                <option>Diploma/ITI</option>
                <option>College</option>
                <option>University</option>
                <option>Restaurant</option>
                <option>Mall</option>
                <option>Hotel</option>
                <option>Commercial Complex</option>
                <option>Petrol Pump</option>
                <option>PG and Hostel</option>
                <option>Multi-Storey Apartment</option>
                <option>Independent House</option>
                <option>Residential Society</option>
                <option>Township</option>
                <option>Manufacturing</option>
                <option>Food and Beverages</option>
                <option>Retail</option>
                <option>Cold Storage</option>
                <option>Warehouse</option>
                <option>Logistics</option>
                <option>Others</option>
              </select>
            </div>
            <div className="address-details-div ">
              <p>Average Monthly Cost</p>
              <input
                className="address-details-input "
                type="text"
                value={this.state.average_monthly_energy_cost}
                placeholder={this.state.average_monthly_energy_cost}
                onChange={this.handleChange}
                name="average_monthly_energy_cost"
              />{" "}
            </div>
            <div className="address-details-div ">
              <p>Electricity Quality</p>
              <select
                className="address-details-select "
                name="electricity_quality"
                onChange={this.handleSelectChange}
                placeholder={this.state.electricity_quality}
                value={this.state.electricity_quality}
              >
                <option>Poor</option>
                <option>Average</option>
                <option>Good</option>
                <option>Excellent</option>
              </select>
            </div>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  info: state.connectionInfo.data
});

export default connect(mapStateToProps)(ConnectionDetails);
