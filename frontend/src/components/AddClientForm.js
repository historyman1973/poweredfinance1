import React, { useState, useEffect } from 'react';
import { FormControl, FormControlLabel, FormLabel, Grid, Radio, Select, TextField } from '@mui/material';
import { useForm, Form } from './useForm';
import Controls from './controls/Controls';

const genderItems = [
  { id: 'male', title: 'Male' },
  { id: 'female', title: 'Female' },
  { id: 'other', title: 'Other' }
]


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
            <Controls.Input
            name="forename"
            label="Forename"
            value={values.forename}
            onChange={handleInputChange} />
            <Controls.Input
            label="Preferred name"
            name="preferred_name"
            value={values.preferred_name}
            onChange = {handleInputChange} />
            <Controls.Input
            label="Middle name(s)"
            name="middle_names"
            value={values.middle_names}
            onChange = {handleInputChange} />
            <Controls.Input
            label="Surname"
            name="surname"
            value={values.surname}
            onChange = {handleInputChange} />
            <Controls.Input
            label="isPrimary"
            name="isPrimary"
            value={values.isPrimary}
            onChange = {handleInputChange} />
          </Grid>
          <Grid item xs={6}>
            <Controls.RadioGroup
             name="gender"
             label="Gender"
             value={values.gender}
             onChange = {handleInputChange}
             items={ genderItems } />
             <div>
               <Controls.Button
               text="Submit"
               type="submit" />
             </div>
          </Grid>
        </Grid>
    </Form>
  )
}