import React from "react";
import { Grid } from "@mui/material";
import { useForm, Form } from "./useForm";
import Controls from "./controls/Controls";
import axios from "axios";
import { toast } from "react-toastify";

export function formatLiabilityType(type) {
  if (type == "credit-card") {
    return "Credit Card";
  } else if (type == "main-residence-mortgage") {
    return "Main Residence Mortgage";
  } else if (type == "commercial-mortgage") {
    return "Commercial Mortgage";
  } else if (type == "buy-to-let-mortgage") {
    return "Buy-to-let Mortgage";
  } else if (type == "holiday-home-mortgage") {
    return "Holiday Home Mortgage";
  } else if (type == "second-residence-mortgage") {
    return "Second Residence Mortgage";
  } else if (type == "personal-loan") {
    return "Personal Loan";
  } else if (type == "miscellaneous") {
    return "Miscellaneous";
  } else {
    return type;
  }
}

export function formatLiabilityCategory(category) {
  if (category == "secured") {
    return "Secured";
  } else if (category == "unsecured") {
    return "Unsecured";
  } else {
    return category;
  }
}

export function currencyFormat(num) {
  try {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  } catch (e) {
    console.log(e);
  }
}
