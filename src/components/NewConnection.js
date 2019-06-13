import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { fetchConnetionInfo } from "../actions/fetchConnectionInfo";
import { connect } from "react-redux";
import Spinner from "../images/index";
import csc from "country-state-city";
import uuid from "uuid";

class NewConnection extends Component {
  state = {
    id: 0,
    tab1: " connection-info-border",
    tab2: "",
    name: "",
    update: false,
    defaultName: "New Connection Name",
    active: 1,
    enableSpinner: false,
    isLoading: true,
    stateId: 0,
    cityReady: false,
    city: "",
    postal: "",
    state: "",
    street: "",
    electricity_connection_name: "",
    segment: "",
    sub_segment: ""
  };

  handleTabChange = tab => {
    if (tab === "connection-details") {
      this.setState({
        tab1: "",
        tab2: " connection-info-border",
        tab3: "",
        tab4: "",
        tab5: "",
        active: 2
      });
    } else if (tab === "address-details") {
      this.setState({
        tab1: " connection-info-border",
        tab2: "",
        tab3: "",
        tab4: "",
        tab5: "",
        active: 1
      });
    }
  };

  componentDidMount() {
    this.setState({
      isLoading: false
    });
    const listOfStates = csc.getStatesOfCountry("101");
    let idd;

    setTimeout(() => {
      listOfStates.forEach(stateI => {
        if (stateI.name === this.state.state) {
          idd = stateI.id;
        }
      });
      this.setState({
        stateId: idd
      });
    }, 100);
  }
  handleSelectChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    const stateId = e.target.options[e.target.selectedIndex].id;
    this.setState({
      stateId
    });
    this.setState({
      cityReady: true
    });
  };
  handleSelectChangeCity = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    this.props.handleChildrenChange({
      [e.target.name]: e.target.value
    });
  };
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleUpdateButtonClick = value => {
    if (value === 1) {
      this.handleTabChange("connection-details");
    }
  };

  render() {
    if (this.state.enableSpinner) {
      return <Spinner />;
    }
    if (this.state.isLoading) {
      return <Spinner />;
    }
    const listOfStatesToRender = [];
    const listOfCitiesToRender = [];
    const listOfStates = csc.getStatesOfCountry("101");
    listOfStates.forEach(stateName => {
      listOfStatesToRender.push(
        <option id={stateName.id} key={uuid.v4()}>
          {stateName.name}
        </option>
      );
    });

    const listOfCities = csc.getCitiesOfState(`${this.state.stateId}`);
    listOfCities.forEach(cityName => {
      listOfCitiesToRender.push(
        <option id={cityName.id} key={uuid.v4()}>
          {cityName.name}
        </option>
      );
    });
    return (
      <div className="view">
        <Helmet>
          <title>{`New Connection`}</title>
        </Helmet>
        <h1 className="mysites-heading">
          {this.state.name || this.state.defaultName}
        </h1>
        <div className="connection-info-hero">
          <div className="connection-info-tabs" style={{ cursor: "pointer" }}>
            <div
              onClick={() => {
                this.handleTabChange("address-details");
              }}
              className={"mycol-5" + this.state.tab1}
            >
              <p className="connection-info-p">Address Details</p>
            </div>
            <div
              onClick={() => {
                this.handleTabChange("connection-details");
              }}
              className={"mycol-5" + this.state.tab2}
            >
              <p className="connection-info-p">Connection Details</p>
            </div>
          </div>
          {this.state.active === 1 && (
            <>
              <div className="address-details">
                {!this.state.isLoading && (
                  <>
                    <div className="address-details-div ">
                      <p>State</p>
                      <select
                        className="address-details-select "
                        name="state"
                        onChange={this.handleSelectChange}
                        ref={this.selectRef}
                        placeholder={this.state.state}
                        value={this.state.state}
                      >
                        {listOfStatesToRender}
                      </select>
                    </div>
                    <div className="address-details-div ">
                      <p>City</p>
                      <select
                        className="address-details-select "
                        name="city"
                        onChange={this.handleSelectChangeCity}
                        placeholder={this.state.city}
                        value={this.state.city}
                      >
                        {listOfCitiesToRender}
                      </select>
                    </div>
                    <div className="address-details-div">
                      <p>Street Address</p>
                      <input
                        className="address-details-input "
                        type="text"
                        value={this.state.street}
                        placeholder={this.state.street}
                        onChange={e => {
                          this.handleChange(e);
                        }}
                        name="street"
                      />{" "}
                    </div>

                    <div className="address-details-div ">
                      <p>Pincode</p>
                      <input
                        className="address-details-input "
                        type="text"
                        value={this.state.postal}
                        placeholder={this.state.postal}
                        onChange={e => {
                          this.handleChange(e);
                        }}
                        name="postal"
                      />{" "}
                    </div>
                  </>
                )}
              </div>
              <button
                className="update-button"
                onClick={() => {
                  this.handleUpdateButtonClick(1);
                }}
              >
                Next
              </button>
            </>
          )}
          {this.state.active === 2 && (
            <>
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
                  </>
                )}
              </div>
              <button
                className="update-button"
                onClick={() => {
                  this.handleUpdateButtonClick(2);
                }}
              >
                Add
              </button>
            </>
          )}
          {this.state.update && <button className="edit-button">Update</button>}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  info: state.connectionInfo.data,
  rawdatamapping: state.userdata.rawdatamapping,
  vid: state.userdata.vid
});

export default connect(
  mapStateToProps,
  { fetchConnetionInfo }
)(NewConnection);
