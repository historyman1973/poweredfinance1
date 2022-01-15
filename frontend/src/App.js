import "bootstrap/dist/css/bootstrap.min.css";
//import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import Layout from "./components/Layout";
//import Container from '@mui/material/Container';


function App() {

  return (
    <div>
      <div className="App">
        <Layout />
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
