import React, { useEffect, useState } from "react";
import axios from "axios";

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
          <h1>{liability.category}</h1>
          <hr />
          <h3>{liability.liability_type}</h3>
          <h3>{liability.amount_borrowed}</h3>
          <h3>{liability.amount_outstanding}</h3>
        </div>
      </div>
    </div>
  );
}

export default LiabilityOverview;
