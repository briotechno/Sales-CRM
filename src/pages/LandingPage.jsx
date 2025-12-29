import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  BarChart3,
  Briefcase,
  Calendar,
  FileText,
  Menu,
  X,
  CheckCircle,
  Share2,
  MessageSquare,
  ClipboardList,
  FileCheck,
  DollarSign,
  Bell,
  Megaphone,
  Settings,
  UserCheck,
  Building2,
  Award,
  CreditCard,
  Star,
  Zap,
  Shield,
  Rocket,
  Target,
  Activity,
  ShieldCheck,
} from "lucide-react";

// Navigation Component
const Navigation = ({ handleLogin, handleSignUp }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-2xl"
          : "bg-white shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold cursor-pointer hover:scale-105 transition-transform">
              Sales<span className="text-orange-600">+</span>
              <span className="text-orange-600">CRM</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-orange-600 transition-colors font-bold relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>
            </a>

            <a
              href="#mockup"
              className="text-gray-700 hover:text-orange-600 transition-colors font-bold relative group"
            >
              Platform
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-orange-600 transition-colors font-bold relative group"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#faq"
              className="text-gray-700 hover:text-orange-600 transition-colors font-bold relative group"
            >
              FAQ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <button
              onClick={handleLogin}
              className="text-orange-600 hover:text-orange-700 font-bold transition-colors"
            >
              Login
            </button>
            <button
              onClick={handleSignUp}
              className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-2 rounded-full hover:from-orange-700 hover:to-orange-800 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Sign Up Free
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4  animate-slideDown">
            <div className="flex flex-col space-y-3">
              <a
                href="#features"
                className="text-gray-700 hover:text-orange-600 transition-colors py-2 hover:bg-orange-50 px-4 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#mockup"
                className="text-gray-700 hover:text-orange-600 transition-colors py-2 hover:bg-orange-50 px-4 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Platform
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-orange-600 transition-colors py-2 hover:bg-orange-50 px-4 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="text-gray-700 hover:text-orange-600 transition-colors py-2 hover:bg-orange-50 px-4 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <button
                onClick={() => {
                  handleLogin();
                  setMobileMenuOpen(false);
                }}
                className="text-left text-orange-600 hover:text-orange-700 py-2 font-medium hover:bg-orange-50 px-4 rounded-lg"
              >
                Login
              </button>
              <button
                onClick={() => {
                  handleSignUp();
                  setMobileMenuOpen(false);
                }}
                className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-2 rounded-full hover:from-orange-700 hover:to-orange-800 transition-all text-center font-medium shadow-lg"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Hero Section Component
const HeroSection = ({ handleSignUp }) => {
  return (
    <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white relative overflow-hidden pt-16">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
        <div className="text-center">
          <div className="mb-6 animate-fadeInDown">
            <span className="bg-orange-800 bg-opacity-50 text-orange-100 px-6 py-3 rounded-full text-sm font-semibold inline-flex items-center space-x-2 hover:bg-opacity-70 transition-all">
              <Star className="w-4 h-4 fill-current" />
              <span>Free 14-Day Trial - No Credit Card Required</span>
            </span>
          </div>
          <h2 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight animate-fadeInUp">
            Grow Your Business with
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-100 to-white animate-shimmer">
              All-in-One CRM Solution
            </span>
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-orange-100 max-w-3xl mx-auto leading-relaxed animate-fadeInUp animation-delay-200">
            Complete CRM + HRM platform that manages your leads, clients, sales
            pipeline, and entire team in one powerful dashboard
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp animation-delay-400">
            <button
              onClick={handleSignUp}
              className="group bg-white text-orange-600 px-10 py-5 rounded-full font-bold text-lg hover:bg-orange-50 transition-all transform hover:scale-105 shadow-2xl hover:shadow-orange-300 flex items-center space-x-2"
            >
              <span>Start Free Trial - 14 Days</span>
              <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group border-2 border-white text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-orange-600 transition-all flex items-center space-x-2">
              <span>Watch Demo</span>
              <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
          <div className="mt-8 flex justify-center items-center space-x-6 text-orange-100 text-lg animate-fadeInUp animation-delay-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Full Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="relative">
        <svg
          className="w-full h-24 fill-current text-white"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path d="M0,64 C480,120 960,0 1440,64 L1440,120 L0,120 Z"></path>
        </svg>
      </div>
    </div>
  );
};

// Enhanced Features Component
const FeaturesSection = () => {
  const features = [
    {
      icon: <Users className="w-12 h-12" />,
      title: "Leads Management",
      description:
        "Track, score, and convert leads with intelligent automation, custom pipelines, and real-time follow-up reminders",
      color: "from-orange-400 to-orange-500",
      delay: "0",
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "campaign",
      description:
        "Identify and nurture your best performers with dedicated champion management and reward systems",
      color: "from-orange-500 to-red-500",
      delay: "100",
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "Pipeline Management",
      description:
        "Visualize deals, forecast revenue, and accelerate sales cycles with drag-and-drop pipeline stages",
      color: "from-red-500 to-orange-600",
      delay: "200",
    },
    {
      icon: <Briefcase className="w-12 h-12" />,
      title: "Client Management",
      description:
        "360° client profiles with complete interaction history, preferences, and automated relationship scoring",
      color: "from-orange-600 to-orange-700",
      delay: "300",
    },
    {
      icon: <Share2 className="w-12 h-12" />,
      title: "Channel Integration",
      description:
        "Connect email, WhatsApp, social media, and all communication channels in one unified inbox",
      color: "from-orange-500 to-amber-600",
      delay: "0",
    },
    {
      icon: <UserCheck className="w-12 h-12" />,
      title: "Team Management",
      description:
        "Manage roles, permissions, performance tracking, and team collaboration with advanced HRM features",
      color: "from-amber-600 to-orange-600",
      delay: "100",
    },
    {
      icon: <Calendar className="w-12 h-12" />,
      title: "Attendance & Leave",
      description:
        "Automated attendance tracking, leave management, shift scheduling, and timesheet approvals",
      color: "from-orange-600 to-red-600",
      delay: "200",
    },
    {
      icon: <FileCheck className="w-12 h-12" />,
      title: "Company Policies",
      description:
        "Centralized policy management, HR documentation, terms & conditions, and employee handbooks",
      color: "from-red-600 to-orange-700",
      delay: "300",
    },
    {
      icon: <Building2 className="w-12 h-12" />,
      title: "Department Management",
      description:
        "Organize teams by departments, set hierarchies, manage budgets, and track departmental KPIs",
      color: "from-orange-700 to-orange-500",
      delay: "0",
    },
    {
      icon: <MessageSquare className="w-12 h-12" />,
      title: "Internal Messenger",
      description:
        "Real-time team chat, file sharing, @mentions, and integrated communication for seamless collaboration",
      color: "from-orange-500 to-amber-500",
      delay: "100",
    },
    {
      icon: <ClipboardList className="w-12 h-12" />,
      title: "Notes & To-Do",
      description:
        "Organize tasks, set priorities, create notes, and never miss deadlines with smart reminders",
      color: "from-amber-500 to-orange-600",
      delay: "200",
    },
    {
      icon: <FileText className="w-12 h-12" />,
      title: "Quotation & Invoice",
      description:
        "Generate professional quotations, invoices, and receipts with customizable templates instantly",
      color: "from-orange-600 to-red-500",
      delay: "300",
    },
    {
      icon: <DollarSign className="w-12 h-12" />,
      title: "Expense Tracking",
      description:
        "Track employee expenses, approve reimbursements, and maintain complete financial transparency",
      color: "from-red-500 to-orange-700",
      delay: "0",
    },
    {
      icon: <Bell className="w-12 h-12" />,
      title: "Smart Notifications",
      description:
        "Real-time alerts for leads, deals, approvals, and important updates across all devices",
      color: "from-orange-700 to-orange-500",
      delay: "100",
    },
    {
      icon: <Megaphone className="w-12 h-12" />,
      title: "Announcements",
      description:
        "Company-wide announcements, news updates, and important communications with read receipts",
      color: "from-orange-500 to-amber-600",
      delay: "200",
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Business Analytics",
      description:
        "Advanced analytics, custom reports, data visualization, and AI-powered insights for growth",
      color: "from-amber-600 to-orange-600",
      delay: "300",
    },
  ];

  return (
    <div
      id="features"
      className="py-24 bg-gradient-to-b from-white via-orange-50 to-white relative overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute top-20 left-0 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 right-0 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 animate-fadeInUp">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">POWERFUL FEATURES</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-orange-800 to-gray-900">
            Everything You Need to Succeed
          </h2>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools designed for modern businesses to manage, grow,
            and thrive
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-orange-100 hover:border-orange-300 animate-fadeInUp"
              style={{ animationDelay: `${feature.delay}ms` }}
            >
              <div
                className={`inline-block p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Desktop Mockup Section with Image Carousel
const DesktopMockupSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const screenshots = [
    {
      title: "Dashboard Overview",
      description:
        "Complete business metrics and real-time analytics at your fingertips",
      emoji: "📊",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Leads Management",
      description:
        "Track and convert leads with intelligent automation and scoring",
      emoji: "👥",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Pipeline Management",
      description:
        "Visualize your sales pipeline with drag-and-drop simplicity",
      emoji: "📈",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Team Management",
      description: "Comprehensive HRM features for modern team collaboration",
      emoji: "👤",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Analytics & Reports",
      description: "AI-powered insights to drive your business growth forward",
      emoji: "📉",
      color: "from-red-500 to-red-600",
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % screenshots.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, screenshots.length]);

  const nextImage = () => {
    setIsAutoPlaying(false);
    setCurrentImage((prev) => (prev + 1) % screenshots.length);
  };

  const prevImage = () => {
    setIsAutoPlaying(false);
    setCurrentImage((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  const goToImage = (index) => {
    setIsAutoPlaying(false);
    setCurrentImage(index);
  };

  return (
    <div
      id="mockup"
      className="py-24 bg-gradient-to-br from-orange-500 via-orange-700 to-orange-950 text-white relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-800 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <div className="inline-flex items-center space-x-2 bg-orange-900/40 text-orange-200 px-4 py-2 rounded-full mb-6 backdrop-blur-md">
            <Target className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide">
              PLATFORM PREVIEW
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-200 to-white">
            Experience the Complete Platform
          </h2>

          <p className="text-2xl text-orange-100/80 max-w-3xl mx-auto">
            Intuitive interface designed for productivity, power, and ease of
            use
          </p>
        </div>

        {/* Main Mockup Container */}
        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-800 rounded-3xl shadow-[0_30px_80px_rgba(255,115,0,0.35)] overflow-hidden border-4 border-orange-400/70 transform hover:scale-[1.01] transition-transform duration-500 animate-fadeInUp animation-delay-200">
          {/* Browser Header */}
          <div className="bg-gradient-to-r from-orange-700 to-orange-900 px-4 py-3 flex items-center space-x-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>

            <div className="flex-1 mx-4">
              <div className="bg-orange-800/70 rounded-lg px-4 py-2 text-sm text-orange-100 flex items-center backdrop-blur-sm">
                <Shield className="w-4 h-4 mr-2 text-green-300" />
                <span className="truncate">
                  https://salescrm.app/
                  {screenshots[currentImage].title
                    .toLowerCase()
                    .replace(/ /g, "-")}
                </span>
              </div>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="relative bg-white" style={{ minHeight: "600px" }}>
            <div
              className="relative overflow-hidden"
              style={{ height: "600px" }}
            >
              {screenshots.map((screenshot, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentImage
                      ? "opacity-100 translate-x-0 scale-100"
                      : index < currentImage
                      ? "opacity-0 -translate-x-full scale-95"
                      : "opacity-0 translate-x-full scale-95"
                  }`}
                >
                  <div
                    className={`w-full h-full bg-gradient-to-br ${screenshot.color} flex items-center justify-center relative`}
                  >
                    <div className="text-center p-12 text-white">
                      <div className="mb-8 text-9xl animate-bounce">
                        {screenshot.emoji}
                      </div>
                      <h3 className="text-5xl font-bold mb-6 drop-shadow-lg">
                        {screenshot.title}
                      </h3>
                      <p className="text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed drop-shadow">
                        {screenshot.description}
                      </p>
                    </div>

                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white text-gray-900 p-4 rounded-full shadow-2xl hover:scale-110 transition"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white text-gray-900 p-4 rounded-full shadow-2xl hover:scale-110 transition"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
              {screenshots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentImage
                      ? "w-12 h-3 bg-gradient-to-r from-orange-500 to-orange-700 shadow-lg"
                      : "w-3 h-3 bg-orange-200/50 hover:bg-orange-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[TrendingUp, Settings, ShieldCheck].map((Icon, i) => (
            <div
              key={i}
              className={`text-center transform hover:scale-105 transition-all duration-300 animate-fadeInUp animation-delay-${
                (i + 1) * 200
              }`}
            >
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl hover:shadow-orange-500/60 hover:rotate-6 transition-all">
                <Icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">
                {
                  [
                    "Real-Time Updates",
                    "Fully Customizable",
                    "Secure & Scalable",
                  ][i]
                }
              </h3>
              <p className="text-orange-100/80 text-lg leading-relaxed">
                {
                  [
                    "Stay synchronized across all devices instantly",
                    "Adapt every aspect to match your workflow",
                    "Enterprise-grade security that grows with your business",
                  ][i]
                }
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Stats Section Component
const StatsSection = () => {
  return (
    // 1. Base Section: Kept the vibrant gradient and padding.
    <section className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-700 to-red-600 text-white py-20 sm:py-24">
      {/* Background Effects (Slightly simplified for standard Tailwind use) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle, soft light effect on top-left */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl opacity-10"></div>
        {/* Subtle, soft light effect on bottom-right */}
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-300 rounded-full blur-3xl opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            Trusted by Businesses Worldwide
          </h2>
          {/* Increased contrast for the supporting text by using a slightly brighter white and increased max-width */}
          <p className="text-base sm:text-lg md:text-xl text-orange-50 max-w-3xl mx-auto">
            Join thousands of companies already growing with{" "}
            <span className="font-extrabold text-white">Sales+CRM</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
          {[
            { value: "1000+", label: "Happy Businesses" },
            { value: "500K+", label: "Leads Managed" },
            { value: "99.9%", label: "Uptime Guarantee" },
            { value: "24/7", label: "Customer Support" },
          ].map((stat, index) => (
            <div
              key={index}
              className="flex justify-center"
              // Removed inline style animation delay for simplicity, but you can re-add it if you have the custom `animate-fadeInUp` utility defined.
              // style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-full max-w-sm transform transition-all duration-300 hover:scale-[1.02]">
                {/* 2. Stat Card: Added stronger background and shadow for pop. */}
                <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-2xl hover:bg-white/25 transition-colors h-full flex flex-col justify-center">
                  {/* 3. Value: The most critical part. Used a highly contrasting, visible gradient. */}
                  <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3 leading-none bg-clip-text text-transparent bg-gradient-to-br from-white to-amber-300">
                    {stat.value}
                  </div>

                  {/* 4. Label: Ensure it's clear and not too faint. */}
                  <div className="text-sm sm:text-base text-orange-100 font-semibold tracking-wide uppercase">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Component
const PricingSection = ({ handleSignUp }) => {
  const packages = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small teams getting started",
      features: [
        "5 Users Included",
        "Basic CRM Features",
        "Lead Management",
        "Email Support",
        "100 MB Storage",
        "Mobile App Access",
      ],
      popular: false,
      icon: <Rocket className="w-6 h-6" />,
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "20 Users Included",
        "Advanced CRM + HRM",
        "Pipeline Management",
        "Client Management",
        "Priority Support",
        "5 GB Storage",
        "Custom Reports",
        "Integration Support",
        "API Access",
      ],
      popular: true,
      icon: <Star className="w-6 h-6 fill-current" />,
    },
    {
      name: "Enterprise",
      price: "$299",
      period: "/month",
      description: "For large organizations with advanced needs",
      features: [
        "Unlimited Users",
        "Complete CRM + HRM Suite",
        "Channel Integration",
        "Advanced Analytics",
        "24/7 Dedicated Support",
        "Unlimited Storage",
        "Custom Development",
        "White Label Option",
        "Premium API Access",
        "Dedicated Account Manager",
      ],
      popular: false,
      icon: <Award className="w-6 h-6" />,
    },
  ];

  return (
    <div
      id="pricing"
      className="py-24 bg-gradient-to-b from-orange-50 via-white to-orange-50 relative overflow-hidden"
    >
      <div className="absolute top-20 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 animate-fadeInUp">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-6">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-semibold">TRANSPARENT PRICING</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Choose Your Perfect Plan
          </h2>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            Flexible pricing that scales with your business needs
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-orange-200 animate-fadeInUp ${
                pkg.popular
                  ? "ring-4 ring-orange-500 scale-105 md:scale-110"
                  : "hover:ring-2 hover:ring-orange-300"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {pkg.popular && (
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-3 font-bold text-sm flex items-center justify-center space-x-2">
                  <Star className="w-4 h-4 fill-current" />
                  <span>MOST POPULAR</span>
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-3xl font-extrabold text-gray-900">
                    {pkg.name}
                  </h3>
                  <div
                    className={`p-3 rounded-xl ${
                      pkg.popular
                        ? "bg-gradient-to-br from-orange-500 to-red-500"
                        : "bg-gradient-to-br from-gray-600 to-gray-700"
                    } text-white`}
                  >
                    {pkg.icon}
                  </div>
                </div>
                <p className="text-gray-600 mb-6 text-sm">{pkg.description}</p>
                <div className="mb-8">
                  <span className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
                    {pkg.price}
                  </span>
                  <span className="text-gray-600 text-xl">{pkg.period}</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start group">
                      <CheckCircle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleSignUp}
                  className={`w-full py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 ${
                    pkg.popular
                      ? "bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 shadow-xl hover:shadow-2xl"
                      : "bg-orange-100 text-orange-600 hover:bg-orange-200 shadow-lg hover:shadow-xl"
                  }`}
                >
                  <span>Get Started</span>
                  <Rocket className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center animate-fadeInUp animation-delay-600">
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need a Custom Plan?
            </h3>
            <p className="text-gray-700 mb-6 text-lg">
              We offer tailored solutions for enterprises with specific
              requirements
            </p>
            <button className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-full font-bold hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg">
              Contact Sales Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// FAQ Component
const FAQSection = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "What is Sales+CRM?",
      answer:
        "Sales+CRM is a complete business management solution that helps you manage sales, leads, clients, and team operations on a single platform. It combines powerful CRM features with comprehensive HRM capabilities to streamline your entire business workflow.",
    },
    {
      question: "How do I get the free trial?",
      answer:
        "You can start your 14-day free trial without any credit card. Simply click the 'Start Free Trial' button, sign up with your email, and get instant access to all features. No hidden charges or commitments.",
    },
    {
      question: "Do you provide training and onboarding?",
      answer:
        "Yes! We provide complete onboarding and training including video tutorials, detailed documentation, and live support to help you get started quickly. Our dedicated team ensures smooth implementation.",
    },
    {
      question: "How secure is my data?",
      answer:
        "Your data is completely secure. We use industry-standard encryption, regular automated backups, and comply with international data protection regulations including GDPR and SOC 2 certification.",
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer:
        "Absolutely! You can change your plan at any time. Billing will be adjusted on a pro-rata basis, so you only pay for what you use. There are no penalties for upgrading or downgrading.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, and bank transfers for enterprise plans. All transactions are secure and encrypted.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div
      id="faq"
      className="py-24 bg-gradient-to-b from-white to-orange-50 relative overflow-hidden"
    >
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 animate-fadeInUp">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-6">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-semibold">GOT QUESTIONS?</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-2xl text-gray-600">
            Everything you need to know about Sales+CRM
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-2 border-orange-200 rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 animate-fadeInUp hover:border-orange-400"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-8 py-6 text-left bg-white hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent transition-all flex justify-between items-center group"
              >
                <span className="font-bold text-gray-900 pr-4 text-lg group-hover:text-orange-600 transition-colors">
                  {faq.question}
                </span>
                <div
                  className={`transform transition-transform duration-300 ${
                    openFaq === index ? "rotate-180" : ""
                  }`}
                >
                  {openFaq === index ? (
                    <ChevronUp className="w-6 h-6 text-orange-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-orange-600 flex-shrink-0 group-hover:translate-y-1" />
                  )}
                </div>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openFaq === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-8 py-6 bg-gradient-to-br from-orange-50 to-red-50 border-t-2 border-orange-100">
                  <p className="text-gray-700 leading-relaxed text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// CTA Section Component
const CTASection = ({ handleSignUp }) => {
  return (
    <div className="py-24 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="animate-fadeInUp">
          <div className="inline-flex items-center space-x-2 bg-orange-800/50 backdrop-blur-sm text-orange-100 px-4 py-2 rounded-full mb-8">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">START TODAY</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            Ready to Transform Your Business?
          </h2>
          <p className="text-2xl md:text-3xl mb-12 text-orange-100 leading-relaxed">
            Join 10,000+ businesses already using Sales+CRM to grow faster and
            work smarter
          </p>
          <button
            onClick={handleSignUp}
            className="group bg-white text-orange-600 px-12 py-6 rounded-full font-extrabold text-2xl hover:bg-orange-50 transition-all transform hover:scale-110 shadow-2xl hover:shadow-orange-300 inline-flex items-center space-x-3 animate-pulse-slow"
          >
            <span>Start Your 14-Day Free Trial</span>
            <Rocket className="w-7 h-7 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
          </button>
          <div className="mt-8 flex justify-center items-center space-x-8 text-orange-100 text-lg">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 fill-current" />
              <span>Full support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <div className="bg-gray-900 text-gray-300 py-16 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-900 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="animate-fadeInUp">
            <h3 className="text-3xl font-extrabold mb-4 group cursor-pointer">
              Sales
              <span className="text-orange-500 group-hover:text-orange-400 transition-colors">
                +
              </span>
              <span className="text-orange-500 group-hover:text-orange-400 transition-colors">
                CRM
              </span>
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Complete Business Management Solution for Modern Teams
            </p>
            <div className="mt-6 flex space-x-4">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer transform hover:scale-110">
                <Share2 className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer transform hover:scale-110">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer transform hover:scale-110">
                <Bell className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="animate-fadeInUp animation-delay-100">
            <h4 className="font-bold mb-4 text-white text-lg">Product</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="hover:text-orange-500 transition-colors inline-flex items-center group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Features</span>
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-orange-500 transition-colors inline-flex items-center group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Pricing</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 transition-colors inline-flex items-center group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Demo</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 transition-colors inline-flex items-center group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>API</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="animate-fadeInUp animation-delay-200">
            <h4 className="font-bold mb-4 text-white text-lg">Company</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 transition-colors inline-flex items-center group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>About Us</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 transition-colors inline-flex items-center group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Careers</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 transition-colors inline-flex items-center group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Contact</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 transition-colors inline-flex items-center group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Blog</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="animate-fadeInUp animation-delay-300">
            <h4 className="font-bold mb-4 text-white text-lg">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 transition-colors inline-flex items-center group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 transition-colors inline-flex items-center group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Terms of Service</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 transition-colors inline-flex items-center group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>Cookie Policy</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 transition-colors inline-flex items-center group"
                >
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  <span>GDPR</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center animate-fadeInUp animation-delay-400">
          <p className="text-sm text-gray-500">
            © 2024 Sales+CRM. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function CRMLandingPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation handleLogin={handleLogin} handleSignUp={handleSignUp} />
      <HeroSection handleSignUp={handleSignUp} />
      <FeaturesSection />
      <DesktopMockupSection />
      <StatsSection />
      <PricingSection handleSignUp={handleSignUp} />
      <FAQSection />
      <CTASection handleSignUp={handleSignUp} />
      <Footer />
    </div>
  );
}
