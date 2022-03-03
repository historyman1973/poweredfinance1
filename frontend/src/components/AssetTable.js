import { Link } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { Component, useState } from "react";
import { Button, Table } from "react-bootstrap";

function AssetTable({ properties, investments, lifestyleAssets }) {
  const rows = Array();

  {
    properties.map((property) =>
      rows.push({
        description: property.address,
        id: property.id,
        category: "Property",
        value: property.value,
        view: `property/` + property.id,
      })
    );
  }

  {
    investments.map((investment) =>
      rows.push({
        description: investment.provider,
        id: investment.id,
        category: "Investment",
        value: investment.value,
        view: `investment/` + investment.id,
      })
    );
  }

  {
    lifestyleAssets.map((lifestyleAsset) =>
      rows.push({
        description: lifestyleAsset.description,
        id: lifestyleAsset.id,
        category: "Lifestyle Asset",
        value: lifestyleAsset.value,
        view: `lifestyleAsset/` + lifestyleAsset.id,
      })
    );
  }

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "category", headerName: "Category", width: 130 },
    { field: "value", headerName: "Value", width: 130 },
    {
      field: "view",
      headerName: "View",
      width: 150,
      renderCell: (params) => (
        <Link
          href={`${window.location.pathname.split("/")[2]}/${params.value}`}
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <div style={{ height: "600px", margin: "50px" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}

export default AssetTable;
