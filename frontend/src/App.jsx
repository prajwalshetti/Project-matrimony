import { useState } from 'react'
import './App.css'
import {BrowserRouter,Route, Routes} from "react-router-dom"; 
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Profile from './components/Profile.jsx';
import Preferences from './components/Preferences.jsx';
import Requests from './components/Requests.jsx';
import Search from './components/Search.jsx';
import Connections from './components/Connections.jsx';
import Feedback from './components/Feedback.jsx';
import LandingPage from './components/LandingPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
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
      </AuthProvider>

    </BrowserRouter>
  );
}

export default App