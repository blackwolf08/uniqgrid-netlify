import React, { Component } from "react";
import { Helmet } from "react-helmet";
import Table from "react-bootstrap/Table";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import jwtDecode from "jwt-decode";
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import uuid from "uuid";
import { Redirect } from "react-router-dom";

class MyRequests extends Component {
  state = {
    newTicket: false,
    ready: false,
    nameOfSites: [],
    site: "",
    device: "",
    content: "",
    redirect: false
  };

  componentDidMount() {
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
        Object.keys(properties).forEach(key => {
          arrayOfStrings.push(key);
        });

        arrayOfStrings.forEach(site => {
          let nanCheck = isNaN(parseInt(site.charAt(site.length - 2), 10));
          if (site.search("site") >= 0 && !nanCheck) {
            noOfSites.push(parseInt(site.charAt(site.length - 2), 10));
          }
        });
        let nameOfSites = [];
        arrayOfStrings.sort();
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
      });
      this.setState({
        ready: true
      });
    }
  }

  handleContentChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSelectChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    console.log(this.state.site);
  };

  handleClick = () => {
    this.setState({
      newTicket: true
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    let obj = [
      { name: "email", value: "demo@uniqgrid.com" },
      { name: "createdate", value: Date.now() },
      { name: "site", value: this.state.site },
      { name: "device", value: this.state.device },
      { name: "content", value: this.state.content }
    ];
    console.log(JSON.stringify(obj));
    fetch(
      `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/crm-objects/v1/objects/tickets?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`,
      {
        method: "POST",
        body: JSON.stringify(obj)
      }
    )
      .then(res => {
        console.log("submitted success", res);
        this.setState({ redirect: true });
      })
      .catch(function(res) {
        console.log(res);
      });
  };

  render() {
    const { redirect } = this.state;
    let listOfSites = [];
    let listOfDevices = [];
    if (redirect) {
      return <Redirect to="/dashboard/my-requests" />;
    }

    if (this.state.ready) {
      this.state.nameOfSites.map(site => {
        listOfSites.push(
          <MenuItem key={uuid.v4()} value={site}>
            {site}
          </MenuItem>
        );
      });
      this.props.devices.map(device => {
        listOfDevices.push(
          <MenuItem key={uuid.v4()} value={device.name}>
            {device.name}
          </MenuItem>
        );
      });
    }
    return (
      <div>
        <Helmet>
          <title>My Requests</title>
        </Helmet>
        {this.state.ready && (
          <>
            <h1 className="mysites-heading">My Requests</h1>
            <div className="myrequest-hero">
              {!this.state.newTicket && (
                <>
                  <Table className="table">
                    <thead>
                      <tr>
                        <th>Ticket Number</th>
                        <th>Connection Name</th>
                        <th>Created On</th>
                        <th>Device</th>
                        <th>Description</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                      </tr>
                      <tr>
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                      </tr>
                      <tr>
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                      </tr>
                      <tr>
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                        <td />
                      </tr>
                    </tbody>
                  </Table>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={this.handleClick}
                    style={styles.button}
                  >
                    Raise New Ticket
                  </Button>
                </>
              )}
              {this.state.newTicket && (
                <>
                  <form onSubmit={this.handleSubmit}>
                    <FormControl>
                      <InputLabel htmlFor="site">Site</InputLabel>
                      <Select
                        value={this.state.site}
                        name="site"
                        style={{ width: "300px" }}
                        onChange={this.handleSelectChange}
                        placeholder={this.state.site}
                        inputProps={{
                          name: "site",
                          id: "site"
                        }}
                      >
                        {listOfSites}
                      </Select>
                    </FormControl>
                    <br />
                    <FormControl>
                      <InputLabel htmlFor="device">Device</InputLabel>
                      <Select
                        value={this.state.device}
                        name="device"
                        style={{ width: "300px" }}
                        onChange={this.handleSelectChange}
                        placeholder={this.state.device}
                        inputProps={{
                          name: "device",
                          id: "device"
                        }}
                      >
                        {listOfDevices}
                      </Select>
                    </FormControl>
                    <br />
                    <TextField
                      id="content"
                      name="content"
                      onChange={this.handleContentChange}
                      value={this.state.content}
                      label="Description"
                      placeholder="Short Description"
                      multiline
                      margin="normal"
                    />
                    <br />
                    <Button
                      color="primary"
                      variant="contained"
                      style={styles.button}
                      type="submit"
                    >
                      Submit
                    </Button>
                  </form>
                </>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
}

const styles = {
  button: {
    margin: "10px"
  }
};

const mapSateToProps = state => ({
  devices: state.userdata.data
});

export default connect(mapSateToProps)(MyRequests);
