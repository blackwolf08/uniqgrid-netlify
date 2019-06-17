import React, { Component } from "react";
import { Helmet } from "react-helmet";
import AddressDetails from "./AddressDetails/AddressDetails";
import ConnectionDetails from "./ConnectionDetails/ConnectionDetails";
import LocalGeneration from "./LocalGeneration/LocalGeneration";
import SolarPvGenerator from "./SolarPvGenerator/SolarPvGenerator";
import InstalledDevices from "./InstalledDevices/InstalledDevices";
import { fetchConnetionInfo } from "../../../../actions/fetchConnectionInfo";
import { connect } from "react-redux";
import MysiteMap from "../MySite Maps/MysiteMap";
import Spinner from "../../../../images/index";

// this componets gets keys for a particular site based upon the site id we recieve from /dashboard/mysite/:id

class ConnectionInfo extends Component {
  state = {
    id: 0,
    tab1: " connection-info-border",
    tab2: "",
    tab3: "",
    tab4: "",
    tab5: "",
    data: {},
    name: "",
    update: false,
    defaultName: "Connection Name",
    active: 0,
    city: "-",
    postal: "-",
    state: "-",
    street: "-",
    electricity_connection_name: "-",
    connected_load_kw: "-",
    segment: "",
    sub_segment: "",
    average_monthly_energy_cost: "",
    electricity_quality: "",
    bodyArray: [],
    finalArray: [],
    enableSpinner: false
  };

  componentDidMount() {
    //get dynaic id from site
    const {
      match: { params }
    } = this.props;
    const id = params.id;
    //setter for id in state
    this.setState({
      id
    });
    this.props
      .fetchConnetionInfo(id)
      .then(res => {
        //fetch connection info based upon the given id
        if (res) {
          //if there is a response
          //get data
          this.setState({
            data: this.props.info
          });
          let name = "";
          Object.keys(this.state.data).forEach(key => {
            if (key.indexOf("connection") === 12) {
              name = this.state.data[key].value.toString();
            }
          });
          this.setState({
            name
          });
          this.setState({
            active: 1
          });
        }
      })
      .catch(res => {
        if (res.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }
      });
  }

  //handle borders in te tabs
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
    } else if (tab === "local-generation") {
      this.setState({
        tab1: "",
        tab2: "",
        tab3: " connection-info-border",
        tab4: "",
        tab5: "",
        active: 3
      });
    } else if (tab === "solar-pv-generator") {
      this.setState({
        tab1: "",
        tab2: "",
        tab3: "",
        tab4: " connection-info-border",
        tab5: "",
        active: 4
      });
    } else if (tab === "installed-devices") {
      this.setState({
        tab1: "",
        tab2: "",
        tab3: "",
        tab4: "",
        tab5: " connection-info-border",
        active: 5
      });
    }
  };

  //handle component mounting

  handleUpdateButtonClick = value => {
    if (value === 1) {
      this.handleTabChange("connection-details");
    } else if (value === 2) {
      this.handleTabChange("local-generation");
    } else if (value === 3) {
      this.handleTabChange("solar-pv-generator");
    } else if (value === 4) {
      this.handleTabChange("installed-devices");
    } else if (value === 5) {
      //this get called when the user clicks submit button
      this.setState({
        enableSpinner: true
      });
      let obj = {};
      let properties = [];
      let toSend = [];
      //prepare the array we need to send to backend
      this.state.bodyArray.forEach(object => {
        Object.keys(object).forEach(key => {
          obj[key] = object[key];
        });
      });
      Object.keys(obj).forEach(key => {
        properties.push({ [key]: obj[key] });
        toSend.push({ property: key, value: obj[key] });
      });
      //console log finalArr to see the list of properties we need to update
      this.setState({
        finalArray: toSend
      });

      //POST the JSON object
      fetch(
        `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/vid/${
          this.props.vid
        }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`,
        {
          method: "POST",
          body: `{  "properties": ${JSON.stringify(toSend)}
                }`
        }
      )
        .then(res => {
          //reload and refresh
          window.location.href = `/dashboard/my-sites/${this.state.id}`;
        })
        .catch(res => {
          if (res.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
          }
        });
    }
  };

  handleChildrenChange = value => {
    Object.keys(value).forEach(key => {
      Object.keys(this.props.rawdatamapping).forEach(key2 => {
        //mapping processed data from raw data, eg, mapping connection name with connection_name_site_:id_
        let regex = new RegExp("^" + key, "i");
        if (key2.match(regex)) {
          let objToBePushed = { [key2]: value[key] };
          this.setState({
            bodyArray: [...this.state.bodyArray, objToBePushed]
          });
        }
      });
      this.setState({
        [key]: value[key]
      });
    });
  };

  render() {
    if (this.state.enableSpinner) {
      return <Spinner />;
    }
    return (
      <div className="view">
        <Helmet>
          <title>{`${this.state.name || this.state.defaultName}`}</title>
        </Helmet>
        <h1 className="mysites-heading1">
          {this.state.name || this.state.defaultName}
        </h1>
        <div style={{ height: "300px" }}>
          <MysiteMap
            className="flex"
            style={{ width: "80%", height: "300px", margin: "0 auto" }}
            data={this.state.data}
          />
        </div>
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
            <div
              onClick={() => {
                this.handleTabChange("local-generation");
              }}
              className={"mycol-5" + this.state.tab3}
            >
              <p className="connection-info-p">Local Generation</p>
            </div>
            <div
              onClick={() => {
                this.handleTabChange("solar-pv-generator");
              }}
              className={"mycol-5" + this.state.tab4}
            >
              <p className="connection-info-p">Solar PV Generator</p>
            </div>
            <div
              onClick={() => {
                this.handleTabChange("installed-devices");
              }}
              className={"mycol-5" + this.state.tab5}
            >
              <p className="connection-info-p">Installed Devices</p>
            </div>
          </div>
          {this.state.active === 1 && (
            <>
              {/* address details component */}
              <AddressDetails
                handleChildrenChange={this.handleChildrenChange}
                update={this.update}
                data={this.props.info}
              />
              <div className="row">
                <div className="col">
                  <button
                    className="update-button"
                    onClick={() => {
                      this.handleUpdateButtonClick(1);
                    }}
                  >
                    Next
                  </button>
                  <br />
                  <br />
                </div>
              </div>
            </>
          )}
          {this.state.active === 2 && (
            <>
              {/* connection details component */}
              <ConnectionDetails
                handleChildrenChange={this.handleChildrenChange}
                update={this.update}
                data={this.props.info}
              />
              <div className="row">
                <div className="col">
                  <button
                    className="update-button"
                    onClick={() => {
                      this.handleUpdateButtonClick(2);
                    }}
                  >
                    Next
                  </button>
                  <br />
                  <br />
                </div>
              </div>
            </>
          )}
          {this.state.active === 3 && (
            <>
              {/* local generation component */}
              <LocalGeneration
                handleChildrenChange={this.handleChildrenChange}
                update={this.update}
                data={this.props.info}
              />
              <div className="row">
                <div className="col">
                  <button
                    className="update-button"
                    onClick={() => {
                      this.handleUpdateButtonClick(3);
                    }}
                  >
                    Next
                  </button>
                  <br />
                  <br />
                </div>
              </div>
            </>
          )}
          {this.state.active === 4 && (
            <>
              {/* solar power component */}
              <SolarPvGenerator
                handleChildrenChange={this.handleChildrenChange}
                update={this.update}
                data={this.props.info}
              />
              <div className="row">
                <div className="col">
                  <button
                    className="update-button"
                    onClick={() => {
                      this.handleUpdateButtonClick(4);
                    }}
                  >
                    Next
                  </button>
                  <br />
                  <br />
                </div>
              </div>
            </>
          )}
          {this.state.active === 5 && (
            <>
              {!this.state.enableSpinner && (
                <>
                  {/* installed devices component */}
                  <InstalledDevices
                    handleChildrenChange={this.handleChildrenChange}
                    update={this.update}
                    data={this.props.info}
                  />
                  <div className="row">
                    <div className="col">
                      <button
                        className="update-button"
                        onClick={() => {
                          this.handleUpdateButtonClick(5);
                        }}
                      >
                        Update
                      </button>
                      <br />
                      <br />
                    </div>
                  </div>
                </>
              )}
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
)(ConnectionInfo);
