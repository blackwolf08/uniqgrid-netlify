import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class MyProfile extends Component {
  state = {
    readOnly: true,
    isSubmitButtonDisabled: true,
    name: this.props.data.name ? this.props.data.name : "",
    phone: this.props.data.phone ? this.props.data.phone : "",
    email: this.props.data.email ? this.props.data.email : ""
  };

  handleSubmit = e => {
    e.preventDefault();
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
              id="name"
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
  data: state.userdata.customerInfo.data
});

export default connect(mapStateToProps)(MyProfile);
