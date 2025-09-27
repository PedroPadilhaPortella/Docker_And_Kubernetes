import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import Fibonacci from './Fibonacci';
import OtherPage from './OtherPage';

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Fibonacci</h1>
          <div className='App-menu'><Link to="/">Fibonacci</Link> | <Link to="/otherpage">Other Page</Link></div>
          
        </header>
        <div className="App-body">
          <Route exact path="/" component={Fibonacci} />
          <Route path="/otherpage" component={OtherPage} />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
