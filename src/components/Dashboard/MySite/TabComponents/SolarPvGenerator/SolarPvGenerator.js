import React, { Component } from 'react';

export default class SolarPvGenerator extends Component {
  state = {
    adopted_solar: '-',
    interested: true,
    solar_capacity_kwp: '',
    solar_generator_operational_since: '',
    solar_panel_oem: '',
    solar_inverter_oem: '',
    solar_installer: '',
    annual_maintenance: 'Yes'
  };

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    Object.keys(this.props.data).forEach(key => {
      if (key.indexOf('adopted') === 0) {
        this.setState({
          adopted_solar: this.props.data[key].value.toString()
        });
      }
      if (key.indexOf('not') > -1) {
        this.setState({
          interested: true
        });
      }

      if (key.indexOf('operational') > -1) {
        this.setState({
          solar_generator_operational_since: this.props.data[
            key
          ].value.toString()
        });
      }
      if (key.indexOf('panel') > -1) {
        this.setState({
          solar_panel_oem: this.props.data[key].value.toString()
        });
      }
      if (key.indexOf('inverter') > -1) {
        this.setState({
          solar_inverter_oem: this.props.data[key].value.toString()
        });
      }
      if (key.indexOf('installer') > -1) {
        this.setState({
          solar_installer: this.props.data[key].value.toString()
        });
      }
      if (key.indexOf('capacity') >= 0) {
        console.log(key);
        console.log(this.props.data[key]);
        this.setState({
          solar_capacity_kwp: this.props.data[key].value.toString()
        });
      }
    });

    this.setState({
      isLoading: false
    });
    const list = this.state.adopted_solar.split(' ');
    if (list[0] === 'Yes' || list[0] === 'yes') {
      this.setState({
        showInstalled: true
      });
    } else {
      this.setState({
        showInstalled: false
      });
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    this.props.handleChildrenChange({
      [e.target.id]: e.target.value
    });
  };

  handleCheckboxInput = () => {
    this.setState({
      interested: !this.state.interested
    });
  };
  handleSelectChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    this.props.handleChildrenChange({
      [e.target.id]: e.target.value
    });
  };
  render() {
    let id = this.props.id;
    return (
      <div className='solar-pv-generator'>
        <p>
          Adopted Solar{' '}
          <span className='solar-pv-generator-heading'>
            {this.state.adopted_solar}
          </span>
        </p>
        {this.state.showInstalled && (
          <div className='solar-pv-generator-box'>
            <div className='solar-pv-generator-box-left'>
              <p>Interested in getting Solar</p>
              <p>generator at this address?</p>
            </div>
            <div className='solar-pv-generator-box-right'>
              <label className='my-container'>
                <input
                  type='checkbox'
                  onChange={this.handleCheckboxInput}
                  checked={this.state.interested}
                />
                <span className='my-checkmark' />
              </label>
            </div>
          </div>
        )}
        {!this.state.showInstalled && (
          <React.Fragment>
            <div className='address-details-div '>
              <p>Total Capacity in kwP</p>
              <input
                id={
                  this.props.id > 1
                    ? `solar_capacity_kwp_site_${id}_`
                    : 'total_capacity_kwp'
                }
                className='address-details-input '
                type='text'
                value={this.state.solar_capacity_kwp}
                onChange={this.handleChange}
                name='solar_capacity_kwp'
              />
            </div>
            <div className='address-details-div '>
              <p>Operational Since</p>
              <input
                id={
                  this.props.id > 1
                    ? `solar_generator_operational_since_site_${id}_`
                    : 'solar_generator_operational_since'
                }
                className='address-details-input '
                type='text'
                value={this.state.solar_generator_operational_since}
                onChange={this.handleChange}
                name='solar_generator_operational_since'
              />
            </div>
            <div className='address-details-div '>
              <p>Solar Panel OEM</p>
              <input
                id={
                  this.props.id > 1
                    ? `solar_panel_oem_site_${id}_`
                    : 'solar_panel_oem'
                }
                className='address-details-input '
                type='text'
                value={this.state.solar_panel_oem}
                onChange={this.handleChange}
                name='solar_panel_oem'
              />
            </div>
            <div className='address-details-div '>
              <p>Inverter OEM </p>
              <input
                id={
                  this.props.id > 1
                    ? `solar_inverter_oem_site_${id}_`
                    : 'solar_inverter_oem'
                }
                className='address-details-input '
                type='text'
                value={this.state.solar_inverter_oem}
                onChange={this.handleChange}
                name='solar_inverter_oem'
              />
            </div>
            <div className='address-details-div '>
              <p>Installer</p>
              <input
                id={
                  this.props.id > 1
                    ? `solar_installer_site_${id}_`
                    : 'installer'
                }
                className='address-details-input '
                type='text'
                value={this.state.solar_installer}
                onChange={this.handleChange}
                name='solar_installer'
              />
            </div>
            <div className='address-details-div '>
              {/* NO value from server, has to be editied before production build */}
              <p>Annual Maintenance</p>
              <select
                className='address-details-select '
                name='annual_maintenance'
                id={
                  this.props.id > 1
                    ? `solar_generator_maintenance_contract_site_${id}_`
                    : 'solar_generator_amc_'
                }
                onChange={this.handleSelectChange}
                placeholder='Yes'
                value={this.state.annual_maintenance}
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}
