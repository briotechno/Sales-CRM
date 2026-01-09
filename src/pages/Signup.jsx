import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Users,
  Eye,
  EyeOff,
  User,
  Lock,
  Mail,
  Phone,
  Building,
  Briefcase,
  FileText,
  MapPin,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { useSignupMutation } from "../store/api/authApi";

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    businessName: "",
    businessType: "",
    gst: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.email || !formData.mobileNumber) {
      toast.error("Please fill out all required fields in Step 1");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.businessName || !formData.businessType || !formData.address) {
      toast.error("Please fill out all required fields in Step 2");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignup = async (e) => {
    if (e) e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill out all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // Create user data without confirmPassword for the API
      const { confirmPassword, ...signupData } = formData;
      await signup(signupData).unwrap();

      toast.success("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || "Signup failed. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (currentStep === 1) {
        handleNext();
      } else if (currentStep === 2) {
        handleNext();
      } else if (currentStep === 3) {
        handleSignup(e);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div
        className="w-full max-w-5xl bg-white rounded-sm shadow-sm overflow-hidden flex flex-col lg:flex-row"
        style={{ height: "640px" }}
      >
        {/* Left Side - Signup Form */}
        <div className="w-full lg:w-1/2 p-6 bg-gradient-to-br from-orange-50 via-white to-amber-50 overflow-y-auto">
          {/* Brand Header */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "#FF7B1D" }}
              >
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="relative text-xl font-bold text-gray-800 inline-block">
                CRM System
                <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#FF7B1D] rounded-full"></span>
              </h1>
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Create Account
            </h2>
            <p className="text-xs text-gray-600 mb-2">
              Step {currentStep} of 3 - Fill in your details to get started
            </p>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-7 h-7 rounded-full font-semibold text-xs transition-all ${currentStep > step
                      ? "bg-orange-500 text-white"
                      : currentStep === step
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {currentStep > step ? <Check className="w-3 h-3" /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`flex-1 h-1 mx-1 rounded ${currentStep > step ? "bg-orange-500" : "bg-gray-200"
                        }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-800 mb-1.5">
                Personal Information
              </h3>

              {/* First Name */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-0.5">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 text-black w-5 h-5" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-9 pr-3 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-0.5">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 text-black w-5 h-5" />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-9 pr-3 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-0.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 text-black w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-9 pr-3 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-0.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 text-black w-4 h-4" />
                  <input
                    type="tel"
                    name="mobileNumber"
                    placeholder="Enter Mobile Number"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-9 pr-3 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl mt-2 flex items-center justify-center gap-2 text-sm"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center mt-2">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-orange-500 font-semibold hover:underline"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Business Information */}
          {currentStep === 2 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-800 mb-1.5">
                Business Information
              </h3>

              {/* Business Name */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-0.5">
                  Business Name
                </label>
                <div className="relative">
                  <Building className="absolute left-2.5 top-1/2 -translate-y-1/2 text-black w-4 h-4" />
                  <input
                    type="text"
                    name="businessName"
                    placeholder="Enter Business Name"
                    value={formData.businessName}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-9 pr-3 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Business Type */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-0.5">
                  Business Type
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-2.5 top-1/2 -translate-y-1/2 text-black w-4 h-4 z-10" />
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full pl-9 pr-8 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 appearance-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none cursor-pointer"
                  >
                    <option value="">Select Business Type</option>
                    <option value="person">Person</option>
                    <option value="organisation">Organisation</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* GST Number */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-0.5">
                  GST Number{" "}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-2.5 top-1/2 -translate-y-1/2 text-black w-4 h-4" />
                  <input
                    type="text"
                    name="gst"
                    placeholder="Enter GST Number"
                    value={formData.gst}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-9 pr-3 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-0.5">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 text-black w-4 h-4" />
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter Address"
                    value={formData.address}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-9 pr-3 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Security */}
          {currentStep === 3 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-800 mb-1.5">
                Security
              </h3>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-0.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 text-black w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-9 pr-9 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-orange-600 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-0.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 text-black w-4 h-4" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-9 pr-9 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-orange-600 transition"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements Checklist */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-2.5">
                <p className="text-[11px] text-gray-700 font-bold mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                  Password Strength Checklist:
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  <div className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all duration-300 ${formData.password.length >= 8
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-white border-gray-100 text-gray-500"
                    }`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${formData.password.length >= 8 ? "bg-green-500" : "bg-gray-200"
                      }`}>
                      <Check className={`w-2.5 h-2.5 text-white ${formData.password.length >= 8 ? "opacity-100" : "opacity-0"}`} />
                    </div>
                    <span className="text-[10px] font-semibold">At least 8 characters</span>
                  </div>

                  <div className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all duration-300 ${(/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password))
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-white border-gray-100 text-gray-500"
                    }`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${(/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password)) ? "bg-green-500" : "bg-gray-200"
                      }`}>
                      <Check className={`w-2.5 h-2.5 text-white ${(/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password)) ? "opacity-100" : "opacity-0"}`} />
                    </div>
                    <span className="text-[10px] font-semibold">Upper & lowercase letters</span>
                  </div>

                  <div className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all duration-300 ${/\d/.test(formData.password)
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-white border-gray-100 text-gray-500"
                    }`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${/\d/.test(formData.password) ? "bg-green-500" : "bg-gray-200"
                      }`}>
                      <Check className={`w-2.5 h-2.5 text-white ${/\d/.test(formData.password) ? "opacity-100" : "opacity-0"}`} />
                    </div>
                    <span className="text-[10px] font-semibold">Contains at least one number</span>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleSignup}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? "Creating Account..." : "Create Account →"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - CRM Vector Illustration */}
        <div className="hidden lg:flex w-full lg:w-1/2 flex-col items-center justify-center p-8 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-center relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-200 rounded-full blur-3xl animate-pulse delay-700"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>

          <div className="mb-4 relative z-10">
            <h3 className="text-orange-100 text-sm font-medium mb-2 uppercase tracking-wide">
              Customer Relationship Management
            </h3>
            <h2 className="text-white text-3xl font-bold mb-3">
              Join CRM System
            </h2>
            <p className="text-orange-100 text-sm">Step {currentStep} of 3</p>
          </div>

          <div className="relative w-full max-w-md z-10">
            <svg viewBox="0 0 500 400" className="w-full h-auto">
              {/* Same SVG as login page */}
              <circle cx="250" cy="200" r="190" fill="#FFFFFF" opacity="0.05" />
              <circle cx="250" cy="200" r="140" fill="#FFFFFF" opacity="0.08" />
              <ellipse
                cx="250"
                cy="320"
                rx="180"
                ry="20"
                fill="#FFFFFF"
                opacity="0.2"
              />
              <rect
                x="80"
                y="300"
                width="340"
                height="20"
                rx="10"
                fill="#FFFFFF"
                opacity="0.3"
              />

              <rect
                x="155"
                y="265"
                width="12"
                height="40"
                rx="6"
                fill="#6366F1"
              />
              <rect
                x="173"
                y="265"
                width="12"
                height="40"
                rx="6"
                fill="#6366F1"
              />
              <ellipse cx="170" cy="235" rx="25" ry="35" fill="#8B5CF6" />
              <circle cx="170" cy="195" r="22" fill="#FCD34D" />
              <ellipse cx="170" cy="185" rx="24" ry="18" fill="#7C3AED" />
              <ellipse
                cx="145"
                cy="240"
                rx="10"
                ry="28"
                fill="#FCD34D"
                transform="rotate(-25 145 240)"
              />
              <ellipse
                cx="195"
                cy="235"
                rx="10"
                ry="28"
                fill="#FCD34D"
                transform="rotate(25 195 235)"
              />
              <rect
                x="130"
                y="225"
                width="20"
                height="35"
                rx="3"
                fill="#1F2937"
                opacity="0.9"
              />
              <rect
                x="133"
                y="228"
                width="14"
                height="25"
                rx="2"
                fill="#3B82F6"
              />

              <rect
                x="240"
                y="260"
                width="12"
                height="45"
                rx="6"
                fill="#7C3AED"
              />
              <rect
                x="258"
                y="260"
                width="12"
                height="45"
                rx="6"
                fill="#7C3AED"
              />
              <ellipse cx="255" cy="225" rx="28" ry="35" fill="#A78BFA" />
              <circle cx="255" cy="185" r="24" fill="#FDE68A" />
              <path
                d="M 235 180 Q 245 165 255 165 Q 265 165 275 180 L 275 185 Q 265 173 255 173 Q 245 173 235 185 Z"
                fill="#6366F1"
              />
              <ellipse
                cx="230"
                cy="230"
                rx="10"
                ry="28"
                fill="#FDE68A"
                transform="rotate(-30 230 230)"
              />
              <ellipse
                cx="280"
                cy="230"
                rx="10"
                ry="28"
                fill="#FDE68A"
                transform="rotate(30 280 230)"
              />
              <rect
                x="220"
                y="240"
                width="70"
                height="45"
                rx="3"
                fill="#1F2937"
                opacity="0.95"
              />
              <rect
                x="225"
                y="245"
                width="60"
                height="35"
                rx="2"
                fill="#10B981"
              />
              <circle cx="255" cy="262" r="3" fill="#FFFFFF" />

              <rect
                x="330"
                y="270"
                width="12"
                height="35"
                rx="6"
                fill="#8B5CF6"
              />
              <rect
                x="348"
                y="270"
                width="12"
                height="35"
                rx="6"
                fill="#8B5CF6"
              />
              <ellipse cx="345" cy="240" rx="24" ry="32" fill="#C4B5FD" />
              <circle cx="345" cy="205" r="20" fill="#FCD34D" />
              <ellipse cx="345" cy="195" rx="22" ry="16" fill="#A78BFA" />
              <ellipse
                cx="323"
                cy="245"
                rx="9"
                ry="26"
                fill="#FCD34D"
                transform="rotate(-20 323 245)"
              />
              <ellipse
                cx="367"
                cy="245"
                rx="9"
                ry="26"
                fill="#FCD34D"
                transform="rotate(20 367 245)"
              />

              <g transform="translate(40, 80)">
                <rect
                  x="0"
                  y="0"
                  width="55"
                  height="35"
                  rx="4"
                  fill="#FFFFFF"
                  opacity="0.95"
                />
                <circle cx="15" cy="12" r="8" fill="#8B5CF6" />
                <rect
                  x="27"
                  y="8"
                  width="20"
                  height="3"
                  rx="1"
                  fill="#9CA3AF"
                />
                <rect
                  x="27"
                  y="14"
                  width="15"
                  height="3"
                  rx="1"
                  fill="#9CA3AF"
                />
              </g>

              <g transform="translate(400, 70)">
                <rect
                  x="0"
                  y="0"
                  width="60"
                  height="50"
                  rx="4"
                  fill="#FFFFFF"
                  opacity="0.95"
                />
                <rect x="8" y="35" width="8" height="10" fill="#EF4444" />
                <rect x="20" y="28" width="8" height="17" fill="#F59E0B" />
                <rect x="32" y="20" width="8" height="25" fill="#10B981" />
                <rect x="44" y="15" width="8" height="30" fill="#3B82F6" />
              </g>

              <circle cx="120" cy="120" r="5" fill="#FCD34D" opacity="0.6" />
              <circle cx="380" cy="150" r="6" fill="#C4B5FD" opacity="0.7" />
            </svg>
          </div>

          <p className="text-orange-50 text-sm mt-4 max-w-sm relative z-10">
            Manage customer relationships and drive growth with{" "}
            <span className="font-semibold text-white">CRM System</span>
          </p>
        </div>
      </div>
    </div>
  );
}
