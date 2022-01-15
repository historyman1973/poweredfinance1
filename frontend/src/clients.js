import React, { Component } from "react";
import ClientTable from "./components/ClientTable";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from './components/Header'

function Clients() {

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
      <Header title={'clients'}/>
      <ClientTable class="padding-left-right" clients={clientList}/>
    </div>
  );

}

export default Clients;