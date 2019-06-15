import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Connection extends Component {
  handleClick = () => {};

  render() {
    const {
      id,
      name,
      power,
      //powerPer,
      consumption
      //consumptionPer
    } = this.props;

    const redirect = `/dashboard/my-sites/${id}`;
    const redirectSmallChart = `/dashboard/charts/${id}`;
    return (
      <div className="mysites-connections" onClick={this.handleClick}>
        <div className="my-col">
          <p>
            <i style={{ color: "black" }} className="fas fa-warehouse" /> {name}
          </p>
        </div>
        <div className="my-col">
          <p>
            {power} {/*<span style={{ color: "green" }}>({powerPer}) </span>*/}
          </p>
        </div>
        <div className="my-col">
          <p>
            {consumption}{" "}
            {/*<span style={{ color: "red" }}>({consumptionPer})</span>*/}
          </p>
        </div>
        <div
          className="my-col mysites-icons"
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          <Link to={redirectSmallChart}>
            <i className="far fa-chart-bar" style={{ color: "black" }} />{" "}
          </Link>
          <Link to={redirect}>
            <i style={{ color: "black" }} className="fas fa-cog" />{" "}
          </Link>
        </div>
      </div>
    );
  }
}
