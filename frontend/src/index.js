import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-globally';
import Layout from './components/Layout';
import { ToastContainer } from 'react-bootstrap';

const initialState = {
  counter: "hello"
}

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
      <Provider globalState={"hello"}>
        <App />
      </Provider>
    </BrowserRouter>
  ), document.getElementById('root')
);
