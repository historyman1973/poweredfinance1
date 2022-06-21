import React, { useEffect, useState } from "react";
import axios from "axios";
import CurrencyFormat from "react-currency-format";

function AssetOverviewOther(id) {
  const [otherAsset, setOtherAsset] = useState([]);

  useEffect(() => {
    const getOtherAsset = async (id) => {
      const res = await axios.get(
        `http://127.0.0.1:5000/get-otherasset/` + id.id
      );
      setOtherAsset(res.data || []);
      console.log(res.data);
    };
    getOtherAsset(id);
  }, []);

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
          <h1>{otherAsset.description}</h1>
        </div>
        <hr />
        <div style={{ textAlign: "center", marginTop: "5px" }}>
          <h3>{otherAsset.asset_type}</h3>
        </div>
        <h4>
          <div style={{ marginTop: "30px", textAlign: "center" }}>
            Value:
            <CurrencyFormat
              value={otherAsset.value}
              displayType={"text"}
              thousandSeparator={true}
              prefix={" £"}
              decimalScale="2"
              fixedDecimalScale="true"
            />
          </div>
        </h4>
      </div>
    </div>
  );
}

export default AssetOverviewOther;
