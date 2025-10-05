import { useState } from 'react'
import './App.css'
import {BrowserRouter,Route, Routes} from "react-router-dom"; 
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Profile from './components/Profile';
import Preferences from './components/Preferences';
import Requests from './components/Requests';
import Search from './components/Search';
import Connections from './components/Connections';
import Feedback from './components/Feedback';
import LandingPage from './components/LandingPage';
function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Profile />} />
          <Route path="preferences" element={<Preferences />} /> 
          <Route path="requests" element={<Requests />} /> 
          <Route path="search" element={<Search />} /> 
          <Route path="connections" element={<Connections />} /> 
          <Route path="feedback" element={<Feedback />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App