import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Spinner from "../images";

class MyProfile extends Component {
  state = {
    readOnly: true,
    isSubmitButtonDisabled: true,
    name: this.props.data.name ? this.props.data.name : "",
    phone: this.props.data.phone ? this.props.data.phone : "",
    email: this.props.data.email ? this.props.data.email : "",
    spinner: false
  };

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
          value: `${this.state.name}`
        },
        {
          property: "mobilephone",
          value: `${this.state.phone}`
        }
      ]
    };
    //make the req, convert array into JSON object
    fetch(
      `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/vid/${
        this.props.vid
      }/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`,
      {
        method: "POST",
        body: JSON.stringify(obj)
      }
    )
      .then(res => {
        //redirecting to my-requests page
        window.location.reload();
      })
      .catch(res => {
        console.log(res);
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
              id="name"
              label="Name"
              onChange={this.handleChange}
              value={this.state.name}
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
              id="phone"
              label="Phone"
              value={this.state.phone}
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
