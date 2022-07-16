import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slide,
} from "@mui/material";
import AdvisorLoginForm from "./components/AdvisorLoginForm";
import IndividualLoginForm from "./components/IndividualLoginForm";

function returnForm(type) {
  if (type == "advisor") {
    return <AdvisorLoginForm />;
  } else if (type == "individual") {
    return <IndividualLoginForm />;
  }
}

function Landing() {
  const [type, setType] = React.useState("");
  const handleChange = (event) => {
    setType(event.target.value);
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
            <Select value={type} label="I'm an" onChange={handleChange}>
              <MenuItem value={"advisor"}>Advisor</MenuItem>
              <MenuItem value={"individual"}>Individual</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
      <div style={{ marginTop: "30px" }}>{returnForm(type)}</div>
    </div>
  );
}

export default Landing;
