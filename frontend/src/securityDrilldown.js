import React, { Component, useEffect, useState } from "react";
import Header from "./components/Header";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DataGrid } from '@mui/x-data-grid';
import { Container } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import CurrencyFormat from "react-currency-format";


function SecurityDrilldown() {

  const [latestData, setLatestData] = useState([]);
  const [eodTS, setEodTS] = useState([]);
  // const [loading, setLoading] = useState(true)

  const getSecurityInfo = async () => {
    try {
      const latestDataCall = await axios.get(`http://127.0.0.1:5000/get-latest-data/` + window.location.pathname.split('/')[2]);
      setLatestData(latestDataCall.data[0] || []);
      const eodTSCall = await axios.get(`http://127.0.0.1:5000/get-eod-timeseries/` + window.location.pathname.split('/')[2]);
      setEodTS(eodTSCall.data || []);
      console.log(eodTS)
      // setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => getSecurityInfo(), []);

  function makeTSData(eodTS) {

    const ts = Array()

    {eodTS.map((item) => (
      ts.push({ date: item.date.substring(0, 10), price: item.adj_close })
      ))}

    ts.reverse()

    return ts

  }

  function formatCurrency(value) {
    return '$' + value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

    return (
      <div>
        <Header />
        <div class="main-container" style={{ width: '80%', margin: 'auto', marginTop: 25 }}>
        <div style={{ height: 'auto', marginLeft: '10%', marginRight: '10%', marginTop: 20, padding: 5 }}>
            <div>
                <h1>{latestData.symbol}</h1>
                <h2><CurrencyFormat value={latestData.close} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale="2" fixedDecimalScale="true"/></h2>
            </div>
            <div class="changeBox">
              <CurrencyFormat value={latestData.high} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale="2" fixedDecimalScale="true"/><b>  high</b>
              <br />
              <CurrencyFormat value={latestData.low} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale="2" fixedDecimalScale="true"/><b>  low</b>
              <br />
              <CurrencyFormat value={latestData.open} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale="2" fixedDecimalScale="true"/><b>  open</b>
            </div>
            <hr />
            <div style={{ width: '100%', height: 500, marginTop: 50, marginBottom: 30 }}>
              <ResponsiveContainer width="100%">
                <LineChart
                width={600}
                height={300}
                data={makeTSData(eodTS)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={formatCurrency} domain={[Math.min(eodTS.adj_close), Math.max(eodTS.adj_close)]}/>
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#4527a0" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <hr />
            general other info
        </div>
        </div>
      </div>
    );


  
}

export default SecurityDrilldown;