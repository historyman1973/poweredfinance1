import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { styled } from "@mui/system";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import { Button, createTheme, Paper } from "@mui/material";
import AssetOverviewProperty from "../AssetOverviewProperty";
import AssetOverviewInvestment from "../AssetOverviewInvestment";
import AssetOverviewOther from "../AssetOverviewOther";
import { currencyFormat } from "../components/GlobalFunctions";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { ThemeProvider } from "@mui/styles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AssetTable({ properties, investments, otherAssets }) {
  const rows = [];

  const handleViewInvestmentClose = () => setOpenViewInvestment(false);
  const [openViewInvestment, setOpenViewInvestment] = React.useState(false);
  const [investment, setInvestment] = React.useState(false);

  const handleViewPropertyClose = () => setOpenViewProperty(false);
  const [openViewProperty, setOpenViewProperty] = React.useState(false);
  const [property, setProperty] = React.useState(false);

  const handleViewOtherClose = () => setOpenViewOther(false);
  const [openViewOther, setOpenViewOther] = React.useState(false);
  const [other, setOther] = React.useState(false);

  const handleClick = (category, id) => {
    if (category === "Property") {
      setProperty(id);
      setOpenViewProperty(true);
    } else if (category === "Investment") {
      setInvestment(id);
      setOpenViewInvestment(true);
    } else if (category === "Other Asset") {
      setOther(id);
      setOpenViewOther(true);
    }
  };

  properties.map((property) =>
    rows.push({
      description: property.address,
      id: rows.length + 1,
      assetId: property.id,
      category: "Property",
      value: currencyFormat(parseFloat(property.value)),
    })
  );

  investments.map((investment) =>
    rows.push({
      description: investment.provider,
      id: rows.length + 1,
      assetId: investment.investment_id,
      category: "Investment",
      value: currencyFormat(parseFloat(investment.current_value)),
    })
  );

  otherAssets.map((otherAsset) =>
    rows.push({
      description: otherAsset.description,
      id: rows.length + 1,
      assetId: otherAsset.id,
      category: "Other Asset",
      value: currencyFormat(parseFloat(otherAsset.value)),
    })
  );

  const columns = [
    { field: "id", headerName: "Table ID", width: 100 },
    { field: "assetId", headerName: "ID", width: 100 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "category", headerName: "Category", width: 130 },
    { field: "value", headerName: "Value", width: 130 },
    {
      field: "view",
      headerName: "View",
      width: 150,
      renderCell: (params) => (
        <Button
          onClick={() => handleClick(params.row.category, params.row.assetId)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ height: "600px", margin: "50px" }}>
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
    </div>
  );
}

export default AssetTable;
