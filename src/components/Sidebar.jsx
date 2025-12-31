import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
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
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [openMenu, setOpenMenu] = useState("");
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("/");
  const activeItemRef = React.useRef(null);
  const dispatch = useDispatch();

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

  const menuItems = [
    {
      section: "Dashboard",
      items: [
        {
          name: "Dashboard",
          icon: <LayoutDashboard size={22} />,
          path: "/dashboard",
        },
      ],
    },
    {
      section: "CRM",
      items: [
        {
          name: "CRM Dashboard",
          icon: <LayoutDashboard size={22} />,
          path: "/crm/dashboard",
        },

        {
          name: "Leads Management",
          icon: <Users size={22} />,
          path: "/crm/leads",
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
          children: [
            { name: "Manage Pipeline", path: "/crm/pipeline/manage" },
            { name: "Analytics", path: "/crm/pipeline/analytics" },
          ],
        },
        {
          name: "Client Management",
          icon: <Briefcase size={22} />,
          path: "/crm/client",
          children: [
            { name: "All Client", path: "/crm/client/all" },
            { name: "Active Client", path: "/crm/client/active" },
            { name: "Inactive", path: "/crm/client/inactive" },
          ],
        },
        {
          name: "Channel Integration",
          icon: <Share2 size={22} />,
          path: "/crm/channel",
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
        },
        {
          name: "Team Management",
          icon: <Users size={22} />,
          path: "/hrm/teams",
        },
        {
          name: "Attendance",
          icon: <CalendarCheck size={22} />,
          path: null,
          children: [
            {
              name: "All Attendance",
              path: "/hrm/attendance",
            },
            {
              name: "Manage Attendance",
              path: "/hrm/attendance/manage",
            },
          ],
        },
        {
          name: "Leave Management",
          icon: <ClipboardList size={22} />,
          path: "/hrm/leave",
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

        },
        {
          name: "Department",
          icon: <Briefcase size={22} />,
          path: "/hrm/department",
        },
        {
          name: "Designation",
          icon: <FileText size={22} />,
          path: "/hrm/designation",
        },
        {
          name: "Terms & Conditions",
          icon: <FileSignature size={22} />,
          path: "/hrm/terms",
        },
        { name: "Salary", icon: <Wallet size={22} />, path: "/hrm/salary" },
        {
          name: "Company Policy",
          icon: <FileText size={22} />,
          path: "/hrm/company-policy",
        },
        {
          name: "HR Policy",
          icon: <FileText size={22} />,
          path: "/hrm/hr-policy",
        },
        {
          name: "Job Management",
          icon: <Briefcase size={22} />,
          path: "/hrm/job-management",
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
        },
        {
          name: "Messenger",
          icon: <MessageSquare size={22} />,
          path: "/additional/messenger",
        },
        {
          name: "Notes",
          icon: <StickyNote size={22} />,
          path: "/additional/notes",
        },
        {
          name: "To-Do",
          icon: <CheckSquare size={22} />,
          path: "/additional/todo",
        },
        {
          name: "Quotation",
          icon: <FileSignature size={22} />,
          path: "/additional/quotation",
        },
        {
          name: "Invoice",
          icon: <FileSpreadsheet size={22} />,
          path: "/additional/invoice",
        },
        {
          name: "My Expenses",
          icon: <Wallet size={22} />,
          path: "/additional/expenses",
        },
        {
          name: "Notification",
          icon: <Bell size={22} />,
          path: "/additional/notification",
        },
        {
          name: "Announcement",
          icon: <Megaphone size={22} />,
          path: "/additional/announcement",
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
        },
        {
          name: "Manage Subscription",
          icon: <BarChart3 size={22} />,
          path: "/settings/subscription",
        },

        {
          name: "FAQ",
          icon: <HelpCircle size={22} />,
          path: "/settings/faq",
        },
        { name: "Logout", icon: <LogOut size={22} />, path: "/logout" },
      ],
    },
  ];

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
          {menuItems.map((section, index) => (
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
                  <p className="mt-4 mb-2 text-[11px] font-semibold tracking-wide text-gray-500 px-2">
                    MAIN MENU
                  </p>
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
