import React from "react";
import { FormControl, Grid, TextField } from "@mui/material";
import { useForm, Form } from "./useForm";
import Controls from "./controls/Controls";
import axios from "axios";
import { toast } from "react-toastify";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateAdapter from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

export default function AddTransactionForm(investment_id) {
  const ttypeOptions = [
    { id: "buy", title: "Buy" },
    { id: "sell", title: "Sell" },
  ];

  const initialFValues = {
    investment_id: investment_id.investmentId,
    instrument_id: "",
    ttype: "",
    tdate: new Date("2022-01-01T10:00:00"),
    price: "0",
    units: "",
    owner1_id: window.location.pathname.split("/")[2],
    owner2_id: 1,
  };

  const [datePicked, setDatePicked] = React.useState(
    new Date("2022-01-01T10:00:00")
  );
  const handleDateChange = (newDate) => {
    setDatePicked(newDate);
  };

  const validate = () => {
    let temp = {};
    temp.instrument_id = values.instrument_id
      ? ""
      : "Please enter the instrument ID.";
    temp.ttype = values.ttype ? "" : "Required field.";
    temp.units = values.units ? "" : "Required field.";
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
      addTransaction(values);
      window.location.reload(false);
    }
  };

  const addTransaction = async (values) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:5000/add-transaction`,
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
        <h3>Add Transaction</h3>
      </div>
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid container xs={12} alignItems="center" justifyContent="center">
            <Controls.Input
              label="Instrument ID"
              name="instrument_id"
              value={values.instrument_id}
              onChange={handleInputChange}
              error={errors.instrument_id}
            />
            <Controls.Input
              type="number"
              label="Units"
              name="units"
              value={values.units}
              onChange={handleInputChange}
              error={errors.units}
            />
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DesktopDatePicker
                label="Date"
                inputFormat="MM/dd/yyyy"
                value={datePicked}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
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
