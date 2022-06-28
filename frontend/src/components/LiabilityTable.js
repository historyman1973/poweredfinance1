import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { Button } from "@mui/material";
import LiabilityOverview from "../LiabilityOverview";
import {
  formatLiabilityCategory,
  formatLiabilityType,
  currencyFormat,
} from "./GlobalFunctions";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { ThemeProvider } from "@mui/styles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function LiabilityTable({ liabilities }) {
  const rows = [];

  const handleClose = () => setOpen(false);
  const [open, setOpen] = React.useState(false);
  const [liability, setLiability] = React.useState(false);

  const handleClick = (id) => {
    setLiability(id);
    setOpen(true);
  };

  liabilities.map((liability) =>
    rows.push({
      id: rows.length + 1,
      category: formatLiabilityCategory(liability.category),
      liability_type: formatLiabilityType(liability.liability_type),
      amount_borrowed: currencyFormat(parseFloat(liability.amount_borrowed)),
      amount_outstanding: currencyFormat(
        parseFloat(liability.amount_outstanding)
      ),
    })
  );

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "category", headerName: "Category", width: 300 },
    { field: "liability_type", headerName: "Type", width: 130 },
    { field: "amount_borrowed", headerName: "Amount Borrowed", width: 130 },
    {
      field: "amount_outstanding",
      headerName: "Amount Outstanding",
      width: 130,
    },
    {
      field: "view",
      headerName: "View",
      width: 150,
      renderCell: (params) => (
        <Button onClick={() => handleClick(params.row.id)}>View</Button>
      ),
    },
  ];

  return (
    <div style={{ height: "600px", margin: "50px" }}>
      <DataGrid rows={rows} columns={columns} disableColumnMenu />
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <ThemeProvider>
          <AppBar
            sx={{ position: "relative" }}
            style={{ background: "#ff00ff" }}
          >
            <Toolbar>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Viewing liability
              </Typography>
              <Button autoFocus color="inherit" onClick={handleClose}>
                Close
              </Button>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        <LiabilityOverview id={liability} />
      </Dialog>
    </div>
  );
}

export default LiabilityTable;
