import React, { useEffect, useState } from "react";
import axios from "axios";

function LiabilityOverview(id) {
  const [liability, setLiability] = useState([]);

  const getLiability = async () => {
    const res = await axios.get(`http://127.0.0.1:5000/get-liability/` + id.id);
    setLiability(res.data || []);
  };

  useEffect(() => getLiability(), []);

  const formatLiabilityType = (type) => {
    if (type == "credit-card") {
      return "Credit Card";
    } else if (type == "main-residence-mortgage") {
      return "Main Residence Mortgage";
    } else if (type == "commercial-mortgage") {
      return "Commercial Mortgage";
    } else if (type == "buy-to-let-mortgage") {
      return "Buy-to-let Mortgage";
    } else if (type == "holiday-home-mortgage") {
      return "Holiday Home Mortgage";
    } else if (type == "second-residence-mortgage") {
      return "Second Residence Mortgage";
    } else if (type == "personal-loan") {
      return "Personal Loan";
    } else if (type == "miscellaneous") {
      return "Miscellaneous";
    }
  };

  const formatLiabilityCategory = (category) => {
    if (category == "secured") {
      return "Secured";
    } else if (category == "unsecured") {
      return "Unsecured";
    }
  };

  function currencyFormat(num) {
    try {
      return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    } catch (e) {
      console.log(e);
    }
  }

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
          <h3>{formatLiabilityType(liability.liability_type)}</h3>
          <hr />
          <h4>{formatLiabilityCategory(liability.category)}</h4>
          <h4>{currencyFormat(parseFloat(liability.amount_borrowed))}</h4>
          <h4>{currencyFormat(parseFloat(liability.amount_outstanding))}</h4>
        </div>
      </div>
    </div>
  );
}

export default LiabilityOverview;
