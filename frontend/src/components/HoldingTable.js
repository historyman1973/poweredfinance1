import React from "react";
import { AppBar, Dialog, Slide, Toolbar, Typography } from "@mui/material";
import { currencyFormat } from "../components/GlobalFunctions";
import { Button } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import TransactionOverview from "../TransactionOverview";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import PageviewIcon from "@mui/icons-material/Pageview";
import PreviewIcon from "@mui/icons-material/Preview";
import { useNavigate } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function HoldingTable({ holdings }) {
  const navigate = useNavigate();
  const [openViewTransactions, setOpenViewTransactions] = React.useState(false);
  const handleViewTransactionsClose = () => setOpenViewTransactions(false);
  const [holdingId, setHoldingId] = React.useState(false);

  const handleClick = (id, method) => {
    if (method === "view-transactions") {
      setHoldingId(id);
      setOpenViewTransactions(true);
    } else if (method === "delete") {
      console.log("To be added soon...");
    } else if (method === "view-security") {
      navigate("/security/" + id);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "holding_id", headerName: "Holding ID", width: 100 },
    { field: "instrument_id", headerName: "Instrument ID", width: 100 },
    { field: "ticker", headerName: "Ticker", width: 100 },
    {
      field: "instrument_name",
      flex: 1,
      headerName: "Name",
      width: 250,
    },
    { field: "units", headerName: "Units", width: 130 },
    { field: "value", headerName: "Value", width: 180 },
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleClick(params.row.holding_id, "delete")}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<PageviewIcon />}
          label="View Transactions"
          onClick={() =>
            handleClick(params.row.holding_id, "view-transactions")
          }
          showInMenu
        />,
        <GridActionsCellItem
          icon={<PreviewIcon />}
          label="View Security"
          onClick={() => handleClick(params.row.ticker, "view-security")}
          showInMenu
        />,
      ],
    },
  ];

  const returnTable = () => {
    const rows = [];
    holdings.map((holding) =>
      rows.push({
        id: rows.length + 1,
        holding_id: holding.holding_id,
        instrument_id: holding.instrument_id,
        ticker: holding.holding_ticker,
        instrument_name: holding.instrument_name,
        units: holding.current_units,
        value: currencyFormat(parseFloat(holding.current_value)),
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
