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
import Moment from "moment";

function TransactionTable({ transactions }) {
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "holdingId", headerName: "Holding ID", width: 100 },
    { field: "ttype", headerName: "Type", width: 100 },
    {
      field: "tdate",
      headerName: "Date",
      width: 250,
    },
    { field: "units", headerName: "Units", width: 130 },
    { field: "price", headerName: "Price", width: 180 },
  ];

  const returnTable = () => {
    const rows = [];
    transactions.map((transaction) =>
      rows.push({
        id: rows.length + 1,
        holdingId: transaction.holding_id,
        ttype: transaction.ttype,
        tdate: Moment(transaction.tdate).format("DD-MM-YYYY"),
        units: transaction.units,
        price: currencyFormat(parseFloat(transaction.price)),
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
    </div>
  );
}

export default TransactionTable;
