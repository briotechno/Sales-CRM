import {
  BarChart,
  Users,
  Award,
  GitBranch,
  Briefcase,
  Calendar,
  FileText,
  FileCheck,
  DollarSign,
  BookOpen,
  ClipboardList,
  MessageSquare,
  StickyNote,
  CheckSquare,
  Wallet,
  Bell,
  Megaphone,
  Shield,
  Settings,
  Database,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download as DownloadIcon,
  Upload,
  UserCheck,
  Mail,
  Phone,
  TrendingUp,
  Target,
  Lock,
  PieChart,
  Activity,
  FileSpreadsheet,
  Package,
} from "lucide-react";

/**
 * Comprehensive Permission Categories for CRM System
 * Each module has granular CRUD permissions
 */
export const permissionCategories = {
  "CRM Dashboard": [
    {
      id: "crm_dashboard_view",
      label: "View Dashboard",
      icon: BarChart,
      description: "Access and view CRM dashboard analytics",
    },

  ],

  "Leads Management": [
    {
      id: "leads_view_all",
      label: "View All Leads",
      icon: Eye,
      description: "View all leads in the system",
    },
    {
      id: "leads_view_own",
      label: "View Own Leads",
      icon: Users,
      description: "View only assigned leads",
    },
    {
      id: "leads_create",
      label: "Create New Leads",
      icon: Plus,
      description: "Add new leads to the system",
    },
    {
      id: "leads_edit",
      label: "Edit Leads",
      icon: Edit,
      description: "Modify existing lead information",
    },
    {
      id: "leads_delete",
      label: "Delete Leads",
      icon: Trash2,
      description: "Remove leads from the system",
    },
    {
      id: "leads_assign",
      label: "Assign Leads",
      icon: UserCheck,
      description: "Assign leads to team members",
    },

  ],



  "Pipeline Management": [
    {
      id: "pipeline_view",
      label: "View Pipeline",
      icon: GitBranch,
      description: "Access sales pipeline overview",
    },
    {
      id: "pipeline_create",
      label: "Create Pipeline",
      icon: Plus,
      description: "Create new sales pipelines",
    },
    {
      id: "pipeline_edit",
      label: "Edit Pipeline",
      icon: Edit,
      description: "Modify existing pipeline settings",
    },
    {
      id: "pipeline_delete",
      label: "Delete Pipeline",
      icon: Trash2,
      description: "Remove pipelines from the system",
    },
    {
      id: "pipeline_stages_manage",
      label: "Manage Pipeline Stages",
      icon: Settings,
      description: "Create, edit, and delete pipeline stages",
    },

  ],

  "Client Management": [
    {
      id: "clients_view_all",
      label: "View All Clients",
      icon: Eye,
      description: "View all client records",
    },
    {
      id: "clients_view_own",
      label: "View Own Clients",
      icon: Users,
      description: "View only assigned clients",
    },
    {
      id: "clients_create",
      label: "Create New Clients",
      icon: Plus,
      description: "Add new clients to the system",
    },
    {
      id: "clients_edit",
      label: "Edit Clients",
      icon: Edit,
      description: "Modify client information",
    },
    {
      id: "clients_delete",
      label: "Delete Clients",
      icon: Trash2,
      description: "Remove client records",
    },

  ],

  "Channel Integration": [
    {
      id: "channels_view",
      label: "View Channels",
      icon: GitBranch,
      description: "View integrated communication channels",
    },
    {
      id: "channels_configure",
      label: "Configure Channels",
      icon: Settings,
      description: "Set up and configure integrations",
    },
    {
      id: "channels_email",
      label: "Email Integration",
      icon: Mail,
      description: "Integrate and use email channels",
    },
    {
      id: "channels_phone",
      label: "Phone Integration",
      icon: Phone,
      description: "Integrate phone systems",
    },
    {
      id: "channels_social",
      label: "Social Media Integration",
      icon: Megaphone,
      description: "Connect social media platforms",
    },
  ],

  "HRM Dashboard": [
    {
      id: "hrm_dashboard_view",
      label: "View HRM Dashboard",
      icon: BarChart,
      description: "Access HR analytics dashboard",
    },

  ],

  "Team Management": [
    {
      id: "team_view",
      label: "View Teams",
      icon: Users,
      description: "View all teams and members",
    },
    {
      id: "team_create",
      label: "Create Teams",
      icon: Plus,
      description: "Create new teams",
    },
    {
      id: "team_edit",
      label: "Edit Teams",
      icon: Edit,
      description: "Modify team information",
    },
    {
      id: "team_delete",
      label: "Delete Teams",
      icon: Trash2,
      description: "Remove teams",
    },
    {
      id: "team_assign_members",
      label: "Assign Team Members",
      icon: UserCheck,
      description: "Add or remove team members",
    },
    {
      id: "team_set_leader",
      label: "Set Team Leaders",
      icon: Award,
      description: "Assign team leadership roles",
    },
  ],

  "Attendance Management": [
    {
      id: "attendance_view_all",
      label: "View All Attendance",
      icon: Eye,
      description: "View attendance records of all employees",
    },
    {
      id: "attendance_view_own",
      label: "View Own Attendance",
      icon: Calendar,
      description: "View personal attendance records",
    },
    {
      id: "attendance_mark",
      label: "Mark Attendance",
      icon: CheckSquare,
      description: "Record daily attendance",
    },
    {
      id: "attendance_edit",
      label: "Edit Attendance",
      icon: Edit,
      description: "Modify attendance records",
    },
    {
      id: "attendance_approve",
      label: "Approve Attendance",
      icon: UserCheck,
      description: "Approve attendance regularization requests",
    },
    {
      id: "attendance_reports",
      label: "Generate Attendance Reports",
      icon: FileSpreadsheet,
      description: "Create attendance reports",
    },
  ],

  "Leave Management": [
    {
      id: "leave_view_all",
      label: "View All Leaves",
      icon: Eye,
      description: "View all employee leave requests",
    },
    {
      id: "leave_view_own",
      label: "View Own Leaves",
      icon: Calendar,
      description: "View personal leave history",
    },
    {
      id: "leave_apply",
      label: "Apply for Leave",
      icon: Plus,
      description: "Submit leave applications",
    },
    {
      id: "leave_approve",
      label: "Approve/Reject Leaves",
      icon: UserCheck,
      description: "Process leave requests",
    },
    {
      id: "leave_cancel",
      label: "Cancel Leaves",
      icon: Trash2,
      description: "Cancel approved leaves",
    },
    {
      id: "leave_types_manage",
      label: "Manage Leave Types",
      icon: Settings,
      description: "Create and edit leave categories",
    },

  ],

  "Employee Management": [
    {
      id: "employee_view_all",
      label: "View All Employees",
      icon: Users,
      description: "Access all employee profiles",
    },

    {
      id: "employee_create",
      label: "Add New Employees",
      icon: Plus,
      description: "Onboard new employees",
    },
    {
      id: "employee_edit",
      label: "Edit Employee Data",
      icon: Edit,
      description: "Modify employee information",
    },
    {
      id: "employee_delete",
      label: "Delete Employees",
      icon: Trash2,
      description: "Remove employee records",
    },

    {
      id: "employee_documents",
      label: "Manage Employee Documents",
      icon: FileText,
      description: "Upload and manage employee files",
    },
    {
      id: "employee_promote",
      label: "Promote Employees",
      icon: TrendingUp,
      description: "Process employee promotions",
    },
    {
      id: "employee_transfer",
      label: "Transfer Employees",
      icon: GitBranch,
      description: "Transfer employees between departments",
    },
  ],

  "Department Management": [
    {
      id: "department_view",
      label: "View Departments",
      icon: Briefcase,
      description: "View all departments",
    },
    {
      id: "department_create",
      label: "Create Departments",
      icon: Plus,
      description: "Add new departments",
    },
    {
      id: "department_edit",
      label: "Edit Departments",
      icon: Edit,
      description: "Modify department information",
    },
    {
      id: "department_delete",
      label: "Delete Departments",
      icon: Trash2,
      description: "Remove departments",
    },
    {
      id: "department_assign_head",
      label: "Assign Department Heads",
      icon: UserCheck,
      description: "Set department managers",
    },
  ],

  "Designation Management": [
    {
      id: "designation_view",
      label: "View Designations",
      icon: FileText,
      description: "View all job designations",
    },
    {
      id: "designation_create",
      label: "Create Designations",
      icon: Plus,
      description: "Add new job titles",
    },
    {
      id: "designation_edit",
      label: "Edit Designations",
      icon: Edit,
      description: "Modify designation details",
    },
    {
      id: "designation_delete",
      label: "Delete Designations",
      icon: Trash2,
      description: "Remove designations",
    },
  ],

  "Financial Management": [
    {
      id: "salary_view_all",
      label: "View All Salaries",
      icon: DollarSign,
      description: "Access all salary information",
    },
    {
      id: "salary_view_own",
      label: "View Own Salary",
      icon: Wallet,
      description: "View personal salary details",
    },
    {
      id: "salary_process",
      label: "Process Payroll",
      icon: FileCheck,
      description: "Generate and process salary payments",
    },
    {
      id: "salary_edit",
      label: "Edit Salary Structure",
      icon: Edit,
      description: "Modify salary components",
    },
    {
      id: "expenses_view",
      label: "View My Expenses",
      icon: Eye,
      description: "View your personal expense claims",
    },
    {
      id: "expenses_create",
      label: "Create Expense",
      icon: Plus,
      description: "Record a new expense claim",
    },
    {
      id: "expenses_edit",
      label: "Edit Expense",
      icon: Edit,
      description: "Modify your pending expense claims",
    },
    {
      id: "expenses_delete",
      label: "Delete Expense",
      icon: Trash2,
      description: "Remove your expense claims",
    },
    {
      id: "expenses_view_all",
      label: "View All Expenses",
      icon: Eye,
      description: "View all team expense claims",
    },
    {
      id: "expenses_submit",
      label: "Submit Expenses",
      icon: Plus,
      description: "Submit expense reimbursement requests",
    },
    {
      id: "expenses_approve",
      label: "Approve Expenses",
      icon: UserCheck,
      description: "Approve or reject expense claims",
    },
  ],

  "Policy & Compliance": [
    {
      id: "terms_view",
      label: "View Terms & Conditions",
      icon: FileCheck,
      description: "Access employment terms",
    },
    {
      id: "terms_manage",
      label: "Manage Terms & Conditions",
      icon: Edit,
      description: "Create and edit employment terms",
    },
    {
      id: "company_policy_view",
      label: "View Company Policies",
      icon: BookOpen,
      description: "Access company policy documents",
    },
    {
      id: "company_policy_manage",
      label: "Manage Company Policies",
      icon: Edit,
      description: "Create and update policies",
    },
    {
      id: "hr_policy_view",
      label: "View HR Policies",
      icon: ClipboardList,
      description: "Access HR policy documents",
    },
    {
      id: "hr_policy_manage",
      label: "Manage HR Policies",
      icon: Edit,
      description: "Create and update HR policies",
    },
  ],

  Recruitment: [
    {
      id: "job_view",
      label: "View Job Postings",
      icon: Briefcase,
      description: "View all job openings",
    },
    {
      id: "job_create",
      label: "Create Job Postings",
      icon: Plus,
      description: "Post new job openings",
    },
    {
      id: "job_edit",
      label: "Edit Job Postings",
      icon: Edit,
      description: "Modify job descriptions",
    },
    {
      id: "job_delete",
      label: "Delete Job Postings",
      icon: Trash2,
      description: "Remove job postings",
    },
    {
      id: "job_applications",
      label: "View Applications",
      icon: FileText,
      description: "Access candidate applications",
    },
    {
      id: "job_shortlist",
      label: "Shortlist Candidates",
      icon: UserCheck,
      description: "Manage candidate pipeline",
    },
  ],

  "Communication Tools": [
    {
      id: "catalogs_view",
      label: "View Catalogs",
      icon: Package,
      description: "Access product/service catalogs",
    },
    {
      id: "catalogs_create",
      label: "Create Catalogs",
      icon: Plus,
      description: "Create new product/service catalogs",
    },
    {
      id: "catalogs_edit",
      label: "Edit Catalogs",
      icon: Edit,
      description: "Modify existing catalogs",
    },
    {
      id: "catalogs_delete",
      label: "Delete Catalogs",
      icon: Trash2,
      description: "Remove product catalogs",
    },
    {
      id: "catalogs_manage",
      label: "Manage Catalogs",
      icon: Settings,
      description: "Create and edit catalogs",
    },
    {
      id: "messenger_use",
      label: "Use Messenger",
      icon: MessageSquare,
      description: "Send and receive internal messages",
    },
    {
      id: "messenger_broadcast",
      label: "Broadcast Messages",
      icon: Megaphone,
      description: "Send messages to multiple users",
    },
    {
      id: "notes_view",
      label: "View Notes",
      icon: Eye,
      description: "View and access notes",
    },
    {
      id: "notes_create",
      label: "Create Notes",
      icon: StickyNote,
      description: "Create personal notes",
    },
    {
      id: "notes_edit",
      label: "Edit Notes",
      icon: Edit,
      description: "Modify existing notes",
    },
    {
      id: "notes_delete",
      label: "Delete Notes",
      icon: Trash2,
      description: "Remove personal notes",
    },
    {
      id: "notes_share",
      label: "Share Notes",
      icon: Users,
      description: "Share notes with team members",
    },
    {
      id: "announcement_view",
      label: "View Announcements",
      icon: Bell,
      description: "Read company announcements",
    },
    {
      id: "announcement_create",
      label: "Create Announcements",
      icon: Megaphone,
      description: "Post company-wide announcements",
    },
    {
      id: "announcement_edit",
      label: "Edit Announcements",
      icon: Edit,
      description: "Modify company announcements",
    },
    {
      id: "announcement_delete",
      label: "Delete Announcements",
      icon: Trash2,
      description: "Remove company announcements",
    },
  ],

  "Task Management": [
    {
      id: "todo_view_own",
      label: "View Own Tasks",
      icon: CheckSquare,
      description: "View personal to-do lists",
    },
    {
      id: "todo_view_team",
      label: "View Team Tasks",
      icon: Users,
      description: "View team member tasks",
    },
    {
      id: "todo_create",
      label: "Create Tasks",
      icon: Plus,
      description: "Create new tasks",
    },
    {
      id: "todo_assign",
      label: "Assign Tasks",
      icon: UserCheck,
      description: "Assign tasks to team members",
    },
    {
      id: "todo_edit",
      label: "Edit Tasks",
      icon: Edit,
      description: "Modify task details",
    },
    {
      id: "todo_delete",
      label: "Delete Tasks",
      icon: Trash2,
      description: "Remove tasks",
    },
  ],

  "Financial Documents": [
    {
      id: "quotation_view",
      label: "View Quotations",
      icon: FileText,
      description: "Access quotation documents",
    },
    {
      id: "quotation_create",
      label: "Create Quotations",
      icon: Plus,
      description: "Generate new quotations",
    },
    {
      id: "quotation_edit",
      label: "Edit Quotations",
      icon: Edit,
      description: "Modify quotation details",
    },
    {
      id: "quotation_approve",
      label: "Approve Quotations",
      icon: UserCheck,
      description: "Approve quotations for sending",
    },
    {
      id: "invoice_view",
      label: "View Invoices",
      icon: FileText,
      description: "Access invoice records",
    },
    {
      id: "invoice_create",
      label: "Create Invoices",
      icon: Plus,
      description: "Generate new invoices",
    },
    {
      id: "invoice_edit",
      label: "Edit Invoices",
      icon: Edit,
      description: "Modify invoice details",
    },
    {
      id: "invoice_send",
      label: "Send Invoices",
      icon: Mail,
      description: "Email invoices to clients",
    },
    {
      id: "invoice_payment",
      label: "Record Payments",
      icon: DollarSign,
      description: "Mark invoices as paid",
    },
  ],

  "Goal Management": [
    {
      id: "goal_view",
      label: "View Goals",
      icon: Target,
      description: "View sales goals and targets",
    },
    {
      id: "goal_create",
      label: "Create Goals",
      icon: Plus,
      description: "Set new sales goals and targets",
    },
    {
      id: "goal_edit",
      label: "Edit Goals",
      icon: Edit,
      description: "Modify existing goals and targets",
    },
    {
      id: "goal_delete",
      label: "Delete Goals",
      icon: Trash2,
      description: "Remove goals and targets",
    },
  ],

  "Meeting Management": [
    {
      id: "meeting_view",
      label: "View Meetings",
      icon: Calendar,
      description: "View scheduled meetings",
    },
    {
      id: "meeting_create",
      label: "Create Meetings",
      icon: Plus,
      description: "Schedule new meetings",
    },
    {
      id: "meeting_edit",
      label: "Edit Meetings",
      icon: Edit,
      description: "Modify meeting details",
    },
    {
      id: "meeting_delete",
      label: "Delete Meetings",
      icon: Trash2,
      description: "Cancel or remove meetings",
    },
  ],

  "Visitor Management": [
    {
      id: "visitor_view",
      label: "View Visitors",
      icon: Users,
      description: "View visitor logs and records",
    },
    {
      id: "visitor_create",
      label: "Log Visitor Entry",
      icon: Plus,
      description: "Record new visitor entries",
    },
    {
      id: "visitor_edit",
      label: "Edit Visitor Info",
      icon: Edit,
      description: "Modify visitor information or status",
    },
    {
      id: "visitor_delete",
      label: "Delete Visitor Logs",
      icon: Trash2,
      description: "Remove visitor records",
    },
  ],

  "Campaign Management": [
    {
      id: "campaign_view",
      label: "View Campaigns",
      icon: Megaphone,
      description: "View marketing campaigns",
    },
    {
      id: "campaign_create",
      label: "Create Campaigns",
      icon: Plus,
      description: "Launch new marketing campaigns",
    },
    {
      id: "campaign_edit",
      label: "Edit Campaigns",
      icon: Edit,
      description: "Modify campaign details or status",
    },
    {
      id: "campaign_delete",
      label: "Delete Campaigns",
      icon: Trash2,
      description: "Remove marketing campaigns",
    },
  ],

  "Offer Letter Management": [
    {
      id: "offer_letter_view",
      label: "View Offer Letters",
      icon: FileText,
      description: "View generated offer letters",
    },
    {
      id: "offer_letter_create",
      label: "Generate Offer Letters",
      icon: Plus,
      description: "Create new offer letters for candidates",
    },
    {
      id: "offer_letter_edit",
      label: "Edit Offer Letters",
      icon: Edit,
      description: "Modify existing offer letters",
    },
    {
      id: "offer_letter_download",
      label: "Download Letters",
      icon: DownloadIcon,
      description: "Download offer letters in PDF format",
    },
    {
      id: "offer_letter_delete",
      label: "Delete Letters",
      icon: Trash2,
      description: "Remove offer letter records",
    },
  ],

  "FAQ Management": [
    {
      id: "faq_view",
      label: "View FAQ",
      icon: BookOpen,
      description: "Access frequency asked questions",
    },
    {
      id: "faq_manage",
      label: "Manage FAQ",
      icon: Edit,
      description: "Create, edit and delete FAQ items",
    },
  ],


};

/**
 * Initial employee data with extended information
 */
export const initialEmployees = [
  {
    id: 1,
    name: "John Doe",
    designation: "Senior Developer",
    projects: 12,
    done: 8,
    progress: 3,
    productivity: 85,
    image: "https://i.pravatar.cc/150?img=1",
    salary: 85000,
    joinDate: "2020-03-15",
    department: "Engineering",
    email: "john.doe@company.com",
    phone: "+1-555-0101",
  },
  {
    id: 2,
    name: "Sarah Smith",
    designation: "UI/UX Designer",
    projects: 8,
    done: 6,
    progress: 2,
    productivity: 75,
    image: "https://i.pravatar.cc/150?img=2",
    salary: 70000,
    joinDate: "2021-06-20",
    department: "Design",
    email: "sarah.smith@company.com",
    phone: "+1-555-0102",
  },
  {
    id: 3,
    name: "Mike Johnson",
    designation: "Project Manager",
    projects: 15,
    done: 10,
    progress: 4,
    productivity: 90,
    image: "https://i.pravatar.cc/150?img=3",
    salary: 95000,
    joinDate: "2019-01-10",
    department: "Management",
    email: "mike.johnson@company.com",
    phone: "+1-555-0103",
  },
  {
    id: 4,
    name: "Emily Brown",
    designation: "Backend Developer",
    projects: 10,
    done: 7,
    progress: 2,
    productivity: 70,
    image: "https://i.pravatar.cc/150?img=4",
    salary: 78000,
    joinDate: "2021-09-05",
    department: "Engineering",
    email: "emily.brown@company.com",
    phone: "+1-555-0104",
  },
  {
    id: 5,
    name: "David Wilson",
    designation: "QA Engineer",
    projects: 9,
    done: 5,
    progress: 3,
    productivity: 55,
    image: "https://i.pravatar.cc/150?img=5",
    salary: 65000,
    joinDate: "2022-02-14",
    department: "Quality Assurance",
    email: "david.wilson@company.com",
    phone: "+1-555-0105",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    designation: "Frontend Developer",
    projects: 11,
    done: 9,
    progress: 2,
    productivity: 82,
    image: "https://i.pravatar.cc/150?img=6",
    salary: 75000,
    joinDate: "2020-11-30",
    department: "Engineering",
    email: "lisa.anderson@company.com",
    phone: "+1-555-0106",
  },
  {
    id: 7,
    name: "Robert Martinez",
    designation: "Sales Manager",
    projects: 14,
    done: 11,
    progress: 3,
    productivity: 88,
    image: "https://i.pravatar.cc/150?img=7",
    salary: 90000,
    joinDate: "2019-07-22",
    department: "Sales",
    email: "robert.martinez@company.com",
    phone: "+1-555-0107",
  },
  {
    id: 8,
    name: "Jennifer Taylor",
    designation: "HR Manager",
    projects: 7,
    done: 5,
    progress: 2,
    productivity: 78,
    image: "https://i.pravatar.cc/150?img=8",
    salary: 82000,
    joinDate: "2020-04-18",
    department: "Human Resources",
    email: "jennifer.taylor@company.com",
    phone: "+1-555-0108",
  },
];

/**
 * Predefined role templates with common permission sets
 */
export const roleTemplates = {
  administrator: {
    name: "System Administrator",
    description: "Full system access and control",
    permissions: [
      "crm_dashboard_view",
      "leads_view_all",
      "employee_view_all",
    ],
  },
  salesManager: {
    name: "Sales Manager",
    description: "Manage sales team and pipeline",
    permissions: [
      "crm_dashboard_view",
      "leads_view_all",
      "leads_assign",
      "pipeline_view",
      "clients_view_all",
      "team_view",
      "team_assign_members",
      "goal_view",
      "goal_create",
      "campaign_view",
      "meeting_view",
    ],
  },
  hrManager: {
    name: "HR Manager",
    description: "Human resources management",
    permissions: [
      "hrm_dashboard_view",
      "employee_view_all",
      "employee_create",
      "attendance_view_all",
      "leave_approve",
      "salary_view_all",
      "job_create",
      "offer_letter_view",
      "offer_letter_create",
    ],
  },
  teamLead: {
    name: "Team Lead",
    description: "Manage team and assign tasks",
    permissions: [
      "leads_view_own",
      "leads_edit",
      "clients_view_own",
      "team_view",
      "todo_view_team",
      "todo_assign",
    ],
  },
  salesRep: {
    name: "Sales Representative",
    description: "Basic CRM access",
    permissions: [
      "crm_dashboard_view",
      "leads_view_own",
      "leads_edit",
      "clients_view_own",
      "pipeline_view",
      "meeting_view",
      "meeting_create",
    ],
  },
  employee: {
    name: "Standard Employee",
    description: "Basic employee access",
    permissions: [
      "attendance_view_own",
      "leave_view_own",
      "leave_apply",
      "todo_view_own",
      "notes_create",
      "messenger_use",
      "faq_view",
      "meeting_view",
    ],
  },
};
