import React from "react";
import { Routes, Route } from "react-router-dom";
import Clients from "../clients";
import Dashboard from "../dashboard";
import Assets from "../assets";
import Liabilities from "../liabilities";
import Settings from "../settings";
import Reports from "../reports";
import SecurityDrilldown from "../securityDrilldown";

const Layout = () => {
  return (
    <Routes>
      <Route path="/" element={<Clients />}></Route>
      <Route path="/dashboard/*" element={<Dashboard />}></Route>
      <Route path="/assets/:id" element={<Assets />}></Route>
      <Route path="/liabilities/:id" element={<Liabilities />}></Route>
      <Route path="/settings/:id" element={<Settings />}></Route>
      <Route path="/reports/:id" element={<Reports />}></Route>
      <Route path="/security/:ticker" element={<SecurityDrilldown />}></Route>
    </Routes>
  );
};

export default Layout;
