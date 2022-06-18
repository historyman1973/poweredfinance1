import React, { useEffect, useState } from "react";
import axios from "axios";

function AssetOverviewOther(id) {
  const [otherAsset, setOtherAsset] = useState([]);

  const getOtherAsset = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-otherasset/` + id.id
    );
    setOtherAsset(res.data || []);
  };

  useEffect(() => getOtherAsset(), []);

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
          <h1>{otherAsset.description}</h1>
          <hr />
          <h3>{otherAsset.value}</h3>
          <h3>{otherAsset.asset_type}</h3>
        </div>
      </div>
    </div>
  );
}

export default AssetOverviewOther;
