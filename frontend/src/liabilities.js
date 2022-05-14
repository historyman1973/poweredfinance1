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
    uv: 145265,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Aug 20",
    uv: 164756,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Sep 20",
    uv: 167854,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Nov 20",
    uv: 189918,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Dec 20",
    uv: 176273,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Jan 21",
    uv: 199028,
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
    uv: 219028,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Apr 21",
    uv: 281023,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "May 21",
    uv: 312673,
    pv: 4300,
    amt: 2100,
  },
];

function Liabilities() {
  const [client, setClient] = useState([]);
  const handleAddLiabilityOpen = () => setOpenAddLiability(true);
  const handleAddLiabilityClose = () => setOpenAddLiability(false);
  const [openAddLiability, setOpenAddLiability] = React.useState(false);
  const [liabilities, setLiabilities] = useState([]);
  const [totalLiabilities, setTotalLiabilities] = useState([]);

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

  useEffect(() => getLiabilities(), []);
  useEffect(() => getTotalLiabilities(), []);

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
        title={"liabilities"}
        viewingId={window.location.pathname.split("/")[2]}
      />
      <br />
      <br />
      <div>
        <div class="row">
          <div class="column">
            {" "}
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
            {" "}
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
          <div class="columnChart">
            <div style={{ width: "100%", height: 500 }}>
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
        <div style={{ height: "350px", margin: "50px" }}>
          <Button
            onClick={handleAddLiabilityOpen}
            variant="outlined"
            style={{ margin: 10, marginBottom: 20 }}
          >
            Add Liability
          </Button>
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
