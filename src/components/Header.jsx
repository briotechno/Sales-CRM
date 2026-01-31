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
  FiSearch,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FileSignature, Wallet, Shield } from "lucide-react";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const dropdownRef = useRef(null);
  const appsRef = useRef(null);
  const searchInputRef = useRef(null);

  const navigate = useNavigate();

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

  const go = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
    setAppsOpen(false);
    setSearchValue("");
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const allPages = [
    { name: "Main Dashboard", path: "/dashboard", category: "Dashboards" },
    { name: "HRM Dashboard", path: "/hrm/dashboard", category: "Dashboards" },
    { name: "CRM Dashboard", path: "/crm/dashboard", category: "Dashboards" },
    { name: "Employee List", path: "/hrm/employee/all", category: "HRM" },
    { name: "All Leads", path: "/crm/leads/all", category: "CRM" },
    { name: "New Leads", path: "/crm/leads/new", category: "CRM" },
    { name: "Manage Teams", path: "/hrm/teams", category: "HRM" },
    { name: "Attendance Management", path: "/hrm/attendance", category: "HRM" },
    { name: "Leave Management", path: "/hrm/leave/all", category: "HRM" },
    { name: "Department Management", path: "/hrm/department", category: "HRM" },
    { name: "Designation Management", path: "/hrm/designation", category: "HRM" },
    { name: "Salary Management", path: "/hrm/salary", category: "HRM" },
    { name: "Company Policies", path: "/hrm/company-policy", category: "HRM" },
    { name: "HR Policies", path: "/hrm/hr-policy", category: "HRM" },
    { name: "Job Management", path: "/hrm/job-management", category: "Recruitment" },
    { name: "Invoices", path: "/additional/invoice", category: "Financial" },
    { name: "Business Info", path: "/settings/business-info", category: "Settings" },
  ];

  const searchResults = searchValue.length > 0
    ? allPages.filter(page => {
      const q = searchValue.toLowerCase();
      const name = page.name.toLowerCase();
      const cat = page.category.toLowerCase();
      const isDashboardTypo = q.includes("dash") && (q.includes("bi") || q.includes("bo"));
      return name.includes(q) || cat.includes(q) || (isDashboardTypo && name.includes("dashboard"));
    }).reduce((acc, curr) => {
      const cat = acc.find(c => c.category === curr.category);
      if (cat) cat.items.push(curr);
      else acc.push({ category: curr.category, items: [curr] });
      return acc;
    }, [])
    : [];

  return (
    <header className="fixed top-0 left-0 right-0 md:left-[280px] h-[64px] flex items-center px-4 lg:px-8 z-40 bg-white border-b border-gray-100 transition-all duration-300">
      {/* Search Bar */}
      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-md group">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF7B1D] transition-colors"
            size={16}
          />
          <input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search leads, employees, or dashboards..."
            className="w-full h-10 pl-10 pr-16 rounded-full bg-gray-100 border-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 placeholder-gray-400 text-sm outline-none transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-[10px] font-medium text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded uppercase tracking-tighter">CTRL</span>
            <span className="text-[10px] font-medium text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">/</span>
          </div>
        </div>

        {/* Search Results Dropdown */}
        {searchValue && isSearchFocused && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-y-auto max-h-[70vh] animate-fadeIn py-2 z-50 custom-scrollbar">
            {searchResults.length > 0 ? (
              searchResults.map((cat, idx) => (
                <div key={idx} className="mb-2 last:mb-0">
                  <div className="px-4 py-1 flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{cat.category}</h3>
                    <div className="h-px flex-1 ml-4 bg-gray-50" />
                  </div>
                  {cat.items.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => go(item.path)}
                      className="w-full px-4 py-2.5 flex items-center justify-between group hover:bg-[#FF7B1D]/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#FF7B1D] group-hover:bg-white transition-all border border-transparent group-hover:border-orange-100">
                          <FiFileText size={14} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#FF7B1D]">{item.name}</span>
                      </div>
                      <FiGrid size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-gray-50/30">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-100">
                  <FiSearch size={20} className="text-gray-300" />
                </div>
                <p className="text-sm text-gray-600 font-medium">No matches for <span className="text-[#FF7B1D]">"{searchValue}"</span></p>
                <p className="text-[11px] text-gray-400 mt-1">Try searching for HRM, Dashboard, or Leads</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-3 ml-6">
        {/* Digital Clock */}
        <div className="hidden lg:flex flex-col items-center mr-4">
          <span className="text-sm font-bold text-black leading-none uppercase">
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
          <span className="text-[10px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleFullScreen}
            className="p-2.5 text-gray-500 hover:bg-gray-100 hover:text-orange-500 rounded-xl transition-all"
            title="Fullscreen"
          >
            <FiMaximize size={20} />
          </button>

          <div className="relative" ref={appsRef}>
            <button
              onClick={() => setAppsOpen(!appsOpen)}
              className={`p-2.5 rounded-xl transition-all ${appsOpen ? "bg-orange-50 text-orange-500" : "text-gray-500 hover:bg-gray-100"}`}
              title="Apps"
            >
              <FiGrid size={20} />
            </button>
            {appsOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 z-50 animate-fadeIn">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "To Do", icon: <FiCheckSquare />, path: "/additional/todo", color: "text-blue-500" },
                    { name: "Notes", icon: <FiFileText />, path: "/additional/notes", color: "text-purple-500" },
                    { name: "Invoices", icon: <FiDollarSign />, path: "/additional/invoice", color: "text-green-500" },
                    { name: "Expenses", icon: <Wallet />, path: "/additional/expenses", color: "text-orange-500" },
                  ].map((app, i) => (
                    <button
                      key={i}
                      onClick={() => go(app.path)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                    >
                      <div className={`p-2 rounded-lg bg-gray-50 ${app.color}`}>{app.icon}</div>
                      <span className="text-xs font-semibold text-gray-600">{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => go("/additional/messenger")}
            className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
          >
            <FiMessageCircle size={20} />
            <span className="absolute top-2 right-2 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 text-[8px] text-white items-center justify-center font-bold">5</span>
            </span>
          </button>

          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className={`relative p-2.5 rounded-xl transition-all ${notificationOpen ? "bg-orange-50 text-orange-500" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <FiBell size={20} />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>

        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-lg transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.firstName?.charAt(0).toUpperCase()}
              {user?.lastName?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left ml-1">
              <p className="text-[13px] font-bold text-gray-800 leading-tight">
                {user?.firstName?.toLowerCase() || "user"}
              </p>
              <p className="text-[10px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wide flex items-center gap-1">
                {user?.role || "Member"}
              </p>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
              <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-800">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{user?.email}</p>
              </div>
              <div className="p-2">
                {[
                  { name: "My Profile", icon: <FiUser />, path: "/profile" },
                  { name: "Account Settings", icon: <FiSettings />, path: "/settings" },
                  { name: "Payment Details", icon: <FiCreditCard />, path: "/billing" },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => go(item.path)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
                  >
                    <span className="text-gray-400">{item.icon}</span>
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-gray-100">
                <button
                  onClick={() => go("/logout")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <FiLogOut /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
