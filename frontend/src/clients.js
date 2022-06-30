import React from "react";
import ClientTable from "./components/ClientTable";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import { Button, Dialog, Divider, Stack, Toolbar } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import AddClientForm from "./components/AddClientForm";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { ThemeProvider } from "@mui/styles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Clients() {
  const handleAddClientModalOpen = () => setOpen(true);
  const handleAddClientModalClose = () => setOpen(false);
  const [clientList, setClientList] = useState([]);

  const [loadingTestClient, setLoadingTestClient] = useState(false);
  const [loadingDeleteClients, setLoadingDeleteClients] = useState(false);
  const [loadingClientListReport, setLoadingClientListReport] = useState(false);

  const [open, setOpen] = React.useState(false);

  const getClientList = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/client-list`);
      setClientList(res.data || []);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const exportClientListReport = async () => {
    try {
      setLoadingClientListReport(true);
      await axios
        .get(`http://127.0.0.1:5000/mi-client-list`, {
          responseType: "blob",
        })
        .then((response) => {
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          const pdfWindow = window.open();
          pdfWindow.location.href = fileURL;
        });
      setLoadingClientListReport(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const addRandomClients = async () => {
    try {
      setLoadingTestClient(true);
      await axios.post(`http://127.0.0.1:5000/add-test-client`);
      window.location.reload(true);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const deleteAllClients = async () => {
    try {
      setLoadingDeleteClients(true);
      await axios.post(`http://127.0.0.1:5000/delete-all-clients`);
      window.location.reload(true);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => getClientList(), []);

  return (
    <div>
      <Header title={"clients"} />
      <div
        style={{
          justifyContent: "right",
          float: "right",
          marginRight: "50px",
        }}
      >
        <Stack
          spacing={2}
          direction="row"
          divider={
            <Divider orientation="vertical" flexItem alignItems="right" />
          }
        >
          <Button
            onClick={handleAddClientModalOpen}
            variant="outlined"
            size="large"
          >
            Add client
          </Button>
          <LoadingButton
            onClick={exportClientListReport}
            variant="outlined"
            size="large"
            loading={loadingClientListReport}
          >
            Export client list report
          </LoadingButton>
        </Stack>
      </div>
      <br />
      <br />
      <br />
      <Dialog
        open={open}
        onClose={handleAddClientModalClose}
        TransitionComponent={Transition}
      >
        <ThemeProvider>
          <AppBar
            sx={{ position: "relative" }}
            style={{ background: "#ff00ff" }}
          >
            <Toolbar variant="dense">
              <Typography sx={{ ml: 3, flex: 1 }} variant="h6" component="div">
                Add client
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={handleAddClientModalClose}
              >
                Close
              </Button>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        <div style={{ margin: "20px" }}>
          <AddClientForm />
        </div>
      </Dialog>
      <ClientTable clients={clientList} />
      <hr />
      <div style={{ marginTop: "40px", marginLeft: "40px" }}>
        <h4>Test tools</h4>
        <div style={{ marginTop: "20px" }}>
          <LoadingButton
            onClick={addRandomClients}
            variant="outlined"
            size="large"
            loading={loadingTestClient}
          >
            Add 2 random clients
          </LoadingButton>
        </div>
        <div style={{ marginTop: "20px" }}>
          <LoadingButton
            onClick={deleteAllClients}
            variant="outlined"
            size="large"
            loading={loadingDeleteClients}
          >
            Delete all clients
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}

export default Clients;
