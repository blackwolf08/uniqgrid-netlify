import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Spinner from "../images";
import jwtDecode from 'jwt-decode'
import axios from 'axios'

class MyProfile extends Component {
  state = {
    readOnly: true,
    isSubmitButtonDisabled: true,
    firstname: "",
    mobilephone: "",
    email: "",
    spinner: false
  };

  componentDidMount()
  {
    this.setState({
      spinner: true
    })
    if(localStorage.jwtToken)
    {
      let jwtToken = jwtDecode(localStorage.jwtToken)
      axios.get(`https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/email/${jwtToken.sub}/profile?hapikey= bdcec428-e806-47ec-b7fd-ece8b03a870b`)
      .then(res=>{
        console.log(res)
        this.setState({
          firstname: res.data.properties.firstname.value,
          email: res.data.properties.email.value,
          mobilephone: res.data.properties.mobilephone.value,
          spinner: false,
          vid:  res.data.vid
        })
      })
      .catch(res=>{
        localStorage.clear();
        window.location.href = "/login";
      })
    }
    
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      spinner: true
    });
    let obj = {
      properties: [
        {
          property: "email",
          value: `${this.state.email}`
        },
        {
          property: "firstname",
          value: `${this.state.firstname}`
        },
        {
          property: "mobilephone",
          value: `${this.state.mobilephone}`
        }
      ]
    };
    //make the req, convert array into JSON object
    axios({
      url: `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/vid/${
        this.state.vid
      }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`,
      method: "POST",
      config: { 
        headers: {
          'Content-Type': 'application/json'
        }
      },
      data : obj
    })
      .then(res => {
        //redirecting to my-requests page
       window.location.reload();
      })
      .catch(res => {
        localStorage.clear();
          window.location.href = "/login";
      });
  };

  handleClick = () => {
    this.setState({
      isSubmitButtonDisabled: false,
      readOnly: false
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  render() {
    let shortName = "";
    if (typeof this.props.data !== "undefined") {
      let nameArr = this.props.data.name.split(" ");
      nameArr.forEach(e => {
        shortName += e[0].toUpperCase();
      });
    }
    if (this.state.spinner) return <Spinner />;

    return (
      <div className="flex h-w-100">
        <Helmet>
          <title>My Profile</title>
        </Helmet>
        <Container fixed>
          <div className="circle circle-myprofile">
            <p>{shortName}</p>
          </div>
          <form
            className="flex flex-col"
            noValidate
            autoComplete="off"
            onSubmit={this.handleSubmit}
          >
            <TextField
              id="firstname"
              label="Name"
              onChange={this.handleChange}
              value={this.state.firstname}
              style={styles.textField}
              margin="normal"
              InputProps={{
                readOnly: this.state.readOnly
              }}
            />
            <br />
            <TextField
              id="email"
              label="Email"
              value={this.state.email}
              style={styles.textField}
              margin="normal"
              onChange={this.handleChange}
              InputProps={{
                readOnly: this.state.readOnly
              }}
            />
            <br />
            <TextField
              id="mobilephone"
              label="Phone"
              value={this.state.mobilephone}
              style={styles.textField}
              onChange={this.handleChange}
              margin="normal"
              InputProps={{
                readOnly: this.state.readOnly
              }}
            />
            <br />
            <div>
              <Button
                onClick={this.handleClick}
                variant="contained"
                style={styles.button}
              >
                Edit
              </Button>
              <Button
                disabled={this.state.isSubmitButtonDisabled}
                type="submit"
                color="primary"
                variant="contained"
                style={styles.button}
              >
                Submit
              </Button>
            </div>
          </form>
        </Container>
      </div>
    );
  }
}

const styles = {
  textField: {
    width: "300px"
  },
  button: {
    margin: "10px"
  }
};

const mapStateToProps = state => ({
  data: state.userdata.customerInfo.data,
  vid: state.userdata.vid
});

export default connect(mapStateToProps)(MyProfile);
