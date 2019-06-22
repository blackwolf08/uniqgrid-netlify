import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchConnetionInfo } from '../../../../../actions/fetchConnectionInfo';
import Spinner from '../../../../../images';
import csc from 'country-state-city';
import uuid from 'uuid';

class AddressDetails extends Component {
  state = {
    data: {},
    city: '-',
    postal: '-',
    state: '-',
    street: '-',
    isLoading: true,
    name: '',
    stateId: 0,
    cityReady: false
  };

  componentDidMount() {
    this.setState({
      isLoading: true //here
    });
    this.setState({
      data: this.props.info
    });
    let name = '';

    //get name of connection from keys
    Object.keys(this.state.data).forEach(key => {
      if (key.indexOf('connection') === 12) {
        name = this.state.data[key].value.toString();
      }
    });
    this.setState({
      name
    });
    //get city street state from the keys
    Object.keys(this.props.data).forEach(key => {
      if (key.indexOf('city') === 0) {
        // if (this.props.data[key].value.toString() === this.state.city) {
        this.setState({
          city: this.props.data[key].value.toString()
        });
        // }
      }
      if (key.indexOf('address') === 0) {
        this.setState({
          street: this.props.data[key].value.toString()
        });
      }
      if (key.indexOf('state') === 0) {
        this.setState({
          state: this.props.data[key].value.toString()
        });
      }
      if (key.indexOf('zip') === 0) {
        this.setState({
          postal: this.props.data[key].value.toString()
        });
      }
    });
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
  }

  //handle select change and handleChange() are same for all components

  handleChange = e => {
    if (!e.target.value.match(/[!@#$+_=%^&*()\\,.?"`~':{}|<>]/g)) {
      this.setState({
        [e.target.name]: e.target.value
      });
      this.props.handleChildrenChange({
        [e.target.id]: e.target.value
      });
    }
  };

  handleSelectChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    this.props.handleChildrenChange({
      [e.target.id]: e.target.value
    });
    const stateId = e.target.options[e.target.selectedIndex].id;
    this.setState({
      stateId
    });
    this.setState({
      cityReady: true
    });
  };

  //same as handle city change in NewConnections.js
  handleSelectChangeCity = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    this.props.handleChildrenChange({
      [e.target.name]: e.target.value
    });
  };

  render() {
    if (this.state.isLoading) {
      return <Spinner />;
    }
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

    let id = this.props.id;
    return (
      <div className='address-details'>
        {!this.state.isLoading && (
          <>
            <div className='address-details-div'>
              <p>Street Address</p>
              <input
                className='address-details-input '
                type='text'
                id={this.props.id > 1 ? `street_site${id}_` : 'address'}
                value={this.state.street}
                placeholder={this.state.street}
                onChange={e => {
                  this.handleChange(e);
                }}
                name='street'
              />{' '}
            </div>
            <div className='address-details-div '>
              <p>State</p>
              <select
                className='address-details-select '
                name='state'
                onChange={this.handleSelectChange}
                ref={this.selectRef}
                id={this.props.id > 1 ? `state_site_${id}_` : 'state'}
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
                id={this.props.id > 1 ? `city_site${id}_` : 'city'}
                onChange={this.handleSelectChangeCity}
                placeholder={this.state.city}
                value={this.state.city}
              >
                {listOfCitiesToRender}
              </select>
            </div>
            <div className='address-details-div '>
              <p>Pincode</p>
              <input
                id={this.props.id > 1 ? `postal_code_site_${id}_` : 'zip'}
                className='address-details-input '
                type='number'
                value={this.state.postal}
                placeholder={this.state.postal}
                onChange={e => {
                  this.handleChange(e);
                }}
                name='postal'
              />
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

export default connect(
  mapStateToProps,
  { fetchConnetionInfo }
)(AddressDetails);
