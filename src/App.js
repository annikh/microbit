import React, { Component } from 'react';
import './App.css';
import MicrobitConnect from './components/MicrobitConnect'
import ReadInputFile from './ReadInputFile.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <ReadInputFile />
        </header>
        <MicrobitConnect />
      </div>
    );
  }
}

export default App;
