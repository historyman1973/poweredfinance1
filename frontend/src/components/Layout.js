import React from "react";
import { Routes, Route } from "react-router-dom";
import Clients from "../clients";
import Dashboard from "../dashboard";
import Assets from "../assets";
import Liabilities from "../liabilities";
import Settings from "../settings";
import Support from "../support";
import SecurityDrilldown from "../securityDrilldown";
import AssetOverviewProperty from "../AssetOverviewProperty";
import AssetOverviewLifestyle from "../AssetOverviewLifestyle";
import AssetOverviewInvestment from "../AssetOverviewInvestment";

const Layout = () => {
  return (
    <Routes>
      <Route path="/" element={<Clients />}></Route>
      <Route path="/dashboard/*" element={<Dashboard />}></Route>
      <Route
        path="/assets/:id/property/:propertyid"
        element={<AssetOverviewProperty />}
      ></Route>
      <Route
        path="/assets/:id/lifestyleasset/:lifestyleassetid"
        element={<AssetOverviewLifestyle />}
      ></Route>
      <Route
        path="/assets/:id/investment/:investmentid"
        element={<AssetOverviewInvestment />}
      ></Route>
      <Route path="/assets/:id" element={<Assets />}></Route>
      <Route path="/liabilities/:id" element={<Liabilities />}></Route>
      <Route path="/settings/:id" element={<Settings />}></Route>
      <Route path="/support/:id" element={<Support />}></Route>
      <Route path="/security/:ticker" element={<SecurityDrilldown />}></Route>
    </Routes>
  );
};

export default Layout;
