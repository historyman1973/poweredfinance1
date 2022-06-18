import abbreviate from "number-abbreviate";

export function formatLiabilityType(type) {
  if (type === "credit-card") {
    return "Credit Card";
  } else if (type === "main-residence-mortgage") {
    return "Main Residence Mortgage";
  } else if (type === "commercial-mortgage") {
    return "Commercial Mortgage";
  } else if (type === "buy-to-let-mortgage") {
    return "Buy-to-let Mortgage";
  } else if (type === "holiday-home-mortgage") {
    return "Holiday Home Mortgage";
  } else if (type === "second-residence-mortgage") {
    return "Second Residence Mortgage";
  } else if (type === "personal-loan") {
    return "Personal Loan";
  } else if (type === "miscellaneous") {
    return "Miscellaneous";
  } else {
    return type;
  }
}

export function formatLiabilityCategory(category) {
  if (category === "long-term") {
    return "Long term";
  } else if (category === "short-term") {
    return "Short term";
  } else {
    return category;
  }
}

export function currencyFormat(num) {
  try {
    if (num < 1000) {
      return "£" + abbreviate(num, 0);
    } else if (num === 1000 || (num > 1000 && num < 10000)) {
      return "£" + abbreviate(num, 2);
    } else if (num === 10000 || (num > 10000 && num < 100000)) {
      return "£" + abbreviate(num, 1);
    } else if (num === 100000 || (num > 100000 && num < 1000000)) {
      return "£" + abbreviate(num, 0);
    } else if (num === 1000000 || (num > 1000000 && num < 10000000)) {
      return "£" + abbreviate(num, 2);
    } else if (num === 10000000 || (num > 10000000 && num < 100000000)) {
      return "£" + abbreviate(num, 1);
    } else if (num === 100000000 || (num > 100000000 && num < 1000000000)) {
      return "£" + abbreviate(num, 0);
    } else if (num === 1000000000 || (num > 1000000000 && num < 10000000000)) {
      return "£" + abbreviate(num, 2);
    } else if (num === 1000000000 || (num > 1000000000 && num < 10000000000)) {
      return "£" + abbreviate(num, 1);
    } else if (num === 1000000000 || (num > 1000000000 && num < 10000000000)) {
      return "£" + abbreviate(num, 0);
    } else {
      return "£" + abbreviate(num);
    }
  } catch (e) {
    console.log(e);
  }
}
