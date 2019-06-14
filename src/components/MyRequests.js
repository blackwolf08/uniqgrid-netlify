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
import { fetchConnetionInfo } from "../actions/fetchConnectionInfo";
import Spinner from "../images/index";
import moment from "moment";
class MyRequests extends Component {
  state = {
    newTicket: false,
    ready: false,
    nameOfSites: [],
    site: "",
    device: "",
    content: "",
    redirect: false,
    email: "",
    spinner: false,
    recievedObj: "",
    newObj: {},
    ticketArray: [],
    nameOfSite: ""
  };

  componentDidMount() {
    if (typeof localStorage.jwtToken !== "undefined") {
      this.setState({
        spinner: true
      });
      this.props.fetchConnetionInfo();
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
      axios
        .get(URL)
        .then(res => {
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
            if (
              site.search("electricity_connection_name") >= 0 &&
              !nanCheck &&
              properties[site].value !== ""
            ) {
              noOfSites.push(parseInt(site.charAt(site.length - 2), 10));
            }
          });
          let nameOfSites = [];
          arrayOfStrings.sort();
          // name of sites are stored in the array
          arrayOfStrings.forEach(site => {
            if (
              site.search("electricity_connection_name") >= 0 &&
              properties[site].value !== ""
            ) {
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
          this.setState({
            spinner: false
          });
        })
        .catch(res => {
          if (res.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
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
    this.setState({
      nameOfSite: e.target.id
    });
  };

  clickmee = e => {
    this.setState({
      nameOfSite: e.target.id
    });
  };

  handleClick = () => {
    this.setState({
      newTicket: true
    });
    this.setState({
      site: ""
    });
  };

  getTicket = e => {
    e.preventDefault();

    this.setState({
      spinner: true
    });
    let jwt = localStorage.jwtToken;
    jwt = jwtDecode(jwt);

    const URL = `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/email/${
      jwt.sub
    }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`;

    axios
      .get(URL)
      .then(res => {
        this.setState({
          vid: res.data.vid
        });
        const properties = res.data.properties;
        let site = this.state.site;
        let id = site.charAt(site.length - 1);
        let nanCheck = isNaN(parseInt(id, 10));
        let ticketToCheck = "";
        if (nanCheck) {
          ticketToCheck = "tickets_site1_";
        } else {
          ticketToCheck = `tickets_site${id}_`;
        }
        Object.keys(properties).forEach(key => {
          if (key.search(ticketToCheck) >= 0) {
            this.setState({
              recievedObj: properties[key].value
            });
          }
        });
        let objRec = this.state.recievedObj;
        objRec = JSON.parse(objRec);
        let ticketArray = [];
        objRec.forEach(ticket => {
          ticketArray.push(ticket);
        });
        this.setState({
          ticketArray
        });
        this.setState({
          spinner: false
        });
      })
      .catch(res => {
        if (res.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }
      });
  };

  handleSubmit = e => {
    // this next step is used to over write the default behavior of the form to submit the data and refreshing
    e.preventDefault();
    this.setState({
      spinner: true
    });

    //obj is the object created to be sent to API and in response we get back a ticket number
    let obj = [
      { name: "email", value: `${this.state.email}` },
      { name: "site", value: this.state.site },
      { name: "device", value: this.state.device },
      { name: "content", value: this.state.content },
      {
        name: "hs_pipeline_stage",
        value: "1"
      },
      {
        name: "hs_pipeline",
        value: "0"
      }
    ];
    axios({
      url: `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/crm-objects/v1/objects/tickets?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`,
      method: "POST",
      config: {
        headers: {
          "Content-Type": "application/json"
        }
      },
      data: obj
    })
      .then(res => {
        //redirecting to my-requests page

        let objToSend = {};
        objToSend["objectId"] = res.data.objectId;
        objToSend["content"] = res.data.properties.content.value;
        objToSend["createdAt"] = res.data.properties.createdate.value;
        objToSend["email"] = res.data.properties.email.value;
        objToSend["device"] = res.data.properties.device.value;
        objToSend["isDeleted"] = res.data.isDeleted;

        let arrToSend = [];
        arrToSend.push(objToSend);
        let jwt = localStorage.jwtToken;
        jwt = jwtDecode(jwt);

        const URL = `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/email/${
          jwt.sub
        }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`;

        axios
          .get(URL)
          .then(res => {
            this.setState({
              vid: res.data.vid
            });
            const properties = res.data.properties;
            let site = this.state.site;
            let id = site.charAt(site.length - 1);
            let nanCheck = isNaN(parseInt(id, 10));
            let ticketToCheck = "";
            if (nanCheck) {
              ticketToCheck = "tickets_site1_";
            } else {
              ticketToCheck = `tickets_site${id}_`;
            }
            Object.keys(properties).forEach(key => {
              if (key.search(ticketToCheck) >= 0) {
                this.setState({
                  recievedObj: properties[key].value
                });
              }
            });

            if (!this.state.recievedObj) {
              this.setState({
                recievedObj: `[]`
              });
            }

            let objRec = this.state.recievedObj;

            objRec = JSON.parse(objRec);
            if (!Array.isArray(objRec)) {
              objRec = [];
            }

            let ticketArray = [];
            objRec.forEach(ticket => {
              ticketArray.push(ticket);
            });

            ticketArray.forEach(ticket => {
              arrToSend.push(ticket);
            });

            axios({
              url: `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/vid/${
                this.props.vid
              }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`,
              method: "POST",
              data: {
                properties: [
                  {
                    property: `${ticketToCheck}`,
                    value: JSON.stringify(arrToSend)
                  }
                ]
              }
            }).then(res => {
              this.setState({
                site: "",
                objectId: res.data.objectId
              });
              this.setState({ redirect: true });
              this.setState({
                spinner: false
              });
            });
          })
          .catch(res => {
            if (res.status === 401) {
              localStorage.clear();
              window.location.href = "/login";
            }
          });

        //window.location.reload();
      })
      .catch(res => {
        if (res.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }
      });
  };

  render() {
    const { redirect } = this.state;
    let listOfSites = [];
    let listOfDevices = [];
    if (redirect && !this.state.spinner) {
      return <Redirect to="/dashboard/my-requests" />;
    }
    if (this.state.spinner) {
      return <Spinner />;
    }

    if (this.state.ready) {
      // list of websites to be as an option for select, we are creating <option>Name of site</option> with Material UI
      let i = 1;
      this.state.nameOfSites.forEach(site => {
        if (i === 1) {
          listOfSites.push(
            <MenuItem onClick={this.clickmee} key={i} id={site} value={`site`}>
              {site}
            </MenuItem>
          );
        } else {
          listOfSites.push(
            <MenuItem
              key={i}
              onClick={this.clickmee}
              id={site}
              value={`site_${i}`}
            >
              {site}
            </MenuItem>
          );
        }
        i++;
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
    let listOfTickets;
    if (this.state.ticketArray) {
      listOfTickets = this.state.ticketArray.map(ticket => {
        if (!ticket.isDeleted && typeof ticket.isDeleted !== "undefined") {
          return (
            <tr key={uuid.v4()}>
              <td>{ticket.objectId}</td>
              <td>{this.state.site}</td>
              <td>{moment.unix(ticket.createdAt).format("MMM Do")}</td>
              <td>{ticket.device}</td>
              <td>{ticket.content}</td>
              <td>False</td>
            </tr>
          );
        } else {
          return <></>;
        }
      });
    }
    if (!this.state.spinner) {
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
                    <form onSubmit={this.getTicket}>
                      <FormControl>
                        <InputLabel htmlFor="site">Site</InputLabel>
                        <Select
                          value={this.state.site}
                          name="site"
                          style={{ width: "300px" }}
                          onChange={e => {
                            this.handleSelectChange(e);
                            this.clickmee(e);
                          }}
                          placeholder={this.state.site}
                          inputProps={{
                            name: "site",
                            id: "site"
                          }}
                        >
                          {listOfSites}
                        </Select>
                      </FormControl>
                      <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        style={styles.button}
                      >
                        Get Ticket
                      </Button>
                    </form>
                    <br />
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
                      <tbody>{listOfTickets}</tbody>
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
                        style={{ height: "50px", width: "300px" }}
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
}

const styles = {
  button: {
    margin: "10px"
  }
};

const mapSateToProps = state => ({
  devices: state.userdata.data,
  vid: state.userdata.vid
});

export default connect(
  mapSateToProps,
  { fetchConnetionInfo }
)(MyRequests);
