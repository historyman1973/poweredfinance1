import React, { Component } from "react";
import Header from "./components/Header";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DataGrid } from '@mui/x-data-grid';

const chartData = [
  {
    name: 'May 20', uv: 122536, pv: 2400, amt: 2400,
  },
  {
    name: 'Jun 20', uv: 125246, pv: 2400, amt: 2400,
  },
  {
    name: 'Jul 20', uv: 345265, pv: 2400, amt: 2400,
  },
  {
    name: 'Aug 20', uv: 564756, pv: 2400, amt: 2400,
  },
  {
    name: 'Sep 20', uv: 767854, pv: 2400, amt: 2400,
  },
  {
    name: 'Nov 20', uv: 789918, pv: 2400, amt: 2400,
  },
  {
    name: 'Dec 20', uv: 476273, pv: 1398, amt: 2210,
  },
  {
    name: 'Jan 21', uv: 399028, pv: 9800, amt: 2290,
  },
  {
    name: 'Feb 21', uv: 201829, pv: 3908, amt: 2000,
  },
  {
    name: 'Mar 21', uv: 519028, pv: 4800, amt: 2181,
  },
  {
    name: 'Apr 21', uv: 981023, pv: 3800, amt: 2500,
  },
  {
    name: 'May 21', uv: 1312674, pv: 4300, amt: 2100,
  }
];

const assetListColumns = [
  { field: 'id', 
    headerName: 'ID', 
    width: 100,
    type: 'number',
    editable: false
  },
  {
    field: 'assetName',
    headerName: 'Asset name',
    minWidth: 300,
    editable: false
  },
  {
    field: 'value',
    headerName: 'Value',
    type: 'number',
    width: 150,
    editable: false
  },
  {
    field: 'currency',
    headerName: 'Currency',
    minWidth: 150,
    editable: false
  },
  {
    field: 'allocation',
    headerName: 'Allocation %',
    minWidth: 200,
    editable: false
  },
  {
    field: 'lastUpdated',
    headerName: 'Last Updated',
    minWidth: 200,
    editable: false
  }
];

const assetListRows = [
  { id: 1, assetName: 'Home #1', value: 376799, currency: 'GBP', allocation: '28.7%', lastUpdated: '12/10/2021' },
  { id: 2, assetName: 'S&S ISA', value: 10320, currency: 'GBP', allocation: '0.8%', lastUpdated: '12/10/2021' },
  { id: 3, assetName: 'Lifetime ISA', value: 1012, currency: 'GBP', allocation: '0.1%', lastUpdated: '12/10/2021' },
  { id: 4, assetName: 'Ledger Crypto', value: 912541, currency: 'GBP', allocation: '69.5%', lastUpdated: '12/10/2021' },
  { id: 5, assetName: 'Car #1', value: 3228, currency: 'GBP', allocation: '0.2%', lastUpdated: '12/10/2021' },
  { id: 6, assetName: 'Work Pension', value: 8774, currency: 'GBP', allocation: '0.7%', lastUpdated: '12/10/2021' }
];

class Assets extends Component {

  render() {
    return (
      <div>
        <Header title={'assets'}/>
          <br />
          <br />
            <div class="main-container">
              <div class="row">
                <div class="columnChart">
                  <div style={{ width: '100%', height: 500 }}>
                    <ResponsiveContainer>
                      <AreaChart
                        width={500}
                        height={400}
                        data={chartData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div class="columnSummary">
                  <div class="summaryCardOuter">
                    <h1>1,312,674 GBP</h1>
                    <p>TOTAL ASSETS</p>
                    <div class="summaryCardInner">
                      <h3>(+28%) 51,999 GBP</h3>
                      <p>30-DAY PERFORMANCE</p>
                      <h3>(+314%) 810,011 GBP</h3>
                      <p>120-DAY PERFORMANCE</p>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ height: '350px', margin: '50px' }}>
                <DataGrid
                  rows={assetListRows}
                  columns={assetListColumns}
                />
              </div>
            </div>
      </div>
    );
  }
}

export default Assets;