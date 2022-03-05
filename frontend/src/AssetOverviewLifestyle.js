import React, { useEffect, useState } from "react";
import axios from "axios";

function AssetOverviewLifestyle(id) {
  const [lifestyleAsset, setLifestyleAsset] = useState([]);

  const getLifestyleAsset = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-lifestyle-asset/` + id.id
    );
    setLifestyleAsset(res.data || []);
  };

  useEffect(() => getLifestyleAsset(), []);

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
          <h1>{lifestyleAsset.description}</h1>
          <hr />
          <h3>{lifestyleAsset.value}</h3>
          <h3>{lifestyleAsset.asset_type}</h3>
        </div>
      </div>
    </div>
  );
}

export default AssetOverviewLifestyle;
