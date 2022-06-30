import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import {
  AppBar,
  Dialog,
  Link,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import { currencyFormat } from "../components/GlobalFunctions";
import { Button } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import TransactionOverview from "../TransactionOverview";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function HoldingTable({ holdings }) {
  const [openViewTransactions, setOpenViewTransactions] = React.useState(false);
  const handleViewTransactionsClose = () => setOpenViewTransactions(false);
  const [holdingId, setHoldingId] = React.useState(false);

  const handleClick = (id) => {
    setHoldingId(id);
    setOpenViewTransactions(true);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "instrument_id", headerName: "Instrument ID", width: 100 },
    {
      field: "instrument_name",
      headerName: "Name",
      width: 250,
    },
    { field: "units", headerName: "Units", width: 130 },
    { field: "value", headerName: "Value", width: 180 },
    {
      field: "viewSecurity",
      headerName: "View Security",
      width: 150,
      renderCell: (params) => (
        <Link href={`/security/${params.value}`}>View Security</Link>
      ),
    },
    {
      field: "viewTransactions",
      headerName: "View Transactions",
      width: 150,
      renderCell: (params) => (
        <Button onClick={() => handleClick(params.row.id)}>
          View Transaction
        </Button>
      ),
    },
  ];

  const returnTable = () => {
    const rows = [];
    holdings.map((holding) =>
      rows.push({
        id: holding.holding_id,
        instrument_id: holding.instrument_id,
        instrument_name: holding.instrument_name,
        units: holding.current_units,
        value: currencyFormat(parseFloat(holding.current_value)),
        viewSecurity: holding.holding_ticker,
        viewTransactions: holding.holding_id,
      })
    );
    return <DataGrid rows={rows} columns={columns} disableColumnMenu />;
  };

  return (
    <div
      style={{
        height: "600px",
        width: "100%",
        margin: "50px",
        marginTop: "20px",
      }}
    >
      {returnTable()}
      <Dialog
        fullScreen
        open={openViewTransactions}
        onClose={handleViewTransactionsClose}
        TransitionComponent={Transition}
      >
        <ThemeProvider>
          <AppBar
            sx={{ position: "relative" }}
            style={{ background: "#ff00ff" }}
          >
            <Toolbar>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Viewing transactions for holding with ID {holdingId}
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={handleViewTransactionsClose}
              >
                Close
              </Button>
            </Toolbar>
          </AppBar>
          <TransactionOverview holdingId={holdingId} />
        </ThemeProvider>
      </Dialog>
    </div>
  );
}

export default HoldingTable;
