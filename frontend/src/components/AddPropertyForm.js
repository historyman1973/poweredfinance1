import React, { useState, useEffect } from 'react';
import { Button, FormControl, FormControlLabel, FormLabel, Grid, Radio, Select, TextField } from '@mui/material';
import { useForm, Form } from './useForm';
import Controls from './controls/Controls';

const initialFValues = {
  address: ''
}

export default function AddPropertyForm() {

  const validate = () => {
    let temp = {}
    temp.address = values.address?"":"Required field. Alternatively a name can be provided here."
    temp.postcode = values.postcode?"":"Please add postcode for valuation purposes."
    temp.cost = values.cost?"":"Please add the purchase cost of the property, net of fees if these are included in the fees field."
    setErrors({
      ...temp
    })
    return Object.values(temp).every(x => x == "")
  }

  const {
    values,
    setValues,
    handleInputChange,
    errors,
    setErrors
  } = useForm(initialFValues);

  const handleSubmit = e => {

    if (!validate())
      e.preventDefault()
    else {
      console.log("Submitted Property")
      //addClient(values)
    }

  }

  return (
    <div style={{ height: 'auto', width: 'auto', display: 'grid' }}>
      <div style={{ margin: 'auto' }}><h2>Add Property</h2></div>
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={12}>
          <Controls.Input
                label="Address"
                name="address"
                value={values.address}
                onChange = {handleInputChange}
                error={errors.address} />
          <Controls.Input
                label="Postcode"
                name="postcode"
                value={values.postcode}
                onChange = {handleInputChange}
                error={errors.postcode} />
          <Controls.Input
                label="Cost (minus fees)"
                name="cost"
                value={values.cost}
                onChange = {handleInputChange}
                error={errors.cost} />
          <Controls.Input
                label="Purchase Fees"
                name="fees"
                value={values.fees}
                onChange = {handleInputChange}
                error={errors.fees} />
            </Grid>
            <Grid item xs={12}>
              <div>
                <Controls.Button style={{ float: 'right', marginTop: '6%' }}
                text="Submit"
                type="submit"
                variant="outlined" />
              </div>
            </Grid>
        </Grid>
      </Form>
      </div>
    )
}