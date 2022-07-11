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

function BasicDateTimePicker() {
  const [value, setValue] = React.useState(new Date("2022-01-01T10:00:00"));

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

export default function AddTransactionForm({ allInstruments }) {
  const ttypeOptions = [
    { id: "buy", title: "Buy" },
    { id: "sell", title: "Sell" },
  ];

  const initialFValues = {
    investment_id: 3,
    instrument_id: "",
    ttype: "",
    tdate: new Date("2022-01-01T10:00:00"),
    price: "",
    units: "",
    owner1_id: window.location.pathname.split("/")[2],
    owner2_id: 1,
  };

  const validate = () => {
    let temp = {};
    temp.instrument_id = values.instrument_id
      ? ""
      : "Please enter the instrument ID.";
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
      addTransaction(values);
      window.location.reload(false);
    }
  };

  const addTransaction = async (values) => {
    try {
      await axios.post(`http://127.0.0.1:5000/add-transaction`, values);
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
              <FormControl>
                <InputLabel id="demo-simple-select-label">
                  Instrument
                </InputLabel>
                <Select
                  name="instrument_id"
                  label="Instrument"
                  value={values.instrument_id}
                  onChange={handleInputChange}
                  error={errors.instrument_id}
                  MenuProps={MenuProps}
                >
                  {allInstruments.map((instrument) => (
                    <MenuItem value={instrument.id}>
                      {instrument.symbol} - {instrument.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              <BasicDateTimePicker />
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
