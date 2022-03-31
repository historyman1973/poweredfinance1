import { DataGrid } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import axios from "axios";
import { Link } from "@mui/material";

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

const style = {
  p: 2,
  px: 4,
  pb: 3,
  borderRadius: 5,
  position: "fixed",
  overflowY: "auto",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "50%",
  minWidth: "50%",
  height: "50%",
  bgcolor: "#ffffff",
  boxShadow: 24,
  p: 4,
};

function HoldingTable({ investmentId }) {
  const [holdings, setHoldings] = useState([]);

  const rows = Array();

  useEffect(() => getHoldingsForInvestment(), []);

  const getHoldingsForInvestment = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-holdings/` + investmentId
    );
    setHoldings(res.data || []);
  };

  const getInstrumentName = async (id) => {
    const resTicker = await axios.get(
      `http://127.0.0.1:5000/get-instrument/` + id
    );
    const res = await axios.get(
      `http://127.0.0.1:5000/get-ticker/` + resTicker.data.symbol
    );
    return res.data[0].name;
  };

  const getHoldingValue = async (id, units) => {
    const resTicker = await axios.get(
      `http://127.0.0.1:5000/get-instrument/` + id
    );
    const resPrice = await axios.get(
      `http://127.0.0.1:5000/get-latest-data/` + resTicker.data[0].close
    );
    return resPrice * units;
  };

  const getTicker = async (id) => {
    const resTicker = await axios.get(
      `http://127.0.0.1:5000/get-instrument/` + id
    );
    return resTicker.data.symbol;
  };

  {
    holdings.map((holding) =>
      rows.push({
        id: holding.id,
        instrument_id: holding.instrument_id,
        instrument_name: getInstrumentName(holding.instrument_id),
        units: holding.units,
        value: getHoldingValue(holding.instrument_id, holding.units),
        view: getTicker(holding.instrument_id),
      })
    );
  }

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "instrument_id", headerName: "Instrument ID", width: 100 },
    {
      field: "instrument_name",
      headerName: "Name",
      width: 150,
    },
    { field: "units", headerName: "Units", width: 130 },
    { field: "value", headerName: "Value", width: 130 },
    {
      field: "view",
      headerName: "View",
      width: 150,
      renderCell: (params) => (
        <Link href={`security/${params.value}`}>View</Link>
      ),
    },
  ];

  return (
    <div style={{ height: "600px", margin: "50px" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}

export default HoldingTable;
