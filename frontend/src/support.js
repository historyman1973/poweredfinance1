import React, { Component } from "react";
import Header from "./components/Header";
import Container from '@mui/material/Container';

class Support extends Component {

  render() {
    return (
      <div>
        <Header title={'support'} />
        <br />
        <br />
          <Container maxWidth="lg">
            <div class="main-container"></div>
          </Container>
      </div>
    );
  }
}

export default Support;