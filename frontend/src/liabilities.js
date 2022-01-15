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
    name: 'Jul 20', uv: 145265, pv: 2400, amt: 2400,
  },
  {
    name: 'Aug 20', uv: 164756, pv: 2400, amt: 2400,
  },
  {
    name: 'Sep 20', uv: 167854, pv: 2400, amt: 2400,
  },
  {
    name: 'Nov 20', uv: 189918, pv: 2400, amt: 2400,
  },
  {
    name: 'Dec 20', uv: 176273, pv: 1398, amt: 2210,
  },
  {
    name: 'Jan 21', uv: 199028, pv: 9800, amt: 2290,
  },
  {
    name: 'Feb 21', uv: 201829, pv: 3908, amt: 2000,
  },
  {
    name: 'Mar 21', uv: 219028, pv: 4800, amt: 2181,
  },
  {
    name: 'Apr 21', uv: 281023, pv: 3800, amt: 2500,
  },
  {
    name: 'May 21', uv: 312673, pv: 4300, amt: 2100,
  }
];

const liabilityListColumns = [
  { field: 'id', 
    headerName: 'ID', 
    width: 100,
    type: 'number',
    editable: false
  },
  {
    field: 'liabilityName',
    headerName: 'Liability name',
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

const liabilityListRows = [
  { id: 1, liabilityName: 'Mortgage #1', value: 288092, currency: 'GBP', allocation: '92.3%', lastUpdated: '12/10/2021' },
  { id: 2, liabilityName: 'Car loan #1', value: 2545, currency: 'GBP', allocation: '0.8%', lastUpdated: '12/10/2021' },
  { id: 3, liabilityName: 'NatWest credit', value: 930, currency: 'GBP', allocation: '0.3%', lastUpdated: '12/10/2021' },
  { id: 4, liabilityName: 'Personal loan', value: 20606, currency: 'GBP', allocation: '6.6%', lastUpdated: '12/10/2021' }
];

class Liabilities extends Component {

  render() {
    return (
      <div>
        <Header title={'liabilities'} viewingId={window.location.pathname.split('/')[2]} />
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
                    <h1>312,173 GBP</h1>
                    <p>TOTAL LIABILITIES</p>
                    <div class="summaryCardInner">
                      <h3>(+7%) 1,299 GBP</h3>
                      <p>30-DAY PERFORMANCE</p>
                      <h3>(-19%) 111,293 GBP</h3>
                      <p>120-DAY PERFORMANCE</p>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ height: '350px', margin: '50px' }}>
                <DataGrid
                  rows={liabilityListRows}
                  columns={liabilityListColumns}
                />
              </div>
            </div>
      </div>
    );
  }
}

export default Liabilities;