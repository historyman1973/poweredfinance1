import React from "react";
import { Button } from "@mui/material";
import AddPropertyForm from "./AddPropertyForm";
import AddInvestmentForm from "./AddInvestmentForm";
import AddOtherAssetForm from "./AddOtherAssetForm";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { ThemeProvider } from "@mui/styles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddAssetForm() {
  const handleAddPropertyOpen = () => setOpenProperty(true);
  const handleAddPropertyClose = () => setOpenProperty(false);
  const [openProperty, setOpenProperty] = React.useState(false);

  const handleAddInvestmentOpen = () => setOpenInvestment(true);
  const handleAddInvestmentClose = () => setOpenInvestment(false);
  const [openInvestment, setOpenInvestment] = React.useState(false);

  const handleAddOtherAssetOpen = () => setOpenOtherAsset(true);
  const handleAddOtherAssetClose = () => setOpenOtherAsset(false);
  const [openOtherAsset, setOpenOtherAsset] = React.useState(false);

  return (
    <div style={{ height: "250px", margin: "10px", display: "grid" }}>
      <Button
        onClick={handleAddPropertyOpen}
        variant="outlined"
        style={{ margin: 10, marginBottom: 10 }}
      >
        Property
      </Button>
      <Button
        onClick={handleAddInvestmentOpen}
        variant="outlined"
        style={{ margin: 10, marginBottom: 10 }}
      >
        Investment account
      </Button>
      <Button
        onClick={handleAddOtherAssetOpen}
        variant="outlined"
        style={{ margin: 10, marginBottom: 10 }}
      >
        Other Asset
      </Button>
      <Dialog
        open={openProperty}
        onClose={handleAddPropertyClose}
        TransitionComponent={Transition}
        PaperProps={{
          style: { borderRadius: 15 },
        }}
      >
        <ThemeProvider>
          <AppBar
            sx={{ position: "relative" }}
            style={{ background: "#ff00ff" }}
          >
            <Toolbar variant="dense">
              <Typography sx={{ ml: 3, flex: 1 }} variant="h6" component="div">
                Add property
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={handleAddPropertyClose}
              >
                Close
              </Button>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        <div
          style={{
            margin: "20px",
            marginLeft: "80px",
            marginRight: "80px",
          }}
        >
          <AddPropertyForm />
        </div>
      </Dialog>
      <Dialog
        open={openInvestment}
        onClose={handleAddInvestmentClose}
        TransitionComponent={Transition}
        PaperProps={{
          style: { borderRadius: 15 },
        }}
      >
        <ThemeProvider>
          <AppBar
            sx={{ position: "relative" }}
            style={{ background: "#ff00ff" }}
          >
            <Toolbar variant="dense">
              <Typography sx={{ ml: 3, flex: 1 }} variant="h6" component="div">
                Add investment
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={handleAddInvestmentClose}
              >
                Close
              </Button>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        <div
          style={{
            margin: "20px",
            marginLeft: "80px",
            marginRight: "80px",
          }}
        >
          <AddInvestmentForm />
        </div>
      </Dialog>
      <Dialog
        open={openOtherAsset}
        onClose={handleAddOtherAssetClose}
        TransitionComponent={Transition}
        PaperProps={{
          style: { borderRadius: 15 },
        }}
      >
        <ThemeProvider>
          <AppBar
            sx={{ position: "relative" }}
            style={{ background: "#ff00ff" }}
          >
            <Toolbar variant="dense">
              <Typography sx={{ ml: 3, flex: 1 }} variant="h6" component="div">
                Add other asset
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={handleAddOtherAssetClose}
              >
                Close
              </Button>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        <div
          style={{
            margin: "20px",
            marginLeft: "80px",
            marginRight: "80px",
          }}
        >
          <AddOtherAssetForm />
        </div>
      </Dialog>
    </div>
  );
}
