import React, { Component } from 'react';
import './App.css';
import MicrobitConnection from './components/MicrobitConnection.js'
import ReadInputFile from './ReadInputFile.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <ReadInputFile />
          <MicrobitConnection />
        </header>
      </div>
    );
  }
}

export default App;
