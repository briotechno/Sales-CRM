import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { departmentApi } from "../store/api/departmentApi";
import { designationApi } from "../store/api/designationApi";
import { employeeApi } from "../store/api/employeeApi";
import { businessApi } from "../store/api/businessApi";
import { permissionCategories } from "../pages/EmployeePart/permissionsData";
import {
  LayoutDashboard,
  ChevronDown,
  Briefcase,
  Users,
  ClipboardList,
  MessageSquare,
  StickyNote,
  CheckSquare,
  FileSignature,
  FileSpreadsheet,
  Wallet,
  Bell,
  Megaphone,
  Settings,
  LogOut,
  FolderKanban,
  BarChart3,
  Share2,
  CalendarCheck,
  FileText,
  Menu,
  X,
  HelpCircle,
  Building2,
  CreditCard,
  KeyRound,
  Package,
  Shield,
  Search,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [openMenu, setOpenMenu] = useState("");
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("/");
  const activeItemRef = React.useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleItemClick = (path) => {
    setActiveItem(path);
    if (window.innerWidth < 768) setIsOpen(false);

    // Force re-fetch for specific routes by invalidating RTK Query tags
    if (path === "/hrm/department") {
      dispatch(departmentApi.util.invalidateTags(["Department"]));
    } else if (path === "/hrm/designation") {
      dispatch(designationApi.util.invalidateTags(["Designation"]));
    } else if (path === "/hrm/employee/all") {
      dispatch(employeeApi.util.invalidateTags(["Employee"]));
    } else if (path === "/settings/business-info") {
      dispatch(businessApi.util.invalidateTags(["BusinessInfo"]));
    }
  };

  useEffect(() => {
    setActiveItem(location.pathname);
    // Auto-open parent menu if child is active
    menuItems.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children) {
          const hasActiveChild = item.children.some(
            (child) => child.path === location.pathname
          );
          if (hasActiveChild) {
            setOpenMenu(item.name);
          }
        }
      });
    });

    // Scroll active item into view after a short delay to ensure DOM is updated
    setTimeout(() => {
      if (activeItemRef.current) {
        const element = activeItemRef.current;
        const container = element.closest(".overflow-y-auto");
        if (container) {
          const elementTop = element.offsetTop;
          const offset = 80;

          container.scrollTo({
            top: elementTop - offset,
            behavior: "smooth",
          });
        }
      }
    }, 100);
  }, [location.pathname]);

  const toggleMenu = (name) => {
    setOpenMenu((prev) => (prev === name ? "" : name));
  };

  const isParentActive = (item) => {
    if (item.path === activeItem) return true;
    if (item.children) {
      return item.children.some((c) => c.path === activeItem);
    }
    return false;
  };

  const checkPermission = (key) => {
    // If no user, or if role is missing, deny
    if (!user) return false;

    // Super Admin and Admin have full access
    if (user.role === 'Super Admin' || user.role === 'Admin') return true;

    // Employee Access Check
    if (user.role === 'Employee') {
      let perms = user.permissions;

      // Parse if string
      if (typeof perms === 'string') {
        try {
          perms = JSON.parse(perms);
        } catch (e) {
          return false;
        }
      }

      // Safety check
      if (!perms) return false;

      // 1. NEW Flat Array Structure (Array of strings)
      if (Array.isArray(perms)) {
        // Direct match (for specific IDs like 'attendance_view_all')
        if (perms.includes(key)) return true;

        // Category match using permissionCategories
        // This is the most accurate way since it checks if any ID in the category is granted
        const categoryPerms = permissionCategories[key];
        if (categoryPerms) {
          return categoryPerms.some(cp => perms.includes(cp.id));
        }

        // Fallback: Module match (check if any 'view' or 'read' permission exists for this module)
        const moduleKey = key.toLowerCase().replace(/\s+/g, '_');
        const fallbackMatch = perms.some(p =>
          (p.startsWith(moduleKey) || p.includes(moduleKey.split('_')[0])) &&
          (p.includes('view') || p.includes('read') || p.includes('use'))
        );
        if (fallbackMatch) return true;

        return false;
      }

      // 2. OLD Object Structure (Backward Compatibility)
      // Check if the key itself is a granted permission (Flat object: { "perm_id": true })
      if (perms[key] === true) return true;

      // Check if it's a module object (Module structure: { "Module Name": { "read": true } })
      const modulePerms = perms[key];
      if (modulePerms && typeof modulePerms === 'object') {
        if (modulePerms.read === true || modulePerms.view === true || modulePerms.view_all === true) {
          return true;
        }
      }

      return false;
    }

    return false;
  };

  // Module Configuration
  const modules = [
    { id: "dashboard", name: "Dashboard", icon: <LayoutDashboard size={20} />, section: "Dashboard" },
    { id: "crm", name: "CRM", icon: <Users size={20} />, section: "CRM" },
    { id: "hrm", name: "HRM", icon: <Briefcase size={20} />, section: "HRM" },
    { id: "additional", name: "Additional", icon: <Package size={20} />, section: "Additional" },
    { id: "settings", name: "Settings", icon: <Settings size={20} />, section: "Settings" },
  ];

  // Add Super Admin module if user is Super Admin
  const availableModules = user?.role === "Super Admin"
    ? [{ id: "superadmin", name: "Admin", icon: <Shield size={20} />, section: "Super Admin" }, ...modules]
    : modules;

  const [activeModule, setActiveModule] = useState("dashboard");

  // Detect active module from URL
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/superadmin")) setActiveModule("superadmin");
    else if (path.startsWith("/crm")) setActiveModule("crm");
    else if (path.startsWith("/hrm")) setActiveModule("hrm");
    else if (path.startsWith("/additional")) setActiveModule("additional");
    else if (path.startsWith("/settings") || path === "/logout") setActiveModule("settings");
    else if (path === "/dashboard" || path === "/") setActiveModule("dashboard");
  }, [location.pathname]);



  const menuItems = [
    {
      section: "Dashboard",
      items: [
        {
          name: "Dashboard",
          icon: <LayoutDashboard size={22} />,
          path: "/dashboard",
        },
        {
          name: "HRM Dashboard",
          icon: <LayoutDashboard size={22} />,
          path: "/hrm/dashboard",
          permission: "HRM Dashboard"
        },
        {
          name: "CRM Dashboard",
          icon: <LayoutDashboard size={22} />,
          path: "/crm/dashboard",
          permission: "CRM Dashboard"
        },
      ],
    },
    {
      section: "Super Admin",
      items: [
        {
          name: "Admin Dashboard",
          icon: <LayoutDashboard size={22} />,
          path: "/superadmin/dashboard",
          permission: "Super Admin Dashboard"
        },
        {
          name: "Enterprise Management",
          icon: <Building2 size={22} />,
          path: "/superadmin/enterprises",
          permission: "Enterprise Management",
        },
        {
          name: "Subscription Management",
          icon: <CreditCard size={16} />,
          path: "/superadmin/subscriptions",
          permission: "Subscription Management",
        },
        {
          name: "Plan Management",
          icon: <Package size={22} />,
          path: "/superadmin/plans",
          permission: "Plan Management",
        },
        {
          name: "Generate Product Keys",
          icon: <KeyRound size={22} />,
          path: "/superadmin/productkeys",
          permission: "Product Key Management",
        },
        {
          name: "Payment Gateways",
          icon: <Wallet size={22} />,
          path: "/superadmin/paymentgateways",
          permission: "Payment Gateway Management",
          children: [
            { name: "Cashfree", path: "/superadmin/paymentgateways/cashfree" },
            { name: "PhonePay", path: "/superadmin/paymentgateways/PhonePay" },
            { name: "Razorpay", path: "/superadmin/paymentgateways/razorpay" },
          ],
        }
      ],
    },
    {
      section: "CRM",
      items: [
        {
          name: "Leads Management",
          icon: <Users size={22} />,
          path: "/crm/leads",
          permission: "Leads Management",
          children: [
            { name: "Lead Dashboard", path: "/crm/leads/dashboard" },
            { name: "All Leads", path: "/crm/leads/all" },
            { name: "New Leads", path: "/crm/leads/new" },
            { name: "Assigned", path: "/crm/leads/assigned" },
            { name: "Unread Leads", path: "/crm/leads/unread" },
            { name: "Dropped Leads", path: "/crm/leads/dropped" },
            { name: "Trending Leads", path: "/crm/leads/trending" },
            { name: "Analysis", path: "/crm/leads/analysis" },
          ],
        },
        {
          name: "campaign",
          icon: <Users size={16} />,
          path: "/crm/champions",
          permission: "Champions",
          children: [
            { name: "Lead", path: "/crm/champions/lead" },
            { name: "Dialer ", path: "/crm/champions/dialer" },
            { name: "Whatsapp", path: "/crm/champions/whatsapp" },
            { name: "Mail", path: "/crm/champions/mail" },
          ],
        },
        {
          name: "Pipeline Management",
          icon: <FolderKanban size={22} />,
          path: "/crm/pipeline",
          permission: "Pipeline Management",
          children: [
            { name: "Manage Pipeline", path: "/crm/pipeline/manage" },
            { name: "Manage Stages", path: "/crm/pipeline/stages" },
            { name: "Analytics", path: "/crm/pipeline/analytics" },
          ],
        },
        {
          name: "Client Management",
          icon: <Briefcase size={22} />,
          path: "/crm/client/all",
          permission: "Client Management",

        },
        {
          name: "Channel Integration",
          icon: <Share2 size={22} />,
          path: "/crm/channel",
          permission: "Channel Integration",
          children: [
            { name: "Meta", path: "/crm/channel/meta" },
            { name: "Justdial", path: "/crm/channel/justdial" },
            { name: "Indiamart", path: "/crm/channel/indiamart" },
            { name: "Google Docs", path: "/crm/channel/google-docs" },
            { name: "CRM Form", path: "/crm/channel/form" },
          ],
        },
      ],
    },
    {
      section: "HRM",
      items: [
        {
          name: "Team Management",
          icon: <Users size={22} />,
          path: "/hrm/teams",
          permission: "Team Management"
        },
        {
          name: "Attendance",
          icon: <CalendarCheck size={22} />,
          children: [
            {
              name: "My Attendance",
              path: "/hrm/attendance/employee",
            },

            {
              name: "All Attendance",
              path: "/hrm/attendance",
              permission: "attendance_view_all"
            },
            {
              name: "Manage Attendance",
              path: "/hrm/attendance/manage",
              permission: "attendance_edit"
            },
          ],
        },


        {
          name: "Leave Management",
          icon: <ClipboardList size={22} />,
          path: "/hrm/leave",
          permission: "Leave Management",
          children: [
            { name: "Leave", path: "/hrm/leave/all" },
            { name: "Holidays", path: "/hrm/leave/holiday" },
            { name: "Manage leave", path: "/hrm/leave/manage" },
          ],
        },
        {
          name: "Employee",
          icon: <Users size={22} />,
          path: "/hrm/employee/all",
          permission: "Employee Management"
        },
        {
          name: "Department",
          icon: <Briefcase size={22} />,
          path: "/hrm/department",
          permission: "Department Management"
        },
        {
          name: "Designation",
          icon: <FileText size={22} />,
          path: "/hrm/designation",
          permission: "Designation Management"
        },
        {
          name: "Terms & Conditions",
          icon: <FileSignature size={22} />,
          path: "/hrm/terms",
          permission: "Policy & Compliance"
        },
        {
          name: "Salary", icon: <Wallet size={22} />, path: "/hrm/salary", permission: "Financial Management"
        },
        {
          name: "Company Policy",
          icon: <FileText size={22} />,
          path: "/hrm/company-policy",
          permission: "Policy & Compliance"
        },
        {
          name: "HR Policy",
          icon: <FileText size={22} />,
          path: "/hrm/hr-policy",
          permission: "Policy & Compliance"
        },
        {
          name: "Job Management",
          icon: <Briefcase size={22} />,
          permission: "Recruitment",
          children: [
            { name: "Job List", path: "/hrm/job-management", permission: "Recruitment" },
            { name: "Applicant List", path: "/hrm/applicants", permission: "Recruitment" },
            { name: "Offer Letter", path: "/hrm/offer-letters", permission: "Recruitment" },
          ],
        },
      ],
    },
    {
      section: "Additional",
      items: [
        {
          name: "Catelogs",
          icon: <BarChart3 size={22} />,
          path: "/additional/catelogs",
          permission: "Communication Tools",
        },
        {
          name: "Notes",
          icon: <StickyNote size={22} />,
          path: "/additional/notes",
          permission: "Communication Tools"
        },
        {
          name: "To-Do",
          icon: <CheckSquare size={22} />,
          path: "/additional/todo",
          permission: "Task Management"
        },
        {
          name: "Invoice",
          icon: <FileSpreadsheet size={22} />,
          path: "/additional/invoice",
          permission: "Financial Documents"
        },
        {
          name: "My Expenses",
          icon: <Wallet size={22} />,
          path: "/additional/expenses",
          permission: "Financial Management"
        },
        {
          name: "Announcement",
          icon: <Megaphone size={22} />,
          path: "/additional/announcement",
          permission: "Communication Tools",
        },
      ],
    },
    {
      section: "Settings",
      items: [
        {
          name: "Business Info",
          icon: <Settings size={22} />,
          path: "/settings/business-info",
          permission: "System Administration"
        },
        {
          name: "Manage Subscription",
          icon: <BarChart3 size={22} />,
          path: "/settings/subscription",
          permission: "System Administration"
        },

        {
          name: "FAQ",
          icon: <HelpCircle size={22} />,
          path: "/settings/faq",
          permission: "System Administration"
        },
        { name: "Logout", icon: <LogOut size={22} />, path: "/logout" },
      ],
    },
  ];

  /* Filtering */
  const filteredMenuItems = menuItems
    .filter((section) => {
      // Role-based filtering
      if (section.section === "Super Admin" && user?.role !== "Super Admin") {
        return false;
      }

      // Module-wise filtering
      const currentModule = availableModules.find(m => m.id === activeModule);
      return currentModule?.section === section.section;
    })
    .map((section) => {
      const filteredItems = section.items
        .filter((item) => {
          if (item.name === "Logout") return true;

          if (item.permission) {
            return checkPermission(item.permission);
          }
          if (!item.children) return true;
          return true;
        })
        .map((item) => {
          if (item.children) {
            const filteredChildren = item.children.filter((child) => {
              if (child.name === "Logout") return true;
              if (!child.permission) return true;
              return checkPermission(child.permission);
            });

            if (filteredChildren.length === 0 && !item.path && !item.permission) {
              return null;
            }

            return {
              ...item,
              children: filteredChildren.length > 0 ? filteredChildren : undefined,
            };
          }
          return item;
        })
        .filter(Boolean); // Remove null items
      return { ...section, items: filteredItems };
    })
    .filter((section) => section.items.length > 0);


  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden text-2xl text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X strokeWidth={8} /> : <Menu strokeWidth={3} />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white shadow-xl flex transition-all duration-300 z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 w-[280px]`}
      >
        {/* Module Rail - Left */}
        <div className="w-[68px] bg-[#f8f9fa] border-r border-[#eee] flex flex-col items-center py-4 gap-4 z-10 no-scrollbar overflow-y-auto">
          <div className="mb-4">
            <div className="w-10 h-10 bg-[#FF7B1D] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-200">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-3 w-full items-center">
            {availableModules.map((module) => {
              const isActive = activeModule === module.id;
              return (
                <div key={module.id} className="relative group w-full flex justify-center">
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#FF7B1D] rounded-r-full" />
                  )}

                  <button
                    onClick={() => setActiveModule(module.id)}
                    className={`relative p-3 rounded-2xl transition-all duration-300 ${isActive
                      ? "bg-white text-[#FF7B1D] shadow-md scale-110"
                      : "text-gray-400 hover:bg-white hover:text-gray-600 hover:shadow-sm"
                      }`}
                    title={module.name}
                  >
                    {module.icon}
                  </button>

                  {/* Tooltip */}
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 font-medium">
                    {module.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Rail Action */}
          <div className="mt-auto pb-4">
            <button title="Help Center" className="p-3 text-gray-400 hover:text-gray-600">
              <HelpCircle size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Panel - Right */}
        <div className="flex-1 flex flex-col min-w-0 bg-white shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.02)]">
          <div className="px-6 py-6 border-b border-gray-50 mb-2 bg-gradient-to-r from-white to-gray-50/30">
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2 tracking-tight">
              {availableModules.find(m => m.id === activeModule)?.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF7B1D] animate-pulse" />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em]">
                CRM SALES SYSTEM
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 custom-scrollbar">
            {filteredMenuItems.map((section, idx) => (
              <div key={idx} className="mb-8 last:mb-0">
                <div className="flex items-center gap-3 px-3 mb-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    {section.section}
                  </h3>
                  <div className="h-px flex-1 bg-gray-100 opacity-50" />
                </div>

                <div className="space-y-[2px]">
                  {section.items.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const parentActive = isParentActive(item);
                    const isOpenThis = openMenu === item.name;

                    return (
                      <div key={item.name}>
                        {!hasChildren ? (
                          <Link
                            to={item.path}
                            ref={parentActive ? activeItemRef : null}
                            className={`group flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-300 text-[13.5px] whitespace-nowrap ${parentActive
                              ? "bg-[#FF7B1D] text-white shadow-[#FF7B1D]/30 shadow-xl scale-[1.02] -translate-y-0.5"
                              : "hover:bg-gray-50 text-gray-600 hover:text-[#FF7B1D] hover:pl-5"
                              }`}
                            onClick={() => handleItemClick(item.path)}
                          >
                            <span className={`transition-colors duration-300 ${parentActive ? "text-white" : "text-gray-400 group-hover:text-[#FF7B1D]"}`}>
                              {item.icon && React.cloneElement(item.icon, { size: 18 })}
                            </span>
                            <span className="truncate">{item.name}</span>
                          </Link>
                        ) : (
                          <>
                            <div
                              className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300 font-semibold text-[14px] whitespace-nowrap ${parentActive
                                ? "text-[#FF7B1D] bg-orange-50/50"
                                : "text-[#444] hover:bg-gray-50 hover:text-black"
                                }`}
                              onClick={() => toggleMenu(item.name)}
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <span className={parentActive ? "text-[#FF7B1D]" : "text-gray-400"}>
                                  {item.icon && React.cloneElement(item.icon, { size: 18 })}
                                </span>
                                <span className="truncate">{item.name}</span>
                              </div>
                              <ChevronDown
                                size={14}
                                className={`transition-transform duration-300 flex-shrink-0 ${isOpenThis ? "rotate-180" : ""}`}
                              />
                            </div>

                            {/* Submenu */}
                            <div
                              className={`ml-9 overflow-hidden transition-all duration-300 ease-in-out ${isOpenThis ? "max-h-[500px] mt-1 opacity-100" : "max-h-0 opacity-0"}`}
                            >
                              <div className="border-l-2 border-orange-100 pl-3 py-1 space-y-1">
                                {item.children.map((sub) => {
                                  const subActive = activeItem === sub.path;
                                  return (
                                    <Link
                                      key={sub.name}
                                      to={sub.path}
                                      ref={subActive ? activeItemRef : null}
                                      className={`block px-3 py-1.5 rounded-lg transition-all duration-200 text-[13px] font-medium whitespace-nowrap truncate ${subActive
                                        ? "text-[#FF7B1D] bg-orange-50"
                                        : "text-gray-500 hover:text-[#FF7B1D] hover:bg-gray-50"
                                        }`}
                                      onClick={() => {
                                        handleItemClick(sub.path);
                                        setOpenMenu(item.name);
                                      }}
                                    >
                                      {sub.name}
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <style>{`
        /* Custom scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FF7B1D;
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #E66A0D;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
