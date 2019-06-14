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
    devicesArr: [],
    isLoading: false,
    keys: [],
    selectValue: "Select Device",
    graphData: "",
    startTime: moment()
      .startOf("day")
      .valueOf(),
    endtime: "",
    default: true,
    deviceActivated: false,
    day: " active-filter",
    week: "",
    month: "",
    year: "",
    id: "",
    selectedFilter: "day",
    back: 1
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
      default: false,
      back: 1
    });
    this.setState({ selectValue: e.target.value });
    let endtime = moment().valueOf();
    let startTime = moment()
      .startOf("day")
      .valueOf();
    this.setState({
      selectedFilter: "day"
    });
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
    let typeOfGraph;
    if (this.state.selectedFilter === "day") {
      typeOfGraph = "area";
    }
    if (this.state.selectedFilter === "week") {
      typeOfGraph = "column";
    }
    if (this.state.selectedFilter === "month") {
      typeOfGraph = "column";
    }
    if (this.state.selectedFilter === "year") {
      typeOfGraph = "column";
    }
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
          type: typeOfGraph,
          color: "orange",
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
    if (this.state.selectedFilter === "day") {
      let s = this.state.graphData.map(e => {
        return {
          label: moment(e.ts).format("hh a"),
          y: e.value * 1
        };
      });
      return s;
    }
    if (this.state.selectedFilter === "year") {
      let s = this.state.graphData.map(e => {
        return {
          label: moment(e.ts).format("MMM"),
          y: e.value * 1
        };
      });
      return s;
    }
    let s = this.state.graphData.map(e => {
      return {
        label: moment(e.ts).format("MMM Do YY"),
        y: e.value * 1
      };
    });
    return s;
  };

  filterWeek = () => {
    this.setState({
      selectedFilter: "week",
      back: 1
    });
    let startTime = moment()
      .startOf("isoWeek")
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
    this.setState({
      selectedFilter: "month",
      back: 1
    });
    let startTime = moment()
      .startOf("month")
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
    this.setState({
      selectedFilter: "year",
      back: 1
    });
    let startTime = moment()
      .startOf("year")
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

  handleGraphChange = (start_time, end_time, interval) => {
    this.setState({
      startTime: start_time
    });
    this.setState({
      isLoading: true
    });
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/plugins/telemetry/DEVICE/${
          this.state.deviceId
        }/values/timeseries?limit=10000&interval=${interval}&agg=MAX&keys=${
          this.state.selectValue
        }&startTs=${start_time}&endTs=${end_time}`
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
  };

  handleLeft = () => {
    this.setState({
      back: this.state.back + 1
    });
    if (this.state.back >= 4) {
      this.setState({
        back: 4
      });
    }
    setTimeout(() => {
      if (this.state.back >= 0 && this.state.back <= 4) {
        let start_time, end_time, interval;

        if (this.state.selectedFilter === "day") {
          interval = 900000;
        }
        if (this.state.selectedFilter === "week") {
          interval = 10800000;
        }
        if (this.state.selectedFilter === "month") {
          interval = 86400000;
        }
        if (this.state.selectedFilter === "year") {
          interval = 86400000;
        }
        console.log(this.state.back);
        if (this.state.selectedFilter === "day") {
          if (this.state.back === 1) {
            start_time = moment()
              .subtract(1, "days")
              .startOf("day")
              .valueOf();
            end_time = start_time + 86400000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 2) {
            start_time = moment()
              .subtract(2, "days")
              .startOf("day")
              .valueOf();
            end_time = start_time + 86400000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 3) {
            start_time = moment()
              .subtract(3, "days")
              .startOf("day")
              .valueOf();
            end_time = start_time + 86400000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 4) {
            start_time = moment()
              .subtract(4, "days")
              .startOf("day")
              .valueOf();
            end_time = start_time + 86400000;
            this.handleGraphChange(start_time, end_time, interval);
          }
        } else if (this.state.selectedFilter === "week") {
          if (this.state.back === 1) {
            start_time = moment()
              .subtract(1, "week")
              .startOf("isoWeek")
              .valueOf();
            end_time = start_time + 604800000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 2) {
            start_time = moment()
              .subtract(2, "week")
              .startOf("isoWeek")
              .valueOf();
            end_time = start_time + 604800000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 3) {
            start_time = moment()
              .subtract(3, "week")
              .startOf("isoWeek")
              .valueOf();
            end_time = start_time + 604800000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 4) {
            start_time = moment()
              .subtract(4, "week")
              .startOf("isoWeek")
              .valueOf();
            end_time = start_time + 604800000;
            this.handleGraphChange(start_time, end_time, interval);
          }
        } else if (this.state.selectedFilter === "month") {
          if (this.state.back === 1) {
            start_time = moment()
              .subtract(1, "month")
              .startOf("month")
              .valueOf();
            end_time = start_time + 2628000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 2) {
            start_time = moment()
              .subtract(2, "month")
              .startOf("month")
              .valueOf();
            end_time = start_time + 2628000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 3) {
            start_time = moment()
              .subtract(3, "month")
              .startOf("month")
              .valueOf();
            end_time = start_time + 2628000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 4) {
            start_time = moment()
              .subtract(4, "month")
              .startOf("month")
              .valueOf();
            end_time = start_time + 2628000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
        } else if (this.state.selectedFilter === "year") {
          if (this.state.back === 1) {
            start_time = moment()
              .subtract(1, "year")
              .startOf("year")
              .valueOf();
            end_time = start_time + 31536000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 2) {
            start_time = moment()
              .subtract(2, "year")
              .startOf("year")
              .valueOf();
            end_time = start_time + 31536000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 3) {
            start_time = moment()
              .subtract(3, "year")
              .startOf("year")
              .valueOf();
            end_time = start_time + 31536000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 4) {
            start_time = moment()
              .subtract(4, "year")
              .startOf("year")
              .valueOf();
            end_time = start_time + 31536000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
        } else {
          if (this.state.back >= 4) {
            this.setState({
              back: 4
            });
          }
        }
      }
    }, 200);
  };

  handleRight = () => {
    this.setState({
      back: this.state.back - 1
    });
    if (this.state.back >= 0 && this.state.back <= 4) {
      if (this.state.back <= 1) {
        this.setState({
          back: 1
        });
      }
      if (this.state.back >= 0 && this.state.back <= 4) {
        let start_time, end_time, interval;

        if (this.state.selectedFilter === "day") {
          interval = 900000;
        }
        if (this.state.selectedFilter === "week") {
          interval = 10800000;
        }
        if (this.state.selectedFilter === "month") {
          interval = 86400000;
        }
        if (this.state.selectedFilter === "year") {
          interval = 86400000;
        }
        if (this.state.selectedFilter === "day") {
          if (this.state.back === 1) {
            start_time = moment()
              .startOf("day")
              .valueOf();
            end_time = moment().valueOf();
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 2) {
            start_time = moment()
              .subtract(1, "days")
              .startOf("day")
              .valueOf();
            end_time = start_time + 86400000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 3) {
            start_time = moment()
              .subtract(2, "days")
              .startOf("day")
              .valueOf();
            end_time = start_time + 86400000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 4) {
            start_time = moment()
              .subtract(3, "days")
              .startOf("day")
              .valueOf();
            end_time = start_time + 86400000;
            this.handleGraphChange(start_time, end_time, interval);
          }
        } else if (this.state.selectedFilter === "week") {
          if (this.state.back === 1) {
            start_time = moment()
              .startOf("isoWeek")
              .valueOf();
            end_time = start_time + 604800000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 2) {
            start_time = moment()
              .subtract(1, "week")
              .startOf("isoWeek")
              .valueOf();
            end_time = start_time + 604800000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 3) {
            start_time = moment()
              .subtract(2, "week")
              .startOf("isoWeek")
              .valueOf();
            end_time = start_time + 604800000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 4) {
            start_time = moment()
              .subtract(3, "week")
              .startOf("isoWeek")
              .valueOf();
            end_time = start_time + 604800000;
            this.handleGraphChange(start_time, end_time, interval);
          }
        } else if (this.state.selectedFilter === "month") {
          if (this.state.back === 1) {
            start_time = moment()
              .startOf("month")
              .valueOf();
            end_time = start_time + 2628000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 2) {
            start_time = moment()
              .subtract(1, "month")
              .startOf("month")
              .valueOf();
            end_time = start_time + 2628000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 3) {
            start_time = moment()
              .subtract(2, "month")
              .startOf("month")
              .valueOf();
            end_time = start_time + 2628000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 4) {
            start_time = moment()
              .subtract(3, "month")
              .startOf("month")
              .valueOf();
            end_time = start_time + 2628000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
        } else if (this.state.selectedFilter === "year") {
          if (this.state.back === 1) {
            start_time = moment()
              .startOf("year")
              .valueOf();
            end_time = start_time + 31536000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 2) {
            start_time = moment()
              .subtract(1, "year")
              .startOf("year")
              .valueOf();
            end_time = start_time + 31536000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 3) {
            start_time = moment()
              .subtract(2, "year")
              .startOf("year")
              .valueOf();
            end_time = start_time + 31536000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 4) {
            start_time = moment()
              .subtract(3, "year")
              .startOf("year")
              .valueOf();
            end_time = start_time + 31536000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
        } else {
          this.setState({
            back: 1
          });
        }
      }
    }
  };

  filterDay = () => {
    this.setState({
      selectedFilter: "day",
      back: 1
    });
    let startTime = moment()
      .startOf("day")
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
      day: " active-filter",
      week: "",
      month: "",
      year: ""
    });
  };

  componentDidMount() {
    this.setState({
      devicesArr: this.props.devices
    });
  }

  getConnectionList = () => {
    return <DeviceList handleMethod={this.handleClick} key={uuid.v4()} />;
  };

  render() {
    let CanvasJSChart = CanvasJSReact.CanvasJSChart;
    console.log(this.state.devicesArr);

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

          <div className="mydevice-list">
            <div
              style={{
                display: "flex",
                paddingLeft: "10px",
                paddingTop: "10px",
                cursor: "pointer",
                fontSize: "120%",
                color: "#111111",
                borderBottom: "2px solid #d3d3d3"
              }}
              className={"device-list " + this.state.selected}
            >
              <div className="my-col">
                <p>Device Id</p>
              </div>
              <div className="my-col">
                <p> </p>
              </div>
              <div className="my-col">
                <p>Rated Capacity (kW)</p>
              </div>
              <div className="my-col">
                <p>Device Type</p>
              </div>
            </div>
          </div>
          {this.getConnectionList()}
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
                        onClick={this.handleLeft}
                        style={{
                          position: "absolute",
                          left: "0",
                          fontSize: "150%",
                          backgroundColor: "white"
                        }}
                      >
                        <i className="fas fa-arrow-left" />
                        <span style={{}}>
                          {" "}
                          Previos {this.state.selectedFilter}
                        </span>
                      </button>
                    </div>
                    <div style={{ width: "50%", position: "relative" }}>
                      <button
                        onClick={this.handleRight}
                        style={{
                          position: "absolute",
                          right: "0",
                          fontSize: "150%",
                          backgroundColor: "white"
                        }}
                      >
                        <span style={{}}>
                          Next {this.state.selectedFilter}{" "}
                        </span>
                        <i className="fas fa-arrow-right" />
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
