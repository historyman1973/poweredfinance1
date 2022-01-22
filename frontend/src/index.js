import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import { BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import { ToastContainer } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  render() {
    return (
      <div>
        <div className="App">
          <Layout />
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    )
  }
}

ReactDOM.render((
    <BrowserRouter>
        <App />
    </BrowserRouter>
  ), document.getElementById('root')
);
