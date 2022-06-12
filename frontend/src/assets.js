import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button, Paper } from "@mui/material";
import { styled } from "@mui/system";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import AddAssetForm from "./components/AddAssetForm";
import axios from "axios";
import { toast } from "react-toastify";
import AssetTable from "./components/AssetTable";
import { currencyFormat } from "./components/GlobalFunctions";
import { Chart } from "react-google-charts";

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  p: 2,
  px: 4,
  pb: 3,
  borderRadius: 5,
  position: "fixed",
  overflowY: "auto",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "40%",
  minWidth: 400,
  bgcolor: "#ffffff",
  boxShadow: 24,
  p: 4,
};

const chartData = [
  {
    name: "May 20",
    uv: 122536,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Jun 20",
    uv: 125246,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Jul 20",
    uv: 345265,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Aug 20",
    uv: 564756,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Sep 20",
    uv: 767854,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Nov 20",
    uv: 789918,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Dec 20",
    uv: 476273,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Jan 21",
    uv: 399028,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Feb 21",
    uv: 201829,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Mar 21",
    uv: 519028,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Apr 21",
    uv: 981023,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "May 21",
    uv: 1312674,
    pv: 4300,
    amt: 2100,
  },
];

function Assets() {
  const handleAddAssetOpen = () => setOpenAddAsset(true);
  const handleAddAssetClose = () => setOpenAddAsset(false);
  const [openAddAsset, setOpenAddAsset] = React.useState(false);

  const [client, setClient] = useState([]);

  const [properties, setProperties] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [lifestyleAssets, setLifestyleAssets] = useState([]);

  const [investmentTotal, setInvestmentTotal] = useState([]);
  const [propertyTotal, setPropertyTotal] = useState([]);
  const [lifestyleTotal, setLifestyleTotal] = useState([]);
  const [totalAssets, setTotalAssets] = useState([]);

  const getTotalAssets = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-networth/` +
        window.location.pathname.split("/")[2]
    );
    const totalAssets =
      res.data.total_joint_investments +
      res.data.total_joint_lifestyle_assets +
      res.data.total_joint_properties +
      res.data.total_sole_investments +
      res.data.total_sole_lifestyle_assets +
      res.data.total_sole_properties;
    setTotalAssets(totalAssets || []);
    setInvestmentTotal(
      res.data.total_sole_investments + res.data.total_joint_investments || []
    );
    setPropertyTotal(
      res.data.total_sole_properties + res.data.total_joint_properties || []
    );
    setLifestyleTotal(
      res.data.total_sole_lifestyle_assets +
        res.data.total_joint_lifestyle_assets || []
    );
  };

  const getProperties = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-properties/` +
        window.location.pathname.split("/")[2]
    );
    setProperties(res.data || []);
  };

  const getLifestyleAssets = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-lifestyle-assets/` +
        window.location.pathname.split("/")[2]
    );
    setLifestyleAssets(res.data || []);
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
    ["Lifestyle Assets", parseFloat(lifestyleTotal)],
  ];

  useEffect(() => getProperties(), []);
  useEffect(() => getInvestments(), []);
  useEffect(() => getLifestyleAssets(), []);
  useEffect(() => getTotalAssets(), []);

  const options = {
    legend: "none",
    chartArea: { width: "90%", height: "90%" },
    pieHole: 0.4,
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${currencyFormat(
            parseFloat(payload[0].value)
          )}`}</p>
        </div>
      );
    }

    return null;
  };

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
              Total investments over time
            </h5>
            <div class="columnChart">
              <div
                style={{
                  height: 500,
                  marginBottom: "40px",
                  marginLeft: "10%",
                  marginRight: "10%",
                  marginTop: "40px",
                }}
              >
                <ResponsiveContainer>
                  <LineChart
                    width={500}
                    height={400}
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={currencyFormat} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="uv"
                      stroke="#8884d8"
                      fill="#8884d8"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
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
          <StyledModal
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
            open={openAddAsset}
            onClose={handleAddAssetClose}
            BackdropComponent={Backdrop}
          >
            <Paper sx={style}>
              <AddAssetForm />
            </Paper>
          </StyledModal>
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
              lifestyleAssets={lifestyleAssets}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Assets;
