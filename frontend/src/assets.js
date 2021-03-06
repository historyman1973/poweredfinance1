import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import { Button } from "@mui/material";
import AddAssetForm from "./components/AddAssetForm";
import axios from "axios";
import { toast } from "react-toastify";
import AssetTable from "./components/AssetTable";
import { currencyFormat } from "./components/GlobalFunctions";
import { Chart } from "react-google-charts";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { ThemeProvider } from "@mui/styles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Assets() {
  const handleAddAssetOpen = () => setOpenAddAsset(true);
  const handleAddAssetClose = () => setOpenAddAsset(false);
  const [openAddAsset, setOpenAddAsset] = React.useState(false);

  const [client, setClient] = useState([]);

  const [properties, setProperties] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [otherAssets, setOtherAssets] = useState([]);

  const [investmentTotal, setInvestmentTotal] = useState([]);
  const [propertyTotal, setPropertyTotal] = useState([]);
  const [otherTotal, setOtherTotal] = useState([]);
  const [totalAssets, setTotalAssets] = useState([]);

  const barData = [["Description", "Value"]];

  properties.map((property) =>
    barData.push([property.address, parseFloat(property.value)])
  );

  investments.map((investment) =>
    barData.push([investment.provider, parseFloat(investment.current_value)])
  );

  otherAssets.map((otherAsset) =>
    barData.push([otherAsset.description, parseFloat(otherAsset.value)])
  );

  const getTotalAssets = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-networth/` +
        window.location.pathname.split("/")[2]
    );
    const totalAssets =
      res.data.total_joint_investments +
      res.data.total_joint_otherassets +
      res.data.total_joint_properties +
      res.data.total_sole_investments +
      res.data.total_sole_otherassets +
      res.data.total_sole_properties;
    setTotalAssets(totalAssets || []);
    setInvestmentTotal(
      res.data.total_sole_investments + res.data.total_joint_investments || []
    );
    setPropertyTotal(
      res.data.total_sole_properties + res.data.total_joint_properties || []
    );
    setOtherTotal(
      res.data.total_sole_otherassets + res.data.total_joint_otherassets || []
    );
  };

  const getProperties = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-properties/` +
        window.location.pathname.split("/")[2]
    );
    setProperties(res.data || []);
  };

  const getOtherAssets = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-otherassets/` +
        window.location.pathname.split("/")[2]
    );
    setOtherAssets(res.data || []);
  };

  const getInvestments = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-investments/` +
        window.location.pathname.split("/")[2]
    );
    setInvestments(res.data || []);
  };

  const assetComp = [
    ["Category", "Value"],
    ["Investments", parseFloat(investmentTotal)],
    ["Properties", parseFloat(propertyTotal)],
    ["Other Assets", parseFloat(otherTotal)],
  ];

  useEffect(() => getProperties(), []);
  useEffect(() => getInvestments(), []);
  useEffect(() => getOtherAssets(), []);
  useEffect(() => getTotalAssets(), []);

  const options = {
    legend: "none",
    chartArea: { width: "90%", height: "90%" },
    pieHole: 0.4,
    colors: ["ffa6ff", "ff54ff", "ff00ff", "ba00ba", "730073"],
  };

  const getClient = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/get-client/` +
          window.location.pathname.split("/")[2]
      );
      setClient(res.data || []);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => getClient(), []);

  return (
    <div>
      <Header
        title={"assets"}
        viewingId={window.location.pathname.split("/")[2]}
      />
      <br />
      <br />
      <div>
        <div class="row">
          <div class="column">
            <div style={{ textAlign: "left", marginLeft: "5%" }}>
              <h1>Assets</h1>
              <div style={{ marginTop: "10px" }}>
                <h5>
                  Client ID: {client.id}
                  <br />
                  {client.forename} {client.middle_names} {client.surname}
                </h5>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="summaryCardOuter">
              <h1>{currencyFormat(parseFloat(totalAssets))}</h1>
              <div class="textRight">
                <p>TOTAL ASSETS</p>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-md-6">
            <h5
              style={{
                textAlign: "center",
                marginTop: "60px",
              }}
            >
              Asset categories
            </h5>
            <div style={{ marginTop: "20px" }}>
              <Chart
                chartType="PieChart"
                width="100%"
                height="500px"
                data={assetComp}
                options={options}
              />
            </div>
          </div>
          <div class="col-md-6">
            <h5
              style={{
                textAlign: "center",
                marginTop: "60px",
              }}
            >
              All assets
            </h5>
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
        <hr />
        <div
          style={{
            height: "350px",
            marginTop: "20px",
            display: "grid",
          }}
        >
          <Dialog
            open={openAddAsset}
            onClose={handleAddAssetClose}
            TransitionComponent={Transition}
            PaperProps={{
              style: { borderRadius: 15 },
            }}
          >
            <ThemeProvider>
              <AppBar
                sx={{ position: "relative" }}
                style={{ background: "#ff00ff" }}
              >
                <Toolbar variant="dense">
                  <Typography
                    sx={{ ml: 3, flex: 1 }}
                    variant="h6"
                    component="div"
                  >
                    Add asset
                  </Typography>
                  <Button
                    autoFocus
                    color="inherit"
                    onClick={handleAddAssetClose}
                  >
                    Close
                  </Button>
                </Toolbar>
              </AppBar>
            </ThemeProvider>
            <div
              style={{
                margin: "20px",
                marginLeft: "80px",
                marginRight: "80px",
              }}
            >
              <AddAssetForm />
            </div>
          </Dialog>
          <div class="paddingBottom">
            <div class="row" style={{ marginTop: "20px", marginLeft: "50px" }}>
              <div class="column">
                <h3>List of assets</h3>
              </div>
              <div class="column">
                <Button
                  onClick={handleAddAssetOpen}
                  style={{ float: "right", marginRight: 80 }}
                  size="large"
                >
                  Add Asset
                </Button>
              </div>
            </div>
            <AssetTable
              class="padding-left-right"
              properties={properties}
              investments={investments}
              otherAssets={otherAssets}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Assets;
