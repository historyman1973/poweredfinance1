import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import React from "react";
import { Button } from "@mui/material";
import AssetOverviewProperty from "../AssetOverviewProperty";
import AssetOverviewInvestment from "../AssetOverviewInvestment";
import AssetOverviewOther from "../AssetOverviewOther";
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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import axios from "axios";
import EditInvestmentForm from "./EditInvestmentForm";
import EditPropertyForm from "./EditPropertyForm";
import EditOtherAssetForm from "./EditOtherAssetForm";
import EditLiabilityForm from "./EditLiabilityForm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AssetLiabilityTable({
  properties,
  investments,
  otherAssets,
  liabilities,
}) {
  const rows = [];

  const handleViewInvestmentClose = () => setOpenViewInvestment(false);
  const [openViewInvestment, setOpenViewInvestment] = React.useState(false);
  const [investment, setInvestment] = React.useState(false);
  const handleCloseDeleteInvestment = () => setOpenDeleteInvestment(false);
  const [openDeleteInvestment, setOpenDeleteInvestment] = React.useState(false);
  const handleCloseEditInvestment = () => setOpenEditInvestment(false);
  const [openEditInvestment, setOpenEditInvestment] = React.useState(false);
  const [investmentEdit, setInvestmentEdit] = React.useState(false);

  const handleViewPropertyClose = () => setOpenViewProperty(false);
  const [openViewProperty, setOpenViewProperty] = React.useState(false);
  const [property, setProperty] = React.useState(false);
  const handleCloseDeleteProperty = () => setOpenDeleteProperty(false);
  const [openDeleteProperty, setOpenDeleteProperty] = React.useState(false);
  const handleCloseEditProperty = () => setOpenEditProperty(false);
  const [openEditProperty, setOpenEditProperty] = React.useState(false);
  const [propertyEdit, setPropertyEdit] = React.useState(false);

  const handleViewOtherClose = () => setOpenViewOther(false);
  const [openViewOther, setOpenViewOther] = React.useState(false);
  const [other, setOther] = React.useState(false);
  const handleCloseDeleteOther = () => setOpenDeleteOther(false);
  const [openDeleteOther, setOpenDeleteOther] = React.useState(false);
  const handleCloseEditOther = () => setOpenEditOther(false);
  const [openEditOther, setOpenEditOther] = React.useState(false);
  const [otherEdit, setOtherEdit] = React.useState(false);

  const handleViewLiabilityClose = () => setOpenViewLiability(false);
  const [openViewLiability, setOpenViewLiability] = React.useState(false);
  const [liability, setLiability] = React.useState(false);
  const handleCloseDeleteLiability = () => setOpenDeleteLiability(false);
  const [openDeleteLiability, setOpenDeleteLiability] = React.useState(false);
  const handleCloseEditLiability = () => setOpenEditLiability(false);
  const [openEditLiability, setOpenEditLiability] = React.useState(false);
  const [liabilityEdit, setLiabilityEdit] = React.useState(false);

  const deleteInvestment = async () => {
    try {
      try {
        await axios.delete(
          `http://127.0.0.1:5000/delete-investment/` + investment
        );
        console.log("Deleted investment " + investment);
        window.location.reload(true);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProperty = async () => {
    try {
      try {
        await axios.delete(`http://127.0.0.1:5000/delete-property/` + property);
        console.log("Deleted property " + property);
        window.location.reload(true);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteOther = async () => {
    try {
      try {
        await axios.delete(`http://127.0.0.1:5000/delete-otherasset/` + other);
        console.log("Deleted client " + other);
        window.location.reload(true);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleClick = async (category, id, method) => {
    if (method === "view") {
      if (category === "Property") {
        setProperty(id);
        setOpenViewProperty(true);
      } else if (category === "Investment") {
        setInvestment(id);
        setOpenViewInvestment(true);
      } else if (category === "Other Asset") {
        setOther(id);
        setOpenViewOther(true);
      } else if (category === "Long term" || category === "Short term") {
        setLiability(id);
        setOpenViewLiability(true);
      }
    } else if (method === "delete") {
      if (category === "Property") {
        setProperty(id);
        setOpenDeleteProperty(true);
      } else if (category === "Investment") {
        setInvestment(id);
        setOpenDeleteInvestment(true);
      } else if (category === "Other Asset") {
        setOther(id);
        setOpenDeleteOther(true);
      } else if (category === "Long term" || category === "Short term") {
        setLiability(id);
        setOpenDeleteLiability(true);
      }
    } else if (method === "edit") {
      if (category === "Investment") {
        try {
          const res = await axios.get(
            `http://127.0.0.1:5000/get-investment/` + id
          );
          setInvestmentEdit(res.data);
          setOpenEditInvestment(true);
        } catch (error) {
          console.log(error);
        }
      } else if (category === "Property") {
        try {
          const res = await axios.get(
            `http://127.0.0.1:5000/get-property/` + id
          );
          setPropertyEdit(res.data);
          setOpenEditProperty(true);
        } catch (error) {
          console.log(error);
        }
      } else if (category === "Other Asset") {
        try {
          const res = await axios.get(
            `http://127.0.0.1:5000/get-otherasset/` + id
          );
          setOtherEdit(res.data);
          setOpenEditOther(true);
        } catch (error) {
          console.log(error);
        }
      } else if (category === "Long term" || category === "Short term") {
        try {
          const res = await axios.get(
            `http://127.0.0.1:5000/get-liability/` + id
          );
          setLiabilityEdit(res.data);
          setOpenEditLiability(true);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  properties.map((property) =>
    rows.push({
      description: property.address,
      id: rows.length + 1,
      itemId: property.id,
      category: "Property",
      value: currencyFormat(parseFloat(property.value)),
    })
  );

  investments.map((investment) =>
    rows.push({
      description: investment.provider,
      id: rows.length + 1,
      category: "Investment",
      itemId: investment.investment_id,
      value: currencyFormat(parseFloat(investment.current_value)),
    })
  );

  otherAssets.map((otherAsset) =>
    rows.push({
      description: otherAsset.description,
      id: rows.length + 1,
      category: "Other Asset",
      itemId: otherAsset.id,
      value: currencyFormat(parseFloat(otherAsset.value)),
    })
  );

  liabilities.map((liability) =>
    rows.push({
      description: formatLiabilityType(liability.liability_type),
      id: rows.length + 1,
      itemId: liability.id,
      category: formatLiabilityCategory(liability.category),
      value: currencyFormat(parseFloat(liability.amount_outstanding)),
    })
  );

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "itemId", headerName: "Asset/Liability ID", width: 100 },
    { field: "description", headerName: "Description", flex: 1, width: 300 },
    { field: "category", headerName: "Category", width: 130 },
    { field: "value", headerName: "Value", width: 130 },
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() =>
            handleClick(params.row.category, params.row.itemId, "delete")
          }
          showInMenu
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() =>
            handleClick(params.row.category, params.row.itemId, "edit")
          }
          showInMenu
        />,
        <GridActionsCellItem
          icon={<PersonSearchIcon />}
          label="View"
          onClick={() =>
            handleClick(params.row.category, params.row.itemId, "view")
          }
          showInMenu
        />,
      ],
    },
  ];

  return (
    <div style={{ height: "600px", margin: "50px", width: "100%" }}>
      <DataGrid rows={rows} columns={columns} disableColumnMenu />
      <Dialog
        fullScreen
        open={openViewProperty}
        onClose={handleViewPropertyClose}
        TransitionComponent={Transition}
      >
        <ThemeProvider>
          <AppBar
            sx={{ position: "relative" }}
            style={{ background: "#ff00ff" }}
          >
            <Toolbar>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Viewing property
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={handleViewPropertyClose}
              >
                Close
              </Button>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        <AssetOverviewProperty id={property} />
      </Dialog>
      <Dialog
        fullScreen
        open={openViewInvestment}
        onClose={handleViewInvestmentClose}
        TransitionComponent={Transition}
      >
        <ThemeProvider>
          <AppBar
            sx={{ position: "relative" }}
            style={{ background: "#ff00ff" }}
          >
            <Toolbar>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Viewing investment
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={handleViewInvestmentClose}
              >
                Close
              </Button>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        <AssetOverviewInvestment id={investment} />
      </Dialog>
      <Dialog
        fullScreen
        open={openViewOther}
        onClose={handleViewOtherClose}
        TransitionComponent={Transition}
      >
        <ThemeProvider>
          <AppBar
            sx={{ position: "relative" }}
            style={{ background: "#ff00ff" }}
          >
            <Toolbar>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Viewing other asset
              </Typography>
              <Button autoFocus color="inherit" onClick={handleViewOtherClose}>
                Close
              </Button>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        <AssetOverviewOther id={other} />
      </Dialog>
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
        open={openDeleteInvestment}
        onClose={handleCloseDeleteInvestment}
        TransitionComponent={Transition}
      >
        <ThemeProvider>
          <AppBar
            sx={{ position: "relative" }}
            style={{ background: "#ff00ff" }}
          >
            <Toolbar variant="dense">
              <Typography sx={{ ml: 3, flex: 1 }} variant="h6" component="div">
                Delete investment
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={handleCloseDeleteInvestment}
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
              Please confirm you want to delete investment ID {investment}.
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
                  deleteInvestment();
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={openDeleteProperty}
        onClose={handleCloseDeleteProperty}
        TransitionComponent={Transition}
      >
        <ThemeProvider>
          <AppBar
            sx={{ position: "relative" }}
            style={{ background: "#ff00ff" }}
          >
            <Toolbar variant="dense">
              <Typography sx={{ ml: 3, flex: 1 }} variant="h6" component="div">
                Delete property
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={handleCloseDeleteProperty}
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
              Please confirm you want to delete property ID {property}.
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
                  deleteProperty();
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={openDeleteOther}
        onClose={handleCloseDeleteOther}
        TransitionComponent={Transition}
      >
        <ThemeProvider>
          <AppBar
            sx={{ position: "relative" }}
            style={{ background: "#ff00ff" }}
          >
            <Toolbar variant="dense">
              <Typography sx={{ ml: 3, flex: 1 }} variant="h6" component="div">
                Delete other asset
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={handleCloseDeleteOther}
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
              Please confirm you want to delete other asset ID {other}.
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
                  deleteOther();
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
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
        open={openEditProperty}
        onClose={handleCloseEditProperty}
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
                Edit property
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={handleCloseEditProperty}
              >
                Close
              </Button>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        <div style={{ margin: "20px" }}>
          <EditPropertyForm property={propertyEdit} />
        </div>
      </Dialog>
      <Dialog
        open={openEditInvestment}
        onClose={handleCloseEditInvestment}
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
                Edit investment
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={handleCloseEditInvestment}
              >
                Close
              </Button>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        <div style={{ margin: "20px" }}>
          <EditInvestmentForm investment={investmentEdit} />
        </div>
      </Dialog>
      <Dialog
        open={openEditOther}
        onClose={handleCloseEditOther}
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
                Edit other asset
              </Typography>
              <Button autoFocus color="inherit" onClick={handleCloseEditOther}>
                Close
              </Button>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        <div style={{ margin: "20px" }}>
          <EditOtherAssetForm other={otherEdit} />
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

export default AssetLiabilityTable;
