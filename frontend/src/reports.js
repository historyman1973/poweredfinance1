import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "./components/Header";
import LoadingButton from "@mui/lab/LoadingButton";

function Reports() {
  const [client, setClient] = useState([]);

  const [loadingClientSummaryReport, setLoadingClientSummaryReport] =
    useState(false);

  const getClient = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/get-client/` +
          window.location.pathname.split("/")[2]
      );
      setClient(res.data || []);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const exportClientSummaryReport = async () => {
    try {
      setLoadingClientSummaryReport(true);
      await axios
        .get(
          `http://127.0.0.1:5000/client-summary/` +
            window.location.pathname.split("/")[2],
          {
            responseType: "blob",
          }
        )
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

  useEffect(() => getClient(), []);

  return (
    <div>
      <div>
        <Header
          title={"reports"}
          viewingId={window.location.pathname.split("/")[2]}
        />
        <br />
        <br />
        <div class="row">
          <div class="column">
            <div style={{ textAlign: "left", marginLeft: "5%" }}>
              <h1>Reports</h1>
              <div style={{ marginTop: "10px" }}>
                <h5>
                  Client ID: {client.id}
                  <br />
                  {client.forename} {client.middle_names} {client.surname}
                </h5>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div style={{ marginTop: "50px", marginLeft: "50px" }}>
          <LoadingButton
            onClick={exportClientSummaryReport}
            variant="outlined"
            size="large"
            loading={loadingClientSummaryReport}
          >
            Export client summary report
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}

export default Reports;
