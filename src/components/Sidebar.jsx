import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { departmentApi } from "../store/api/departmentApi";
import { designationApi } from "../store/api/designationApi";
import { employeeApi } from "../store/api/employeeApi";
import { businessApi } from "../store/api/businessApi";
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
          console.error("Failed to parse permissions", e);
          return false;
        }
      }

      // Safety check
      if (!perms) return false;

      // Handle both object-based module permissions and flat ID-based permissions

      // 1. Check if the key itself is a granted permission (Flat structure: { "perm_id": true })
      if (perms[key] === true) return true;

      // 2. Check if it's a module object (Module structure: { "Module Name": { "read": true } })
      const modulePerms = perms[key];
      if (modulePerms && typeof modulePerms === 'object') {
        if (modulePerms.read === true || modulePerms.view === true || modulePerms.view_all === true) {
          return true;
        }
      }

      // 3. Fallback for specific IDs if key looks like one
      // If we use IDs like 'attendance_view_all' in the permission field, step 1 handles it.

      return false;
    }

    return false;
  };


  const menuItems = [
    {
      section: "Dashboard",
      items: [
        {
          name: "Dashboard",
          icon: <LayoutDashboard size={22} />,
          path: "/dashboard",
          permission: "Dashboard" // Matches JSON key
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
          name: "CRM Dashboard",
          icon: <LayoutDashboard size={22} />,
          path: "/crm/dashboard",
          permission: "CRM Dashboard"
        },
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
          permission: "Champions Management",
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
          name: "HRM Dashboard",
          icon: <LayoutDashboard size={22} />,
          path: "/hrm/dashboard",
          permission: "HRM Dashboard"
        },
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
          permission: "Terms & Conditions Management"
        },
        {
          name: "Salary", icon: <Wallet size={22} />, path: "/hrm/salary", permission: "Salary Management"
        },
        {
          name: "Company Policy",
          icon: <FileText size={22} />,
          path: "/hrm/company-policy",
          permission: "Company Policy"
        },
        {
          name: "HR Policy",
          icon: <FileText size={22} />,
          path: "/hrm/hr-policy",
          permission: "HR Policy"
        },
        {
          name: "Job Management",
          icon: <Briefcase size={22} />,
          path: "/hrm/job-management",
          permission: "Job Management"
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
          permission: "Catelogs",
          children: [
            { name: "All Catelogs", path: "/additional/catelogs" },
            { name: "Categories", path: "/additional/catalog-categories" },
          ],
        },
        {
          name: "Messenger",
          icon: <MessageSquare size={22} />,
          path: "/additional/messenger",
          permission: "Messenger"
        },
        {
          name: "Notes",
          icon: <StickyNote size={22} />,
          path: "/additional/notes",
          permission: "Notes"
        },
        {
          name: "To-Do",
          icon: <CheckSquare size={22} />,
          path: "/additional/todo",
          permission: "ToDo"
        },
        {
          name: "Quotation",
          icon: <FileSignature size={22} />,
          path: "/additional/quotation",
          permission: "Quotation"
        },
        {
          name: "Invoice",
          icon: <FileSpreadsheet size={22} />,
          path: "/additional/invoice",
          permission: "Invoice"
        },
        {
          name: "My Expenses",
          icon: <Wallet size={22} />,
          path: "/additional/expenses",
          permission: "Expense Management"
        },
        {
          name: "Notification",
          icon: <Bell size={22} />,
          path: "/additional/notification",
          permission: "Notification"
        },
        {
          name: "Announcement",
          icon: <Megaphone size={22} />,
          path: "/additional/announcement",
          permission: "Announcement",
          children: [
            { name: "All Announcement", path: "/additional/announcement" },
            { name: "Categories", path: "/additional/announcement/category" },
          ],
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
          permission: "Business Info"
        },
        {
          name: "Manage Subscription",
          icon: <BarChart3 size={22} />,
          path: "/settings/subscription",
          permission: "Subscription"
        },

        {
          name: "FAQ",
          icon: <HelpCircle size={22} />,
          path: "/settings/faq",
          permission: "FAQ"
        },
        { name: "Logout", icon: <LogOut size={22} />, path: "/logout" },
      ],
    },
  ];

  /* Filtering */
  const filteredMenuItems = menuItems
    .filter((section) => {
      if (section.section === "Super Admin") {
        return user?.role === "Super Admin";
      }
      return true;
    })
    .map((section) => {
      const filteredItems = section.items
        .filter((item) => {
          if (item.name === "Logout") return true;
          if (!item.permission) return true;
          return checkPermission(item.permission);
        })
        .map((item) => {
          if (item.children) {
            const filteredChildren = item.children.filter((child) => {
              if (!child.permission) return true;
              return checkPermission(child.permission);
            });
            return {
              ...item,
              children: filteredChildren.length > 0 ? filteredChildren : undefined,
            };
          }
          return item;
        });
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

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white text-black shadow-lg flex flex-col p-2 transition-all duration-300 z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 w-64`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-2 py-3 mb-2">
          <h2 className="text-xl font-bold text-gray-800">
            Sales+
            <span className="text-[#FF7B1D]">CRM</span>
          </h2>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {filteredMenuItems.map((section, index) => (
            <React.Fragment key={index}>
              {index === 0 ? (
                <>
                  {/* Dashboard Item */}
                  {section.items.map((item) => {
                    const isActive = activeItem === item.path;
                    return (
                      <div key={item.name} className="mb-2">
                        <Link
                          to={item.path}
                          className={`flex items-center gap-2 px-4 py-2 rounded-sm font-semibold transition-all duration-200 ${isActive
                            ? "bg-[#FF7B1D] text-white"
                            : "hover:bg-gray-100 text-black"
                            }`}
                          onClick={() => {
                            handleItemClick(item.path);
                          }}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      </div>
                    );
                  })}

                  {/* Main Menu Label */}
                  {/* Show tag only if following sections exist */}
                  {filteredMenuItems.length > 1 && (
                    <p className="mt-4 mb-2 text-[11px] font-semibold tracking-wide text-gray-500 px-2">
                      MAIN MENU
                    </p>
                  )}
                </>
              ) : (
                <>
                  {/* Section Heading */}
                  <p className="mt-3 mb-2 text-[11px] font-semibold tracking-wide text-gray-500 px-2">
                    {section.section.toUpperCase()}
                  </p>

                  {section.items.map((item) => {
                    const hasChildren =
                      item.children && item.children.length > 0;
                    const parentActive = isParentActive(item);
                    const isOpenThis = openMenu === item.name;

                    return (
                      <div key={item.name} className="mb-[2px]">
                        {!hasChildren ? (
                          <Link
                            to={item.path}
                            ref={parentActive ? activeItemRef : null}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-sm font-semibold transition-all duration-200 text-[15px] ${parentActive
                              ? "bg-[#FF7B1D] text-white shadow-sm"
                              : "hover:bg-gray-100 text-black"
                              }`}
                            onClick={() => {
                              handleItemClick(item.path);
                            }}
                          >
                            {item.icon}
                            <span>{item.name}</span>
                          </Link>
                        ) : (
                          <>
                            <div
                              className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-sm cursor-pointer transition-colors duration-200 font-semibold text-[15px] ${parentActive
                                ? "text-[#FF7B1D]"
                                : "text-black hover:bg-gray-100"
                                }`}
                              onClick={() => toggleMenu(item.name)}
                            >
                              <div className="flex items-center gap-2">
                                {item.icon}
                                <span>{item.name}</span>
                              </div>
                              <ChevronDown
                                size={12}
                                className={`transition-transform duration-300 ${isOpenThis ? "rotate-180" : ""
                                  }`}
                              />
                            </div>

                            {/* Submenu */}
                            <ul
                              className={`ml-4 border-l pl-3 mt-1 overflow-hidden transition-all duration-300 ease-in-out ${isOpenThis
                                ? "max-h-64 opacity-100"
                                : "max-h-0 opacity-0"
                                }`}
                            >
                              {item.children.map((sub) => {
                                const subActive = activeItem === sub.path;
                                return (
                                  <li key={sub.name} className="relative">
                                    <Link
                                      to={sub.path}
                                      ref={subActive ? activeItemRef : null}
                                      className={`block px-2 py-1 rounded-sm transition-colors duration-200 text-[13px] ${subActive
                                        ? "text-[#FF7B1D] font-semibold before:content-[''] before:absolute before:left-[-8px] before:top-0 before:h-full before:w-[2px] before:bg-[#FF7B1D]"
                                        : "text-black hover:text-[#FF7B1D]"
                                        }`}
                                      onClick={() => {
                                        handleItemClick(sub.path);
                                        setOpenMenu(item.name);
                                      }}
                                    >
                                      {sub.name}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </React.Fragment>
          ))}
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
      `}</style>
    </>
  );
};

export default Sidebar;
