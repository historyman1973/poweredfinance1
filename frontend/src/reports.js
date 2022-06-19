import React, { Component } from "react";
import Header from "./components/Header";
import Container from "@mui/material/Container";

class Reports extends Component {
  render() {
    return (
      <div>
        <Header
          title={"reports"}
          viewingId={window.location.pathname.split("/")[2]}
        />
        <br />
        <br />
        <Container maxWidth="lg">
          <div class="main-container"></div>
        </Container>
      </div>
    );
  }
}

export default Reports;
