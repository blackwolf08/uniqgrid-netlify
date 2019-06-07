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
    redirect: false,
    email: ""
  };

  componentDidMount() {
    if (typeof localStorage.jwtToken !== "undefined") {
      let jwt = localStorage.jwtToken;
      jwt = jwtDecode(jwt);
      this.setState({
        email: jwt.sub
      });
      //decoding jwt to get email of user jwt.sub contains the email of user
      const URL = `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/email/${
        jwt.sub
      }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`;
      //this req is to get all the data from server, to filter out site names
      axios.get(URL).then(res => {
        const properties = res.data.properties;
        let arrayOfStrings = [];
        let noOfSites = [];
        Object.keys(properties).forEach(key => {
          arrayOfStrings.push(key);
        });
        // arrofstrings contains all the keys of the data

        arrayOfStrings.forEach(site => {
          let nanCheck = isNaN(parseInt(site.charAt(site.length - 2), 10));
          //checking acc to the struct of API that id that key has any sub string site in it then appending to no of sites
          if (site.search("site") >= 0 && !nanCheck) {
            noOfSites.push(parseInt(site.charAt(site.length - 2), 10));
          }
        });
        let nameOfSites = [];
        arrayOfStrings.sort();
        // name of sites are stored in the array
        arrayOfStrings.forEach(site => {
          if (site.search("electricity_connection_name") >= 0) {
            nameOfSites.push(res.data.properties[site].value);
          }
        });
        this.setState({
          nameOfSites: nameOfSites
        });
        // this condition is for if the sites has no int char in it sepecifying the number of site
        if (noOfSites.length === 0) {
          noOfSites.push(1);
        }
      });
      // all done, now ready to render
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
  };

  handleClick = () => {
    this.setState({
      newTicket: true
    });
  };

  handleSubmit = e => {
    // this next step is used to over write the default behavior of the form to submit the data and refreshing
    e.preventDefault();
    //obj is the object created to be sent to API and in response we get back a ticket number
    let obj = [
      { name: "email", value: `${this.state.email}` },
      { name: "createdate", value: Date.now() },
      { name: "site", value: this.state.site },
      { name: "device", value: this.state.device },
      { name: "content", value: this.state.content }
    ];
    //make the req, convert array into JSON object
    fetch(
      `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/crm-objects/v1/objects/tickets?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`,
      {
        method: "POST",
        body: JSON.stringify(obj)
      }
    )
      .then(res => {
        //redirecting to my-requests page
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
      // list of websites to be as an option for select, we are creating <option>Name of site</option> with Material UI
      this.state.nameOfSites.forEach(site => {
        listOfSites.push(
          <MenuItem key={uuid.v4()} value={site}>
            {site}
          </MenuItem>
        );
      });
      // same as above, creates options for select for devices array
      this.props.devices.forEach(device => {
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
          // this section is basically the table with tickets
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
                // this section contains the form elements to raise a new ticket
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