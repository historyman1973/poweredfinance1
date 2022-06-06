import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import { currencyFormat } from "./components/GlobalFunctions";
import { Chart } from "react-google-charts";
import AssetLiabilityTable from "./components/AssetLiabilityTable";

function Dashboard() {
  const [client, setClient] = useState([]);
  const [networth, setNetworth] = useState([]);
  const [investmentTotal, setInvestmentTotal] = useState([]);
  const [propertyTotal, setPropertyTotal] = useState([]);
  const [lifestyleTotal, setLifestyleTotal] = useState([]);
  const [liabilityTotal, setLiabilityTotal] = useState([]);
  const [properties, setProperties] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [lifestyleAssets, setLifestyleAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);

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

  const getAssetsLiabilities = async () => {
    const properties = await axios.get(
      `http://127.0.0.1:5000/get-properties/` +
        window.location.pathname.split("/")[2]
    );
    const lifestyleAssets = await axios.get(
      `http://127.0.0.1:5000/get-lifestyle-assets/` +
        window.location.pathname.split("/")[2]
    );
    const investments = await axios.get(
      `http://127.0.0.1:5000/get-investments/` +
        window.location.pathname.split("/")[2]
    );
    const liabilities = await axios.get(
      `http://127.0.0.1:5000/get-liabilities/` +
        window.location.pathname.split("/")[2]
    );
    setProperties(properties.data);
    setLifestyleAssets(lifestyleAssets.data);
    setInvestments(investments.data);
    setLiabilities(liabilities.data);
  };

  useEffect(() => getNetworth(), []);
  useEffect(() => getAssetsLiabilities(), []);

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
    chartArea: { width: "80%", height: "80%" },
  };

  const summaryData = [
    ["Category", "Value"],
    ["Investments", parseFloat(investmentTotal)],
    ["Properties", parseFloat(propertyTotal)],
    ["Lifestyle Assets", parseFloat(lifestyleTotal)],
    ["Liabilities", parseFloat(-liabilityTotal)],
  ];

  const assetComp = [
    ["Category", "Value"],
    ["Investments", parseFloat(investmentTotal)],
    ["Properties", parseFloat(propertyTotal)],
    ["Lifestyle Assets", parseFloat(lifestyleTotal)],
  ];

  const liabilityComp = [
    ["Category", "Value"],
    ["Liabilities", parseFloat(liabilityTotal)],
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
        <div style={{ marginLeft: "10%", marginRight: "10%" }}>
          <div class="row">
            <div class="col-md-12">
              <h5
                style={{
                  textAlign: "center",
                  marginTop: "60px",
                }}
              >
                Asset and Liability types
              </h5>
              <div style={{ paddingTop: "0px" }}>
                <Chart
                  chartType="ColumnChart"
                  width="100%"
                  height="500px"
                  data={summaryData}
                  options={options}
                />
              </div>
            </div>
          </div>
          <div
            class="row"
            style={{ marginTop: "6%", marginLeft: "10%", marginRight: "10%" }}
          >
            <div class="col-md-6">
              <h5
                style={{
                  textAlign: "center",
                  marginTop: "60px",
                }}
              >
                Asset composition
              </h5>
              <Chart
                chartType="PieChart"
                width="100%"
                height="500px"
                data={assetComp}
                options={options}
              />
            </div>
            <div class="col-md-6">
              <h5
                style={{
                  textAlign: "center",
                  marginTop: "60px",
                }}
              >
                Liability composition
              </h5>
              <Chart
                chartType="PieChart"
                width="100%"
                height="500px"
                data={liabilityComp}
                options={options}
              />
            </div>
          </div>
        </div>
        <div
          class="row"
          style={{ marginTop: "6%", marginLeft: "10%", marginRight: "10%" }}
        >
          <h5
            style={{
              textAlign: "center",
            }}
          >
            Assets and Liabilities
          </h5>
          <AssetLiabilityTable
            properties={properties}
            investments={investments}
            lifestyleAssets={lifestyleAssets}
            liabilities={liabilities}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
