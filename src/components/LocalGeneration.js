import React, { Component } from "react";

export default class LocalGeneration extends Component {
  state = {
    diesel_genset_operational: "",
    number_of_diesel_gensets: "",
    total_kva_capacity_of_diesel_gensets: "",
    monthly_energy_cost: ""
  };

  componentDidMount() {
    this.setState({
      isLoading: true
    });

    Object.keys(this.props.data).forEach(key => {
      if (key.indexOf("genset") === 7) {
        this.setState({
          diesel_genset_operational: this.props.data[key].value.toString()
        });
      }
      if (key.indexOf("number") === 0) {
        this.setState({
          number_of_diesel_gensets: this.props.data[key].value.toString()
        });
      }
      if (key.indexOf("total") === 0) {
        this.setState({
          total_kva_capacity_of_diesel_gensets: this.props.data[
            key
          ].value.toString()
        });
      }
      if (key.indexOf("monthly") === 0) {
        this.setState({
          monthly_energy_cost: this.props.data[key].value.toString()
        });
      }
    });
    this.setState({
      isLoading: false
    });
  }

  handleSelectChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    this.props.handleChildrenChange({
      [e.target.name]: e.target.value
    });
  };
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    this.props.handleChildrenChange({
      [e.target.name]: e.target.value
    });
  };

  render() {
    return (
      <div className="address-details">
        {!this.state.isLoading && (
          <>
            <div className="address-details-div">
              <p>Diesel Genset Operational?</p>
              <select
                className="address-details-select "
                name="diesel_genset_operational"
                onChange={this.handleSelectChange}
                placeholder={this.state.diesel_genset_operational}
                value={this.state.diesel_genset_operational}
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            <div className="address-details-div ">
              <p>Number of Diesel Genset(s)?</p>
              <input
                className="address-details-input "
                type="text"
                value={this.state.number_of_diesel_gensets}
                placeholder={this.state.number_of_diesel_gensets}
                onChange={this.handleChange}
                name="number_of_diesel_gensets"
              />{" "}
            </div>
            <div className="address-details-div ">
              <p>Total kVA Capacity of Diesel Genset(s)</p>
              <input
                className="address-details-input "
                type="text"
                value={this.state.total_kva_capacity_of_diesel_gensets}
                placeholder={this.state.total_kva_capacity_of_diesel_gensets}
                onChange={this.handleChange}
                name="total_kva_capacity_of_diesel_gensets"
              />{" "}
            </div>
            <div className="address-details-div ">
              <p>Monthly running cost of Diesel Genset(s)</p>
              <input
                className="address-details-input "
                type="text"
                value={this.state.monthly_energy_cost}
                placeholder={this.state.monthly_energy_cost}
                onChange={this.handleChange}
                name="monthly_energy_cost"
              />{" "}
            </div>
          </>
        )}
      </div>
    );
  }
}
