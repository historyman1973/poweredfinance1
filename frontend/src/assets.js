import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import {
  AreaChart,
  Area,
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

  useEffect(() => getProperties(), []);
  useEffect(() => getInvestments(), []);
  useEffect(() => getLifestyleAssets(), []);

  const getClient = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/get-client/` +
          window.location.pathname.split("/")[2]
      );
      setClient(res.data || []);
      // setLoading(false);
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
      <div class="main-container">
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
        <div class="row">
          <div class="columnChart">
            <div style={{ width: "100%", height: 500 }}>
              <ResponsiveContainer>
                <AreaChart
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
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div class="columnSummary">
            <div class="summaryCardOuter">
              <h1>1,312,674 GBP</h1>
              <p>TOTAL ASSETS</p>
              <div class="summaryCardInner">
                <h3>(+28%) 51,999 GBP</h3>
                <p>30-DAY PERFORMANCE</p>
                <h3>(+314%) 810,011 GBP</h3>
                <p>120-DAY PERFORMANCE</p>
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: "350px", margin: "50px" }}>
          <Button
            onClick={handleAddAssetOpen}
            variant="outlined"
            style={{ margin: 10, marginBottom: 20 }}
          >
            Add Asset
          </Button>
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
          <AssetTable
            class="padding-left-right"
            properties={properties}
            investments={investments}
            lifestyleAssets={lifestyleAssets}
          />
        </div>
      </div>
    </div>
  );
}

export default Assets;
