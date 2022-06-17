import React, { useEffect, useState } from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { useForm, Form } from "./useForm";
import Controls from "./controls/Controls";
import axios from "axios";
import { toast } from "react-toastify";

const initialFValues = {
  property_type: "",
  address: "",
  cost: "",
  value: "",
  owner1_id: window.location.pathname.split("/")[2],
  owner2_id: "",
  liability_id: "",
};

export default function AddPropertyForm() {
  const [mortgages, setMortgages] = useState([]);
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
      window.location.reload(false);
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

  useEffect(() => getMortgages(), []);

  const getMortgages = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-liabilities/` +
        window.location.pathname.split("/")[2]
    );
    const mortgages = Array();
    res.data.map((liability) => {
      if (
        liability.liability_type == "main-residence-mortgage" ||
        liability.liability_type == "commercial-mortgage" ||
        liability.liability_type == "buy-to-let-mortgage" ||
        liability.liability_type == "holiday-home-mortgage" ||
        liability.liability_type == "second-residence-mortgage"
      ) {
        mortgages.push(liability);
      }
    });
    setMortgages(res.data);
    console.log(mortgages);
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
            <FormControl>
              <InputLabel id="demo-simple-select-label">
                Linked Mortgage
              </InputLabel>
              <Select
                name="liability_id"
                label="Mortgage ID"
                value={values.liability_id}
                onChange={handleInputChange}
              >
                <MenuItem value={"0"}>None</MenuItem>
                {mortgages.map((mortgage) => (
                  <MenuItem value={mortgage.id}>
                    {mortgage.description}
                  </MenuItem>
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
