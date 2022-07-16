import React, { useState } from "react";
import {
  FormControl,
  Grid,
  TextField,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useForm, Form } from "./useForm";
import Controls from "./controls/Controls";
import axios from "axios";
import { toast } from "react-toastify";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

function BasicDateTimePicker(existingDate) {
  const [value, setValue] = React.useState(new Date(existingDate.existingDate));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        renderInput={(props) => <TextField {...props} />}
        label="DateTimePicker"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
      />
    </LocalizationProvider>
  );
}

export default function EditTransactionForm({ transaction }) {
  const ttypeOptions = [
    { id: "buy", title: "Buy" },
    { id: "sell", title: "Sell" },
  ];

  const initialFValues = {
    ttype: transaction.ttype,
    tdate: transaction.tdate,
    price: transaction.price,
    units: transaction.units,
  };

  const validate = () => {
    let temp = {};
    temp.ttype = values.ttype ? "" : "Required field.";
    temp.units = values.units ? "" : "Required field.";
    temp.price = values.price ? "" : "Required field.";
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x === "");
  };

  const { values, handleInputChange, errors, setErrors } =
    useForm(initialFValues);

  const handleSubmit = async (e) => {
    if (!validate()) {
      e.preventDefault();
    } else {
      e.preventDefault();
      editTransaction(values);
      window.location.reload(false);
    }
  };

  const editTransaction = async (values) => {
    try {
      await axios.patch(
        `http://127.0.0.1:5000/edit-transaction/` + transaction.id,
        values
      );
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div
      style={{
        height: "auto",
        width: "auto",
        display: "grid",
        margin: "20px",
      }}
    >
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid container xs={12} alignItems="center" justifyContent="center">
            <Grid container xs={8} alignItems="center" justifyContent="center">
              <Controls.Input
                type="number"
                label="Units"
                name="units"
                value={values.units}
                onChange={handleInputChange}
                error={errors.units}
              />
              <Controls.Input
                type="number"
                label="Price each"
                name="price"
                value={values.price}
                onChange={handleInputChange}
                error={errors.price}
              />
              <BasicDateTimePicker existingDate={transaction.tdate} />
            </Grid>
            <Grid container xs={4} alignItems="center" justifyContent="center">
              <FormControl>
                <Controls.RadioGroup
                  name="ttype"
                  label="Type"
                  value={values.ttype}
                  onChange={handleInputChange}
                  items={ttypeOptions}
                />
              </FormControl>
            </Grid>
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
