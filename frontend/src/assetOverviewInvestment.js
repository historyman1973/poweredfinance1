import React, { Component, useEffect, useState } from "react";
import Header from "./components/Header";
import axios from "axios";
import CurrencyFormat from "react-currency-format";

function AssetOverviewInvestment(id) {
  const [investment, setInvestment] = useState([]);

  const getInvestment = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-investment/` + id.id
    );
    setInvestment(res.data || []);
  };

  useEffect(() => getInvestment(), []);

  return (
    <div>
      <div
        class="main-container"
        style={{ width: "80%", margin: "auto", marginTop: 25 }}
      >
        <div
          style={{
            height: "auto",
            marginLeft: "10%",
            marginRight: "10%",
            marginTop: 20,
            padding: 5,
          }}
        >
          <h1>{investment.provider}</h1>
          <hr />
          <h3>{investment.investment_type}</h3>
          {investment.investment_ref}
          <br />
          [grid with holdings - transactions/securitydrilldown]
        </div>
      </div>
    </div>
  );
}

export default AssetOverviewInvestment;
