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
  const [otherTotal, setOtherTotal] = useState([]);
  const [mortgageTotal, setMortgageTotal] = useState([]);
  const [creditCardTotal, setCreditCardTotal] = useState([]);
  const [loanTotal, setLoanTotal] = useState([]);
  const [miscLiabilityTotal, setMiscLiabilityTotal] = useState([]);

  const [properties, setProperties] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [otherAssets, setOtherAssets] = useState([]);
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
    setOtherTotal(
      res.data.total_sole_otherassets + res.data.total_joint_otherassets || []
    );
    setMortgageTotal(
      (res.data.liability_breakdown.buy_to_let_mortgage || 0) +
        (res.data.liability_breakdown.main_residence_mortgage || 0) +
        (res.data.liability_breakdown.commercial_mortgage || 0) +
        (res.data.liability_breakdown.holiday_home_mortgage || 0) +
        (res.data.liability_breakdown.second_residence_mortgage || 0) || []
    );
    setCreditCardTotal(res.data.liability_breakdown.credit_card || 0);
    setLoanTotal(res.data.liability_breakdown.personal_loan || 0);
    setMiscLiabilityTotal(res.data.liability_breakdown.miscellaneous || 0);
  };

  const getAssetsLiabilities = async () => {
    const properties = await axios.get(
      `http://127.0.0.1:5000/get-properties/` +
        window.location.pathname.split("/")[2]
    );
    const otherAssets = await axios.get(
      `http://127.0.0.1:5000/get-otherassets/` +
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
    setOtherAssets(otherAssets.data);
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
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => getClient(), []);

  const options = {
    legend: "none",
    chartArea: { width: "80%", height: "80%" },
    pieHole: 0.4,
    colors: ["ffa6ff", "ff54ff", "ff00ff", "ba00ba", "730073"],
  };

  const summaryData = [
    ["Category", "Value"],
    ["Investments", parseFloat(investmentTotal)],
    ["Properties", parseFloat(propertyTotal)],
    ["Other Assets", parseFloat(otherTotal)],
    ["Liabilities", parseFloat(-mortgageTotal)],
  ];

  const assetComp = [
    ["Category", "Value"],
    ["Investments", parseFloat(investmentTotal)],
    ["Properties", parseFloat(propertyTotal)],
    ["Other Assets", parseFloat(otherTotal)],
  ];

  const liabilityComp = [
    ["Category", "Value"],
    ["Mortgages", parseFloat(mortgageTotal)],
    ["Personal loans", parseFloat(loanTotal)],
    ["Credit cards", parseFloat(creditCardTotal)],
    ["Miscellaneous", parseFloat(miscLiabilityTotal)],
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
                Asset categories
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
                Liability categories
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
          style={{
            marginTop: "6%",
            marginLeft: "10%",
            marginRight: "10%",
            justifyContent: "center",
          }}
        >
          <hr />
          <h5
            style={{
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            Assets and Liabilities
          </h5>
          <AssetLiabilityTable
            properties={properties}
            investments={investments}
            otherAssets={otherAssets}
            liabilities={liabilities}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
