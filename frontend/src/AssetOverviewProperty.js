import React, { useEffect, useState } from "react";
import axios from "axios";
import CurrencyFormat from "react-currency-format";
import Chart from "react-google-charts";

function AssetOverviewProperty(id) {
  const [property, setProperty] = useState([]);

  const getProperty = async () => {
    const res = await axios.get(`http://127.0.0.1:5000/get-property/` + id.id);
    setProperty(res.data || []);
  };

  useEffect(() => getProperty(), []);

  const getReadableType = (type) => {
    if (type === "main-residence") {
      return "Main residence";
    } else if (type === "buy-to-let") {
      return "Buy to let";
    } else if (type === "holiday-home") {
      return "Holiday home";
    } else if (type === "commercial") {
      return "Commercial";
    } else if (type === "second-residence") {
      return "Second residence";
    }
  };

  const barData = [["A", "Amount"]];
  barData.push(["Cost", parseFloat(property.cost)]);
  barData.push(["Value", parseFloat(property.value)]);

  const options = {
    legend: "none",
    chartArea: { width: "90%", height: "90%" },
    pieHole: 0.4,
    colors: ["ffa6ff", "ff54ff", "ff00ff", "ba00ba", "730073"],
  };

  const returnValueChange = (change) => {
    if (change >= 0) {
      return (
        <CurrencyFormat
          value={change}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"(+£"}
          suffix={")"}
          decimalScale="2"
          fixedDecimalScale="true"
        />
      );
    } else {
      return (
        <CurrencyFormat
          value={-change}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"(-£"}
          suffix={")"}
          decimalScale="2"
          fixedDecimalScale="true"
        />
      );
    }
  };

  return (
    <div>
      <div
        style={{
          height: "auto",
          marginLeft: "10%",
          marginRight: "10%",
          marginTop: 20,
          padding: 5,
        }}
      >
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <h1>{property.address}</h1>
        </div>
        <hr />
        <div style={{ textAlign: "center", marginTop: "5px" }}>
          <h3>{getReadableType(property.property_type)}</h3>
        </div>
        <h4>
          <div style={{ marginTop: "30px", textAlign: "center" }}>
            Value:
            <CurrencyFormat
              value={property.value}
              displayType={"text"}
              thousandSeparator={true}
              prefix={" £"}
              decimalScale="2"
              fixedDecimalScale="true"
            />{" "}
            {returnValueChange(property.value - property.cost)}
          </div>
        </h4>
        <div style={{ marginTop: "20px" }}>
          <Chart
            chartType="BarChart"
            width="100%"
            height="400px"
            data={barData}
            options={options}
          />
        </div>
      </div>
    </div>
  );
}

export default AssetOverviewProperty;
