import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { LogIn, Mail, Lock, UserPlus, Home, AlertCircle, CheckCircle, Heart, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUserid, setName, setIsProfileCompleted } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:8000/api/v1/user/loginuser", {
                email,
                password
            }, { withCredentials: true });

            if (response.status === 200) {
                console.log(response);
                const { _id, name, isProfileCompleted } = response.data;
                
                // Set context values (automatically saved to localStorage via AuthContext)
                setUserid(_id);
                setName(name);
                setIsProfileCompleted(isProfileCompleted || false);
                
                setSuccess("Login successful");
                setTimeout(() => navigate("/dashboard"), 1500);
            } else {
                setError("Login failed");
            }
        } catch (error) {
            setError("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200 to-red-200 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
            
            <div className="max-w-md w-full mx-auto space-y-8 relative z-10">
                {/* Matrimony-themed Card Container */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-orange-100">
                    {/* Header with Gradient Background */}
                    <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 px-8 py-10 text-center">
                        <div className="mx-auto h-16 w-16 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <Heart className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                            Welcome Back
                        </h2>
                    </div>

                    <div className="px-8 py-8 space-y-6">
                        {/* Alerts */}
                        {error && (
                            <div className="flex items-center p-4 bg-red-50 rounded-xl text-red-700 border border-red-200 shadow-sm">
                                <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="flex items-center p-4 bg-green-50 rounded-xl text-green-700 border border-green-200 shadow-sm">
                                <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                                <span className="text-sm">{success}</span>
                            </div>
                        )}

                        {/* Security Badge */}
                        <div className="flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border border-orange-100">
                            <Users className="h-5 w-5 text-orange-600" />
                            <span className="text-sm font-medium text-gray-700">Continue your journey to find your perfect match</span>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-4">
                                {/* Email Field */}
                                <div className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-orange-400" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your.email@example.com"
                                            className="pl-12 w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-gray-800 placeholder-gray-400"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-orange-400" />
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            className="pl-12 w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-gray-800 placeholder-gray-400"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent" />
                                ) : (
                                    <>
                                        <LogIn className="h-5 w-5 mr-2" />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Privacy Note */}
                        <p className="text-xs text-center text-gray-500 px-4">
                            Your login is secure and your information is protected with industry-standard encryption.
                        </p>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">New user?</span>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => navigate("/register")}
                                className="flex items-center justify-center py-3 px-4 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 transition-all"
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Register
                            </button>
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="flex items-center justify-center py-3 px-4 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 transition-all"
                            >
                                <Home className="h-4 w-4 mr-2" />
                                Home
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Login;