import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Clients from '../clients';
import Dashboard from '../dashboard';
import Assets from '../assets';
import Liabilities from '../liabilities';
import Settings from '../settings';
import Support from '../support';

const Layout = () => {
  return (
    <Routes>
      <Route path='/' element={<Clients />}></Route>
      <Route path='/dashboard' element={<Dashboard />}></Route>
      <Route path='/assets' element={<Assets />}></Route>
      <Route path='/liabilities' element={<Liabilities />}></Route>
      <Route path='/settings' element={<Settings />}></Route>
      <Route path='/support' element={<Support />}></Route>
    </Routes>
  );
}

export default Layout;