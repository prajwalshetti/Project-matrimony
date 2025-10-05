import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

function LandingPage() {
  const [showHeart, setShowHeart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowHeart(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-100 flex items-center justify-center overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200 to-red-200 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

      <div className="text-center relative z-10 px-4">
        {/* Character Animation Container */}
        <div className="relative h-48 mb-12">
          {/* Bride */}
          <div className="absolute left-1/2 -translate-x-[200px] top-0 w-32 h-32 md:w-40 md:h-40 bg-white rounded-full shadow-2xl flex flex-col items-center justify-center animate-[slideInLeft_1.5s_ease-out_forwards] opacity-0">
            <div className="text-5xl md:text-6xl mb-2">👰</div>
            <div className="px-4 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs md:text-sm font-semibold rounded-full shadow-lg">
              Bride
            </div>
          </div>

          {/* Groom */}
          <div className="absolute right-1/2 translate-x-[200px] top-0 w-32 h-32 md:w-40 md:h-40 bg-white rounded-full shadow-2xl flex flex-col items-center justify-center animate-[slideInRight_1.5s_ease-out_forwards] opacity-0">
            <div className="text-5xl md:text-6xl mb-2">🤵</div>
            <div className="px-4 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs md:text-sm font-semibold rounded-full shadow-lg">
              Groom
            </div>
          </div>

          {/* Heart Animation */}
          <div 
            className={`absolute top-16 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
              showHeart ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}
          >
            <Heart className="w-12 h-12 md:w-16 md:h-16 fill-red-500 text-red-500 animate-pulse" />
          </div>
        </div>

        {/* Title Section */}
        <div className="space-y-4 mt-8">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 mb-3" style={{ fontFamily: "'Great Vibes', cursive" }}>
            Vaishya Samaja Matrimony
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Find Your Perfect Match
          </h2>
          
          <p className="text-gray-600 text-base md:text-lg mb-8 max-w-md mx-auto">
            Connecting Hearts in the Vaishya Community
          </p>

          {/* Enter Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="group px-8 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-lg font-semibold rounded-full shadow-2xl hover:shadow-orange-300 transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-3"
          >
            <span>Enter</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
        
        @keyframes slideInLeft {
          0% {
            left: -200px;
            opacity: 0;
          }
          100% {
            left: calc(50% - 200px);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          0% {
            right: -200px;
            opacity: 0;
          }
          100% {
            right: calc(50% - 200px);
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          @keyframes slideInLeft {
            0% {
              left: -150px;
              opacity: 0;
            }
            100% {
              left: calc(50% - 150px);
              opacity: 1;
            }
          }

          @keyframes slideInRight {
            0% {
              right: -150px;
              opacity: 0;
            }
            100% {
              right: calc(50% - 150px);
              opacity: 1;
            }
          }
        }
      `}</style>
    </div>
  );
}

export default LandingPage;