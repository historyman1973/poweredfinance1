import React, { Component } from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/index.css";
import { BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import { ToastContainer } from "react-bootstrap";

class App extends Component {
  render() {
    return (
      <div>
        <div className="App">
          <style>
            @import
            url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300&family=Mulish:wght@200&family=Roboto:wght@300&display=swap');
          </style>
          <Layout />
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    );
  }
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
