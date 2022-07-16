import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { currencyFormat } from "../components/GlobalFunctions";
import Moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { ThemeProvider } from "@mui/styles";
import { Button } from "@mui/material";
import EditTransactionForm from "./EditTransactionForm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TransactionTable({ transactions }) {
  const [transaction, setTransaction] = React.useState(false);
  const handleCloseDeleteTransaction = () => setOpenDeleteTransaction(false);
  const [openDeleteTransaction, setOpenDeleteTransaction] =
    React.useState(false);
  const handleCloseEditTransaction = () => setOpenEditTransaction(false);
  const [openEditTransaction, setOpenEditTransaction] = React.useState(false);
  const [transactionEdit, setTransactionEdit] = React.useState(false);

  const deleteTransaction = async () => {
    try {
      try {
        await axios.delete(
          `http://127.0.0.1:5000/delete-transaction/` + transaction
        );
        console.log("Deleted transaction " + transaction);
        window.location.reload(true);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "holdingId", headerName: "Holding ID", width: 100 },
    { field: "transactionId", headerName: "Transaction ID", width: 100 },
    { field: "ttype", headerName: "Type", width: 100, flex: 1 },
    {
      field: "tdate",
      headerName: "Date",
      width: 250,
      flex: 1,
    },
    { field: "units", headerName: "Units", width: 130, flex: 1 },
    { field: "price", headerName: "Price", width: 180, flex: 1 },
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleClick(params.row.transactionId, "delete")}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleClick(params.row.transactionId, "edit")}
          showInMenu
        />,
      ],
    },
  ];

  const handleClick = async (id, method) => {
    if (method === "edit") {
      try {
        const resTransaction = await axios.get(
          `http://127.0.0.1:5000/get-transaction/` + id
        );
        setTransactionEdit(resTransaction.data);
        setOpenEditTransaction(true);
      } catch (error) {
        console.log(error);
      }
    } else if (method === "delete") {
      setTransaction(id);
      setOpenDeleteTransaction(true);
    }
  };

  const returnTable = () => {
    const rows = [];
    transactions.map((transaction) =>
      rows.push({
        id: rows.length + 1,
        holdingId: transaction.holding_id,
        transactionId: transaction.id,
        ttype: transaction.ttype,
        tdate: Moment(transaction.tdate).format("DD-MM-YYYY"),
        units: transaction.units,
        price: currencyFormat(parseFloat(transaction.price)),
      })
    );
    return <DataGrid rows={rows} columns={columns} disableColumnMenu />;
  };

  return (
    <div>
      <div
        style={{
          height: "600px",
          width: "100%",
          margin: "50px",
          marginTop: "20px",
        }}
      >
        {returnTable()}
      </div>
      <Dialog
        open={openDeleteTransaction}
        onClose={handleCloseDeleteTransaction}
        TransitionComponent={Transition}
      >
        <ThemeProvider>
          <AppBar
            sx={{ position: "relative" }}
            style={{ background: "#ff00ff" }}
          >
            <Toolbar variant="dense">
              <Typography sx={{ ml: 3, flex: 1 }} variant="h6" component="div">
                Delete transaction
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={handleCloseDeleteTransaction}
              >
                Close
              </Button>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        <div
          style={{
            height: "auto",
            width: "500px",
            marginLeft: "20px",
            marginTop: "20px",
          }}
        >
          <div class="row">
            <div>
              <h4>Are you sure?</h4>
              Please confirm you want to delete transaction ID {transaction.id}.
            </div>
          </div>
          <div
            class="row"
            style={{
              justifyContent: "right",
              marginRight: "20px",
              marginTop: "10px",
              marginBottom: "20px",
            }}
          >
            <div style={{ padding: "0px" }}>
              <Button
                style={{ float: "right" }}
                onClick={() => {
                  deleteTransaction();
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={openEditTransaction}
        onClose={handleCloseEditTransaction}
        TransitionComponent={Transition}
        PaperProps={{
          style: { borderRadius: 10 },
        }}
      >
        <ThemeProvider>
          <AppBar
            sx={{ position: "relative" }}
            style={{ background: "#ff00ff" }}
          >
            <Toolbar variant="dense">
              <Typography sx={{ ml: 3, flex: 1 }} variant="h6" component="div">
                Edit transaction
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={handleCloseEditTransaction}
              >
                Close
              </Button>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        <div style={{ margin: "20px" }}>
          <EditTransactionForm transaction={transactionEdit} />
        </div>
      </Dialog>
    </div>
  );
}

export default TransactionTable;
