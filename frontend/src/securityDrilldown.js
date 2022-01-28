import React, { Component } from "react";
import Header from "./components/Header";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DataGrid } from '@mui/x-data-grid';
import { Container } from "@mui/material";


class SecurityDrilldown extends Component {

  render() {
    return (
      <div>
        <Header />
        <div class="main-container">
            <ResponsiveContainer>
                <div>
                    <h1>AMZN</h1>
                    <h2>Amazon, Inc</h2>
                    <h4>$3,459.33</h4>
                </div>
            </ResponsiveContainer>
        </div>
      </div>
    );
  }
}

export default SecurityDrilldown;