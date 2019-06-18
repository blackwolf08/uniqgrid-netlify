import React, { Component } from 'react';
import axios from 'axios';

export default class Charts extends Component {
  componentDidMount() {
    //get dynaic id from site
    const {
      match: { params }
    } = this.props;
    const id = params.id;
    //setter for id in state
    this.setState({
      id
    });
    const URL = `https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/vid/4301/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b`;

    axios.get(URL).then(res => {
      console.log(res);
    });
  }

  render() {
    return (
      <div>
        <h1>Hey</h1>
      </div>
    );
  }
}
