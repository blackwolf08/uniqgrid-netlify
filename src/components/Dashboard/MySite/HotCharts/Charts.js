import React, { Component } from 'react';
import axios from 'axios';
import Spinner from '../../../../images';
import CanvasJSReact from '../../../../lib/canvasjs.react';
import moment from 'moment';
import uuid from 'uuid';
import DeviceList from '../../MyDevices/DeviceList';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export default class Charts extends Component {
  state = {
    deviceId: '',
    key_selected: '',
    device_name: '',
    key: 'import_energy',
    newKeys: [],
    devicesArr: [],
    deviceActivated: false,
    isLoading: false,
    keys: [],
    checked: true,
    selectValue: '',
    graphData: '',
    show_keys: false,
    show_filters: false,
    power_active: '',
    energy_acive: '',
    others_active: '',
    //Default start time
    startTime: moment()
      .startOf('day')
      .valueOf(),
    endtime: '',
    default: true,
    day: ' active-filter',
    //used to add selected highlight to day/week/month/year component
    week: '',
    month: '',
    year: '',
    //id of device
    id: '',
    selectedFilter: 'day',
    //back values handles LEFT and RIGHT changes to graph
    back: 1,
    device_list: {}
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
    const URL = `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/vid/4301/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`;

    axios.get(URL).then(res => {
      let properties = res.data.properties;
      if (parseInt(id) === 1) {
        Object.keys(properties).forEach(property => {
          if (property === 'device_id') {
            let device_list = {
              device_list: []
            };
            if (properties[property].value !== '') {
              device_list = JSON.parse(properties[property].value);
            }
            this.setState({
              device_list
            });
          }
        });
      } else {
        Object.keys(properties).forEach(property => {
          if (property.search(`device_list_site_${this.state.id}_`) >= 0) {
            let device_list = {
              device_list: []
            };
            if (properties[property].value !== '') {
              device_list = JSON.parse(properties[property].value);
            }
            this.setState({
              device_list
            });
          }
        });
      }
    });
  }

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

  handleClick = (deviceId, name) => {
    //function executed when user clicks on one of the devices
    this.setState({
      deviceId,
      isLoading: true,
      deviceActivated: true,
      deviceName: name,
      selectValue: '',
      graphData: ''
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
          if (res.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
          }
        });
    });
  };
  handleChange1 = e => {
    //handle keys dropdown change
    let deviceId = e.target.value[0];
    this.setState({
      isLoading: true,
      default: false,
      back: 1,
      deviceActivated: true,
      show_keys: false
    });
    //setting select value to store selected key
    this.setState({
      device_name: e.target.value[1],
      deviceId: e.target.value[0]
    });
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/plugins/telemetry/DEVICE/${deviceId}/keys/timeseries`
      )
      .then(res => {
        this.setState({
          keys: res.data,
          newKeys: res.data,
          show_filters: true
        });
      });
  };

  handleKeyChange1 = e => {
    this.setState({
      key_selected: e.target.value,
      isLoading: true
    });
    this.handleChange2(this.state.deviceId, e.target.value);
  };

  handleChange2 = (deviceId, key) => {
    //handle keys dropdown change
    this.setState({
      isLoading: true,
      default: false,
      back: 1
    });
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
        `https://cors-anywhere.herokuapp.com/http://portal.uniqgridcloud.com:8080/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?limit=10000&interval=900000&agg=MAX&keys=${key}&startTs=${startTime}&endTs=${endtime}`
      )
      .then(res => {
        //extract data from response
        console.log(res, 'data');
        let a = res.data;
        let s = a[Object.keys(a)[0]];
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
        if (res.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
        }
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
        text: `${heading} Analysis`
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
      //change formatting for day filter on X axis and also scale the data on the y-axis
      let s = this.state.graphData.map(e => {
        return {
          label: moment(e.ts).format('hh a'),
          y: e.value * 1
        };
      });
      return s;
    }
    if (this.state.selectedFilter === 'year') {
      //formatting for year
      let s = this.state.graphData.map(e => {
        return {
          label: moment(e.ts).format('MMM'),
          y: e.value * 1
        };
      });
      return s;
    }
    //for all others
    let s = this.state.graphData.map(e => {
      return {
        label: moment(e.ts).format('MMM Do YY'),
        y: e.value * 1
      };
    });
    return s;
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
        }/values/timeseries?limit=10000&interval=10800000&agg=MAX&keys=${
          this.state.key
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
        if (res.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
        }
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
        }/values/timeseries?limit=10000&interval=900000&agg=MAX&keys=${
          this.state.key
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
          window.location.href = '/login';
        }
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
          this.state.key
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
          window.location.href = '/login';
        }
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
        }/values/timeseries?limit=10000&interval=86400000&agg=MAX&keys=${
          this.state.key
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
          window.location.href = '/login';
        }
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
          this.state.key
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
        if (res.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
        }
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
          // 15 mins
          interval = 900000;
        }
        if (this.state.selectedFilter === 'week') {
          // 1 hour
          interval = 10800000;
        }
        if (this.state.selectedFilter === 'month') {
          // 1 day
          interval = 86400000;
        }
        if (this.state.selectedFilter === 'year') {
          // 1 day
          interval = 86400000;
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
            interval = 900000;
          }
          if (this.state.selectedFilter === 'week') {
            interval = 10800000;
          }
          if (this.state.selectedFilter === 'month') {
            interval = 86400000;
          }
          if (this.state.selectedFilter === 'year') {
            interval = 86400000;
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

  handleKeyChange = e => {
    console.log(e.target.checked);
    if (e.target.checked) {
      this.setState({
        key: 'import_energy'
      });
    } else {
      this.setState({
        key: 'active_power'
      });
    }
    this.setState({
      checked: !this.state.checked
    });
  };

  getConnectionList = () => {
    return <DeviceList handleMethod={this.handleClick} key={uuid.v4()} />;
  };

  toTitleCase = str => {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  render() {
    //inintialize graph
    let CanvasJSChart = CanvasJSReact.CanvasJSChart;
    let listOfDevices;
    if (this.state.device_list) {
      if (this.state.device_list.device_list) {
        listOfDevices = this.state.device_list.device_list.map(device => {
          return (
            <MenuItem
              key={uuid.v4()}
              value={[device.device.id, device.device.name]}
            >
              {device.device.name}
            </MenuItem>
          );
        });
      }
    }
    let listOfKeys;
    if ((this.state.keys && this.state.keys !== '') || this.state.keys !== []) {
      listOfKeys = this.state.keys.map(key => {
        return (
          <MenuItem key={uuid.v4()} value={key}>
            {this.toTitleCase(key.split('_').join(' '))}
          </MenuItem>
        );
      });
    }

    return (
      <div className='hot_charts'>
        <h3 style={{ marginTop: '100px' }}>Select Device</h3>
        <FormControl className='hot_chart_select'>
          <InputLabel htmlFor='devices'>Devices</InputLabel>
          <Select
            style={{ height: '50px', width: '250px' }}
            onChange={this.handleChange1}
            inputProps={{
              name: 'devices',
              id: 'devices'
            }}
            placeholder={this.state.device_name}
            value={this.state.deviceId}
          >
            {listOfDevices}
          </Select>
        </FormControl>
        {this.state.show_filters && (
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
        )}
        {this.state.show_keys && (
          <FormControl className='hot_chart_select'>
            <InputLabel htmlFor='devices'>Keys</InputLabel>
            <Select
              style={{ height: '50px', width: '250px' }}
              onChange={this.handleKeyChange1}
              inputProps={{
                name: 'keys',
                id: 'keys'
              }}
              value={this.state.key_selected}
              placeholder={this.state.key_selected}
            >
              {listOfKeys}
            </Select>
          </FormControl>
        )}
        <div className='my-device-graph'>
          {this.state.deviceActivated && (
            <>
              <div className='filter'>
                <h4 style={{ width: '100%', textAlign: 'center' }}>
                  {this.state.device_name}
                </h4>
                <div className=''>
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
                </div>
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
                    this.state.graphData.length > 1 && (
                      <CanvasJSChart
                        options={this.setOptions()}
                        /* onRef = {ref => this.chart = ref} */
                      />
                    )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}
