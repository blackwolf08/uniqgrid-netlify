import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Connection extends Component {
  handleClick = () => {};

  render() {
    const {
      id,
      name,
      power,
      powerPer,
      consumption,
      consumptionPer
    } = this.props;

    const redirect = `/dashboard/my-sites/${id}`;
    return (
      <Link to={redirect}>
        <div className="mysites-connections" onClick={this.handleClick}>
          <div className="my-col">
            <p>{name}</p>
          </div>
          <div className="my-col">
            <p>
              {power} <span style={{ color: "green" }}>({powerPer})</span>
            </p>
          </div>
          <div className="my-col">
            <p>
              {consumption}{" "}
              <span style={{ color: "red" }}>({consumptionPer})</span>
            </p>
          </div>
          <div
            className="my-col mysites-icons"
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <i className="far fa-chart-bar" /> <i className="fas fa-cog" />
          </div>
        </div>
      </Link>
    );
  }
}
