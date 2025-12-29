import React, { useState, useRef, useEffect } from "react";
import {
  FiGrid,
  FiMaximize,
  FiBell,
  FiMail,
  FiMessageCircle,
  FiUser,
  FiSettings,
  FiCreditCard,
  FiLogOut,
  FiCheckSquare,
  FiFileText,
  FiDollarSign,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const dropdownRef = useRef(null);
  const appsRef = useRef(null);

  const navigate = useNavigate();

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (appsRef.current && !appsRef.current.contains(event.target)) {
        setAppsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigate + close dropdowns
  const go = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
    setAppsOpen(false);
  };

  // Fullscreen toggle function
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 sm:left-64 h-[56px] flex items-center pl-14 pr-3 sm:px-4 lg:px-6 shadow-md z-50 bg-[#343d46]">
      {/* Digital Clock - Hidden on mobile, visible on md+ */}
      <div
        className="hidden md:flex items-center gap-2 mr-3 lg:mr-4 px-2 lg:px-3 py-0 rounded-sm"
        style={{ width: "140px", minWidth: "140px" }}
      >
        <div className="flex flex-col items-center w-full text-center">
          <span
            className="text-white text-base lg:text-lg font-semibold tracking-wide leading-tight"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </span>

          <span className="text-white text-xs font-medium">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Search - Responsive width - Small and properly spaced on mobile */}
      <div className="flex-1 flex justify-start max-w-full sm:max-w-[240px] md:max-w-[280px] lg:max-w-md relative">
        <div className="w-full max-w-[140px] sm:max-w-full relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-8 sm:h-9 pl-2.5 sm:pl-3 pr-2 sm:pr-20 rounded bg-gray-800 text-white 
      placeholder-gray-400 text-xs sm:text-sm focus:outline-none"
          />
          <span
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 
    text-gray-400 text-xs bg-[#2c323a] px-1 rounded hidden sm:block"
          >
            CTRL + /
          </span>
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 ml-auto">
        {/* Fullscreen Toggle Button - Hidden on mobile */}
        <button
          onClick={toggleFullScreen}
          className="hidden md:block text-white text-lg p-2 hover:bg-[#414b57] rounded transition-colors"
        >
          <FiMaximize />
        </button>

        {/* Apps Dropdown - Hidden on mobile */}
        <div className="relative" ref={appsRef}>
          <button
            onClick={() => setAppsOpen(!appsOpen)}
            className="hidden md:block text-white text-lg p-2 hover:bg-[#414b57] rounded transition-colors"
          >
            <FiGrid />
          </button>

          {appsOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-sm shadow-lg p-3 z-50">
              <h3 className="text-sm font-semibold px-2 mb-2">Applications</h3>

              <div className="flex flex-col gap-1">
                <button
                  onClick={() => go("/additional/todo")}
                  className="flex items-center gap-3 px-3 py-2 text-sm rounded hover:bg-gray-100"
                >
                  <FiCheckSquare className="text-gray-600" /> To Do
                </button>

                <button
                  onClick={() => go("/additional/notes")}
                  className="flex items-center gap-3 px-3 py-2 text-sm rounded hover:bg-gray-100"
                >
                  <FiFileText className="text-gray-600" /> Notes
                </button>

                <button
                  onClick={() => go("/invoices")}
                  className="flex items-center gap-3 px-3 py-2 text-sm rounded hover:bg-gray-100"
                >
                  <FiDollarSign className="text-gray-600" /> Invoices
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Chat - Responsive */}
        <button
          onClick={() => go("/chat")}
          className="relative text-white text-base sm:text-lg p-1.5 sm:p-2 hover:bg-[#414b57] rounded transition-colors"
        >
          <FiMessageCircle />
          <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-blue-500 text-white text-[10px] sm:text-xs w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-semibold">
            5
          </span>
        </button>

        {/* Mail - Responsive */}
        <button
          onClick={() => go("/mail")}
          className="relative text-white text-base sm:text-lg p-1.5 sm:p-2 hover:bg-[#414b57] rounded transition-colors"
        >
          <FiMail />
          <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-blue-500 text-white text-[10px] sm:text-xs w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-semibold">
            5
          </span>
        </button>

        {/* Notifications - Responsive */}
        <button
          onClick={() => go("/notifications")}
          className="relative text-white text-base sm:text-lg p-1.5 sm:p-2 hover:bg-[#414b57] rounded transition-colors"
        >
          <FiBell />
          <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-500 text-white text-xs w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" />
        </button>

        {/* USER MENU - Responsive */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="focus:outline-none ml-1"
          >
            <img
              src="https://i.pravatar.cc/32"
              alt="User Avatar"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-600 cursor-pointer"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-[#343d46] rounded-full" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-3 sm:px-4 py-2 sm:py-3 border-b">
                <p className="text-xs sm:text-sm font-semibold">Kevin Larry</p>
                <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                  warren@example.com
                </p>
              </div>

              <div className="py-1 sm:py-2">
                <button
                  onClick={() => go("/profile")}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm flex items-center gap-2 sm:gap-3 hover:bg-gray-100 transition-colors"
                >
                  <FiUser /> My Profile
                </button>

                <button
                  onClick={() => go("/settings")}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm flex items-center gap-2 sm:gap-3 hover:bg-gray-100 transition-colors"
                >
                  <FiSettings /> Settings
                </button>

                <button
                  onClick={() => go("/billing")}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm flex items-center gap-2 sm:gap-3 hover:bg-gray-100 transition-colors"
                >
                  <FiCreditCard /> Billing
                </button>
              </div>

              <button
                onClick={() => go("/logout")}
                className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm flex items-center gap-2 sm:gap-3 hover:bg-gray-100 border-t transition-colors"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
