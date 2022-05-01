import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import { Button, Paper } from "@mui/material";
import LiabilityOverview from "./LiabilityOverview";
import {
  formatLiabilityCategory,
  formatLiabilityType,
  currencyFormat,
} from "./GlobalFunctions";

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

const styleLifestyle = {
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
  maxWidth: "50%",
  minWidth: "50%",
  height: "50%",
  bgcolor: "#ffffff",
  boxShadow: 24,
  p: 4,
};

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
  maxWidth: "90%",
  minWidth: "90%",
  height: "90%",
  bgcolor: "#ffffff",
  boxShadow: 24,
  p: 4,
};

function LiabilityTable({ liabilities }) {
  const rows = Array();

  const handleClose = () => setOpen(false);
  const [open, setOpen] = React.useState(false);
  const [liability, setLiability] = React.useState(false);

  const handleClick = (id) => {
    setLiability(id);
    setOpen(true);
  };

  {
    liabilities.map((liability) =>
      rows.push({
        id: liability.id,
        category: formatLiabilityCategory(liability.category),
        liability_type: formatLiabilityType(liability.liability_type),
        amount_borrowed: currencyFormat(parseFloat(liability.amount_borrowed)),
        amount_outstanding: currencyFormat(
          parseFloat(liability.amount_outstanding)
        ),
      })
    );
  }

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
      <DataGrid rows={rows} columns={columns} />
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
      >
        <Paper sx={style}>
          <LiabilityOverview id={liability} />
        </Paper>
      </StyledModal>
    </div>
  );
}

export default LiabilityTable;