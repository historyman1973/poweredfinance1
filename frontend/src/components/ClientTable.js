import { Link } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { Component, useState } from "react";
import { Button, Table } from "react-bootstrap";

function ClientTable({ clients }) {
  const rows = Array();

  {
    clients.map((client) =>
      rows.push({
        id: client.id,
        forename: client.forename,
        middlename: client.middle_names,
        surname: client.surname,
        gender: client.gender,
        view: client.id,
      })
    );
  }

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "forename", headerName: "Forename", flex: 1, minWidth: 150 },
    { field: "middlename", headerName: "Middle names", flex: 1, minWidth: 150 },
    { field: "surname", headerName: "Surname", flex: 1, minWidth: 150 },
    { field: "gender", headerName: "Gender", width: 150 },
    {
      field: "view",
      headerName: "View",
      width: 150,
      renderCell: (params) => (
        <Link href={`dashboard/${params.value}`}>View</Link>
      ),
    },
  ];

  return (
    <div style={{ height: "600px", margin: "50px" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}

export default ClientTable;
