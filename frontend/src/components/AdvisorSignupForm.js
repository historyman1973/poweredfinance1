import { Grid } from "@mui/material";
import React from "react";
import Controls from "./controls/Controls";
import { useForm, Form } from "./useForm";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const initialFValues = {
  username: "",
  password: "",
  forename: "",
  surname: "",
};

export default function AdvisorSignupForm() {
  const navigate = useNavigate();
  const signup = async (values) => {
    try {
      await axios.post(`http://127.0.0.1:5000/add-user`, values);
      navigate("/clientlist");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const validate = () => {
    let temp = {};
    temp.forename = values.username ? "" : "Username must be provided.";
    temp.surname = values.password ? "" : "Password must be provided.";
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
      e.preventDefault();
      signup(values);
    }
  };

  return (
    <div
      style={{
        height: "auto",
        width: "800px",
        maxWidth: "90%",
        display: "grid",
        margin: "auto",
      }}
    >
      <Form onSubmit={handleSubmit}>
        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={8}>
            <Controls.Input
              name="username"
              label="Username"
              value={values.username}
              onChange={handleInputChange}
              error={errors.username}
            />
            <Controls.Input
              label="Password"
              name="password"
              value={values.password}
              onChange={handleInputChange}
              error={errors.password}
            />
            <Controls.Input
              label="Forename"
              name="forename"
              value={values.forename}
              onChange={handleInputChange}
              error={errors.forename}
            />
            <Controls.Input
              label="Surname"
              name="surname"
              value={values.surname}
              onChange={handleInputChange}
              error={errors.surname}
            />
            <div>
              <Controls.Button
                style={{ float: "right", marginTop: "20px" }}
                text="Advisor signup"
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
