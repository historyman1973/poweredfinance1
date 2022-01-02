import React, { Component } from "react";
import Header from "./components/Header";
import Container from '@mui/material/Container';

class Settings extends Component {

  render() {
    return (
      <div>
        <Header title={'settings'} />
        <br />
        <br />
          <Container maxWidth="lg">
            <div class="main-container"></div>
          </Container>
      </div>
    );
  }
}

export default Settings;