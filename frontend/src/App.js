import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import axios from "axios";
//import { Container } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import ClientTable from "./components/ClientTable";
import React from "react";
import Layout from "./components/Layout";
//import Container from '@mui/material/Container';


function App() {
  const [clientList, setClientList] = useState([]);
  // const [loading, setLoading] = useState(true)

  const getClientList = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/client-list`);
      setClientList(res.data || []);
      // setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => getClientList(), []);

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
