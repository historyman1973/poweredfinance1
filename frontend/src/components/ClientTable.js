import { Link } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

function ClientTable({ clients }) {
  const rows = Array();

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

  const deleteClient = React.useCallback(
    (id) => async () => {
      try {
        await axios.delete(`http://127.0.0.1:5000/delete-client/` + id);
        console.log("done");
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

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
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={deleteClient(params.id)}
        />,
      ],
    },
  ];

  return (
    <div
      style={{
        height: "600px",
        marginLeft: "50px",
        marginRight: "50px",
        marginBottom: "50px",
      }}
    >
      <DataGrid rows={rows} columns={columns} disableColumnMenu />
    </div>
  );
}

export default ClientTable;
