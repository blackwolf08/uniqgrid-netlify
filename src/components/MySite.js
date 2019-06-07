import React, { Component } from "react";
import Connection from "./Connection";
import { Helmet } from "react-helmet";
import axios from "axios";
import icon1 from "../images/icon1.png";
import icon2 from "../images/icon2.png";
import jwtDecode from "jwt-decode";

export default class MySite extends Component {
  state = {
    maxConnections: 0,
    kWASite: {},
    properties: {},
    ready: false,
    nameOfSites: []
  };

  componentWillMount() {
    // this full piece of code executes to get the keys from te object we get from the API and processes the raw data into a more feature rich text
    if (typeof localStorage.jwtToken !== "undefined") {
      let jwt = localStorage.jwtToken;
      jwt = jwtDecode(jwt);
      const URL = `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/email/${
        jwt.sub
      }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`;

      axios.get(URL).then(res => {
        const properties = res.data.properties;
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
          if (site.search("site") >= 0 && !nanCheck) {
            noOfSites.push(parseInt(site.charAt(site.length - 2), 10));
          }
        });
        let nameOfSites = [];
        arrayOfStrings.sort();
        //get the names of the sites
        arrayOfStrings.forEach(site => {
          if (site.search("electricity_connection_name") >= 0) {
            nameOfSites.push(res.data.properties[site].value);
          }
        });
        this.setState({
          nameOfSites: nameOfSites
        });

        if (noOfSites.length === 0) {
          noOfSites.push(1);
        }

        arrayOfStrings.sort();
        this.setState({
          properties
        });

        let kWASite = [];
        // gives us the power that are used to render power in my site area
        arrayOfStrings.forEach(site => {
          if (site.search("connected_load_kw_site") >= 0) {
            kWASite.push(site);
          } else if (site.search("connected_load_kw") >= 0) {
            kWASite.push(site);
          }
        });
        this.setState({
          kWASite
        });
        //get the max number of sites of the current user
        noOfSites.sort();
        this.setState({
          maxConnections: noOfSites[noOfSites.length - 1]
        });
      });
      this.setState({
        ready: true
      });
    }
  }

  render() {
    let list = [];
    for (let i = 1; i <= this.state.maxConnections; i++) {
      let j = i - 1;
      //this if conditon stat
      if (j === this.state.maxConnections - 1) {
        j = this.state.maxConnections - 1;
      }

      if (typeof this.state.properties[this.state.kWASite[j]] === "undefined") {
        list.push(
          <Connection
            key={i}
            id={i}
            name={`${this.state.nameOfSites[i] || "--"}`}
            power={`
              - kW`}
            powerPer={`55%`}
            consumption={`
              - kW`}
            consumptionPer={`100%`}
          />
        );
      } else {
        list.push(
          <Connection
            key={i}
            id={i}
            name={`${this.state.nameOfSites[j]} || "--"`}
            power={`${this.state.properties[this.state.kWASite[j]].value ||
              "--"} kW`}
            powerPer={`55%`}
            consumption={`${this.state.properties[this.state.kWASite[j]]
              .value || "--"} kW`}
            consumptionPer={`100%`}
          />
        );
      }
    }

    return (
      <div className="mysites-root">
        <Helmet>
          <title>My Site</title>
        </Helmet>
        <h1 className="mysites-heading">My Sites</h1>
        {this.state.ready && (
          <div className="mysites-connection-list">
            <div className="mysites-connections" onClick={this.handleClick}>
              <div className="my-col">
                <p>{}</p>
              </div>
              <div className="my-col">
                <img className="mysite-icons1" src={icon1} alt="power" />
              </div>
              <div className="my-col">
                <img className="mysite-icons2" src={icon2} alt="charge" />
              </div>
              <div
                className="my-col mysites-icons"
                style={{ display: "flex", justifyContent: "space-around" }}
              >
                <p />
              </div>
            </div>
            {list}
          </div>
        )}
      </div>
    );
  }
}