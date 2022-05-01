import { DataGrid } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import axios from "axios";
import { Link } from "@mui/material";
import { Button } from "@mui/material";
import DataTable from "react-data-table-component";

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
  maxWidth: "50%",
  minWidth: "50%",
  height: "50%",
  bgcolor: "#ffffff",
  boxShadow: 24,
  p: 4,
};

function currencyFormat(num) {
  try {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  } catch (e) {
    console.log(e);
  }
}

function HoldingTable({ holdings }) {
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
      field: "view",
      headerName: "View",
      width: 150,
      renderCell: (params) => (
        <Link href={`/security/${params.value}`}>View</Link>
      ),
    },
  ];

  const returnTable = () => {
    const rows = Array();
    console.log(holdings);
    holdings.map((holding) =>
      rows.push({
        id: holding.holding_id,
        instrument_id: holding.instrument_id,
        instrument_name: holding.instrument_name,
        units: holding.current_units,
        value: currencyFormat(parseFloat(holding.current_value)),
        view: holding.holding_ticker,
      })
    );
    return <DataGrid rows={rows} columns={columns} />;
  };

  return (
    <div style={{ height: "600px", width: "100%", margin: "50px" }}>
      {returnTable()}
    </div>
  );
}

export default HoldingTable;
