import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import LiabilityTable from "./components/LiabilityTable";
import { Button } from "@mui/material";
import AddLiabilityForm from "./components/AddLiabilityForm";
import { currencyFormat } from "./components/GlobalFunctions";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { ThemeProvider } from "@mui/styles";
import { Chart } from "react-google-charts";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Liabilities() {
  const [client, setClient] = useState([]);
  const handleAddLiabilityOpen = () => setOpenAddLiability(true);
  const handleAddLiabilityClose = () => setOpenAddLiability(false);
  const [openAddLiability, setOpenAddLiability] = React.useState(false);
  const [liabilities, setLiabilities] = useState([]);
  const [totalLiabilities, setTotalLiabilities] = useState([]);
  const [mortgageTotal, setMortgageTotal] = useState([]);
  const [creditCardTotal, setCreditCardTotal] = useState([]);
  const [loanTotal, setLoanTotal] = useState([]);
  const [miscLiabilityTotal, setMiscLiabilityTotal] = useState([]);

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
    setMortgageTotal(
      (res.data.liability_breakdown.buy_to_let_mortgage || 0) +
        (res.data.liability_breakdown.main_residence_mortgage || 0) +
        (res.data.liability_breakdown.commercial_mortgage || 0) +
        (res.data.liability_breakdown.holiday_home_mortgage || 0) +
        (res.data.liability_breakdown.second_residence_mortgage || 0) || []
    );
    setCreditCardTotal(res.data.liability_breakdown.credit_card || 0);
    setLoanTotal(res.data.liability_breakdown.personal_loan || 0);
    setMiscLiabilityTotal(res.data.liability_breakdown.miscellaneous || 0);
  };

  useEffect(() => getLiabilities(), []);
  useEffect(() => getTotalLiabilities(), []);
  useEffect(() => getLiabilityComp(), []);

  liabilities.map((liability) =>
    barData.push([
      liability.description,
      parseFloat(liability.amount_outstanding),
    ])
  );

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
    colors: ["ffa6ff", "ff54ff", "ff00ff", "ba00ba", "730073"],
  };

  const liabilityComp = [
    ["Category", "Value"],
    ["Mortgages", parseFloat(mortgageTotal)],
    ["Personal loans", parseFloat(loanTotal)],
    ["Credit cards", parseFloat(creditCardTotal)],
    ["Miscellaneous", parseFloat(miscLiabilityTotal)],
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
          <Dialog
            open={openAddLiability}
            onClose={handleAddLiabilityClose}
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
                    Add liability
                  </Typography>
                  <Button
                    autoFocus
                    color="inherit"
                    onClick={handleAddLiabilityClose}
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
              <AddLiabilityForm />
            </div>
          </Dialog>
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
