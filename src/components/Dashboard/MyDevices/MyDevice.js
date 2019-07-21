import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import DeviceList from './DeviceList';
import uuid from 'uuid';
import axios from 'axios';
import { connect } from 'react-redux';
import Spinner from '../../../images';
import CanvasJSReact from '../../../lib/canvasjs.react';
import moment from 'moment';
import { fetchUserData } from '../../../actions/userData';

//Info about tampering with momentJS is in MyDevice.md (same folder)

class MyDevice extends Component {
  state = {
    connections: [
      //DO NOT CHANGE THIS!!
      1
      //JSON response from uniqgrid server
      // STATIC STUFF, DO NOT TAMPER
    ],
    deviceId: '',
    show_graph: false,
    devicesArr: [],
    isLoading: false,
    keys: [],
    selectValue: 'Select Device',
    graphData: '',
    show_keys: false,
    show_filters: false,
    power_active: '',
    energy_acive: '',
    others_active: '',
    newKeys: [],
    //Default start time
    startTime: moment()
      .startOf('day')
      .valueOf(),
    endtime: '',
    default: true,
    deviceActivated: false,
    day: ' active-filter',
    //used to add selected highlight to day/week/month/year component
    week: '',
    month: '',
    year: '',
    //id of device
    id: '',
    selectedFilter: 'day',
    //back values handles LEFT and RIGHT changes to graph
    back: 1
  };

  componentDidMount() {
    //Getter and setter for device array for the current state form props
    this.setState({
      devicesArr: this.props.devices
    });
    //this.props.fetchUserData();
  }

  handleClick = (deviceId, name) => {
    //function executed when user clicks on one of the devices
    this.setState({
      deviceId,
      isLoading: true,
      show_keys: false,
      deviceActivated: true,
      deviceName: name,
      selectValue: '',
      graphData: '',
      show_graph: false
    });
    const URL = `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/device/${deviceId}`;
    //grab device details
    axios.get(URL).then(res => {
      //get device keys for dropdown
      axios
        .get(
          `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/plugins/telemetry/DEVICE/${deviceId}/keys/timeseries`
        )
        .then(res => {
          //storing keys to display in dropdown, E.g. keys array === [current, ac power, ...]
          this.setState({
            keys: res.data,
            newKeys: res.data,
            isLoading: false
          });
        })
        .catch(res => {
          console.log(res);
        });
    });
  };
  handleChange = e => {
    //handle keys dropdown change
    let key = e.target.value;
    this.setState({
      isLoading: true,
      default: false,
      back: 1,
      show_graph: true
    });
    //setting select value to store selected key
    this.setState({ selectValue: e.target.value });
    //Default EndTime and StartTime is DAY
    let endtime = moment().valueOf();
    let startTime = moment()
      .startOf('day')
      .valueOf();
    this.setState({
      selectedFilter: 'day'
    });
    //get the timeseries data for graph
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/plugins/telemetry/DEVICE/${
          this.state.deviceId
        }/values/timeseries?limit=10000&interval=3600000&agg=MAX&keys=${key}&startTs=${startTime}&endTs=${endtime}`
      )
      .then(res => {
        let a = res.data;
        let s = a[Object.keys(a)[0]];

        //extract data from response
        //store data in state
        this.setState({
          isLoading: false,
          graphData: s
        });

        //if no data
        if (typeof a[Object.keys(a)[0]] === 'undefined') {
          this.setState({
            isLoading: false,
            graphData: ''
          });
        }
      })
      .catch(res => {
        console.log(res);
      });
  };
  //this function sets options for the graph
  setOptions = () => {
    //Get the datapoints for graph
    let s = this.dataPoints();
    let typeOfGraph;
    //Set type of graphs for different filters
    if (this.state.selectedFilter === 'day') {
      typeOfGraph = 'area';
    } else {
      typeOfGraph = 'column';
    }
    //Make heading from ac_power, to ac power
    let heading = this.state.selectValue.split('_');
    heading = heading.join(' ');
    //custom options for graphs
    const options = {
      title: {
        text: `${heading} Analysis`,
        fontSize: 20
      },
      animationEnabled: true,
      //Downloadable ? true : false
      exportEnabled: true,
      theme: 'light2',
      data: [
        {
          type: typeOfGraph,
          //change color of graph
          color: 'orange',
          dataPoints: [...s]
        }
      ]
    };

    return options;
  };

  noDataSetOptions = () => {
    // if there are no data points then return empty graph
    let s = this.noDataPoints();
    let heading = this.state.selectValue.split('_');
    heading = heading.join(' ');
    const options = {
      title: {
        text: `${heading} Analysis`
      },
      animationEnabled: true,
      exportEnabled: true,
      theme: 'light2',
      data: [
        {
          type: 'area',
          dataPoints: [...s]
        }
      ]
    };

    return options;
  };

  noDataPoints = () => {
    //set options for no data points
    return [
      {
        label: moment().format('MMM Do YY'),
        y: 0
      }
    ];
  };

  dataPoints = () => {
    if (this.state.selectedFilter === 'day') {
      let s;
      //change formatting for day filter on X axis and also scale the data on the y-axis
      s = this.state.graphData.map(e => {
        return {
          label: moment(e.ts).format('hh a'),
          y: e.value
        };
      });
      s = this.state.graphData.map(e => {
        return {
          label: moment(e.ts).format('hh a'),
          y: e.value * 1
        };
      });
      return s;
    }
    if (this.state.selectedFilter === 'year') {
      //formatting for year
      let s;
      s = this.state.graphData.map(e => {
        return {
          label: moment(e.ts).format('MMM'),
          y: e.value
        };
      });
      s = this.state.graphData.map(e => {
        return {
          label: moment(e.ts).format('MMM'),
          y: e.value * 1
        };
      });

      return s;
    }
    if (this.state.selectedFilter === 'week') {
      //formatting for week
      let s;
      s = this.state.graphData.map(e => {
        return {
          label: moment(e.ts).format('dddd'),
          y: e.value
        };
      });
      s = this.state.graphData.map(e => {
        return {
          label: moment(e.ts).format('dddd'),
          y: e.value * 1
        };
      });

      return s;
    }
    if (this.state.selectedFilter === 'month') {
      //formatting for month
      let s;
      s = this.state.graphData.map(e => {
        return {
          label: moment(e.ts).format('D MMM'),
          y: e.value
        };
      });
      s = this.state.graphData.map(e => {
        return {
          label: moment(e.ts).format('D MMM'),
          y: e.value * 1
        };
      });

      return s;
    }
  };

  filter_energy = () => {
    let keys = this.state.newKeys;
    let newKeys = [];
    keys.forEach(key => {
      if (key.match(/energy/) || key.match(/kwh_/) || key.match(/kWh_/)) {
        newKeys.push(key);
      }
    });
    this.setState({
      keys: newKeys,
      show_keys: true,
      energy_acive: ' active-filter',
      power_active: '',
      others_active: ''
    });
  };
  filter_power = () => {
    let keys = this.state.newKeys;
    let newKeys = [];
    keys.forEach(key => {
      if (key.match(/power/) || key.match(/kw_/) || key.match(/kW_/)) {
        newKeys.push(key);
      }
    });
    this.setState({
      keys: newKeys,
      show_keys: true,
      energy_acive: '',
      power_active: ' active-filter',
      others_active: ''
    });
  };
  filter_others = () => {
    let keys = this.state.newKeys;
    let newKeys = [];
    keys.forEach(key => {
      if (!key.match(/energy/) && !key.match(/power/)) {
        newKeys.push(key);
      }
    });
    this.setState({
      keys: newKeys,
      show_keys: true,
      energy_acive: '',
      power_active: '',
      others_active: ' active-filter'
    });
  };

  filterWeek = () => {
    this.setState({
      selectedFilter: 'week',
      back: 1
    });
    //for more details on isoWeek refer to MyDevice.md on same directory
    let startTime = moment()
      .startOf('isoWeek')
      .valueOf();
    this.setState({
      startTime
    });
    this.setState({
      isLoading: true
    });
    //get current time in UNIX
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
        //getter and setter for graph data

        this.setState({
          isLoading: false,
          graphData: s
        });
      })
      .catch(res => {
        console.log(res);
      });
    //apply CSS to selected filter
    this.setState({
      day: '',
      week: ' active-filter',
      month: '',
      year: ''
    });
  };
  // Following all the filters provide the same basic usage as filter Week

  filterDay = () => {
    this.setState({
      selectedFilter: 'day',
      back: 1
    });
    let startTime = moment()
      .startOf('day')
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
        }/values/timeseries?limit=10000&interval=3600000&agg=MAX&keys=${
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
        console.log(res);
      });
    this.setState({
      day: ' active-filter',
      week: '',
      month: '',
      year: ''
    });
  };

  filterMonth = () => {
    this.setState({
      selectedFilter: 'month',
      back: 1
    });
    let startTime = moment()
      .startOf('month')
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
        console.log(res);
      });
    this.setState({
      day: '',
      week: '',
      month: ' active-filter',
      year: ''
    });
  };

  filterYear = () => {
    this.setState({
      selectedFilter: 'year',
      back: 1
    });
    let startTime = moment()
      .startOf('year')
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
        }/values/timeseries?limit=10000&interval=2592000000&agg=MAX&keys=${
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
        console.log(res);
      });
    this.setState({
      day: '',
      week: '',
      month: '',
      year: ' active-filter'
    });
  };

  //Change the graph data on any of the following interactions
  // takes three inputs that are quite intutive
  handleGraphChange = (start_time, end_time, interval) => {
    this.setState({
      startTime: start_time
    });
    this.setState({
      isLoading: true
    });
    //get values form given start time, endtime & interval
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/plugins/telemetry/DEVICE/${
          this.state.deviceId
        }/values/timeseries?limit=10000&interval=${interval}&agg=MAX&keys=${
          this.state.selectValue
        }&startTs=${start_time}&endTs=${end_time}`
      )
      .then(res => {
        //getter and setter for graph data
        let a = res.data;
        let s = a[Object.keys(a)[0]];

        this.setState({
          isLoading: false,
          graphData: s
        });
      })
      .catch(res => {
        console.log(res);
      });
  };

  // Method to handle left button for device filter
  // Refer to MyDevice.md before editing handleLeft() and handleRight() methods
  handleLeft = () => {
    //change back's value
    this.setState({
      back: this.state.back + 1
    });
    if (this.state.back >= 4) {
      this.setState({
        back: 4
      });
    }
    //set-timeout used to ensure that we are working on latest state change as setState takes some time
    setTimeout(() => {
      //this ensures to set the limit on no. of backs performed
      if (this.state.back >= 0 && this.state.back <= 4) {
        let start_time, end_time, interval;
        //set interval timings for the day/week/month/year

        if (this.state.selectedFilter === 'day') {
          // 1 hour
          interval = 3600000;
        }
        if (this.state.selectedFilter === 'week') {
          // 1 day
          interval = 86400000;
        }
        if (this.state.selectedFilter === 'month') {
          // 1 day
          interval = 86400000;
        }
        if (this.state.selectedFilter === 'year') {
          // 1 month
          interval = 2592000000;
        }
        if (this.state.selectedFilter === 'day') {
          // This whole logic is explained in MyDevice.md
          if (this.state.back === 1) {
            start_time = moment()
              .subtract(1, 'days')
              .startOf('day')
              .valueOf();
            end_time = start_time + 86400000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 2) {
            start_time = moment()
              .subtract(2, 'days')
              .startOf('day')
              .valueOf();
            end_time = start_time + 86400000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 3) {
            start_time = moment()
              .subtract(3, 'days')
              .startOf('day')
              .valueOf();
            end_time = start_time + 86400000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 4) {
            start_time = moment()
              .subtract(4, 'days')
              .startOf('day')
              .valueOf();
            end_time = start_time + 86400000;
            this.handleGraphChange(start_time, end_time, interval);
          }
        } else if (this.state.selectedFilter === 'week') {
          if (this.state.back === 1) {
            start_time = moment()
              .subtract(1, 'week')
              .startOf('isoWeek')
              .valueOf();
            end_time = start_time + 604800000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 2) {
            start_time = moment()
              .subtract(1, 'week')
              .startOf('isoWeek')
              .valueOf();
            end_time = start_time + 604800000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 3) {
            start_time = moment()
              .subtract(2, 'week')
              .startOf('isoWeek')
              .valueOf();
            end_time = start_time + 604800000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 4) {
            start_time = moment()
              .subtract(3, 'week')
              .startOf('isoWeek')
              .valueOf();
            end_time = start_time + 604800000;
            this.handleGraphChange(start_time, end_time, interval);
          }
        } else if (this.state.selectedFilter === 'month') {
          if (this.state.back === 1) {
            start_time = moment()
              .subtract(1, 'month')
              .startOf('month')
              .valueOf();
            end_time = start_time + 2628000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 2) {
            start_time = moment()
              .subtract(2, 'month')
              .startOf('month')
              .valueOf();
            end_time = start_time + 2628000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 3) {
            start_time = moment()
              .subtract(3, 'month')
              .startOf('month')
              .valueOf();
            end_time = start_time + 2628000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 4) {
            start_time = moment()
              .subtract(4, 'month')
              .startOf('month')
              .valueOf();
            end_time = start_time + 2628000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
        } else if (this.state.selectedFilter === 'year') {
          if (this.state.back === 1) {
            start_time = moment()
              .subtract(1, 'year')
              .startOf('year')
              .valueOf();
            end_time = start_time + 31536000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 2) {
            start_time = moment()
              .subtract(2, 'year')
              .startOf('year')
              .valueOf();
            end_time = start_time + 31536000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 3) {
            start_time = moment()
              .subtract(3, 'year')
              .startOf('year')
              .valueOf();
            end_time = start_time + 31536000000;
            this.handleGraphChange(start_time, end_time, interval);
          }
          if (this.state.back === 4) {
            start_time = moment()
              .subtract(4, 'year')
              .startOf('year')
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

  //Refer Mydevice.md
  handleRight = () => {
    this.setState({
      back: this.state.back - 1
    });
    setTimeout(() => {
      if (this.state.back >= 0 && this.state.back <= 4) {
        if (this.state.back <= 1) {
          this.setState({
            back: 1
          });
        }
        if (this.state.back >= 0 && this.state.back <= 4) {
          let start_time, end_time, interval;
          console.log(this.state.back);
          if (this.state.selectedFilter === 'day') {
            interval = 3600000;
          }
          if (this.state.selectedFilter === 'week') {
            interval = 86400000;
          }
          if (this.state.selectedFilter === 'month') {
            interval = 86400000;
          }
          if (this.state.selectedFilter === 'year') {
            interval = 2592000000;
          }
          if (this.state.selectedFilter === 'day') {
            if (this.state.back === 1) {
              start_time = moment()
                .startOf('day')
                .valueOf();
              end_time = moment().valueOf();
              this.handleGraphChange(start_time, end_time, interval);
            }
            if (this.state.back === 2) {
              start_time = moment()
                .subtract(1, 'days')
                .startOf('day')
                .valueOf();
              end_time = start_time + 86400000;
              this.handleGraphChange(start_time, end_time, interval);
            }
            if (this.state.back === 3) {
              start_time = moment()
                .subtract(2, 'days')
                .startOf('day')
                .valueOf();
              end_time = start_time + 86400000;
              this.handleGraphChange(start_time, end_time, interval);
            }
            if (this.state.back === 4) {
              start_time = moment()
                .subtract(3, 'days')
                .startOf('day')
                .valueOf();
              end_time = start_time + 86400000;
              this.handleGraphChange(start_time, end_time, interval);
            }
          } else if (this.state.selectedFilter === 'week') {
            if (this.state.back === 1) {
              start_time = moment()
                .startOf('isoWeek')
                .valueOf();
              end_time = start_time + 604800000;
              this.handleGraphChange(start_time, end_time, interval);
            }
            if (this.state.back === 2) {
              start_time = moment()
                .subtract(1, 'week')
                .startOf('isoWeek')
                .valueOf();
              end_time = start_time + 604800000;
              this.handleGraphChange(start_time, end_time, interval);
            }
            if (this.state.back === 3) {
              start_time = moment()
                .subtract(2, 'week')
                .startOf('isoWeek')
                .valueOf();
              end_time = start_time + 604800000;
              this.handleGraphChange(start_time, end_time, interval);
            }
            if (this.state.back === 4) {
              start_time = moment()
                .subtract(3, 'week')
                .startOf('isoWeek')
                .valueOf();
              end_time = start_time + 604800000;
              this.handleGraphChange(start_time, end_time, interval);
            }
          } else if (this.state.selectedFilter === 'month') {
            if (this.state.back === 1) {
              start_time = moment()
                .startOf('month')
                .valueOf();
              end_time = start_time + 2628000000;
              this.handleGraphChange(start_time, end_time, interval);
            }
            if (this.state.back === 2) {
              start_time = moment()
                .subtract(1, 'month')
                .startOf('month')
                .valueOf();
              end_time = start_time + 2628000000;
              this.handleGraphChange(start_time, end_time, interval);
            }
            if (this.state.back === 3) {
              start_time = moment()
                .subtract(2, 'month')
                .startOf('month')
                .valueOf();
              end_time = start_time + 2628000000;
              this.handleGraphChange(start_time, end_time, interval);
            }
            if (this.state.back === 4) {
              start_time = moment()
                .subtract(3, 'month')
                .startOf('month')
                .valueOf();
              end_time = start_time + 2628000000;
              this.handleGraphChange(start_time, end_time, interval);
            }
          } else if (this.state.selectedFilter === 'year') {
            if (this.state.back === 1) {
              start_time = moment()
                .startOf('year')
                .valueOf();
              end_time = start_time + 31536000000;
              this.handleGraphChange(start_time, end_time, interval);
            }
            if (this.state.back === 2) {
              start_time = moment()
                .subtract(1, 'year')
                .startOf('year')
                .valueOf();
              end_time = start_time + 31536000000;
              this.handleGraphChange(start_time, end_time, interval);
            }
            if (this.state.back === 3) {
              start_time = moment()
                .subtract(2, 'year')
                .startOf('year')
                .valueOf();
              end_time = start_time + 31536000000;
              this.handleGraphChange(start_time, end_time, interval);
            }
            if (this.state.back === 4) {
              start_time = moment()
                .subtract(3, 'year')
                .startOf('year')
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
    }, 200);
  };

  //Render list of devices using component DeviceList for eac individual component
  getConnectionList = () => {
    return <DeviceList handleMethod={this.handleClick} key={uuid.v4()} />;
  };

  render() {
    //inintialize graph
    let CanvasJSChart = CanvasJSReact.CanvasJSChart;

    //options for selection of keys
    const listOfKeys = this.state.keys.map(key => {
      let keyValue = key;
      let keyArray = keyValue.split('_');
      keyArray = keyArray.join(' ');
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
        <div className='mydevice-hero'>
          <h1 style={{ marginBottom: '20px' }} className='mysite-heading'>
            <i className='fas fa-mobile-alt icon-heading' /> My Devices
          </h1>

          <div className='mydevice-list'>
            <div
              style={{
                display: 'flex',
                paddingLeft: '10px',
                paddingTop: '10px',
                cursor: 'pointer',
                fontSize: '120%',
                color: '#111111',
                borderBottom: '2px solid #d3d3d3'
              }}
              className={'device-list ' + this.state.selected}
            >
              <div className='my-col'>
                <p>Device Id</p>
              </div>
              <div className='my-col'>
                <p> </p>
              </div>
              <div className='my-col'>
                <p>Rated Capacity (kW)</p>
              </div>
              <div className='my-col'>
                <p>Device Type</p>
              </div>
            </div>
          </div>
          {this.getConnectionList()}
          <div className='my-device-graph'>
            {this.state.deviceActivated && (
              <div className='filter'>
                <h4 style={{ width: '100%', textAlign: 'center' }}>
                  {this.state.deviceName}
                </h4>
                <div className='button-div'>
                  <button
                    className={'filter-button' + this.state.power_active}
                    onClick={this.filter_power}
                  >
                    Power
                  </button>
                  <button
                    className={'filter-button' + this.state.energy_acive}
                    onClick={this.filter_energy}
                  >
                    Energy
                  </button>
                  <button
                    className={'filter-button' + this.state.others_active}
                    onClick={this.filter_others}
                  >
                    Others
                  </button>
                </div>
                {this.state.show_keys && (
                  <select
                    value={this.state.selectValue}
                    onChange={this.handleChange}
                    className='key-select'
                  >
                    <option defaultValue>Select</option>
                    {listOfKeys}
                  </select>
                )}
                {this.state.show_graph && (
                  <>
                    <button
                      className={'filter-button' + this.state.day}
                      onClick={this.filterDay}
                    >
                      Day
                    </button>
                    <button
                      className={'filter-button' + this.state.week}
                      onClick={this.filterWeek}
                    >
                      Week
                    </button>
                    <button
                      className={'filter-button' + this.state.month}
                      onClick={this.filterMonth}
                    >
                      Month
                    </button>
                    <button
                      className={'filter-button' + this.state.year}
                      onClick={this.filterYear}
                    >
                      Year
                    </button>
                    <br />
                    <div className='row' style={{ marginTop: '10px' }}>
                      <div className='col-sm-12 col flex'>
                        <div style={{ width: '50%' }}>
                          <button
                            onClick={this.handleLeft}
                            style={{
                              position: 'absolute',
                              left: '0',
                              fontSize: '130%',
                              backgroundColor: 'white'
                            }}
                          >
                            <i
                              style={{ color: 'black' }}
                              className='fas fa-arrow-left'
                            />
                            <span style={{}}>
                              {' '}
                              Previous {this.state.selectedFilter}
                            </span>
                          </button>
                        </div>
                        <div style={{ width: '50%', position: 'relative' }}>
                          <button
                            onClick={this.handleRight}
                            style={{
                              position: 'absolute',
                              right: '0',
                              fontSize: '130%',
                              backgroundColor: 'white'
                            }}
                          >
                            <span style={{}}>
                              Next {this.state.selectedFilter}{' '}
                            </span>
                            <i
                              style={{ color: 'black' }}
                              className='fas fa-arrow-right'
                            />
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
                        <div style={{ height: '400px' }}>
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
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

//mapping redux
const mapSateToProps = state => ({
  devices: state.userdata.data,
  connectionName: state.connectionInfo.data
});

export default connect(
  mapSateToProps,
  { fetchUserData }
)(MyDevice);
