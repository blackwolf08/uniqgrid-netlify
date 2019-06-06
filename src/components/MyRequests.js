import React, { Component } from "react";
import { Helmet } from "react-helmet";
import Table from "react-bootstrap/Table";

export default class MyRequests extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>My Requests</title>
        </Helmet>
        <h1 className="mysites-heading">My Requests</h1>
        <div className="myrequest-hero">
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
        </div>
      </div>
    );
  }
}
