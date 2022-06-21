import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { Link } from "@mui/material";
import { currencyFormat } from "../components/GlobalFunctions";

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
    const rows = [];
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

export default HoldingTable;
