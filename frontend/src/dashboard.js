import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import { currencyFormat } from "./components/GlobalFunctions";
import { Chart } from "react-google-charts";

function Dashboard() {
  const [client, setClient] = useState([]);
  const [networth, setNetworth] = useState([]);
  const [investmentTotal, setInvestmentTotal] = useState([]);
  const [propertyTotal, setPropertyTotal] = useState([]);
  const [lifestyleTotal, setLifestyleTotal] = useState([]);
  const [liabilityTotal, setLiabilityTotal] = useState([]);

  const getNetworth = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-networth/` +
        window.location.pathname.split("/")[2]
    );
    setNetworth(res.data.networth || []);
    setInvestmentTotal(
      res.data.total_sole_investments + res.data.total_joint_investments || []
    );
    setPropertyTotal(
      res.data.total_sole_properties + res.data.total_joint_properties || []
    );
    setLifestyleTotal(
      res.data.total_sole_lifestyle_assets +
        res.data.total_joint_lifestyle_assets || []
    );
    setLiabilityTotal(
      res.data.total_sole_liabilities + res.data.total_joint_liabilities || []
    );
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
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => getClient(), []);

  const options = {
    legend: "none",
  };

  const summaryData = [
    ["Category", "Value"],
    ["Investments", parseFloat(investmentTotal)],
    ["Properties", parseFloat(propertyTotal)],
    ["Lifestyle Assets", parseFloat(lifestyleTotal)],
    ["Liabilities", parseFloat(-liabilityTotal)],
  ];

  return (
    <div>
      <Header
        title={"dashboard"}
        viewingId={window.location.pathname.split("/")[2]}
      />
      <br />
      <br />
      <div>
        <div class="row">
          <div class="column">
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
            <div class="summaryCardOuter">
              <h1>{currencyFormat(parseFloat(networth))}</h1>
              <div class="textRight">
                <p>NET WORTH</p>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="columnChart">
            <div style={{ width: "100%", height: 500, marginBottom: "40px" }}>
              <Chart
                chartType="ColumnChart"
                width="100%"
                height="800px"
                data={summaryData}
                options={options}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
