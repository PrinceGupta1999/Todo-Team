import { Component, Fragment } from 'react';
import React from 'react';
import Header from './components/Header'
import Index from './components/Index'

class App extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <Index />
      </Fragment>
    );
    
  }
}

export default App;
