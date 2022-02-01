import React, { Component, useEffect, useState } from "react";
import Header from "./components/Header";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DataGrid } from '@mui/x-data-grid';
import { Container } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import SecuritySummary from "./components/SecuritySummary";


function SecurityDrilldown() {

  const [latestData, setLatestData] = useState([]);
  const [eodTS, setEodTS] = useState([]);
  // const [loading, setLoading] = useState(true)

  const getSecurityInfo = async () => {
    try {
      const latestData = await axios.get(`http://127.0.0.1:5000/get-latest-data/` + window.location.pathname.split('/')[2]);
      setLatestData(latestData.data[0] || []);
      const eodTS = await axios.get(`http://127.0.0.1:5000/get-eod-timeseries/` + window.location.pathname.split('/')[2]);
      setEodTS(eodTS.data[0] || []);
      console.log(eodTS);
      // setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => getSecurityInfo(), []);

    return (
      <div>
        <Header />
        <div class="main-container" style={{ width: '80%', margin: 'auto', marginTop: 25 }}>
          <SecuritySummary {...{...latestData,...eodTS}} />
        </div>
      </div>
    );


  
}

export default SecurityDrilldown;