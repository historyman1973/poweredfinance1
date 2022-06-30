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
import EditIcon from "@mui/icons-material/Edit";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { useNavigate } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ClientTable({ clients }) {
  const navigate = useNavigate();
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

  const handleClick = (id, method) => {
    if (method == "delete") {
      setClientDeleteID(id);
      setOpenDeleteClient(true);
    } else if (method == "edit") {
      console.log("To be added soon...");
    } else if (method == "view") {
      navigate("/dashboard/" + id);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "forename", headerName: "Forename", flex: 1, minWidth: 150 },
    { field: "middlename", headerName: "Middle names", flex: 1, minWidth: 150 },
    { field: "surname", headerName: "Surname", flex: 1, minWidth: 150 },
    { field: "gender", headerName: "Gender", width: 150 },
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleClick(params.id, "delete")}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleClick(params.id, "edit")}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<PersonSearchIcon />}
          label="View"
          onClick={() => handleClick(params.id, "view")}
          showInMenu
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
            <Toolbar variant="dense">
              <Typography sx={{ ml: 3, flex: 1 }} variant="h6" component="div">
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
            height: "auto",
            width: "500px",
            marginLeft: "20px",
            marginTop: "20px",
          }}
        >
          <div class="row">
            <div>
              <h4>Are you sure?</h4>
              Please confirm you want to delete client ID {clientDeleteID}.
            </div>
          </div>
          <div
            class="row"
            style={{
              justifyContent: "right",
              marginRight: "20px",
              marginTop: "10px",
              marginBottom: "20px",
            }}
          >
            <div>
              <Button
                onClick={() => {
                  deleteClient();
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
      <DataGrid rows={rows} columns={columns} disableColumnMenu />
    </div>
  );
}

export default ClientTable;
