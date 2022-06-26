import React, { useEffect, useState } from "react";
import axios from "axios";
import TransactionTable from "./components/TransactionTable";

function TransactionOverview(holdingId) {
  const [transactions, setTransactions] = useState([]);

  const getTransactions = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/get-transactions/holding/` + holdingId.holdingId
    );
    setTransactions(res.data || []);
    console.log(res.data);
  };

  useEffect(() => getTransactions(), []);

  return (
    <div>
      <div
        style={{
          height: "auto",
          marginLeft: "10%",
          marginRight: "10%",
          marginTop: 20,
          padding: 5,
        }}
      >
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
}

export default TransactionOverview;
