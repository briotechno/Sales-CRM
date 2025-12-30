import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../../components/DashboardLayout";
import {
  Clock,
  Settings,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Wifi,
  QrCode,
  Calendar,
  Timer,
  Users,
  Shield,
  Bell,
  MapPin,
  Smartphone,
  Globe,
  Info,
  Zap,
  Activity,
  Lock,
  Unlock,
  Edit,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AttendanceSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    attendanceStartTime: "09:00",
    attendanceEndTime: "18:00",
    graceTime: "15",
    halfDayStartTime: "09:00",
    halfDayEndTime: "13:00",
    halfDayMinHours: "4",
    fullDayMinHours: "8",
    lateMarkAfter: "15",
    autoCheckOut: true,
    autoCheckOutTime: "19:00",

    // Check-in Methods
    wifiEnabled: true,
    qrCodeEnabled: true,
    manualEnabled: true,
    biometricEnabled: false,
    gpsEnabled: false,

    // WiFi Settings
    wifiSSID: "CompanyWiFi-Guest",
    wifiPassword: "Company@2024",
    allowedIPs: "192.168.1.0/24",

    // GPS Settings
    officeLatitude: "23.8103",
    officeLongitude: "90.4125",
    geoFenceRadius: "100",

    // Break Settings
    breakEnabled: true,
    breakDuration: "60",
    maxBreaks: "2",
    deductBreakTime: true,

    // Leave Settings
    casualLeave: "12",
    sickLeave: "10",
    paidLeave: "15",
    unpaidLeave: "5",

    // Notification Settings
    lateArrivalNotification: true,
    earlyDepartureNotification: true,
    absentNotification: true,
    overtimeNotification: true,
    emailNotifications: true,
    smsNotifications: false,

    // Weekend & Holiday Settings
    weekendDays: ["Saturday", "Sunday"],
    publicHolidays: [],

    // Overtime Settings
    overtimeEnabled: true,
    overtimeStartAfter: "18:00",
    overtimeRate: "1.5",
    maxOvertimeHours: "4",

    // Shift Settings
    multipleShiftsEnabled: false,
    defaultShift: "morning",
  });

  const [shifts] = useState([
    { id: "morning", name: "Morning Shift", start: "09:00", end: "18:00" },
    { id: "evening", name: "Evening Shift", start: "14:00", end: "23:00" },
    { id: "night", name: "Night Shift", start: "22:00", end: "07:00" },
  ]);

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Save logic here
    alert("✓ Settings saved successfully!");
  };

  const handleReset = () => {
    if (window.confirm("⚠️ Reset all settings to default?")) {
      // Reset logic here
      alert("✓ Settings reset to default!");
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "checkin", label: "Check-in Methods", icon: Smartphone },
    { id: "timing", label: "Timing & Breaks", icon: Clock },
    { id: "leaves", label: "Leave Policy", icon: Calendar },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "advanced", label: "Advanced", icon: Shield },
  ];

  return (
    <DashboardLayout>
      <div className="p-0 bg-white ml-2 min-h-screen text-black">
        {/* Animated Background */}

        <div className="relative z-10 p-0 ml-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4 bg-white border-b py-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Attendance Settings
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700 text-sm" />
                  <span className="text-gray-400"></span>HRM / Manage Attendance
                  / <span className="text-[#FF7B1D] font-medium">Settings</span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lsm shadow-sm p-4 border border-orange-100">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg transform  flex items-center gap-2 text-sm font-semibold"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-sm hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg transform  flex items-center gap-2 text-sm font-semibold"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset to Default
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg transform  flex items-center gap-2 text-sm font-semibold"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded-sm">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">
                  Configure Your Attendance System
                </h3>
                <p className="text-xs text-gray-600">
                  Set up how your company tracks attendance. Configure timing,
                  check-in methods, break policies, and notifications to match
                  your organization's needs.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white/90 backdrop-blur-sm rounded-sm shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-1">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 min-w-[140px] px-4 py-3 flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                        activeTab === tab.id
                          ? "bg-white text-blue-600 shadow-lg"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6">
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-50 to-orange-50 p-4 rounded-sm border border-orange-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Working Hours Configuration
                    </h3>
                    <p className="text-xs text-gray-600">
                      Define your company's standard working hours and grace
                      periods
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Attendance Start Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                        <input
                          type="time"
                          value={settings.attendanceStartTime}
                          onChange={(e) =>
                            handleSettingChange(
                              "attendanceStartTime",
                              e.target.value
                            )
                          }
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        When employees can start marking attendance
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Attendance End Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                        <input
                          type="time"
                          value={settings.attendanceEndTime}
                          onChange={(e) =>
                            handleSettingChange(
                              "attendanceEndTime",
                              e.target.value
                            )
                          }
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Standard work day end time
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Grace Time (Minutes)
                      </label>
                      <div className="relative">
                        <Timer className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-500" />
                        <input
                          type="number"
                          value={settings.graceTime}
                          onChange={(e) =>
                            handleSettingChange("graceTime", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          min="0"
                          max="60"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Late marking grace period after start time
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Mark Late After (Minutes)
                      </label>
                      <div className="relative">
                        <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                        <input
                          type="number"
                          value={settings.lateMarkAfter}
                          onChange={(e) =>
                            handleSettingChange("lateMarkAfter", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          min="0"
                          max="120"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Employee marked late after this time
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Full Day Minimum Hours
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                        <input
                          type="number"
                          value={settings.fullDayMinHours}
                          onChange={(e) =>
                            handleSettingChange(
                              "fullDayMinHours",
                              e.target.value
                            )
                          }
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          min="1"
                          max="12"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum hours for full day attendance
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Half Day Minimum Hours
                      </label>
                      <div className="relative">
                        <Timer className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-500" />
                        <input
                          type="number"
                          value={settings.halfDayMinHours}
                          onChange={(e) =>
                            handleSettingChange(
                              "halfDayMinHours",
                              e.target.value
                            )
                          }
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          min="1"
                          max="8"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum hours for half day attendance
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-sm p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-orange-500" />
                          Auto Check-Out
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Automatically check out employees at specified time
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.autoCheckOut}
                          onChange={(e) =>
                            handleSettingChange(
                              "autoCheckOut",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    {settings.autoCheckOut && (
                      <div className="mt-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Auto Check-Out Time
                        </label>
                        <input
                          type="time"
                          value={settings.autoCheckOutTime}
                          onChange={(e) =>
                            handleSettingChange(
                              "autoCheckOutTime",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Check-in Methods */}
              {activeTab === "checkin" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-50 to-orange-50 p-4 rounded-sm border border-green-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-green-600" />
                      Check-in & Check-out Methods
                    </h3>
                    <p className="text-xs text-gray-600">
                      Configure how employees can mark their attendance
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* WiFi Method */}
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Wifi className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-800">
                              WiFi Check-in
                            </h4>
                            <p className="text-xs text-gray-600">
                              Mark attendance via office WiFi
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.wifiEnabled}
                            onChange={(e) =>
                              handleSettingChange(
                                "wifiEnabled",
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      {settings.wifiEnabled && (
                        <div className="space-y-3 mt-4 pt-4 border-t border-gray-200">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              WiFi SSID Name
                            </label>
                            <input
                              type="text"
                              value={settings.wifiSSID}
                              onChange={(e) =>
                                handleSettingChange("wifiSSID", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="CompanyWiFi"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              WiFi Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={settings.wifiPassword}
                                onChange={(e) =>
                                  handleSettingChange(
                                    "wifiPassword",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="Enter password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              Allowed IP Range
                            </label>
                            <input
                              type="text"
                              value={settings.allowedIPs}
                              onChange={(e) =>
                                handleSettingChange(
                                  "allowedIPs",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="192.168.1.0/24"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* QR Code Method */}
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <QrCode className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-800">
                              QR Code Check-in
                            </h4>
                            <p className="text-xs text-gray-600">
                              Scan QR code to mark attendance
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.qrCodeEnabled}
                            onChange={(e) =>
                              handleSettingChange(
                                "qrCodeEnabled",
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      {settings.qrCodeEnabled && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="bg-purple-50 p-3 rounded-lg text-center">
                            <QrCode className="w-24 h-24 mx-auto text-purple-600 mb-2" />
                            <p className="text-xs text-gray-600">
                              QR Code will be generated for your office
                            </p>
                            <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700">
                              Generate QR Code
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Manual Method */}
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-green-300 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Edit className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-800">
                              Manual Entry
                            </h4>
                            <p className="text-xs text-gray-600">
                              Admin can manually mark attendance
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.manualEnabled}
                            onChange={(e) =>
                              handleSettingChange(
                                "manualEnabled",
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* GPS Location */}
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <MapPin className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-800">
                              GPS Location
                            </h4>
                            <p className="text-xs text-gray-600">
                              Verify location using GPS
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.gpsEnabled}
                            onChange={(e) =>
                              handleSettingChange(
                                "gpsEnabled",
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                        </label>
                      </div>
                      {settings.gpsEnabled && (
                        <div className="space-y-3 mt-4 pt-4 border-t border-gray-200">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              Office Latitude
                            </label>
                            <input
                              type="text"
                              value={settings.officeLatitude}
                              onChange={(e) =>
                                handleSettingChange(
                                  "officeLatitude",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                              placeholder="23.8103"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              Office Longitude
                            </label>
                            <input
                              type="text"
                              value={settings.officeLongitude}
                              onChange={(e) =>
                                handleSettingChange(
                                  "officeLongitude",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                              placeholder="90.4125"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                              Geo-Fence Radius (meters)
                            </label>
                            <input
                              type="number"
                              value={settings.geoFenceRadius}
                              onChange={(e) =>
                                handleSettingChange(
                                  "geoFenceRadius",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                              placeholder="100"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Timing & Breaks */}
              {activeTab === "timing" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
                      <Timer className="w-5 h-5 text-yellow-600" />
                      Break Time & Half Day Configuration
                    </h3>
                    <p className="text-xs text-gray-600">
                      Configure break policies and half-day timing
                    </p>
                  </div>

                  {/* Half Day Settings */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      Half Day Timing
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Half Day Start Time
                        </label>
                        <input
                          type="time"
                          value={settings.halfDayStartTime}
                          onChange={(e) =>
                            handleSettingChange(
                              "halfDayStartTime",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Half Day End Time
                        </label>
                        <input
                          type="time"
                          value={settings.halfDayEndTime}
                          onChange={(e) =>
                            handleSettingChange(
                              "halfDayEndTime",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 bg-yellow-50 p-2 rounded">
                      💡 Half day will be marked if employee works between these
                      hours
                    </p>
                  </div>

                  {/* Break Settings */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-orange-500" />
                        Break Time Management
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.breakEnabled}
                          onChange={(e) =>
                            handleSettingChange(
                              "breakEnabled",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                    {settings.breakEnabled && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Break Duration (Minutes)
                            </label>
                            <input
                              type="number"
                              value={settings.breakDuration}
                              onChange={(e) =>
                                handleSettingChange(
                                  "breakDuration",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                              min="15"
                              max="120"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Maximum Breaks Per Day
                            </label>
                            <input
                              type="number"
                              value={settings.maxBreaks}
                              onChange={(e) =>
                                handleSettingChange("maxBreaks", e.target.value)
                              }
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                              min="1"
                              max="5"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-lg">
                          <input
                            type="checkbox"
                            checked={settings.deductBreakTime}
                            onChange={(e) =>
                              handleSettingChange(
                                "deductBreakTime",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-orange-600 focus:ring-orange-500 rounded"
                          />
                          <label className="text-sm text-gray-700">
                            Deduct break time from total work hours
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Overtime Settings */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-500" />
                        Overtime Configuration
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.overtimeEnabled}
                          onChange={(e) =>
                            handleSettingChange(
                              "overtimeEnabled",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    {settings.overtimeEnabled && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            OT Starts After
                          </label>
                          <input
                            type="time"
                            value={settings.overtimeStartAfter}
                            onChange={(e) =>
                              handleSettingChange(
                                "overtimeStartAfter",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            OT Rate (Multiplier)
                          </label>
                          <input
                            type="number"
                            value={settings.overtimeRate}
                            onChange={(e) =>
                              handleSettingChange(
                                "overtimeRate",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            step="0.1"
                            min="1"
                            max="3"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Max OT Hours/Day
                          </label>
                          <input
                            type="number"
                            value={settings.maxOvertimeHours}
                            onChange={(e) =>
                              handleSettingChange(
                                "maxOvertimeHours",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            min="1"
                            max="8"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Leave Policy */}
              {activeTab === "leaves" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      Leave Policy Configuration
                    </h3>
                    <p className="text-xs text-gray-600">
                      Set annual leave quotas for employees
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        label: "Casual Leave (Per Year)",
                        key: "casualLeave",
                        color: "blue",
                        icon: Calendar,
                      },
                      {
                        label: "Sick Leave (Per Year)",
                        key: "sickLeave",
                        color: "red",
                        icon: AlertCircle,
                      },
                      {
                        label: "Paid Leave (Per Year)",
                        key: "paidLeave",
                        color: "green",
                        icon: CheckCircle,
                      },
                      {
                        label: "Unpaid Leave (Per Year)",
                        key: "unpaidLeave",
                        color: "gray",
                        icon: XCircle,
                      },
                    ].map((leave) => {
                      const Icon = leave.icon;
                      return (
                        <div
                          key={leave.key}
                          className="bg-white border-2 border-gray-200 rounded-lg p-4"
                        >
                          <label className="d-block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <Icon
                              className={`w-5 h-5 text-${leave.color}-500`}
                            />
                            {leave.label}
                          </label>
                          <input
                            type="number"
                            value={settings[leave.key]}
                            onChange={(e) =>
                              handleSettingChange(leave.key, e.target.value)
                            }
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                            min="0"
                            max="30"
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4 text-purple-600" />
                      Leave Policy Notes
                    </h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>
                        • Unused casual/sick leaves may carry forward to next
                        year
                      </li>
                      <li>
                        • Paid leaves are separate from casual/sick leaves
                      </li>
                      <li>• Unpaid leaves will deduct from salary</li>
                      <li>• Leave approval required from manager</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-blue-600" />
                      Notification Settings
                    </h3>
                    <p className="text-xs text-gray-600">
                      Configure attendance alerts and notifications
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        label: "Late Arrival Notification",
                        key: "lateArrivalNotification",
                        desc: "Notify when employee arrives late",
                      },
                      {
                        label: "Early Departure Notification",
                        key: "earlyDepartureNotification",
                        desc: "Notify when employee leaves early",
                      },
                      {
                        label: "Absent Notification",
                        key: "absentNotification",
                        desc: "Notify when employee is absent",
                      },
                      {
                        label: "Overtime Notification",
                        key: "overtimeNotification",
                        desc: "Notify when employee works overtime",
                      },
                      {
                        label: "Email Notifications",
                        key: "emailNotifications",
                        desc: "Send notifications via email",
                      },
                      {
                        label: "SMS Notifications",
                        key: "smsNotifications",
                        desc: "Send notifications via SMS",
                      },
                    ].map((notif) => (
                      <div
                        key={notif.key}
                        className="bg-white border-2 border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-gray-800">
                              {notif.label}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {notif.desc}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings[notif.key]}
                              onChange={(e) =>
                                handleSettingChange(notif.key, e.target.checked)
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advanced Settings */}
              {activeTab === "advanced" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-gray-600" />
                      Advanced Configuration
                    </h3>
                    <p className="text-xs text-gray-600">
                      Additional settings and shift management
                    </p>
                  </div>

                  {/* Shift Management */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-500" />
                        Multiple Shifts
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.multipleShiftsEnabled}
                          onChange={(e) =>
                            handleSettingChange(
                              "multipleShiftsEnabled",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    {settings.multipleShiftsEnabled && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Default Shift
                          </label>
                          <select
                            value={settings.defaultShift}
                            onChange={(e) =>
                              handleSettingChange(
                                "defaultShift",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                          >
                            {shifts.map((shift) => (
                              <option key={shift.id} value={shift.id}>
                                {shift.name} ({shift.start} - {shift.end})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="bg-indigo-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-700 font-semibold mb-2">
                            Available Shifts:
                          </p>
                          {shifts.map((shift) => (
                            <div
                              key={shift.id}
                              className="flex items-center justify-between py-2 border-b border-indigo-200 last:border-0"
                            >
                              <span className="text-xs font-medium text-gray-700">
                                {shift.name}
                              </span>
                              <span className="text-xs text-gray-600">
                                {shift.start} - {shift.end}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Weekend Configuration */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      Weekend Days
                    </h4>
                    <div className="grid grid-cols-7 gap-2">
                      {[
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ].map((day) => (
                        <button
                          key={day}
                          onClick={() => {
                            const isSelected =
                              settings.weekendDays.includes(day);
                            handleSettingChange(
                              "weekendDays",
                              isSelected
                                ? settings.weekendDays.filter((d) => d !== day)
                                : [...settings.weekendDays, day]
                            );
                          }}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            settings.weekendDays.includes(day)
                              ? "bg-purple-600 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-red-500" />
                      Security & Access
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            Require Check-in Photo
                          </p>
                          <p className="text-xs text-gray-600">
                            Employee must take selfie during check-in
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            Two-Factor Authentication
                          </p>
                          <p className="text-xs text-gray-600">
                            Require OTP for attendance marking
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      </div>
    </DashboardLayout>
  );
}
