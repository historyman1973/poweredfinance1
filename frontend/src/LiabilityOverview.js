import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  formatLiabilityCategory,
  formatLiabilityType,
  currencyFormat,
} from "./components/GlobalFunctions";

function LiabilityOverview(id) {
  const [liability, setLiability] = useState([]);

  const getLiability = async () => {
    const res = await axios.get(`http://127.0.0.1:5000/get-liability/` + id.id);
    setLiability(res.data || []);
  };

  const returnPropertyID = (id) => {
    if (id == null) {
      return "None";
    } else {
      return id;
    }
  };

  useEffect(() => getLiability(), []);

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
          <h1>{liability.description}</h1>
        </div>
        <hr />
        <div style={{ textAlign: "center", marginTop: "5px" }}>
          <h3>
            {formatLiabilityType(liability.liability_type) +
              " (" +
              formatLiabilityCategory(liability.category) +
              ")"}
          </h3>
        </div>
        <h4>
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            Amount outstanding:{" "}
            {currencyFormat(parseFloat(liability.amount_outstanding))}
          </div>
        </h4>
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <h5>
            Amount borrowed:{" "}
            {currencyFormat(parseFloat(liability.amount_borrowed))}
          </h5>
          <h5>Linked property ID: {returnPropertyID(liability.property_id)}</h5>
        </div>
      </div>
    </div>
  );
}

export default LiabilityOverview;
