import React, { useEffect, useState } from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { useForm, Form } from "./useForm";
import Controls from "./controls/Controls";
import axios from "axios";
import { toast } from "react-toastify";

const initialFValues = {
  category: "",
  liability_type: "",
  description: "",
  amount_borrowed: "",
  amount_outstanding: "",
  owner1_id: window.location.pathname.split("/")[2],
  owner2_id: "",
  property_id: "",
};

export default function AddLiabilityForm() {
  const [properties, setProperties] = useState([]);
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
    return Object.values(temp).every((x) => x == "");
  };

  const { values, setValues, handleInputChange, errors, setErrors } =
    useForm(initialFValues);

  const handleSubmit = async (e) => {
    if (!validate()) e.preventDefault();
    else {
      e.preventDefault();
      addLiability(values);
      window.location.reload(false);
    }
  };

  useEffect(() => getProperties(), []);

  const addLiability = async (values) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:5000/add-liability`,
        values
      );
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getProperties = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-properties/` +
        window.location.pathname.split("/")[2]
    );
    setProperties(res.data);
  };

  return (
    <div style={{ height: "auto", width: "auto", display: "grid" }}>
      <div style={{ margin: "auto", marginBottom: "4%", display: "grid" }}>
        <h3>Add Liability</h3>
      </div>
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
                <MenuItem value={"secured"}>Secured</MenuItem>
                <MenuItem value={"unsecured"}>Unsecured</MenuItem>
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
              />
            </div>
          </Grid>
        </Grid>
      </Form>
    </div>
  );
}
