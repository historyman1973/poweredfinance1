import React from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import AdvisorLoginForm from "./components/AdvisorLoginForm";
import IndividualLoginForm from "./components/IndividualLoginForm";
import AdvisorSignupForm from "./components/AdvisorSignupForm";
import IndividualSignupForm from "./components/IndividualSignupForm";

function returnForm(advisorIndividual, signupLogin) {
  if (advisorIndividual == "advisor" && signupLogin == "login") {
    return <AdvisorLoginForm />;
  } else if (advisorIndividual == "individual" && signupLogin == "login") {
    return <IndividualLoginForm />;
  } else if (advisorIndividual == "advisor" && signupLogin == "signup") {
    return <AdvisorSignupForm />;
  } else if (advisorIndividual == "individual" && signupLogin == "signup") {
    return <IndividualSignupForm />;
  }
}

function Landing() {
  const [advisorIndividual, setAdvisorIndividual] = React.useState("");
  const [signupLogin, setSignupLogin] = React.useState("");
  const handleChangeAdvisorIndividual = (event) => {
    setAdvisorIndividual(event.target.value);
  };
  const handleChangeSignupLogin = (event) => {
    setSignupLogin(event.target.value);
  };
  return (
    <div>
      <div class="row">
        <div style={{ textAlign: "center", display: "block" }}>
          <img src="https://i.imgur.com/5upfeud.png" width="70%" />
        </div>
        <hr />
      </div>
      <div class="row">
        <Box
          sx={{
            display: "block",
            margin: "auto",
            marginTop: "30px",
            width: "200px",
            maxWidth: "90%",
            fontSize: "large",
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">I'm an</InputLabel>
            <Select
              value={advisorIndividual}
              label="I'm an"
              onChange={handleChangeAdvisorIndividual}
            >
              <MenuItem value={"advisor"}>Advisor</MenuItem>
              <MenuItem value={"individual"}>Individual</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth style={{ marginTop: "10px" }}>
            <InputLabel id="demo-simple-select-label">and I</InputLabel>
            <Select
              value={signupLogin}
              label="and I"
              onChange={handleChangeSignupLogin}
            >
              <MenuItem value={"login"}>have an account</MenuItem>
              <MenuItem value={"signup"}>don't have an account</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
      <div style={{ marginTop: "30px" }}>
        {returnForm(advisorIndividual, signupLogin)}
      </div>
    </div>
  );
}

export default Landing;
