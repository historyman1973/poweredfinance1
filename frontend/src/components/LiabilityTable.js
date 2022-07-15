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
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import axios from "axios";
import EditLiabilityForm from "./EditLiabilityForm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function LiabilityTable({ liabilities }) {
  const rows = [];

  const handleViewLiabilityClose = () => setOpenViewLiability(false);
  const [openViewLiability, setOpenViewLiability] = React.useState(false);
  const [liability, setLiability] = React.useState(false);
  const handleCloseDeleteLiability = () => setOpenDeleteLiability(false);
  const [openDeleteLiability, setOpenDeleteLiability] = React.useState(false);
  const handleCloseEditLiability = () => setOpenEditLiability(false);
  const [openEditLiability, setOpenEditLiability] = React.useState(false);
  const [liabilityEdit, setLiabilityEdit] = React.useState(false);

  const deleteLiability = async () => {
    try {
      try {
        await axios.delete(
          `http://127.0.0.1:5000/delete-liability/` + liability
        );
        console.log("Deleted liability " + liability);
        window.location.reload(true);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (id, method) => {
    if (method === "delete") {
      setLiability(id);
      setOpenDeleteLiability(true);
    } else if (method === "edit") {
      try {
        const res = await axios.get(
          `http://127.0.0.1:5000/get-liability/` + id
        );
        setLiabilityEdit(res.data);
        setOpenEditLiability(true);
      } catch (error) {
        console.log(error);
      }
    } else if (method === "view") {
      setLiability(id);
      setOpenViewLiability(true);
    }
  };

  liabilities.map((liability) =>
    rows.push({
      id: rows.length + 1,
      liabilityId: liability.id,
      category: formatLiabilityCategory(liability.category),
      liability_type: formatLiabilityType(liability.liability_type),
      amount_borrowed: currencyFormat(parseFloat(liability.amount_borrowed)),
      amount_outstanding: currencyFormat(
        parseFloat(liability.amount_outstanding)
      ),
    })
  );

  const columns = [
    { field: "id", headerName: "Table ID", width: 100 },
    { field: "liabilityId", headerName: "ID", width: 100 },
    { field: "category", headerName: "Category", width: 300 },
    { field: "liability_type", headerName: "Type", flex: 1, width: 130 },
    { field: "amount_borrowed", headerName: "Amount Borrowed", width: 130 },
    {
      field: "amount_outstanding",
      headerName: "Amount Outstanding",
      width: 130,
    },
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleClick(params.row.liabilityId, "delete")}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleClick(params.row.liabilityId, "edit")}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<PersonSearchIcon />}
          label="View"
          onClick={() => handleClick(params.row.liabilityId, "view")}
          showInMenu
        />,
      ],
    },
  ];

  return (
    <div style={{ height: "600px", margin: "50px" }}>
      <DataGrid rows={rows} columns={columns} disableColumnMenu />
      <Dialog
        fullScreen
        open={openViewLiability}
        onClose={handleViewLiabilityClose}
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
              <Button
                autoFocus
                color="inherit"
                onClick={handleViewLiabilityClose}
              >
                Close
              </Button>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        <LiabilityOverview id={liability} />
      </Dialog>
      <Dialog
        open={openDeleteLiability}
        onClose={handleCloseDeleteLiability}
        TransitionComponent={Transition}
      >
        <ThemeProvider>
          <AppBar
            sx={{ position: "relative" }}
            style={{ background: "#ff00ff" }}
          >
            <Toolbar variant="dense">
              <Typography sx={{ ml: 3, flex: 1 }} variant="h6" component="div">
                Delete liability
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={handleCloseDeleteLiability}
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
              Please confirm you want to delete liability ID {liability}.
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
            <div style={{ padding: "0px" }}>
              <Button
                style={{ float: "right" }}
                onClick={() => {
                  deleteLiability();
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={openEditLiability}
        onClose={handleCloseEditLiability}
        TransitionComponent={Transition}
        PaperProps={{
          style: { borderRadius: 10 },
        }}
      >
        <ThemeProvider>
          <AppBar
            sx={{ position: "relative" }}
            style={{ background: "#ff00ff" }}
          >
            <Toolbar variant="dense">
              <Typography sx={{ ml: 3, flex: 1 }} variant="h6" component="div">
                Edit liability
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={handleCloseEditLiability}
              >
                Close
              </Button>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        <div style={{ margin: "20px" }}>
          <EditLiabilityForm liability={liabilityEdit} />
        </div>
      </Dialog>
    </div>
  );
}

export default LiabilityTable;
