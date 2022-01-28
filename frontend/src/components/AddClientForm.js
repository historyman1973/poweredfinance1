import React, { useState, useEffect } from 'react';
import { FormControl, FormControlLabel, FormLabel, Grid, Radio, Select, TextField } from '@mui/material';
import { useForm, Form } from './useForm';
import Controls from './controls/Controls';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const genderItems = [
  { id: 'male', title: 'Male' },
  { id: 'female', title: 'Female' },
  { id: 'other', title: 'Other' }
]

const initialFValues = {
  forename: '',
  preferred_name: '',
  middle_names: '',
  surname: '',
  gender: 'male',
  isPrimary: true
}

const addClient = async (values) => {
  try {
    const res = await axios.post(`http://127.0.0.1:5000/add-client`, values);
    // setLoading(false);
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};

export default function AddClientForm() {

  const validate = () => {
    let temp = {}
    temp.forename = values.forename?"":"Forename must be provided."
    temp.surname = values.surname?"":"Surname must be provided."
    temp.isPrimary = values.isPrimary?"":"Must be true or false."
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
    //e.preventDefault()
    if (validate())
      addClient(values)
  }

  return (
    <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={6}>
            <Controls.Input
            name="forename"
            label="Forename"
            value={values.forename}
            onChange={handleInputChange}
            error={errors.forename} />
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
            onChange = {handleInputChange}
            error={errors.surname} />
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