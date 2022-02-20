import React, { useState, useEffect } from 'react';
import { Button, FormControl, FormControlLabel, FormLabel, Grid, Radio, Select, TextField } from '@mui/material';

export default function AddAssetForm() {

  return (
    <div style={{ height: '250px', margin: '10px', display: 'grid' }}>
        <Button variant="outlined" style={{ margin: 10, marginBottom: 10 }} >Property</Button>
        <Button variant="outlined" style={{ margin: 10, marginBottom: 10 }} >Investment account</Button>
        <Button variant="outlined" style={{ margin: 10, marginBottom: 10 }} >Other Asset</Button>
      </div>
    )
}