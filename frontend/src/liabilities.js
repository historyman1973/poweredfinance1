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
import axios from "axios";
import { toast } from "react-toastify";
import LiabilityTable from "./components/LiabilityTable";
import { Button, Paper } from "@mui/material";
import { styled } from "@mui/system";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import AddLiabilityForm from "./components/AddLiabilityForm";
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

function Liabilities() {
  const [client, setClient] = useState([]);
  const handleAddLiabilityOpen = () => setOpenAddLiability(true);
  const handleAddLiabilityClose = () => setOpenAddLiability(false);
  const [openAddLiability, setOpenAddLiability] = React.useState(false);
  const [liabilities, setLiabilities] = useState([]);
  const [totalLiabilities, setTotalLiabilities] = useState([]);
  const [totalLiabilitiesComp, setTotalLiabilitiesComp] = useState([]);

  const barData = [["Description", "Outstanding"]];

  const getTotalLiabilities = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-networth/` +
        window.location.pathname.split("/")[2]
    );
    const totalLiabilities =
      res.data.total_joint_liabilities + res.data.total_sole_liabilities;
    setTotalLiabilities(totalLiabilities || []);
  };

  const getLiabilities = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-liabilities/` +
        window.location.pathname.split("/")[2]
    );
    setLiabilities(res.data || []);
  };

  const getLiabilityComp = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-networth/` +
        window.location.pathname.split("/")[2]
    );
    const totalLiabilities =
      res.data.total_joint_liabilities + res.data.total_sole_liabilities;
    setTotalLiabilitiesComp(totalLiabilities || []);
  };

  useEffect(() => getLiabilities(), []);
  useEffect(() => getTotalLiabilities(), []);
  useEffect(() => getLiabilityComp(), []);

  {
    liabilities.map((liability) =>
      barData.push([
        liability.description,
        parseFloat(liability.amount_outstanding),
      ])
    );
  }

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

  const options = {
    legend: "none",
    chartArea: { width: "80%", height: "80%" },
    pieHole: 0.4,
  };

  const liabilityComp = [
    ["Category", "Value"],
    ["Liabilities", parseFloat(totalLiabilitiesComp)],
  ];

  return (
    <div>
      <Header
        title={"liabilities"}
        viewingId={window.location.pathname.split("/")[2]}
      />
      <br />
      <br />
      <div>
        <div class="row">
          <div class="column">
            <div style={{ textAlign: "left", marginLeft: "5%" }}>
              <h1>Liabilities</h1>
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
              <h1>{currencyFormat(parseFloat(totalLiabilities))}</h1>
              <div class="textRight">
                <p>TOTAL LIABILITIES</p>
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
              Liability categories
            </h5>
            <div style={{ marginTop: "20px" }}>
              <Chart
                chartType="PieChart"
                width="100%"
                height="500px"
                data={liabilityComp}
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
              All liabilities
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
          <StyledModal
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
            open={openAddLiability}
            onClose={handleAddLiabilityClose}
            BackdropComponent={Backdrop}
          >
            <Paper sx={style}>
              <AddLiabilityForm />
            </Paper>
          </StyledModal>
          <div class="paddingBottom">
            <div class="row" style={{ marginTop: "20px", marginLeft: "50px" }}>
              <div class="column">
                <h3>List of liabilities</h3>
              </div>
              <div class="column">
                <Button
                  onClick={handleAddLiabilityOpen}
                  style={{ float: "right", marginRight: 80 }}
                  size="large"
                >
                  Add Liability
                </Button>
              </div>
            </div>
            <LiabilityTable
              class="padding-left-right"
              liabilities={liabilities}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Liabilities;
