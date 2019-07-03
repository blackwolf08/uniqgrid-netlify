import React, { Component } from 'react';
import Connection from './ConnectionList/Connection';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import icon1 from '../../../images/icon1.svg';
import icon2 from '../../../images/icon2.svg';
import jwtDecode from 'jwt-decode';
import { Link } from 'react-router-dom';
import { fetchUserData } from '../../../actions/userData';
import { connect } from 'react-redux';

class MySite extends Component {
  state = {
    maxConnections: 0,
    kWASite: {},
    solarPower: {},
    properties: {},
    ready: false,
    nameOfSites: []
  };

  componentWillMount() {
    // this full piece of code executes to get the keys from te object we get from the API and processes the raw data into a more feature rich text
    if (typeof localStorage.jwtToken !== 'undefined') {
      this.props.fetchUserData();
      let jwt = localStorage.jwtToken;
      jwt = jwtDecode(jwt);
      const URL = `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/email/${
        jwt.sub
      }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`;

      axios
        .get(URL)
        .then(res => {
          const properties = res.data.properties;
          this.setState({
            properties
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
          let nameOfSites = [];
          arrayOfStrings.sort();
          //get the names of the sites
          arrayOfStrings.forEach(site => {
            if (site.search('electricity_connection_name') >= 0) {
              nameOfSites.push(res.data.properties[site].value);
            }
          });
          this.setState({
            nameOfSites: nameOfSites
          });
          //Following will tell the max no of sites
          //If there is only one site
          if (noOfSites.length === 0) {
            noOfSites.push(1);
          }

          arrayOfStrings.sort();
          this.setState({
            properties
          });

          let kWASite = {
            site1: '--',
            site2: '--',
            site3: '--',
            site4: '--',
            site5: '--',
            site6: '--',
            site7: '--',
            site8: '--',
            site9: '--'
          };
          //Solar power displayed on MySite Page
          let solarPower = {
            site1: '--',
            site2: '--',
            site3: '--',
            site4: '--',
            site5: '--',
            site6: '--',
            site7: '--',
            site8: '--',
            site9: '--'
          };
          // gives us the power that are used to render power in my site area
          Object.keys(properties).forEach(site => {
            if (site.search('connected_load_kw_site_2_') >= 0) {
              kWASite['site2'] = properties[site].value;
            }
            if (site.search('connected_load_kw_site_3_') >= 0) {
              kWASite['site3'] = properties[site].value;
            }
            if (site.search('connected_load_kw_site_4_') >= 0) {
              kWASite['site4'] = properties[site].value;
            }
            if (site.search('connected_load_kw_site_5_') >= 0) {
              kWASite['site5'] = properties[site].value;
            }
            if (site.search('connected_load_kw_site_6_') >= 0) {
              kWASite['site6'] = properties[site].value;
            }
            if (site.search('connected_load_kw_site_7_') >= 0) {
              kWASite['site7'] = properties[site].value;
            }
            if (site.search('connected_load_kw_site_8_') >= 0) {
              kWASite['site8'] = properties[site].value;
            }
            if (site.search('connected_load_kw_site_9_') >= 0) {
              kWASite['site9'] = properties[site].value;
            }
            if (site === 'connected_load_kw_') {
              kWASite['site1'] = properties[site].value;
            }
            if (site.search('solar_capacity_kwp_site_2_') >= 0) {
              solarPower['site2'] = properties[site].value;
            }
            if (site.search('solar_capacity_kwp_site_3_') >= 0) {
              solarPower['site3'] = properties[site].value;
            }
            if (site.search('solar_capacity_kwp_site_4_') >= 0) {
              solarPower['site4'] = properties[site].value;
            }
            if (site.search('solar_capacity_kwp_site_5_') >= 0) {
              solarPower['site5'] = properties[site].value;
            }
            if (site.search('solar_capacity_kwp_site_6_') >= 0) {
              solarPower['site6'] = properties[site].value;
            }
            if (site.search('solar_capacity_kwp_site_7_') >= 0) {
              solarPower['site7'] = properties[site].value;
            }
            if (site.search('solar_capacity_kwp_site_8_') >= 0) {
              solarPower['site8'] = properties[site].value;
            }
            if (site.search('solar_capacity_kwp_site_9_') >= 0) {
              solarPower['site9'] = properties[site].value;
            }
            if (site.search('total_capacity_kwp') >= 0) {
              solarPower['site1'] = properties[site].value;
            }
          });

          this.setState({
            kWASite,
            solarPower
          });
          //get the max number of sites of the current user
          noOfSites.sort();
          this.setState({
            maxConnections: noOfSites[noOfSites.length - 1]
          });
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
  }

  render() {
    let list = [];
    for (let i = 1; i <= this.state.maxConnections; i++) {
      list.push(
        <Connection
          key={i}
          properties={this.state.properties}
          id={i}
          name={`${this.state.nameOfSites[i - 1] || '--'}`}
          power={`${this.state.kWASite[`site${i}`]} kW`}
          powerPer={`55%`}
          consumption={`${this.state.solarPower[`site${i}`]} kW`}
          consumptionPer={`100%`}
        />
      );
    }

    // Views for MySite
    return (
      <div className='mysites-root'>
        <Helmet>
          <title>My Site</title>
        </Helmet>
        <h1 className='mysites-heading '>
          <i className='fas fa-house-damage icon-heading' /> My Sites
        </h1>
        {this.state.ready && (
          <div className='mysites-connection-list'>
            <div
              className='mysites-connections mobile_connection_header'
              onClick={this.handleClick}
            >
              <div className='my-col'>
                <p>{}</p>
              </div>
              <div className='my-col'>
                <img className='mysite-icons1' src={icon1} alt='power' />
              </div>
              <div className='my-col'>
                <img className='mysite-icons2' src={icon2} alt='charge' />
              </div>
              <div
                className='my-col mysites-icons'
                style={{ display: 'flex', justifyContent: 'space-around' }}
              >
                <p>Insights / Settings</p>
              </div>
            </div>
            {list}
          </div>
        )}
        <Link to='/dashboard/new-connection' style={styles.buttonAdd}>
          <i
            style={{ color: 'white', margin: '0', padding: '0' }}
            className='fas fa-plus'
          />
        </Link>
      </div>
    );
  }
}

const styles = {
  buttonAdd: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '20px',
    borderRadius: '50%',
    backgroundColor: 'rgb(38, 50, 56)',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default connect(
  null,
  { fetchUserData }
)(MySite);
