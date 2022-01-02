import React from "react";
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

function makeNavBar(title) {
  if ('dashboard' === title) {
    return (
      <div class="menu-items">
      <Stack spacing={2} direction="row" divider={<Divider orientation="vertical" flexItem alignItems="right"/>}>
        <Button variant="outlined" href="/">Dashboard</Button>
        <Button variant="text" href="/assets">Assets</Button>
        <Button variant="text" href="/liabilities">Liabilities</Button>
        <Button variant="text" href="/settings">Settings</Button>
        <Button variant="text" href="/support">Support</Button>
      </Stack>
    </div>
    )
  } else if ('assets' === title) {
    return (
      <div class="menu-items">
      <Stack spacing={2} direction="row" divider={<Divider orientation="vertical" flexItem alignItems="right"/>}>
        <Button variant="text" href="/">Dashboard</Button>
        <Button variant="outlined" href="/assets">Assets</Button>
        <Button variant="text" href="/liabilities">Liabilities</Button>
        <Button variant="text" href="/settings">Settings</Button>
        <Button variant="text" href="/support">Support</Button>
      </Stack>
    </div>
    )
  } else if ('liabilities' === title) {
    return (
      <div class="menu-items">
      <Stack spacing={2} direction="row" divider={<Divider orientation="vertical" flexItem alignItems="right"/>}>
        <Button variant="text" href="/">Dashboard</Button>
        <Button variant="text" href="/assets">Assets</Button>
        <Button variant="outlined" href="/liabilities">Liabilities</Button>
        <Button variant="text" href="/settings">Settings</Button>
        <Button variant="text" href="/support">Support</Button>
      </Stack>
    </div>
    )
  } else if ('settings' === title) {
    return (
      <div class="menu-items">
      <Stack spacing={2} direction="row" divider={<Divider orientation="vertical" flexItem alignItems="right"/>}>
        <Button variant="text" href="/">Dashboard</Button>
        <Button variant="text" href="/assets">Assets</Button>
        <Button variant="text" href="/liabilities">Liabilities</Button>
        <Button variant="outlined" href="/settings">Settings</Button>
        <Button variant="text" href="/support">Support</Button>
      </Stack>
    </div>
    )
  } else if ('support' === title) {
    return (
      <div class="menu-items">
      <Stack spacing={2} direction="row" divider={<Divider orientation="vertical" flexItem alignItems="right"/>}>
        <Button variant="text" href="/">Dashboard</Button>
        <Button variant="text" href="/assets">Assets</Button>
        <Button variant="text" href="/liabilities">Liabilities</Button>
        <Button variant="text" href="/settings">Settings</Button>
        <Button variant="outlined" href="/support">Support</Button>
      </Stack>
    </div>
    )
  }
};

const Header = ({ title }) => {
  return (
      <div>
        <div class="topnav">
          <img src="https://i.imgur.com/fYKNAxY.png" height="90" width="160" />
          {makeNavBar(title)}
        </div>
      </div>
  );
};

export default Header;