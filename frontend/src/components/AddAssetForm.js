import React, { useState, useEffect } from 'react';
import { Button, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, Select, TextField } from '@mui/material';
import AddPropertyForm from './AddPropertyForm'
import { styled, Box } from '@mui/system';
import ModalUnstyled from '@mui/base/ModalUnstyled';

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

const Backdrop = styled('div')`
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
  position: 'fixed',
  overflowY: 'auto',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: "40%",
  minWidth: 400,
  bgcolor: '#ffffff',
  boxShadow: 24,
  p: 4,
};

export default function AddAssetForm() {

  const handleAddPropertyOpen = () => setOpenProperty(true);
  const handleAddPropertyClose = () => setOpenProperty(false);
  const [openProperty, setOpenProperty] = React.useState(false);


  return (
    <div style={{ height: '250px', margin: '10px', display: 'grid' }}>
      <div style={{ margin: 'auto' }}><h2>Add Asset</h2></div>
        <Button onClick={handleAddPropertyOpen} variant="outlined" style={{ margin: 10, marginBottom: 10 }} >Property</Button>
        <Button variant="outlined" style={{ margin: 10, marginBottom: 10 }} >Investment account</Button>
        <Button variant="outlined" style={{ margin: 10, marginBottom: 10 }} >Other Asset</Button>

        <StyledModal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={openProperty}
          onClose={handleAddPropertyClose}
          BackdropComponent={Backdrop}>
          <Paper sx={style}>
              <AddPropertyForm />
          </Paper>
        </StyledModal>

</div>
    )
}