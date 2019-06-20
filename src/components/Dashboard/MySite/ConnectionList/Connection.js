import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Progress } from 'reactstrap';

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
    const redirectSmallChart = `/dashboard/hot-charts/${id}`;
    return (
      <div className='mysites-connections' onClick={this.handleClick}>
        <div className='my-col flex'>
          <p style={{ width: '100%', textAlign: 'left' }}>{name}</p>
        </div>
        <div className='my-col flex'>
          <div className='flex'>
            <span style={{ width: '100px' }}>
              {power === ' kW' ? '--' : power}
            </span>
            <span style={{ width: '250px' }}>
              <Progress value='55' />{' '}
            </span>
          </div>
        </div>
        <div className='my-col flex'>
          <div className='flex'>
            <span style={{ width: '100px' }}>
              {consumption === ' kW' ? '--' : consumption}
            </span>
            <span style={{ width: '250px' }}>
              <Progress color='danger' value='25' />{' '}
            </span>
          </div>
        </div>
        <div
          className='my-col flex mysites-icons'
          style={{ display: 'flex', justifyContent: 'space-around' }}
        >
          <Link to={redirectSmallChart}>
            <i
              className='far fa-chart-bar'
              style={{ color: 'black', fontSize: '1.6rem' }}
            />{' '}
          </Link>
          <Link to={redirect}>
            <i
              style={{ color: 'black', fontSize: '1.3rem' }}
              className='fas fa-cog'
            />{' '}
          </Link>
        </div>
      </div>
    );
  }
}
