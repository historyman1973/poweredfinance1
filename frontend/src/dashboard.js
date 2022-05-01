import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Header from "./components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import { currencyFormat } from "./components/GlobalFunctions";

const data = [
  {
    name: "May 20",
    uv: 422536,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Jun 20",
    uv: 225246,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Jul 20",
    uv: 345265,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Aug 20",
    uv: 364756,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Sep 20",
    uv: 367854,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Nov 20",
    uv: 489918,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Dec 20",
    uv: 676273,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Jan 21",
    uv: 699028,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Feb 21",
    uv: 501829,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Mar 21",
    uv: 719028,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Apr 21",
    uv: 981023,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "May 21",
    uv: 1000001,
    pv: 4300,
    amt: 2100,
  },
];

function Dashboard() {
  const [client, setClient] = useState([]);
  const [networth, setNetworth] = useState([]);

  const getNetworth = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-networth/` +
        window.location.pathname.split("/")[2]
    );
    setNetworth(res.data.networth || []);
  };

  useEffect(() => getNetworth(), []);

  const getClient = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/get-client/` +
          window.location.pathname.split("/")[2]
      );
      setClient(res.data || []);
      // setLoading(false);
      console.log(client);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => getClient(), []);

  return (
    <div>
      <Header
        title={"dashboard"}
        viewingId={window.location.pathname.split("/")[2]}
      />
      <br />
      <br />
      <div class="main-container">
        <div class="row">
          <div class="column">
            {" "}
            <div style={{ textAlign: "left", marginLeft: "5%" }}>
              <h1>Dashboard</h1>
              <div style={{ marginTop: "10px" }}>
                <h5>
                  Client ID: {client.id}
                  <br />
                  {client.forename} {client.middle_names} {client.surname}
                </h5>
              </div>
            </div>
          </div>
          <div class="column">
            {" "}
            <div class="summaryCardOuter">
              <h1>{currencyFormat(parseFloat(networth))}</h1>
              <p>NET WORTH</p>
            </div>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="columnChart">
            <div style={{ width: "100%", height: 500, marginTop: "20px" }}>
              <ResponsiveContainer width="100%">
                <AreaChart
                  width={500}
                  height={400}
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
