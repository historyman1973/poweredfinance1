import React from "react";
import { Button, Paper } from "@mui/material";
import AddPropertyForm from "./AddPropertyForm";
import AddInvestmentForm from "./AddInvestmentForm";
import AddOtherAssetForm from "./AddOtherAssetForm";
import { styled } from "@mui/system";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { ThemeProvider } from "@mui/styles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  p: 2,
  px: 4,
  pb: 3,
  borderRadius: 5,
  position: "fixed",
  overflowY: "auto",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "40%",
  minWidth: 100,
  bgcolor: "#ffffff",
  boxShadow: 24,
};

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
