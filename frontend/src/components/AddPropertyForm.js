import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  Select,
  TextField,
} from "@mui/material";
import { useForm, Form } from "./useForm";
import Controls from "./controls/Controls";

const initialFValues = {
  type: "",
};

export default function AddPropertyForm() {
  const validate = () => {
    let temp = {};
    temp.address = values.address
      ? ""
      : "Required field. Alternatively a name can be provided here.";
    temp.postcode = values.postcode
      ? ""
      : "Please add postcode for valuation purposes.";
    temp.cost = values.cost
      ? ""
      : "Please add the purchase cost of the property, net of fees if these are included in the fees field.";
    temp.type = values.type ? "" : "Required field.";
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };

  const { values, setValues, handleInputChange, errors, setErrors } =
    useForm(initialFValues);

  const handleSubmit = (e) => {
    if (!validate()) e.preventDefault();
    else {
      console.log("Submitted Property");
      //addClient(values)
    }
  };

  return (
    <div style={{ height: "auto", width: "auto", display: "grid" }}>
      <div style={{ margin: "auto", marginBottom: "4%", display: "grid" }}>
        <h3>Add Property</h3>
      </div>
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={12}>
            <Controls.Input
              label="Address"
              name="address"
              value={values.address}
              onChange={handleInputChange}
              error={errors.address}
            />
            <Controls.Input
              label="Postcode"
              name="postcode"
              value={values.postcode}
              onChange={handleInputChange}
              error={errors.postcode}
            />
            <Controls.Input
              label="Cost (minus fees)"
              name="cost"
              value={values.cost}
              onChange={handleInputChange}
              error={errors.cost}
            />
            <Controls.Input
              label="Purchase Fees"
              name="fees"
              value={values.fees}
              onChange={handleInputChange}
              error={errors.fees}
            />
            <FormControl>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                name="type"
                label="Type"
                value={values.type}
                onChange={handleInputChange}
              >
                <MenuItem value={"buy-to-let"}>Buy to let</MenuItem>
                <MenuItem value={"main-residence"}>Main residence</MenuItem>
                <MenuItem value={"holiday-home"}>Holiday home</MenuItem>
                <MenuItem value={"commercial-land"}>Commercial land</MenuItem>
                <MenuItem value={"second-residence"}>Second residence</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <div>
              <Controls.Button
                style={{ float: "right", marginTop: "6%", display: "grid" }}
                text="Submit"
                type="submit"
                variant="outlined"
              />
            </div>
          </Grid>
        </Grid>
      </Form>
    </div>
  );
}
