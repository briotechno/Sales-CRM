import React, { useState, useMemo, useEffect, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { FiHome } from "react-icons/fi";

import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Timer,
  TrendingUp,
  Wifi,
  QrCode,
  Camera,
  X,
  Zap,
  Activity,
  Target,
  MapPin,
  Image as ImageIcon,
  Home,
  ClipboardList,
  FileText,
} from "lucide-react";

export default function AttendanceApp() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [userIP, setUserIP] = useState(null);
  const [isOnCompanyNetwork, setIsOnCompanyNetwork] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [showSelfieCapture, setShowSelfieCapture] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailsModal, setDetailsModal] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const companyIPRange = "192.168.1.";
  const departments = [
    "Sales",
    "Marketing",
    "HR",
    "IT",
    "Finance",
    "Operations",
  ];

  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      employeeId: "EMP001",
      name: "Rajesh Kumar",
      department: "Sales",
      checkIn: "09:15 AM",
      checkOut: "06:30 PM",
      status: "present",
      workHours: "9h 15m",
      date: "2024-11-18",
      checkInMethod: "WiFi",
      ipAddress: "192.168.1.45",
      selfie: null,
      location: null,
    },
    {
      id: 2,
      employeeId: "EMP002",
      name: "Priya Sharma",
      department: "Marketing",
      checkIn: "08:45 AM",
      checkOut: "05:45 PM",
      status: "present",
      workHours: "9h 0m",
      date: "2024-11-18",
      checkInMethod: "QR Code",
      ipAddress: "192.168.1.52",
      selfie: null,
      location: null,
    },
    {
      id: 3,
      employeeId: "EMP003",
      name: "Amit Patel",
      department: "HR",
      checkIn: "-",
      checkOut: "-",
      status: "absent",
      workHours: "0h 0m",
      date: "2024-11-18",
      checkInMethod: "-",
      ipAddress: "-",
      selfie: null,
      location: null,
    },
    {
      id: 4,
      employeeId: "EMP004",
      name: "Sneha Singh",
      department: "Sales",
      checkIn: "-",
      checkOut: "-",
      status: "absent",
      workHours: "0h 0m",
      date: "2024-11-18",
      checkInMethod: "-",
      ipAddress: "-",
      selfie: null,
      location: null,
    },
    {
      id: 5,
      employeeId: "EMP005",
      name: "Vikram Mehta",
      department: "IT",
      checkIn: "-",
      checkOut: "-",
      status: "absent",
      workHours: "0h 0m",
      date: "2024-11-18",
      checkInMethod: "-",
      ipAddress: "-",
      selfie: null,
      location: null,
    },
    {
      id: 6,
      employeeId: "EMP006",
      name: "Neha Gupta",
      department: "Finance",
      checkIn: "-",
      checkOut: "-",
      status: "absent",
      workHours: "0h 0m",
      date: "2024-11-18",
      checkInMethod: "-",
      ipAddress: "-",
      selfie: null,
      location: null,
    },
  ]);

  useEffect(() => {
    const simulatedIP = `192.168.1.${Math.floor(Math.random() * 255)}`;
    setUserIP(simulatedIP);
    setIsOnCompanyNetwork(simulatedIP.startsWith(companyIPRange));
  }, []);

  useEffect(() => {
    if (showSelfieCapture) {
      startCamera();
      getCurrentLocation();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showSelfieCapture]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      alert("Unable to access camera. Please grant camera permissions.");
    }
  };

  const getCurrentLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Location error:", error);
          setLoadingLocation(false);
        }
      );
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageData);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const confirmCapture = () => {
    if (capturedImage) {
      handleCheckIn(selectedEmployee, capturedImage, location);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setShowSelfieCapture(false);
      setCapturedImage(null);
      setLocation(null);
    }
  };

  const closeSelfieCapture = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setShowSelfieCapture(false);
    setSelectedEmployee(null);
    setCapturedImage(null);
    setLocation(null);
  };

  const handleCheckInClick = (employee) => {
    if (!isOnCompanyNetwork) {
      alert("Please connect to company WiFi network to check in");
      return;
    }
    setSelectedEmployee(employee);
    setShowSelfieCapture(true);
  };

  const handleCheckIn = (employee, selfieData, locationData) => {
    const currentTime = new Date();
    const timeString = currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const totalMinutes = hour * 60 + minute;
    const lateThreshold = 10 * 60;

    let status = "present";
    if (totalMinutes > lateThreshold) {
      status = "late";
    }

    setAttendanceData((prev) =>
      prev.map((record) =>
        record.employeeId === employee.employeeId
          ? {
              ...record,
              checkIn: timeString,
              status: status,
              checkInMethod: "WiFi",
              ipAddress: userIP,
              selfie: selfieData,
              location: locationData,
            }
          : record
      )
    );

    alert(
      `✓ Check-in successful!\n${employee.name}\nTime: ${timeString}\nStatus: ${status}`
    );
    setCurrentPage("dashboard");
  };

  const handleExport = () => {
    const csv = [
      [
        "Employee ID",
        "Name",
        "Department",
        "Check In",
        "Check Out",
        "Status",
        "Work Hours",
        "Method",
        "IP Address",
      ],
      ...filteredAttendance.map((r) => [
        r.employeeId,
        r.name,
        r.department,
        r.checkIn,
        r.checkOut,
        r.status,
        r.workHours,
        r.checkInMethod,
        r.ipAddress,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const total = attendanceData.length;
    const present = attendanceData.filter((a) => a.status === "present").length;
    const absent = attendanceData.filter((a) => a.status === "absent").length;
    const late = attendanceData.filter((a) => a.status === "late").length;
    const halfDay = attendanceData.filter(
      (a) => a.status === "half-day"
    ).length;
    const attendanceRate =
      total > 0 ? (((present + late + halfDay) / total) * 100).toFixed(1) : 0;

    return [
      {
        label: "Total Employees",
        value: total.toString(),
        icon: Users,
        gradient: "from-orange-400 to-orange-600",
      },
      {
        label: "Present Today",
        value: present.toString(),
        icon: UserCheck,
        gradient: "from-green-400 to-green-600",
      },
      {
        label: "Absent",
        value: absent.toString(),
        icon: UserX,
        gradient: "from-red-400 to-red-600",
      },
      {
        label: "Attendance Rate",
        value: `${attendanceRate}%`,
        icon: TrendingUp,
        gradient: "from-purple-400 to-purple-600",
      },
    ];
  }, [attendanceData]);

  const filteredAttendance = useMemo(() => {
    return attendanceData.filter((record) => {
      const matchesSearch =
        record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || record.status === filterStatus;
      const matchesDepartment =
        filterDepartment === "all" || record.department === filterDepartment;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [attendanceData, searchQuery, filterStatus, filterDepartment]);

  const getStatusBadge = (status) => {
    const badges = {
      present: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Present",
        icon: CheckCircle,
      },
      absent: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Absent",
        icon: XCircle,
      },
      late: {
        bg: "bg-orange-100",
        text: "text-orange-700",
        label: "Late",
        icon: AlertCircle,
      },
      "half-day": {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Half Day",
        icon: Timer,
      },
    };
    return badges[status] || badges.present;
  };

  const getMethodBadge = (method) => {
    const badges = {
      WiFi: { bg: "bg-green-100", text: "text-green-700", icon: Wifi },
      "QR Code": { bg: "bg-blue-100", text: "text-blue-700", icon: QrCode },
    };
    return (
      badges[method] || {
        bg: "bg-gray-100",
        text: "text-gray-700",
        icon: Clock,
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="p-0 bg-white ml-6 min-h-screen text-black">
        {/* Navigation */}
        <nav className="bg-white shadow-sm ">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Attendance Syatem
                  </h1>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <FiHome className="text-gray-700 text-sm" />

                    <span className="text-gray-600">HRM /</span>

                    <span className="text-[#FF7B1D] font-medium">
                      All Attendance
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage("dashboard")}
                  className={`px-6 py-3 rounded-sm font-semibold transition-all flex items-center gap-2 ${
                    currentPage === "dashboard"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                      : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                  }`}
                >
                  <Home className="w-5 h-5" />
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage("checkin")}
                  className={`px-6 py-3 rounded-sm font-semibold transition-all flex items-center gap-2 ${
                    currentPage === "checkin"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                      : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  Check-In
                </button>
                <button
                  onClick={() => setCurrentPage("records")}
                  className={`px-6 py-3 rounded-sm font-semibold transition-all flex items-center gap-2 ${
                    currentPage === "records"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                      : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                  }`}
                >
                  <ClipboardList className="w-5 h-5" />
                  Records
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-0 mt-4 py-0">
          {/* ==================== DASHBOARD PAGE ==================== */}
          {currentPage === "dashboard" && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="group relative bg-white rounded-sm shadow-lg hover:shadow-sm transition-all transform  overflow-hidden"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 transition-opacity`}
                    ></div>
                    <div className="relative p-6">
                      <div
                        className={`inline-flex p-4 rounded-sm bg-gradient-to-r ${stat.gradient} shadow-lg mb-4`}
                      >
                        <stat.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">
                        {stat.label}
                      </h3>
                      <p className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Network Status
              <div className="bg-white rounded-sm shadow-xl p-6 border border-orange-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-sm ${
                        isOnCompanyNetwork ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      <Wifi
                        className={`w-6 h-6 ${
                          isOnCompanyNetwork ? "text-green-600" : "text-red-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        Network Status
                      </h3>
                      <p
                        className={`text-sm font-medium ${
                          isOnCompanyNetwork ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isOnCompanyNetwork
                          ? "✓ Connected to company WiFi"
                          : "✗ Not on company network"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right bg-orange-50 px-4 py-2 rounded-sm">
                    <p className="text-xs text-orange-600 font-semibold uppercase">
                      Your IP
                    </p>
                    <p className="text-sm font-mono font-bold text-orange-900">
                      {userIP || "Loading..."}
                    </p>
                  </div>
                </div>
              </div> */}

              {/* Quick Actions */}
              <div className="bg-white rounded-sm shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setCurrentPage("checkin")}
                    className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm hover:shadow-sm transform flex items-center justify-center gap-3 font-semibold"
                  >
                    <Camera className="w-6 h-6" />
                    Check-In with Selfie
                  </button>
                  <button
                    onClick={() => setCurrentPage("records")}
                    className="p-6 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-sm hover:from-orange-500 hover:to-orange-600 transition-all shadow-sm hover:shadow-sm transform  flex items-center justify-center gap-3 font-semibold"
                  >
                    <ClipboardList className="w-6 h-6" />
                    View Attendance Records
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-sm shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Recent Check-ins
                </h2>
                <div className="space-y-4">
                  {attendanceData
                    .filter((a) => a.status !== "absent")
                    .slice(0, 5)
                    .map((record, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-orange-50 rounded-sm"
                      >
                        {record.selfie && (
                          <img
                            src={record.selfie}
                            alt="Selfie"
                            className="w-12 h-12 rounded-full object-cover border-2 border-orange-300"
                          />
                        )}
                        {!record.selfie && (
                          <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center">
                            <UserCheck className="w-6 h-6 text-orange-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">
                            {record.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {record.department}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-orange-600">
                            {record.checkIn}
                          </p>
                          <p className="text-xs text-gray-500">
                            {record.checkInMethod}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== CHECK-IN PAGE ==================== */}
          {currentPage === "checkin" && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-sm shadow-sm">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                      Employee Check-In
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Select employee to check in with selfie & location
                    </p>
                  </div>
                </div>
              </div>

              {/* Network Warning */}
              {!isOnCompanyNetwork && (
                <div className="bg-red-50 border-2 border-red-300 rounded-sm p-6">
                  <div className="flex items-center gap-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                    <div>
                      <p className="font-bold text-red-900 text-lg">
                        Not Connected to Company Network
                      </p>
                      <p className="text-red-700">
                        Please connect to company WiFi to enable check-in
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Employee List */}
              <div className="bg-white rounded-sm shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Available for Check-In
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {attendanceData
                    .filter((emp) => emp.status === "absent")
                    .map((employee) => (
                      <button
                        key={employee.id}
                        onClick={() => handleCheckInClick(employee)}
                        disabled={!isOnCompanyNetwork}
                        className={`border-2 rounded-sm p-6 text-left  ${
                          isOnCompanyNetwork
                            ? "border-orange-200 hover:border-orange-500 hover:bg-orange-50 cursor-pointer shadow-md hover:shadow-sm"
                            : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                        }`}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-sm shadow-sm">
                            <UserCheck className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 text-lg">
                              {employee.name}
                            </p>
                            <p className="text-sm text-gray-600 font-medium">
                              {employee.employeeId}
                            </p>
                          </div>
                        </div>
                        <div className="bg-orange-50 rounded-sm px-3 py-2">
                          <p className="text-xs text-orange-600">Department</p>
                          <p className="text-sm font-bold text-gray-900">
                            {employee.department}
                          </p>
                        </div>
                      </button>
                    ))}
                </div>

                {attendanceData.filter((emp) => emp.status === "absent")
                  .length === 0 && (
                  <div className="text-center py-12 bg-gradient-to-r from-orange-50 to-orange-100 rounded-sm">
                    <CheckCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-700 font-bold text-xl">
                      All employees have checked in! 🎉
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== ATTENDANCE RECORDS PAGE ==================== */}
          {currentPage === "records" && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-sm shadow-sm">
                    <ClipboardList className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                      Attendance Records
                    </h1>
                    <p className="text-gray-600 mt-1">
                      View and manage employee attendance
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleExport}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-sm flex items-center gap-2 font-semibold"
                >
                  <Download className="w-5 h-5" />
                  Export CSV
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-sm shadow-xl p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="px-4 py-3 border-2 border-orange-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 border-2 border-orange-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Status</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="half-day">Half Day</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-sm shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Users className="w-7 h-7" />
                    Records ({filteredAttendance.length})
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-orange-400 to-orange-500">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">
                          Employee
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">
                          Department
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">
                          Check In
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">
                          Method
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">
                          Check Out
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">
                          Work Hours
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">
                          Status
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredAttendance.map((record) => {
                        const badge = getStatusBadge(record.status);
                        const StatusIcon = badge.icon;
                        const methodBadge = getMethodBadge(
                          record.checkInMethod
                        );
                        const MethodIcon = methodBadge.icon;

                        return (
                          <tr
                            key={record.id}
                            className="hover:bg-orange-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {record.selfie && (
                                  <img
                                    src={record.selfie}
                                    alt="Selfie"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-orange-300"
                                  />
                                )}
                                {!record.selfie && (
                                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                    <UserCheck className="w-5 h-5 text-orange-600" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold text-gray-900">
                                    {record.name}
                                  </p>
                                  <p className="text-sm text-orange-600 font-medium">
                                    {record.employeeId}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-700 font-medium">
                                {record.department}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Clock className="w-4 h-4 text-orange-400" />
                                <span className="text-gray-900 font-semibold">
                                  {record.checkIn}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1 ${methodBadge.bg} ${methodBadge.text} rounded-sm text-xs font-bold`}
                              >
                                <MethodIcon className="w-4 h-4" />
                                {record.checkInMethod}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-gray-900 font-semibold">
                                {record.checkOut}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-sm text-xs font-bold">
                                <Timer className="w-4 h-4" />
                                {record.workHours}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1 ${badge.bg} ${badge.text} rounded-sm text-xs font-bold`}
                              >
                                <StatusIcon className="w-4 h-4" />
                                {badge.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => setDetailsModal(record)}
                                className="text-orange-600 hover:text-orange-800 font-medium text-sm underline"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==================== SELFIE CAPTURE MODAL ==================== */}
        {showSelfieCapture && selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-sm max-w-2xl w-full">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 flex justify-between items-center rounded-t-sm">
                <div className="flex items-center gap-3">
                  <Camera className="w-7 h-7 text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Capture Selfie
                    </h2>
                    <p className="text-orange-100 text-sm">
                      {selectedEmployee.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeSelfieCapture}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-sm transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div
                  className="relative bg-gray-900 rounded-sm overflow-hidden mb-4"
                  style={{ height: "400px" }}
                >
                  {!capturedImage ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                    </>
                  ) : (
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {location && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-sm p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-green-600" />
                      <div className="flex-1">
                        <p className="font-bold text-green-900">
                          Location Captured
                        </p>
                        <p className="text-sm text-green-700 font-mono">
                          {location.latitude.toFixed(6)},{" "}
                          {location.longitude.toFixed(6)}
                        </p>
                        <p className="text-xs text-green-600">
                          Accuracy: {location.accuracy.toFixed(0)}m
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {loadingLocation && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-sm p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-yellow-600 animate-pulse" />
                      <p className="text-yellow-800 font-medium">
                        Getting location...
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {!capturedImage ? (
                    <button
                      onClick={capturePhoto}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-sm font-bold hover:from-orange-600 hover:to-orange-700 transition flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Capture Photo
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={retakePhoto}
                        className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-sm font-bold hover:bg-gray-300 transition"
                      >
                        Retake
                      </button>
                      <button
                        onClick={confirmCapture}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-sm font-bold hover:from-orange-600 hover:to-orange-700 transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Confirm
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== DETAILS MODAL ==================== */}
        {detailsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 flex justify-between items-center rounded-t-sm">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Attendance Details
                  </h2>
                  <p className="text-orange-100">{detailsModal.name}</p>
                </div>
                <button
                  onClick={() => setDetailsModal(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-sm transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {detailsModal.selfie && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-orange-500" />
                      Check-in Selfie
                    </h3>
                    <img
                      src={detailsModal.selfie}
                      alt="Check-in selfie"
                      className="w-full max-w-md mx-auto rounded-sm shadow-lg"
                    />
                  </div>
                )}

                {!detailsModal.selfie && detailsModal.status !== "absent" && (
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-sm p-6 text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      No selfie captured for this check-in
                    </p>
                  </div>
                )}

                {detailsModal.location && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-sm p-4">
                    <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location
                    </h3>
                    <p className="text-sm text-green-700 font-mono">
                      Lat: {detailsModal.location.latitude.toFixed(6)}, Long:{" "}
                      {detailsModal.location.longitude.toFixed(6)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Accuracy: {detailsModal.location.accuracy.toFixed(0)}m
                    </p>
                  </div>
                )}

                {!detailsModal.location && detailsModal.status !== "absent" && (
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-sm p-4">
                    <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Location
                    </h3>
                    <p className="text-sm text-gray-600">
                      No location data available
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-4 rounded-sm">
                    <p className="text-orange-600 text-sm mb-1">Employee ID</p>
                    <p className="font-bold text-gray-900">
                      {detailsModal.employeeId}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-sm">
                    <p className="text-orange-600 text-sm mb-1">Department</p>
                    <p className="font-bold text-gray-900">
                      {detailsModal.department}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-sm">
                    <p className="text-orange-600 text-sm mb-1">Check In</p>
                    <p className="font-bold text-gray-900">
                      {detailsModal.checkIn}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-sm">
                    <p className="text-orange-600 text-sm mb-1">Check Out</p>
                    <p className="font-bold text-gray-900">
                      {detailsModal.checkOut}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-sm">
                    <p className="text-orange-600 text-sm mb-1">Method</p>
                    <p className="font-bold text-gray-900">
                      {detailsModal.checkInMethod}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-sm">
                    <p className="text-orange-600 text-sm mb-1">IP Address</p>
                    <p className="font-bold text-gray-900 font-mono text-sm">
                      {detailsModal.ipAddress}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-sm col-span-2">
                    <p className="text-orange-600 text-sm mb-1">Work Hours</p>
                    <p className="font-bold text-gray-900">
                      {detailsModal.workHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
