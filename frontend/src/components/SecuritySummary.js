import React from 'react'

import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Container, Tooltip } from '@mui/material';

const data = [
    {
      name: 'May 20', uv: 422536, pv: 2400, amt: 2400,
    },
    {
      name: 'Jun 20', uv: 225246, pv: 2400, amt: 2400,
    },
    {
      name: 'Jul 20', uv: 345265, pv: 2400, amt: 2400,
    },
    {
      name: 'Aug 20', uv: 364756, pv: 2400, amt: 2400,
    },
    {
      name: 'Sep 20', uv: 367854, pv: 2400, amt: 2400,
    },
    {
      name: 'Nov 20', uv: 489918, pv: 2400, amt: 2400,
    },
    {
      name: 'Dec 20', uv: 676273, pv: 1398, amt: 2210,
    },
    {
      name: 'Jan 21', uv: 699028, pv: 9800, amt: 2290,
    },
    {
      name: 'Feb 21', uv: 501829, pv: 3908, amt: 2000,
    },
    {
      name: 'Mar 21', uv: 719028, pv: 4800, amt: 2181,
    },
    {
      name: 'Apr 21', uv: 581023, pv: 3800, amt: 2500,
    },
    {
      name: 'May 21', uv: 700001, pv: 4300, amt: 2100,
    },
    {
      name: 'May 20', uv: 422536, pv: 2400, amt: 2400,
    },
    {
      name: 'Jun 20', uv: 225246, pv: 2400, amt: 2400,
    },
    {
      name: 'Jul 20', uv: 345265, pv: 2400, amt: 2400,
    },
    {
      name: 'Aug 20', uv: 364756, pv: 2400, amt: 2400,
    },
    {
      name: 'Sep 20', uv: 367854, pv: 2400, amt: 2400,
    },
    {
      name: 'Nov 20', uv: 489918, pv: 2400, amt: 2400,
    },
    {
      name: 'Dec 20', uv: 676273, pv: 1398, amt: 2210,
    },
    {
      name: 'Jan 21', uv: 699028, pv: 9800, amt: 2290,
    },
    {
      name: 'Feb 21', uv: 501829, pv: 3908, amt: 2000,
    },
    {
      name: 'Mar 21', uv: 519028, pv: 4800, amt: 2181,
    },
    {
      name: 'Apr 21', uv: 581023, pv: 3800, amt: 2500,
    },
    {
      name: 'May 21', uv: 600001, pv: 4300, amt: 2100,
    },
    {
      name: 'May 20', uv: 422536, pv: 2400, amt: 2400,
    },
    {
      name: 'Jun 20', uv: 225246, pv: 2400, amt: 2400,
    },
    {
      name: 'Jul 20', uv: 345265, pv: 2400, amt: 2400,
    },
    {
      name: 'Aug 20', uv: 364756, pv: 2400, amt: 2400,
    },
    {
      name: 'Sep 20', uv: 367854, pv: 2400, amt: 2400,
    },
    {
      name: 'Nov 20', uv: 489918, pv: 2400, amt: 2400,
    },
    {
      name: 'Dec 20', uv: 676273, pv: 1398, amt: 2210,
    },
    {
      name: 'Jan 21', uv: 699028, pv: 9800, amt: 2290,
    },
    {
      name: 'Feb 21', uv: 501829, pv: 3908, amt: 2000,
    },
    {
      name: 'Mar 21', uv: 719028, pv: 4800, amt: 2181,
    },
    {
      name: 'Apr 21', uv: 551023, pv: 3800, amt: 2500,
    },
    {
      name: 'May 21', uv: 700001, pv: 4300, amt: 2100,
    },
    {
      name: 'May 20', uv: 422536, pv: 2400, amt: 2400,
    },
    {
      name: 'Jun 20', uv: 225246, pv: 2400, amt: 2400,
    },
    {
      name: 'Jul 20', uv: 745265, pv: 2400, amt: 2400,
    },
    {
      name: 'Aug 20', uv: 664756, pv: 2400, amt: 2400,
    },
    {
      name: 'Sep 20', uv: 867854, pv: 2400, amt: 2400,
    },
    {
      name: 'Nov 20', uv: 689918, pv: 2400, amt: 2400,
    },
    {
      name: 'Dec 20', uv: 676273, pv: 1398, amt: 2210,
    },
    {
      name: 'Jan 21', uv: 699028, pv: 9800, amt: 2290,
    },
    {
      name: 'Feb 21', uv: 501829, pv: 3908, amt: 2000,
    },
    {
      name: 'Mar 21', uv: 719028, pv: 4800, amt: 2181,
    },
    {
      name: 'Apr 21', uv: 981023, pv: 3800, amt: 2500,
    },
    {
      name: 'May 21', uv: 100001, pv: 4300, amt: 2100,
    },
    {
      name: 'May 20', uv: 422536, pv: 2400, amt: 2400,
    },
    {
      name: 'Jun 20', uv: 225246, pv: 2400, amt: 2400,
    },
    {
      name: 'Jul 20', uv: 345265, pv: 2400, amt: 2400,
    },
    {
      name: 'Aug 20', uv: 364756, pv: 2400, amt: 2400,
    },
    {
      name: 'Sep 20', uv: 367854, pv: 2400, amt: 2400,
    },
    {
      name: 'Nov 20', uv: 689918, pv: 2400, amt: 2400,
    },
    {
      name: 'Dec 20', uv: 576273, pv: 1398, amt: 2210,
    },
    {
      name: 'Jan 21', uv: 699028, pv: 9800, amt: 2290,
    },
    {
      name: 'Feb 21', uv: 501829, pv: 3908, amt: 2000,
    },
    {
      name: 'Mar 21', uv: 619028, pv: 4800, amt: 2181,
    },
    {
      name: 'Apr 21', uv: 981023, pv: 3800, amt: 2500,
    },
    {
      name: 'May 21', uv: 1000001, pv: 4300, amt: 2100,
    },
    {
      name: 'May 20', uv: 422536, pv: 2400, amt: 2400,
    },
    {
      name: 'Jun 20', uv: 725246, pv: 2400, amt: 2400,
    },
    {
      name: 'Jul 20', uv: 345265, pv: 2400, amt: 2400,
    },
    {
      name: 'Aug 20', uv: 364756, pv: 2400, amt: 2400,
    },
    {
      name: 'Sep 20', uv: 367854, pv: 2400, amt: 2400,
    },
    {
      name: 'Nov 20', uv: 489918, pv: 2400, amt: 2400,
    },
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
                <h1>NASDAQ:AMZN</h1>
                <h2>$3,728.33</h2>
            </div>
            <div class="changeBox">
            +4.15% 24H
            <br />
            +12.08% 7D
            <br />
            +22.08% 1M
            </div>
            <hr />
            <div style={{ width: '100%', height: 500, marginTop: 50 }}>
              <ResponsiveContainer width="100%">
                <LineChart
                width={600}
                height={300}
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
        </div>
    )
}