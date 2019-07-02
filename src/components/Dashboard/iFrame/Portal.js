import React, { Component } from 'react';
import Iframe from 'react-iframe';

export default class Portal extends Component {
  render() {
    return (
      <Iframe
        url='http://portal.uniqgridcloud.com:8080'
        width='100%'
        height='100%'
        id='myId'
        className='iframe'
        display='initial'
        position='relative'
      />
    );
  }
}
