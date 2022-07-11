import React, { useEffect, useState } from "react";
import axios from "axios";
import TransactionTable from "./components/TransactionTable";
import { Button, Divider, Stack } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { ThemeProvider } from "@mui/styles";
import AddTransactionForm from "./components/AddTransactionForm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TransactionOverview(holdingId) {
  const [transactions, setTransactions] = useState([]);
  const handleAddTransactionOpen = () => setOpen(true);
  const handleAddTransactionClose = () => setOpen(false);
  const [open, setOpen] = React.useState(false);
  const [allInstruments, setAllInstruments] = useState([]);

  const getTransactions = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-transactions/holding/` + holdingId.holdingId
    );
    setTransactions(res.data || []);
    console.log(res.data);
  };

  const getAllInstruments = async () => {
    const res = await axios.get(`http://127.0.0.1:5000/get-all-instruments`);
    setAllInstruments(res.data || []);
  };

  useEffect(() => getTransactions(), []);
  useEffect(() => getAllInstruments(), []);

  return (
    <div>
      <div
        style={{
          height: "auto",
          marginLeft: "10%",
          marginRight: "10%",
          marginTop: 20,
          padding: 5,
        }}
      >
        <div
          class="row"
          style={{ float: "right", marginRight: "5px", marginTop: "20px" }}
        >
          <Stack
            spacing={2}
            direction="row"
            divider={
              <Divider orientation="vertical" flexItem alignItems="right" />
            }
          >
            <Button
              onClick={handleAddTransactionOpen}
              variant="outlined"
              size="large"
            >
              Add transaction
            </Button>
          </Stack>
        </div>
        <Dialog
          open={open}
          onClose={handleAddTransactionClose}
          TransitionComponent={Transition}
          PaperProps={{
            style: { borderRadius: 10 },
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
                  Add transaction
                </Typography>
                <Button
                  autoFocus
                  color="inherit"
                  onClick={handleAddTransactionClose}
                >
                  Close
                </Button>
              </Toolbar>
            </AppBar>
          </ThemeProvider>
          <div
            style={{
              height: "auto",
              width: "500px",
              marginLeft: "20px",
              marginTop: "20px",
            }}
          >
            <AddTransactionForm allInstruments={allInstruments} />
          </div>
        </Dialog>
        <div
          class="row"
          style={{
            width: "100%",
            justifyContent: "center",
            float: "center",
            margin: "auto",
          }}
        >
          <TransactionTable transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

export default TransactionOverview;
