import React, { useState, useEffect } from 'react';
import { FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useForm, Form } from './useForm';
import Input from './controls/Input'

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiFormControl-root': {
      width: '40%',
      margin: '10px'
    }
  }
}))

const initialFValues = {
  id: 0,
  forename: '',
  preferred_name: '',
  middle_names: '',
  surname: '',
  gender: 'male',
  isPrimary: true
}

export default function AddClientForm() {

  const {
    values,
    setValues,
    handleInputChange
  } = useForm(initialFValues);

  return (
    <Form>
        <Grid container>
          <Grid item xs={6}>
            <Input
            name="forename"
            label="Forename"
            value={values.forename}
            onChange={handleInputChange} />
            <Input
            label="Preferred name"
            name="preferred_name"
            value={values.preferred_name}
            onChange = {handleInputChange} />
            <Input
            label="Middle name(s)"
            name="middle_names"
            value={values.middle_names}
            onChange = {handleInputChange} />
            <Input
            label="Surname"
            name="surname"
            value={values.surname}
            onChange = {handleInputChange} />
            <Input
            label="isPrimary"
            name="isPrimary"
            value={values.isPrimary}
            onChange = {handleInputChange} />
          </Grid>
          <Grid item xs={6}>
            <FormControl>
              <FormLabel>Gender</FormLabel>
              <RadioGroup 
              row
              name="gender"
              value={values.gender}
              onChange = {handleInputChange}>
                <FormControlLabel value="male" control={<Radio />} label="Male" /> 
                <FormControlLabel value="female" control={<Radio />} label="Female" /> 
                <FormControlLabel value="other" control={<Radio />} label="Other" /> 
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
    </Form>
  )
}