import React from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { useForm, Form } from "./useForm";
import Controls from "./controls/Controls";
import axios from "axios";
import { toast } from "react-toastify";

const initialFValues = {
  investment_type: "",
  category: "",
  provider: "",
  investment_ref: "",
  owner1_id: window.location.pathname.split("/")[2],
  owner2_id: "",
};

export default function AddInvestmentForm() {
  const validate = () => {
    let temp = {};
    temp.provider = values.provider
      ? ""
      : "Please enter the investment account's provider.";
    temp.investment_type = values.investment_type ? "" : "Required field.";
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
      addInvestment(values);
      window.location.reload(false);
    }
  };

  const addInvestment = async (values) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:5000/add-investment`,
        values
      );
      console.log(
        await axios.get(
          `http://127.0.0.1:5000/get-investments/` +
            window.location.pathname.split("/")[2]
        )
      );
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div style={{ height: "auto", width: "auto", display: "grid" }}>
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid container xs={12} alignItems="center" justifyContent="center">
            <Controls.Input
              label="Provider"
              name="provider"
              value={values.provider}
              onChange={handleInputChange}
              error={errors.provider}
            />
            <Controls.Input
              label="Reference"
              name="investment_ref"
              value={values.investment_ref}
              onChange={handleInputChange}
              error={errors.investment_ref}
            />
            <Controls.Input
              label="Category"
              name="category"
              value={values.category}
              onChange={handleInputChange}
              error={errors.category}
            />
            <FormControl>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                name="investment_type"
                label="Type"
                value={values.investment_type}
                onChange={handleInputChange}
              >
                <MenuItem value={"retirement"}>Retirement</MenuItem>
                <MenuItem value={"non-retirement"}>Non retirement</MenuItem>
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
