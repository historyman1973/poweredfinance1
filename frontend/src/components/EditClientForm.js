import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import { useForm, Form } from "./useForm";
import Controls from "./controls/Controls";
import axios from "axios";
import { toast } from "react-toastify";

const genderItems = [
  { id: "male", title: "Male" },
  { id: "female", title: "Female" },
  { id: "other", title: "Other" },
];

const editClient = async (values, clientID) => {
  try {
    const res = await axios.patch(
      `http://127.0.0.1:5000/edit-client/` + clientID,
      values
    );
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};

export default function EditClientForm(client) {
  const initialFValues = {
    forename: client.client.forename,
    preferred_name: client.client.preferred_name,
    middle_names: client.client.middle_names,
    surname: client.client.surname,
    gender: client.client.gender,
    isPrimary: client.client.isPrimary,
  };

  const validate = () => {
    let temp = {};
    temp.forename = values.forename ? "" : "Forename must be provided.";
    temp.surname = values.surname ? "" : "Surname must be provided.";
    temp.isPrimary = values.isPrimary ? "" : "Must be true or false.";
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };

  const { values, handleInputChange, errors, setErrors } =
    useForm(initialFValues);

  const handleSubmit = (e) => {
    if (!validate()) e.preventDefault();
    else {
      editClient(values, client.client.id);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={8}>
          <Controls.Input
            name="forename"
            label="Forename"
            value={values.forename}
            onChange={handleInputChange}
            error={errors.forename}
          />
          <Controls.Input
            label="Preferred name"
            name="preferred_name"
            value={values.preferred_name}
            onChange={handleInputChange}
          />
          <Controls.Input
            label="Middle name(s)"
            name="middle_names"
            value={values.middle_names}
            onChange={handleInputChange}
          />
          <Controls.Input
            label="Surname"
            name="surname"
            value={values.surname}
            onChange={handleInputChange}
            error={errors.surname}
          />
          <Controls.Input
            label="isPrimary"
            name="isPrimary"
            value={values.isPrimary}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={4}>
          <Controls.RadioGroup
            name="gender"
            label="Gender"
            value={values.gender}
            onChange={handleInputChange}
            items={genderItems}
          />
          <div>
            <Controls.Button
              style={{ float: "right", marginTop: "20px" }}
              text="Submit"
              type="submit"
              variant="text"
            />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
