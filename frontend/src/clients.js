import React from "react";
import ClientTable from "./components/ClientTable";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import { Button, Divider, Paper, Stack } from "@mui/material";
import AddClientForm from "./components/AddClientForm";
import { styled } from "@mui/system";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import LoadingButton from "@mui/lab/LoadingButton";

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
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "40%",
  minWidth: 400,
  bgcolor: "#ffffff",
  boxShadow: 24,
  p: 4,
};

function Clients() {
  const handleAddClientModalOpen = () => setOpen(true);
  const handleAddClientModalClose = () => setOpen(false);
  const [clientList, setClientList] = useState([]);

  const [loadingTestClient, setLoadingTestClient] = useState(false);
  const [loadingDeleteClients, setLoadingDeleteClients] = useState(false);
  const [loadingClientSummaryReport, setLoadingClientSummaryReport] =
    useState(false);

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

  const exportClientSummaryReport = async () => {
    try {
      setLoadingClientSummaryReport(true);
      const res = await axios
        .get(`http://127.0.0.1:5000/mi-client-list`, {
          responseType: "blob",
        })
        .then((response) => {
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          const pdfWindow = window.open();
          pdfWindow.location.href = fileURL;
        });
      setLoadingClientSummaryReport(false);
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
            onClick={exportClientSummaryReport}
            variant="outlined"
            size="large"
            loading={loadingTestClient}
          >
            Export client summary report
          </LoadingButton>
        </Stack>
      </div>
      <br />
      <br />
      <br />
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleAddClientModalClose}
        BackdropComponent={Backdrop}
      >
        <Paper sx={style}>
          <AddClientForm />
        </Paper>
      </StyledModal>
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
