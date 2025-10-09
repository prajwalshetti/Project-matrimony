import { NavLink, useNavigate } from "react-router-dom";
import { User, Settings, Search, Users, Heart, MessageSquare, Menu, X, LogOut,LogIn } from 'lucide-react';
import { useState } from "react";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import NotLoggedIn from './other_components/NotLoggedIn';

function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { userid, clearAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/logoutuser",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        // Clear context and localStorage
        clearAuth();
        
        // Close mobile menu
        setMobileMenuOpen(false);
        
        // Redirect to login
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const NavItem = ({ to, children, end = false }) => (
    <NavLink
      to={to}
      end={end}
      onClick={() => setMobileMenuOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 w-full ${
          isActive
            ? "text-white bg-gradient-to-r from-orange-500 to-red-500 shadow-lg font-semibold"
            : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
        }`
      }
    >
      {children}
    </NavLink>
  );

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full shadow-md">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-800">Vaishya Samaja</h1>
              <p className="text-xs text-orange-600">Matrimony</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavItem to="/dashboard" end>
              <User className="w-4 h-4" />
              <span>Profile</span>
            </NavItem>

            <NavItem to="/dashboard/preferences">
              <Settings className="w-4 h-4" />
              <span>Preferences</span>
            </NavItem>

            <NavItem to="/dashboard/search">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </NavItem>

            <NavItem to="/dashboard/connections">
              <Users className="w-4 h-4" />
              <span>Connections</span>
            </NavItem>

            <NavItem to="/dashboard/requests">
              <Heart className="w-4 h-4" />
              <span>Requests</span>
            </NavItem>

            <NavItem to="/dashboard/feedback">
              <MessageSquare className="w-4 h-4" />
              <span>Feedback</span>
            </NavItem>

            {/* Logout Button (desktop) */}
            {userid&&<button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-4 h-4" />
              {loggingOut ? "..." : "Logout"}
            </button>}

            {/* Login Button (desktop) */}
            {!userid&&<button
              onClick={()=>{navigate  ("/login")}}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50 border border-green-200 hover:border-green-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="w-4 h-4" />
              {"Login"}
            </button>}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-orange-50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-orange-100">
            <NavItem to="/dashboard" end>
              <User className="w-4 h-4" />
              <span>Profile</span>
            </NavItem>

            <NavItem to="/dashboard/preferences">
              <Settings className="w-4 h-4" />
              <span>Preferences</span>
            </NavItem>

            <NavItem to="/dashboard/search">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </NavItem>

            <NavItem to="/dashboard/connections">
              <Users className="w-4 h-4" />
              <span>Connections</span>
            </NavItem>

            <NavItem to="/dashboard/requests">
              <Heart className="w-4 h-4" />
              <span>Requests</span>
            </NavItem>

            <NavItem to="/dashboard/feedback">
              <MessageSquare className="w-4 h-4" />
              <span>Feedback</span>
            </NavItem>

            {/* Logout/Login Buttons (mobile) */}
            <div className="px-4 space-y-2">
              {userid ? (
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-4 h-4" />
                  {loggingOut ? "..." : "Logout"}
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-xl text-sm font-medium text-green-600 hover:bg-green-50 border border-green-200 hover:border-green-300 transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;