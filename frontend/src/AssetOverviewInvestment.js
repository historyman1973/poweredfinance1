import React, { useEffect, useState } from "react";
import axios from "axios";
import HoldingTable from "./components/HoldingTable";
import { Button, ModalUnstyled, Paper } from "@mui/material";
import { styled } from "@mui/styles";
import AddTransactionForm from "./components/AddTransactionForm";

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  zIndex: 1300,
  p: 2,
  px: 4,
  pb: 3,
  borderRadius: 5,
  position: "fixed",
  overflowY: "auto",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "40%",
  minWidth: 100,
  bgcolor: "#ffffff",
  boxShadow: 24,
  p: 4,
};

function AssetOverviewInvestment(id) {
  const [investment, setInvestment] = useState([]);
  const handleAddTransactionOpen = () => setOpen(true);
  const handleAddTransactionClose = () => setOpen(false);
  const [open, setOpen] = React.useState(false);
  const [holdings, setHoldings] = useState([]);

  const getInvestment = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-investment/` + id.id
    );
    setInvestment(res.data || []);
  };

  const getHoldingsForInvestment = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-holding-data/` + id.id
    );
    setHoldings(res.data || []);
  };

  useEffect(() => getInvestment(), []);
  useEffect(() => getHoldingsForInvestment(), []);

  return (
    <div>
      <div
        class="main-container"
        style={{ width: "80%", margin: "auto", marginTop: 25 }}
      >
        <div
          style={{
            height: "auto",
            marginLeft: "10%",
            marginRight: "10%",
            marginTop: 20,
            padding: 5,
          }}
        >
          <h1>{investment.provider}</h1>
          <hr />
          <h3>{investment.investment_type}</h3>
          {investment.investment_ref}
          <br />
          <Button
            onClick={handleAddTransactionOpen}
            variant="outlined"
            size="large"
            style={{ marginTop: "30px" }}
          >
            Add transaction
          </Button>
          <StyledModal
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
            open={open}
            onClose={handleAddTransactionClose}
            BackdropComponent={Backdrop}
          >
            <Paper sx={style}>
              <AddTransactionForm investmentId={id.id} />
            </Paper>
          </StyledModal>
          <HoldingTable holdings={holdings} />
        </div>
      </div>
    </div>
  );
}

export default AssetOverviewInvestment;
