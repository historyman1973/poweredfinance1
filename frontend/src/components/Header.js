import React from "react";
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

function makeNavBar(title, viewingId) {
  if ('clients' === title) {
    return (
      <div class="client-header">
      <h2>Client list</h2>
      Select a client to navigate to their dashboard.
    </div>
    )
  } else if ('dashboard' === title) {
    return (
      <div class="menu-items">
      <Stack spacing={2} direction="row" divider={<Divider orientation="vertical" flexItem alignItems="right"/>}>
        <Button variant="outlined" href={"/dashboard/" + viewingId}>Dashboard</Button>
        <Button variant="text" href={"/assets/" + viewingId}>Assets</Button>
        <Button variant="text" href={"/liabilities/" + viewingId}>Liabilities</Button>
        <Button variant="text" href={"/settings/" + viewingId}>Settings</Button>
        <Button variant="text" href={"/support/" + viewingId}>Support</Button>
      </Stack>
    </div>
    )
  } else if ('assets' === title) {
    return (
      <div class="menu-items">
      <Stack spacing={2} direction="row" divider={<Divider orientation="vertical" flexItem alignItems="right"/>}>
      <Button variant="text" href={"/dashboard/" + viewingId}>Dashboard</Button>
        <Button variant="outlined" href={"/assets/" + viewingId}>Assets</Button>
        <Button variant="text" href={"/liabilities/" + viewingId}>Liabilities</Button>
        <Button variant="text" href={"/settings/" + viewingId}>Settings</Button>
        <Button variant="text" href={"/support/" + viewingId}>Support</Button>
      </Stack>
    </div>
    )
  } else if ('liabilities' === title) {
    return (
      <div class="menu-items">
      <Stack spacing={2} direction="row" divider={<Divider orientation="vertical" flexItem alignItems="right"/>}>
      <Button variant="text" href={"/dashboard/" + viewingId}>Dashboard</Button>
        <Button variant="text" href={"/assets/" + viewingId}>Assets</Button>
        <Button variant="outlined" href={"/liabilities/" + viewingId}>Liabilities</Button>
        <Button variant="text" href={"/settings/" + viewingId}>Settings</Button>
        <Button variant="text" href={"/support/" + viewingId}>Support</Button>
      </Stack>
    </div>
    )
  } else if ('settings' === title) {
    return (
      <div class="menu-items">
      <Stack spacing={2} direction="row" divider={<Divider orientation="vertical" flexItem alignItems="right"/>}>
        <Button variant="text" href={"/dashboard/" + viewingId}>Dashboard</Button>
        <Button variant="text" href={"/assets/" + viewingId}>Assets</Button>
        <Button variant="text" href={"/liabilities/" + viewingId}>Liabilities</Button>
        <Button variant="outlined" href={"/settings/" + viewingId}>Settings</Button>
        <Button variant="text" href={"/support/" + viewingId}>Support</Button>
      </Stack>
    </div>
    )
  } else if ('support' === title) {
    return (
      <div class="menu-items">
      <Stack spacing={2} direction="row" divider={<Divider orientation="vertical" flexItem alignItems="right"/>}>
      <Button variant="text" href={"/dashboard/" + viewingId}>Dashboard</Button>
        <Button variant="text" href={"/assets/" + viewingId}>Assets</Button>
        <Button variant="text" href={"/liabilities/" + viewingId}>Liabilities</Button>
        <Button variant="text" href={"/settings/" + viewingId}>Settings</Button>
        <Button variant="outlined" href={"/support/" + viewingId}>Support</Button>
      </Stack>
    </div>
    )
  }
};

const Header = ({ title, viewingId }) => {
  return (
      <div>
        <div class="topnav">
          <img src="https://i.imgur.com/fYKNAxY.png" height="90" width="160" />
          {makeNavBar(title, viewingId)}
        </div>
      </div>
  );
};

export default Header;