import React, { Component, useEffect, useState } from "react";
import Header from "./components/Header";
import axios from "axios";
import CurrencyFormat from "react-currency-format";

function AssetOverviewProperty() {

  const [property, setProperty] = useState([]);

  const getProperty = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-property/` +
      window.location.pathname.split("/")[4]
    );
    setProperty(res.data || [])
  };

  useEffect(() => getProperty(), []);

  return (
    <div>
      <Header
        title={"assets"}
        viewingId={window.location.pathname.split("/")[2]}
      />
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
          <h1>{property.address}</h1>
          <hr />
          <h3>{property.property_type}</h3>
          Value:
          <CurrencyFormat
            value={property.value}
            displayType={"text"}
            thousandSeparator={true}
            prefix={" £"}
            decimalScale="2"
            fixedDecimalScale="true"
          />
          <br />
          Cost:
          <CurrencyFormat
            value={property.cost}
            displayType={"text"}
            thousandSeparator={true}
            prefix={" £"}
            decimalScale="2"
            fixedDecimalScale="true"
          />
        </div>
      </div>
    </div>
  );
}

export default AssetOverviewProperty;
