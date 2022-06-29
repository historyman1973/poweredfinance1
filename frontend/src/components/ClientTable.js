import { Link } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { ThemeProvider } from "@mui/styles";
import { Button } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ClientTable({ clients }) {
  const rows = Array();

  const handleCloseDeleteClient = () => setOpenDeleteClient(false);
  const [openDeleteClient, setOpenDeleteClient] = React.useState(false);
  const [clientDeleteID, setClientDeleteID] = React.useState(false);

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

  const deleteClient = async () => {
    try {
      try {
        await axios.delete(
          `http://127.0.0.1:5000/delete-client/` + clientDeleteID
        );
        console.log("Deleted client " + clientDeleteID);
        window.location.reload(true);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (id) => {
    setClientDeleteID(id);
    setOpenDeleteClient(true);
  };

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
          onClick={() => handleClick(params.id)}
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
      <Dialog
        open={openDeleteClient}
        onClose={handleCloseDeleteClient}
        TransitionComponent={Transition}
      >
        <ThemeProvider>
          <AppBar
            sx={{ position: "relative" }}
            style={{ background: "#ff00ff" }}
          >
            <Toolbar>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Delete client
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={handleCloseDeleteClient}
              >
                Close
              </Button>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        <div
          style={{
            height: "150px",
            width: "400px",
            justifyContent: "center",
            marginTop: "10%",
            textAlign: "center",
          }}
        >
          <h4>Are you sure?</h4>
          <div style={{ marginTop: "20px" }}>
            <Button
              onClick={() => {
                deleteClient();
              }}
            >
              I want to delete client ID {clientDeleteID}
            </Button>
          </div>
        </div>
      </Dialog>
      <DataGrid rows={rows} columns={columns} disableColumnMenu />
    </div>
  );
}

export default ClientTable;
