import React, { Component } from "react";
import { Helmet } from "react-helmet";
import DeviceList from "./DeviceList";
import uuid from "uuid";
import axios from "axios";
import { connect } from "react-redux";
import Spinner from "../images";
import CanvasJSReact from "../lib/canvasjs.react";
import moment from "moment";

class MyDevice extends Component {
  state = {
    connections: [
      1
      //JSON response from uniqgrid server
    ],
    deviceId: "",
    isLoading: false,
    keys: [],
    selectValue: "Select Device",
    graphData: "",
    startTime: moment()
      .subtract(1, "days")
      .valueOf(),
    default: true,
    deviceActivated: false,
    day: " active-filter",
    week: "",
    month: "",
    year: "",
    id: ""
  };

  handleClick = (deviceId, name) => {
    this.setState({
      deviceId,
      isLoading: true,
      deviceActivated: true,
      deviceName: name,
      selectValue: "",
      graphData: ""
    });
    const URL = `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/device/${deviceId}`;
    axios.get(URL).then(res => {
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/plugins/telemetry/DEVICE/${deviceId}/keys/timeseries`
        )
        .then(res => {
          this.setState({
            keys: res.data,
            isLoading: false
          });
        })
        .catch(res => {
          if (res.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
          }
        });
    });
  };
  handleChange = e => {
    this.setState({
      isLoading: true,
      default: false
    });
    this.setState({ selectValue: e.target.value });
    let endtime = moment().valueOf();
    let startTime = moment()
      .subtract(1, "days")
      .valueOf();
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/plugins/telemetry/DEVICE/${
          this.state.deviceId
        }/values/timeseries?limit=10000&interval=900000&agg=MAX&keys=${
          e.target.value
        }&startTs=${startTime}&endTs=${endtime}`
      )
      .then(res => {
        let a = res.data;
        let s = a[Object.keys(a)[0]];
        this.setState({
          isLoading: false,
          graphData: s
        });
        if (typeof a[Object.keys(a)[0]] === "undefined") {
          console.log(s);
          this.setState({
            isLoading: false,
            graphData: ""
          });
        }
      })
      .catch(res => {
        if (res.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }
      });
  };

  setOptions = () => {
    let s = this.dataPoints();
    let heading = this.state.selectValue.split("_");
    heading = heading.join(" ");
    const options = {
      title: {
        text: `${heading} Analysis`
      },
      animationEnabled: true,
      exportEnabled: true,
      theme: "light2",
      data: [
        {
          type: "area",
          dataPoints: [...s]
        }
      ]
    };

    return options;
  };

  noDataSetOptions = () => {
    let s = this.noDataPoints();
    let heading = this.state.selectValue.split("_");
    heading = heading.join(" ");
    const options = {
      title: {
        text: `${heading} Analysis`
      },
      animationEnabled: true,
      exportEnabled: true,
      theme: "light2",
      data: [
        {
          type: "area",
          dataPoints: [...s]
        }
      ]
    };

    return options;
  };

  noDataPoints = () => {
    return [
      {
        label: moment().format("MMM Do YY"),
        y: 0
      }
    ];
  };

  dataPoints = () => {
    let s = this.state.graphData.map(e => {
      return {
        label: moment(e.ts).format("MMM Do YY"),
        y: e.value * 1
      };
    });
    return s;
  };

  filterWeek = () => {
    let startTime = moment()
      .subtract(1, "weeks")
      .valueOf();
    this.setState({
      startTime
    });
    this.setState({
      isLoading: true
    });
    let endtime = moment().valueOf();
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/plugins/telemetry/DEVICE/${
          this.state.deviceId
        }/values/timeseries?limit=10000&interval=10800000&agg=MAX&keys=${
          this.state.selectValue
        }&startTs=${startTime}&endTs=${endtime}`
      )
      .then(res => {
        console.log(res);
        let a = res.data;
        let s = a[Object.keys(a)[0]];
        this.setState({
          isLoading: false,
          graphData: s
        });
      })
      .catch(res => {
        if (res.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }
      });
    this.setState({
      day: "",
      week: " active-filter",
      month: "",
      year: ""
    });
  };

  filterMonth = () => {
    let startTime = moment()
      .subtract(1, "months")
      .valueOf();
    this.setState({
      startTime
    });
    this.setState({
      isLoading: true
    });
    let endtime = moment().valueOf();
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/plugins/telemetry/DEVICE/${
          this.state.deviceId
        }/values/timeseries?limit=10000&interval=86400000&agg=MAX&keys=${
          this.state.selectValue
        }&startTs=${startTime}&endTs=${endtime}`
      )
      .then(res => {
        let a = res.data;
        let s = a[Object.keys(a)[0]];
        this.setState({
          isLoading: false,
          graphData: s
        });
      })
      .catch(res => {
        if (res.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }
      });
    this.setState({
      day: "",
      week: "",
      month: " active-filter",
      year: ""
    });
  };

  filterYear = () => {
    let startTime = moment()
      .subtract(1, "years")
      .valueOf();
    this.setState({
      startTime
    });
    this.setState({
      isLoading: true
    });
    let endtime = moment().valueOf();
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/plugins/telemetry/DEVICE/${
          this.state.deviceId
        }/values/timeseries?limit=10000&interval=86400000&agg=MAX&keys=${
          this.state.selectValue
        }&startTs=${startTime}&endTs=${endtime}`
      )
      .then(res => {
        let a = res.data;
        let s = a[Object.keys(a)[0]];
        this.setState({
          isLoading: false,
          graphData: s
        });
      })
      .catch(res => {
        if (res.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }
      });
    this.setState({
      day: "",
      week: "",
      month: "",
      year: " active-filter"
    });
  };

  filterDay = () => {
    console.log(
      moment()
        .subtract("1", "days")
        .valueOf()
    );
    let startTime = moment()
      .subtract(1, "days")
      .valueOf();
    this.setState({
      startTime
    });
    this.setState({
      isLoading: true
    });
    let endtime = moment().valueOf();
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/plugins/telemetry/DEVICE/${
          this.state.deviceId
        }/values/timeseries?limit=10000&interval=900000&agg=MAX&keys=${
          this.state.selectValue
        }&startTs=${this.state.startTime}&endTs=${endtime}`
      )
      .then(res => {
        let a = res.data;
        let s = a[Object.keys(a)[0]];
        this.setState({
          isLoading: false,
          graphData: s
        });
      })
      .catch(res => {
        if (res.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }
      });
    this.setState({
      day: " active-filter",
      week: "",
      month: "",
      year: ""
    });
  };

  render() {
    let CanvasJSChart = CanvasJSReact.CanvasJSChart;
    const listOfConnections = this.state.connections.map(connection => {
      return (
        <DeviceList
          handleMethod={this.handleClick}
          key={uuid.v4()}
          name={connection}
        />
      );
    });

    const listOfKeys = this.state.keys.map(key => {
      let keyValue = key;
      let keyArray = keyValue.split("_");
      keyArray = keyArray.join(" ");
      return (
        <option key={uuid.v4()} value={key}>
          {keyArray}
        </option>
      );
    });
    return (
      <div>
        <Helmet>
          <title>My Device</title>
        </Helmet>
        <div className="mydevice-hero">
          <h1 style={{ marginBottom: "20px" }} className="mysite-heading">
            My Devices
          </h1>
          {listOfConnections}
          <div className="my-device-graph">
            {this.state.deviceActivated && (
              <div className="filter">
                <h4 style={{ width: "100%", textAlign: "center" }}>
                  {this.state.deviceName}
                </h4>
                <select
                  value={this.state.selectValue}
                  onChange={this.handleChange}
                  className="key-select"
                >
                  <option defaultValue>Select</option>
                  {listOfKeys}
                </select>
                <button
                  className={"filter-button" + this.state.day}
                  onClick={this.filterDay}
                >
                  Day
                </button>
                <button
                  className={"filter-button" + this.state.week}
                  onClick={this.filterWeek}
                >
                  Week
                </button>
                <button
                  className={"filter-button" + this.state.month}
                  onClick={this.filterMonth}
                >
                  Month
                </button>
                <button
                  className={"filter-button" + this.state.year}
                  onClick={this.filterYear}
                >
                  Year
                </button>
                <div className="row">
                  <div className="col-sm-12 col flex">
                    <div style={{ width: "50%" }}>
                      <button
                        style={{
                          position: "absolute",
                          left: "0",
                          fontSize: "200%",
                          backgroundColor: "white"
                        }}
                      >
                        <i class="fas fa-arrow-left" />
                      </button>
                    </div>
                    <div style={{ width: "50%", position: "relative" }}>
                      <button
                        style={{
                          position: "absolute",
                          right: "0",
                          fontSize: "200%",
                          backgroundColor: "white"
                        }}
                      >
                        <i class="fas fa-arrow-right" />
                      </button>
                    </div>
                  </div>
                </div>
                <br />
                <br />
                {/* <p>{this.state.graphData}</p> */}
                <div>
                  {!this.state.graphData && !this.state.isLoading && (
                    <CanvasJSChart
                      options={this.noDataSetOptions()}
                      /* onRef = {ref => this.chart = ref} */
                    />
                  )}
                  {this.state.isLoading && (
                    <div style={{ height: "400px" }}>
                      <Spinner />
                    </div>
                  )}
                  {this.state.graphData &&
                    !this.state.isLoading &&
                    this.state.graphData.length > 1 &&
                    !this.state.isLoading && (
                      <CanvasJSChart
                        options={this.setOptions()}
                        /* onRef = {ref => this.chart = ref} */
                      />
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapSateToProps = state => ({
  devices: state.userdata.data,
  connectionName: state.connectionInfo.data
});

export default connect(mapSateToProps)(MyDevice);
