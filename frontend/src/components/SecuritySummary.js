import React from 'react'
import NumberFormat from 'react-number-format';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Container, Tooltip } from '@mui/material';
import CurrencyFormat from 'react-currency-format';

const data = [
    {
      name: 'Dec 20', uv: 176273, pv: 1398, amt: 2210,
    },
    {
      name: 'Jan 21', uv: 699028, pv: 9800, amt: 2290,
    },
    {
      name: 'Feb 21', uv: 801829, pv: 3908, amt: 2000,
    },
    {
      name: 'Mar 21', uv: 719028, pv: 4800, amt: 2181,
    },
    {
      name: 'Apr 21', uv: 881023, pv: 3800, amt: 2500,
    },
    {
      name: 'May 21', uv: 1000001, pv: 4300, amt: 2100,
    }
  ];



export default function SecuritySummary(props) {

    return (
        <div style={{ height: 'auto', marginLeft: '10%', marginRight: '10%', marginTop: 20, padding: 5 }}>
            <div>
                <h1>{props.symbol}</h1>
                <h2><CurrencyFormat value={props.close} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale="2" fixedDecimalScale="true"/></h2>
            </div>
            <div class="changeBox">
              <CurrencyFormat value={props.high} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale="2" fixedDecimalScale="true"/><b>  high</b>
              <br />
              <CurrencyFormat value={props.low} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale="2" fixedDecimalScale="true"/><b>  low</b>
              <br />
              <CurrencyFormat value={props.open} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale="2" fixedDecimalScale="true"/><b>  open</b>
            </div>
            <hr />
            <div style={{ width: '100%', height: 500, marginTop: 50, marginBottom: 30 }}>
              <ResponsiveContainer width="100%">
                <LineChart
                width={600}
                height={300}
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <hr />
            general other info
        </div>
    )
}