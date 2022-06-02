import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  formatLiabilityCategory,
  formatLiabilityType,
  currencyFormat,
} from "./GlobalFunctions";

function LiabilityOverview(id) {
  const [liability, setLiability] = useState([]);

  const getLiability = async () => {
    const res = await axios.get(`http://127.0.0.1:5000/get-liability/` + id.id);
    setLiability(res.data || []);
  };

  useEffect(() => getLiability(), []);

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
          <h3>{liability.description}</h3>
          <hr />
          <h3>{formatLiabilityType(liability.liability_type)}</h3>
          <h4>{formatLiabilityCategory(liability.category)}</h4>
          <h4>
            Amount borrowed:{" "}
            {currencyFormat(parseFloat(liability.amount_borrowed))}
          </h4>
          <h4>
            Amount outstanding:{" "}
            {currencyFormat(parseFloat(liability.amount_outstanding))}
          </h4>
          <hr />
          <h4>Linked property ID: {liability.property_id}</h4>
        </div>
      </div>
    </div>
  );
}

export default LiabilityOverview;
