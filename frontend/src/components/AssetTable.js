import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { styled } from "@mui/system";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import { Button, Paper } from "@mui/material";
import AssetOverviewProperty from "../AssetOverviewProperty";
import AssetOverviewInvestment from "../AssetOverviewInvestment";
import AssetOverviewOther from "../AssetOverviewOther";
import axios from "axios";
import { currencyFormat } from "../components/GlobalFunctions";

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

const styleOther = {
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

const styleProperty = {
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
  maxWidth: "60%",
  minWidth: "60%",
  height: "60%",
  bgcolor: "#ffffff",
  boxShadow: 24,
  p: 4,
};

const styleInvestment = {
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
  maxWidth: "90%",
  minWidth: "90%",
  height: "90%",
  bgcolor: "#ffffff",
  boxShadow: 24,
  p: 4,
};

function AssetTable({ properties, investments, otherAssets }) {
  const rows = Array();

  const handleViewInvestmentClose = () => setOpenViewInvestment(false);
  const [openViewInvestment, setOpenViewInvestment] = React.useState(false);
  const [investment, setInvestment] = React.useState(false);

  const handleViewPropertyClose = () => setOpenViewProperty(false);
  const [openViewProperty, setOpenViewProperty] = React.useState(false);
  const [property, setProperty] = React.useState(false);

  const handleViewOtherClose = () => setOpenViewOther(false);
  const [openViewOther, setOpenViewOther] = React.useState(false);
  const [other, setOther] = React.useState(false);

  const handleClick = (category, id) => {
    if (category === "Property") {
      setProperty(id);
      setOpenViewProperty(true);
    } else if (category === "Investment") {
      setInvestment(id);
      setOpenViewInvestment(true);
    } else if (category === "Other Asset") {
      setOther(id);
      setOpenViewOther(true);
    }
  };

  {
    properties.map((property) =>
      rows.push({
        description: property.address,
        id: property.id,
        category: "Property",
        value: currencyFormat(parseFloat(property.value)),
      })
    );
  }

  {
    investments.map((investment) =>
      rows.push({
        description: investment.provider,
        id: investment.investment_id,
        category: "Investment",
        value: currencyFormat(parseFloat(investment.current_value)),
      })
    );
  }

  {
    otherAssets.map((otherAsset) =>
      rows.push({
        description: otherAsset.description,
        id: otherAsset.id,
        category: "Other Asset",
        value: currencyFormat(parseFloat(otherAsset.value)),
      })
    );
  }

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "category", headerName: "Category", width: 130 },
    { field: "value", headerName: "Value", width: 130 },
    {
      field: "view",
      headerName: "View",
      width: 150,
      renderCell: (params) => (
        <Button onClick={() => handleClick(params.row.category, params.row.id)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ height: "600px", margin: "50px" }}>
      <DataGrid rows={rows} columns={columns} />
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={openViewProperty}
        onClose={handleViewPropertyClose}
        BackdropComponent={Backdrop}
      >
        <Paper sx={styleProperty}>
          <AssetOverviewProperty id={property} />
        </Paper>
      </StyledModal>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={openViewInvestment}
        onClose={handleViewInvestmentClose}
        BackdropComponent={Backdrop}
      >
        <Paper sx={styleInvestment}>
          <AssetOverviewInvestment id={investment} />
        </Paper>
      </StyledModal>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={openViewOther}
        onClose={handleViewOtherClose}
        BackdropComponent={Backdrop}
      >
        <Paper sx={styleOther}>
          <AssetOverviewOther id={other} />
        </Paper>
      </StyledModal>
    </div>
  );
}

export default AssetTable;
