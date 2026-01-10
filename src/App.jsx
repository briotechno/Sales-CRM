import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CompanyProfile from "./pages/Public/CompanyProfile";
import Dashboard from "./pages/Dashboard";
// CRM Dashboard
import CRMDashboard from "./pages/CrmDashboard/dashboard";
// HRM Dashboard
import HrmDashboard from "./pages/HrmDashboard/dashboard";
// Leads Managament part
import LeadDashboard from "./pages/LeadsManagement/dashboard";
import AllLeads from "./pages/LeadsManagement/AllLeadPagePart/AllLaeds";
import NewLeads from "./pages/LeadsManagement/NewLeads";
import Assigned from "./pages/LeadsManagement/Assigned";
import UnreadLeads from "./pages/LeadsManagement/UnreadLeads";
import DroppedLeads from "./pages/LeadsManagement/DroppedLeads";
import TrendingLeads from "./pages/LeadsManagement/Trending";
import Analysis from "./pages/LeadsManagement/Analysis";

import LeadProfile from "./pages/LeadsManagement/LeadProfilePageParts/LeadProfile";

import AddNotes from "./components/LeadManagement/LeadPipLineStatus/AddNotes";
import CreateCallLogModal from "./components/LeadManagement/LeadPipLineStatus/CreateCallLogModal";

//pipline management part
import ManagePipline from "./pages/PipelineManagement/ManagePipline";
import ManageStage from "./pages/PipelineManagement/ManageStage";
import Analytics from "./pages/PipelineManagement/Analytics";
// Department part
import AllDepartment from "./pages/DepartmentPart/AllDepartment";
// Designation part
import AllDesignation from "./pages/DesignationPart/Designation";
// Term & Condition Part
import AllTermCondition from "./pages/Term & Condition/AllTerm";
// Employee part
import AllEmployee from "./pages/EmployeePart/AllEmployee";
import EmployeeProfile from "./pages/EmployeePart/AllEmployee/Profile.jsx";

// unused generally
// My Profile
import MyProfile from "./pages/Profile/MyProfile";

// Attendance Part
import AllAttendance from "./pages/AttendancePart/AllAttendance";
import EmployeeAttendance from "./pages/AttendancePart/EmployeeAttendance"; // Import this

import ManageAttendance from "./pages/AttendancePart/ManageAttendancePart/ManageAttendance";
// Leave Management Part
import AllLeave from "./pages/LeaveManagement/AllLeave";
import Holiday from "./pages/LeaveManagement/Holiday";
import ManageLeave from "./pages/LeaveManagement/Manage";
// Salary Management Part
import AllSalary from "./pages/SalaryManagement/AllSalary";
// Company Policy Part
import AllCompanyPolicy from "./pages/CompanyPolicyPart/AllCompanyPolicy";
// HR Policy Part
import AllHRPolicy from "./pages/HrPolicyPage/AllHRPolicy";

// Jobs management
import Job from "./pages/JobManagement/Job";
// Notes  Part
import AllNotes from "./pages/NotesPart/AllNotes";
// To Do Part
import AllToDo from "./pages/ToDoPart/AllToDo";
// My Expanses Part
import MyExpanses from "./pages/MyExpansePart/MyExpanses";
// Quotation Part
import AllQuotation from "./pages/QuotationPart/AllQuotation";
// Invoice Part
import AllInvoice from "./pages/InvoicePart/AllInvoice";
// Notification Part
import Notification from "./pages/NotificationPart/Notification";
// Anouncement Part
import AllAnouncement from "./pages/AnouncementPart/AllAnouncement";
import AnnouncementCategoryPage from "./pages/AnouncementPart/Category";
// Client Management Part
import ClientManagement from "./pages/ClientManagement/ClientManagement";
// Business Info Part
import BusinessInfo from "./pages/BusinessInfoPart/BusinessInfo";
// Manage Subscription Part
import ManageSubscription from "./pages/ManageSubscription/ManageSubscription";

// Champion Management
import Lead from "./pages/ChampionsManagement/Lead";

// FAQ Part
import Faq from "./pages/Faq/Faq";
// Messenger Part
import Messenger from "./pages/MessengerPart/Messenger";
// Catelogs Part
import Catelogs from "./pages/CatelogsPart/Catelogs";
import CatalogView from "./pages/CatelogsPart/CatalogView";
import CatalogCategory from "./pages/CatelogsPart/CatalogCategory";
// Team Management
import TeamManagement from "./pages/TeamManagement/Team";
// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Packages from "./pages/Packages.jsx";
import LandingPage from "./pages/LandingPage";

// logout

import Logout from "./pages/Logout";
// Header components
import NotificationPage from "./pages/TopBarComponents/Notification";
import MailPage from "./pages/TopBarComponents/MailPage";
// Reminder
import LeadsReminder from "./components/Reminder";
// Meeting reminder
import MeetingReminder from "./components/Meeting";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/business/:id" element={<CompanyProfile />} />
        <Route path="/catalog/view/:id" element={<CatalogView />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/logout" element={<Logout />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/mail" element={<MailPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crm/dashboard" element={<CRMDashboard />} />
          <Route path="/crm/leads/all" element={<AllLeads />} />
          <Route path="/crm/leads/new" element={<NewLeads />} />
          <Route path="/crm/leads/assigned" element={<Assigned />} />
          <Route path="/crm/leads/unread" element={<UnreadLeads />} />
          <Route path="/crm/leads/dropped" element={<DroppedLeads />} />
          <Route path="/crm/leads/trending" element={<TrendingLeads />} />
          <Route path="/crm/leads/analysis" element={<Analysis />} />
          <Route path="/crm/leads/profile/:id" element={<LeadProfile />} />
          <Route path="/crm/leads/add-notes" element={<AddNotes />} />
          <Route path="/crm/leads/dashboard" element={<LeadDashboard />} />
          <Route
            path="/crm/leads/create-call-log"
            element={<CreateCallLogModal />}
          />
          <Route path="/crm/champions/lead" element={<Lead />} />
          <Route path="/crm/pipeline/manage" element={<ManagePipline />} />
          <Route path="/crm/pipeline/stages" element={<ManageStage />} />
          <Route path="/crm/pipeline/analytics" element={<Analytics />} />
          <Route path="/hrm/dashboard" element={<HrmDashboard />} />
          <Route path="/hrm/department" element={<AllDepartment />} />
          <Route path="/hrm/designation" element={<AllDesignation />} />
          <Route path="/hrm/terms" element={<AllTermCondition />} />
          <Route path="/hrm/employee/all" element={<AllEmployee />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/employee-profile/:id" element={<EmployeeProfile />} />
          <Route path="/hrm/attendance" element={<AllAttendance />} />
          <Route path="/hrm/attendance/employee" element={<EmployeeAttendance />} />

          <Route path="/hrm/attendance/manage" element={<ManageAttendance />} />
          <Route path="/hrm/leave/all" element={<AllLeave />} />
          <Route path="/hrm/leave/holiday" element={<Holiday />} />
          <Route path="/hrm/leave/manage" element={<ManageLeave />} />
          <Route path="/hrm/salary" element={<AllSalary />} />
          <Route path="/hrm/company-policy" element={<AllCompanyPolicy />} />
          <Route path="/hrm/hr-policy" element={<AllHRPolicy />} />
          <Route path="/hrm/job-management" element={<Job />} />
          <Route path="/additional/notes" element={<AllNotes />} />
          <Route path="/additional/todo" element={<AllToDo />} />
          <Route path="/additional/expenses" element={<MyExpanses />} />
          <Route path="/additional/quotation" element={<AllQuotation />} />
          <Route path="/additional/invoice" element={<AllInvoice />} />
          <Route path="/additional/notification" element={<Notification />} />
          <Route path="/additional/announcement" element={<AllAnouncement />} />
          <Route path="/additional/announcement/category" element={<AnnouncementCategoryPage />} />
          <Route path="/crm/client/all" element={<ClientManagement />} />
          <Route path="/settings/business-info" element={<BusinessInfo />} />
          <Route path="/settings/subscription" element={<ManageSubscription />} />
          <Route path="/settings/faq" element={<Faq />} />
          <Route path="/additional/messenger" element={<Messenger />} />
          <Route path="/additional/catelogs" element={<Catelogs />} />
          <Route path="/additional/catalog-categories" element={<CatalogCategory />} />
          <Route path="/hrm/teams" element={<TeamManagement />} />
        </Route>
      </Routes>
      <LeadsReminder />
      <MeetingReminder />
    </Router>
  );
}

export default App;
