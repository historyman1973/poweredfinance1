import React, { Component, useEffect, useState } from "react";
import Header from "./components/Header";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DataGrid } from '@mui/x-data-grid';
import { Container } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import SecuritySummary from "./components/SecuritySummary";


function SecurityDrilldown() {

  const [security, setSecurity] = useState([]);
  // const [loading, setLoading] = useState(true)

  const getSecurityInfo = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/get-latest-data/` + window.location.pathname.split('/')[2]);
      setSecurity(res.data || []);
      // setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  //useEffect(() => getSecurityInfo(), []);  UNCOMMENT THIS TO CALL API

    return (
      <div>
        <Header />
        <div class="main-container" style={{ width: '80%', margin: 'auto', marginTop: 25 }}>
          <SecuritySummary info={security.length} />
        </div>
      </div>
    );


  
}

export default SecurityDrilldown;