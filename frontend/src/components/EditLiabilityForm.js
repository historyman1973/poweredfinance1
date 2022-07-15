import React, { useEffect, useState } from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { useForm, Form } from "./useForm";
import Controls from "./controls/Controls";
import axios from "axios";
import { toast } from "react-toastify";

const editLiability = async (values, liabilityID) => {
  try {
    await axios.patch(
      `http://127.0.0.1:5000/edit-liability/` + liabilityID,
      values
    );
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};

export default function EditLiabilityForm(liability) {
  const [properties, setProperties] = useState([]);

  const initialFValues = {
    category: liability.liability.category,
    liability_type: liability.liability.liability_type,
    description: liability.liability.description,
    amount_borrowed: liability.liability.amount_borrowed,
    amount_outstanding: liability.liability.amount_outstanding,
    owner1_id: liability.liability.owner1_id,
    owner2_id: liability.liability.owner2_id,
    property_id: liability.liability.property_id,
  };

  const validate = () => {
    let temp = {};
    temp.amount_outstanding = values.amount_outstanding
      ? ""
      : "Please enter the liability amount.";
    temp.description = values.description
      ? ""
      : "Please enter the liability description.";
    temp.liability_type = values.liability_type ? "" : "Required field.";
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x === "");
  };

  const { values, handleInputChange, errors, setErrors } =
    useForm(initialFValues);

  const handleSubmit = async (e) => {
    if (!validate()) e.preventDefault();
    else {
      e.preventDefault();
      editLiability(values, liability.liability.id);
      window.location.reload(false);
    }
  };

  useEffect(() => getProperties(), []);

  const getProperties = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-properties/` +
        window.location.pathname.split("/")[2]
    );
    setProperties(res.data);
  };

  return (
    <div style={{ height: "auto", width: "auto", display: "grid" }}>
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid container xs={12} alignItems="center" justifyContent="center">
            <FormControl>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                name="liability_type"
                label="Type"
                value={values.liability_type}
                onChange={handleInputChange}
              >
                <MenuItem value={"credit-card"}>Credit Card</MenuItem>
                <MenuItem value={"main-residence-mortgage"}>
                  Main Residence Mortgage
                </MenuItem>
                <MenuItem value={"commercial-mortgage"}>
                  Commercial Mortgage
                </MenuItem>
                <MenuItem value={"buy-to-let-mortgage"}>
                  Buy-to-let Mortgage
                </MenuItem>
                <MenuItem value={"holiday-home-mortgage"}>
                  Holiday Home mortgage
                </MenuItem>
                <MenuItem value={"second-residence-mortgage"}>
                  Second Residence Mortgage
                </MenuItem>
                <MenuItem value={"personal-loan"}>Personal Loan</MenuItem>
                <MenuItem value={"miscellaneous"}>Miscellaneous</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                name="category"
                label="Category"
                value={values.category}
                onChange={handleInputChange}
              >
                <MenuItem value={"long-term"}>Long term</MenuItem>
                <MenuItem value={"short-term"}>Short term</MenuItem>
              </Select>
            </FormControl>
            <Controls.Input
              label="Amount Borrowed"
              name="amount_borrowed"
              value={values.amount_borrowed}
              onChange={handleInputChange}
              error={errors.amount_borrowed}
            />
            <Controls.Input
              label="Amount Outstanding"
              name="amount_outstanding"
              value={values.amount_outstanding}
              onChange={handleInputChange}
              error={errors.amount_outstanding}
            />
            <Controls.Input
              label="Description"
              name="description"
              value={values.description}
              onChange={handleInputChange}
              error={errors.description}
            />
            <FormControl>
              <InputLabel id="demo-simple-select-label">
                Linked Property
              </InputLabel>
              <Select
                name="property_id"
                label="Linked Property ID"
                value={values.property_id}
                onChange={handleInputChange}
              >
                <MenuItem value={"none"}>None</MenuItem>
                {properties.map((property) => (
                  <MenuItem value={property.id}>{property.address}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <div>
              <Controls.Button
                style={{ float: "right", display: "grid", marginTop: "20px" }}
                text="Submit"
                type="submit"
                variant="text"
              />
            </div>
          </Grid>
        </Grid>
      </Form>
    </div>
  );
}
