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
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const initialFValues = {
  property_type: "",
  address: "",
  cost: "",
  value: "",
  owner1_id: window.location.pathname.split("/")[2],
  owner2_id: "",
};

export default function AddPropertyForm() {
  const navigate = useNavigate();
  const validate = () => {
    let temp = {};
    temp.address = values.address
      ? ""
      : "Required field. Alternatively a name can be provided here.";
    temp.value = values.value
      ? ""
      : "Please enter an approximate value of the property.";
    temp.cost = values.cost
      ? ""
      : "Please add the purchase cost of the property, net of fees if these are included in the fees field.";
    temp.property_type = values.property_type ? "" : "Required field.";
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x == "");
  };

  const { values, setValues, handleInputChange, errors, setErrors } =
    useForm(initialFValues);

  const handleSubmit = async (e) => {
    if (!validate()) {
      e.preventDefault();
    } else {
      e.preventDefault();
      addProperty(values);
      const newProperty = await axios.get(
        `http://127.0.0.1:5000/get-properties/` +
          window.location.pathname.split("/")[2]
      );
      navigate(
        "/assets/" +
          window.location.pathname.split("/")[2] +
          "/property/" +
          newProperty.data[newProperty.data.length - 1].id
      );
    }
  };

  const addProperty = async (values) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:5000/add-property`,
        values
      );
      // setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div style={{ height: "auto", width: "auto", display: "grid" }}>
      <div style={{ margin: "auto", marginBottom: "4%", display: "grid" }}>
        <h3>Add Property</h3>
      </div>
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid container xs={12} alignItems="center" justifyContent="center">
            <Controls.Input
              label="Address"
              name="address"
              value={values.address}
              onChange={handleInputChange}
              error={errors.address}
            />
            <Controls.Input
              label="Value"
              name="value"
              value={values.value}
              onChange={handleInputChange}
              error={errors.value}
            />
            <Controls.Input
              label="Cost (inc fees)"
              name="cost"
              value={values.cost}
              onChange={handleInputChange}
              error={errors.cost}
            />
            <FormControl>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                name="property_type"
                label="Type"
                value={values.property_type}
                onChange={handleInputChange}
              >
                <MenuItem value={"buy-to-let"}>Buy to let</MenuItem>
                <MenuItem value={"main-residence"}>Main residence</MenuItem>
                <MenuItem value={"holiday-home"}>Holiday home</MenuItem>
                <MenuItem value={"commercial"}>Commercial</MenuItem>
                <MenuItem value={"second-residence"}>Second residence</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <div>
              <Controls.Button
                style={{ float: "right", display: "grid", marginTop: "20px" }}
                text="Submit"
                type="submit"
              />
            </div>
          </Grid>
        </Grid>
      </Form>
    </div>
  );
}
