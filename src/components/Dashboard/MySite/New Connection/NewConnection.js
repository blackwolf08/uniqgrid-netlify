import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { fetchConnetionInfo } from '../../../../actions/fetchConnectionInfo';
import { connect } from 'react-redux';
import Spinner from '../../../../images/index';
import csc from 'country-state-city';
import uuid from 'uuid';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import NewConnectionMap from '../MySite Maps/NewConnectionMap';

class NewConnection extends Component {
  state = {
    id: 0,
    tab1: ' connection-info-border',
    tab2: '',
    name: '',
    update: false,
    defaultName: 'New Connection Name',
    active: 1,
    enableSpinner: false,
    isLoading: true,
    stateId: 0,
    cityReady: false,
    city: '',
    postal: '',
    state: '',
    street: '',
    electricity_connection_name: '',
    segment: '',
    sub_segment: '',
    vid: '',
    lat: '',
    lon: ''
  };

  //this method determines the border-bottom of the tabs
  handleTabChange = tab => {
    if (tab === 'connection-details') {
      this.setState({
        tab1: '',
        tab2: ' connection-info-border',
        tab3: '',
        tab4: '',
        tab5: '',
        active: 2
      });
    } else if (tab === 'address-details') {
      this.setState({
        tab1: ' connection-info-border',
        tab2: '',
        tab3: '',
        tab4: '',
        tab5: '',
        active: 1
      });
    }
  };

  componentDidMount() {
    if (typeof localStorage.jwtToken !== 'undefined') {
      let jwt = localStorage.jwtToken;
      jwt = jwtDecode(jwt);
      //get ViD id customer
      const URL = `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/email/${
        jwt.sub
      }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`;

      axios
        .get(URL)
        .then(res => {
          const properties = res.data.properties;
          //set vid
          this.setState({
            vid: res.data.vid
          });
          let arrayOfStrings = [];
          let noOfSites = [];
          //get the keys of data returned eg, connection_name_site_1_, energy_site_1 etc
          Object.keys(properties).forEach(key => {
            arrayOfStrings.push(key);
          });
          //check for the keys which stores the name of sites
          arrayOfStrings.forEach(site => {
            // according to the struct of API this piece of code gives site number as connection_site_'2'_, outputs 2
            let nanCheck = isNaN(parseInt(site.charAt(site.length - 2), 10));
            if (
              site.search('electricity_connection_name') >= 0 &&
              !nanCheck &&
              properties[site].value !== ''
            ) {
              noOfSites.push(parseInt(site.charAt(site.length - 2), 10));
            }
          });
          arrayOfStrings.sort();

          if (noOfSites.length === 0) {
            this.setState({
              maxConnections: 0
            });
          }
          if (properties['electricity_connection_name'].value !== '') {
            this.setState({
              maxConnections: 1
            });
          }
          if (noOfSites.length !== 0) {
            noOfSites.sort();
            this.setState({
              maxConnections: noOfSites[noOfSites.length - 1]
            });
          }

          //get the max number of sites of the current user

          this.setState({
            isLoading: false
          });
          const listOfStates = csc.getStatesOfCountry('101');
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
        })
        .catch(res => {
          if (res.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
          }
        });
      this.setState({
        ready: true
      });
    }
    //check if geoLocation is avaliable in device
    if (navigator.geolocation) {
      //get the LAT, LONG of current position
      let lat, lon;
      let pos = res => {
        lat = res.coords.latitude;
        lon = res.coords.longitude;
        this.setState({
          lat,
          lon
        });
      };
      //pos is function defined above
      navigator.geolocation.getCurrentPosition(pos);
    }
  }

  //handle dropdown changes
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

  //handle country change and set states accordingly
  handleSelectChangeCity = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  //change on input feilds
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleUpdateButtonClick = value => {
    if (value === 1) {
      this.handleTabChange('connection-details');
    }
    if (value === 2) {
      let objToSend;

      //if the user has no sites, then run this code
      if (this.state.maxConnections === 0) {
        this.setState({
          enableSpinner: true
        });
        //objToSend is the object to send
        objToSend = [
          {
            property: `electricity_connection_name`,
            value: `${this.state.electricity_connection_name}`
          },
          {
            property: `segment_site`,
            value: `${this.state.segment}`
          },
          {
            property: `sub_segment`,
            value: `${this.state.sub_segment}`
          },
          {
            property: `address`,
            value: `${this.state.street}`
          },
          {
            property: `city`,
            value: `${this.state.city}`
          },
          {
            property: `state`,
            value: `${this.state.state}`
          },
          {
            property: `zip`,
            value: `${this.state.postal}`
          },
          {
            property: 'gps_coordinate',
            value: `${this.state.lat}/${this.state.lon}`
          }
        ];

        fetch(
          `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/vid/${
            this.state.vid
          }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`,
          {
            method: 'POST',
            body: `{  "properties": ${JSON.stringify(objToSend)}
          }`
          }
        )
          .then(res => {
            window.location.href = '/dashboard/my-sites';
          })
          .catch(res => {
            if (res.status === 401) {
              localStorage.clear();
              window.location.href = '/login';
            }
          });
      }

      //if user has atleast one site, run this, get max connections and set new connection id to be max conn + 1
      else {
        let newId = parseInt(this.state.maxConnections) + 1;
        this.setState({
          enableSpinner: true
        });

        //define key values dynamically
        objToSend = [
          {
            property: `electricity_connection_name_site_${newId}_`,
            value: `${this.state.electricity_connection_name}`
          },
          {
            property: `segment_site_${newId}_`,
            value: `${this.state.segment}`
          },
          {
            property: `sub_segment_site_${newId}_`,
            value: `${this.state.sub_segment}`
          },
          {
            property: `street_site${newId}_`,
            value: `${this.state.street}`
          },
          {
            property: `city_site${newId}_`,
            value: `${this.state.city}`
          },
          {
            property: `state_site_${newId}_`,
            value: `${this.state.state}`
          },
          {
            property: `postal_code_site_${newId}_`,
            value: `${this.state.postal}`
          },
          {
            property: `gps_coordinate_site${newId}_`,
            value: `${this.state.lat}/${this.state.lon}`
          }
        ];

        //send the object to server
        fetch(
          `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/vid/${
            this.state.vid
          }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`,
          {
            method: 'POST',
            body: `{  "properties": ${JSON.stringify(objToSend)}
          }`
          }
        )
          .then(res => {
            window.location.href = '/dashboard/my-sites';
          })
          .catch(res => {
            if (res.status === 401) {
              localStorage.clear();
              window.location.href = '/login';
            }
          });
      }
    }
  };

  render() {
    //if loding then sipnners
    if (this.state.enableSpinner) {
      return <Spinner />;
    }
    if (this.state.isLoading) {
      return <Spinner />;
    }

    //lists of states and sites returned as an option for select respectively
    const listOfStatesToRender = [];
    const listOfCitiesToRender = [];
    const listOfStates = csc.getStatesOfCountry('101');
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
      <div className='view'>
        <Helmet>
          <title>{`New Connection`}</title>
        </Helmet>
        {this.state.lon && this.state.lat && (
          <NewConnectionMap
            className='flex'
            style={{ width: '80%', height: '300px', margin: '0 auto' }}
            lat={this.state.lat}
            lon={this.state.lon}
          />
        )}
        <div className='connection-info-hero'>
          <div
            className='connection-info-tabs new_connection_tabs'
            style={{ cursor: 'pointer' }}
          >
            <div
              onClick={() => {
                this.handleTabChange('address-details');
              }}
              className={'mycol-5' + this.state.tab1}
            >
              <p className='connection-info-p'>Address Details</p>
            </div>
            <div
              onClick={() => {
                this.handleTabChange('connection-details');
              }}
              className={'mycol-5' + this.state.tab2}
            >
              <p className='connection-info-p'>Connection Details</p>
            </div>
          </div>
          {this.state.active === 1 && (
            <>
              <div className='address-details'>
                {!this.state.isLoading && (
                  <>
                    <div className='address-details-div '>
                      <p>State</p>
                      <select
                        className='address-details-select '
                        name='state'
                        onChange={this.handleSelectChange}
                        ref={this.selectRef}
                        placeholder={this.state.state}
                        value={this.state.state}
                      >
                        {listOfStatesToRender}
                      </select>
                    </div>
                    <div className='address-details-div '>
                      <p>City</p>
                      <select
                        className='address-details-select '
                        name='city'
                        onChange={this.handleSelectChangeCity}
                        placeholder={this.state.city}
                        value={this.state.city}
                      >
                        {listOfCitiesToRender}
                      </select>
                    </div>
                    <div className='address-details-div'>
                      <p>Street Address</p>
                      <input
                        className='address-details-input '
                        type='text'
                        value={this.state.street}
                        placeholder={this.state.street}
                        onChange={e => {
                          this.handleChange(e);
                        }}
                        name='street'
                      />{' '}
                    </div>

                    <div className='address-details-div '>
                      <p>Pincode</p>
                      <input
                        className='address-details-input '
                        type='text'
                        value={this.state.postal}
                        placeholder={this.state.postal}
                        onChange={e => {
                          this.handleChange(e);
                        }}
                        name='postal'
                      />{' '}
                    </div>
                  </>
                )}
              </div>
              <button
                className='update-button'
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
              <div className='address-details'>
                {!this.state.isLoading && (
                  <>
                    <div className='address-details-div'>
                      <p>Connection Name</p>
                      <input
                        className='address-details-input '
                        type='text'
                        value={this.state.electricity_connection_name}
                        placeholder={this.state.electricity_connection_name}
                        onChange={this.handleChange}
                        name='electricity_connection_name'
                      />{' '}
                    </div>
                    <div className='address-details-div '>
                      <p>Segment</p>
                      <select
                        className='address-details-select '
                        name='segment'
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
                    <div className='address-details-div '>
                      <p>Sub Segment</p>
                      <select
                        className='address-details-select '
                        name='sub_segment'
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
                className='update-button'
                onClick={() => {
                  this.handleUpdateButtonClick(2);
                }}
              >
                Add
              </button>
            </>
          )}
          {this.state.update && <button className='edit-button'>Update</button>}
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
