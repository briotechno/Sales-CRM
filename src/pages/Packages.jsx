import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  ChevronLeft,
  ChevronRight,
  Check,
  Users,
  Database,
  Zap,
  Shield,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";

const PricingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSelecting, setIsSelecting] = useState(null);
  const [searchParams] = useSearchParams();
  const isSignedUp = searchParams.get("signed_up") === "true";

  // Sample packages data
  const packages = [
    {
      id: 1,
      name: "Starter",
      price: 999,
      defaultEmployees: 5,
      defaultStorage: 10,
      maxEmployees: 10,
      maxStorage: 50,
      features: [
        "Basic CRM Features",
        "Email Support",
        "Mobile App Access",
        "Basic Reports",
      ],
    },
    {
      id: 2,
      name: "Professional",
      price: 2499,
      defaultEmployees: 15,
      defaultStorage: 50,
      maxEmployees: 50,
      maxStorage: 200,
      features: [
        "Advanced CRM Features",
        "Priority Support",
        "Custom Dashboards",
        "Advanced Analytics",
        "API Access",
      ],
      popular: true,
    },
    {
      id: 3,
      name: "Business",
      price: 4999,
      defaultEmployees: 30,
      defaultStorage: 100,
      maxEmployees: 100,
      maxStorage: 500,
      features: [
        "All Professional Features",
        "24/7 Support",
        "White Label Option",
        "Advanced Integrations",
        "Custom Reports",
      ],
    },
    {
      id: 4,
      name: "Enterprise",
      price: 9999,
      defaultEmployees: 50,
      defaultStorage: 250,
      maxEmployees: 500,
      maxStorage: 2000,
      features: [
        "All Business Features",
        "Dedicated Account Manager",
        "Custom Development",
        "SLA Guarantee",
        "Unlimited Integrations",
      ],
    },
    {
      id: 5,
      name: "Startup",
      price: 1499,
      defaultEmployees: 8,
      defaultStorage: 25,
      maxEmployees: 20,
      maxStorage: 100,
      features: [
        "Standard CRM Features",
        "Email & Chat Support",
        "Team Collaboration",
        "Basic Analytics",
      ],
    },
    {
      id: 6,
      name: "Growth",
      price: 3499,
      defaultEmployees: 20,
      defaultStorage: 75,
      maxEmployees: 75,
      maxStorage: 300,
      features: [
        "Advanced Features",
        "Priority Support",
        "Marketing Automation",
        "Custom Workflows",
        "Data Export",
      ],
    },
    {
      id: 7,
      name: "Scale",
      price: 6999,
      defaultEmployees: 40,
      defaultStorage: 150,
      maxEmployees: 150,
      maxStorage: 750,
      features: [
        "All Growth Features",
        "Premium Support",
        "Advanced Security",
        "Multi-region Support",
        "Custom Integrations",
      ],
    },
    {
      id: 8,
      name: "Ultimate",
      price: 14999,
      defaultEmployees: 100,
      defaultStorage: 500,
      maxEmployees: 1000,
      maxStorage: 5000,
      features: [
        "Unlimited Everything",
        "White Glove Support",
        "Enterprise Security",
        "Custom Infrastructure",
        "Dedicated Resources",
      ],
    },
    {
      id: 9,
      name: "Premium",
      price: 5499,
      defaultEmployees: 25,
      defaultStorage: 120,
      maxEmployees: 80,
      maxStorage: 400,
      features: [
        "Premium CRM Features",
        "24/7 Priority Support",
        "Advanced Automation",
        "Custom Branding",
        "API Access",
      ],
    },
    {
      id: 10,
      name: "Corporate",
      price: 11999,
      defaultEmployees: 75,
      defaultStorage: 350,
      maxEmployees: 300,
      maxStorage: 1500,
      features: [
        "Enterprise Features",
        "Dedicated Support Team",
        "Custom Solutions",
        "Advanced Compliance",
        "Unlimited API Calls",
      ],
    },
  ];

  // State for each package's customization
  const [packageCustomizations, setPackageCustomizations] = useState(
    packages.reduce((acc, pkg) => {
      acc[pkg.id] = {
        employees: pkg.defaultEmployees,
        storage: pkg.defaultStorage,
      };
      return acc;
    }, {})
  );

  const navigate = useNavigate();

  const itemsPerPage = 3;
  const totalSlides = Math.ceil(packages.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentPackages = () => {
    const start = currentSlide * itemsPerPage;
    return packages.slice(start, start + itemsPerPage);
  };

  const handleEmployeeChange = (pkgId, value) => {
    setPackageCustomizations((prev) => ({
      ...prev,
      [pkgId]: { ...prev[pkgId], employees: parseInt(value) },
    }));
  };

  const handleStorageChange = (pkgId, value) => {
    setPackageCustomizations((prev) => ({
      ...prev,
      [pkgId]: { ...prev[pkgId], storage: parseInt(value) },
    }));
  };

  const calculatePrice = (pkg) => {
    const custom = packageCustomizations[pkg.id];
    const empDiff = custom.employees - pkg.defaultEmployees;
    const storageDiff = custom.storage - pkg.defaultStorage;
    const additionalCost = empDiff * 50 + storageDiff * 2;
    return pkg.price + Math.max(0, additionalCost);
  };

  const handleSelectPlan = (pkg) => {
    setIsSelecting(pkg.id);
    toast.success(`${pkg.name} Plan selected! Redirecting to login...`, {
      icon: '🚀',
      style: {
        borderRadius: '10px',
        border: '1px solid #FF7B1D',
        color: '#FF7B1D',
      },
    });

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 py-12 px-4">
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400 rounded-full filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-300 rounded-full filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
        <div className="inline-block mb-6">
          <span className="bg-orange-100 text-[#FF7B1D] px-6 py-2 rounded-full text-xs font-black uppercase tracking-[2px] border border-orange-200 shadow-sm animate-bounce">
            🚀 Choose Your Momentum
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter">
          {isSignedUp ? "Welcome! " : "Choose Your "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7B1D] to-orange-400">
            {isSignedUp ? "Choose Your Plan" : "Perfect Plan"}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
          Customize employees and storage to match your business needs. Scale as
          you grow.
        </p>
      </div>

      {/* Packages Slider */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Navigation Buttons */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 group hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 group hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-8 max-w-6xl mx-auto pt-10">
          {getCurrentPackages().map((pkg) => {
            const custom = packageCustomizations[pkg.id];
            const finalPrice = calculatePrice(pkg);

            return (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-3xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(255,123,29,0.15)] group flex flex-col ${pkg.popular
                  ? "ring-2 ring-orange-500 scale-105 z-20 shadow-2xl"
                  : "border border-orange-100 hover:border-orange-500 shadow-xl"
                  }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg z-30 whitespace-nowrap">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-8 flex-1 flex flex-col">
                  {/* Package Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                      {pkg.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-gray-400 text-lg font-bold">₹</span>
                      <span className="text-5xl font-black text-gray-900 tracking-tighter">
                        {finalPrice.toLocaleString()}
                      </span>
                      <span className="text-gray-400 font-medium whitespace-nowrap">/ month</span>
                    </div>
                  </div>

                  <div className="space-y-8 mb-8">
                    {/* Employee Customization */}
                    <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100 group-hover:bg-white group-hover:border-orange-200 transition-all">
                      <div className="flex items-center justify-between mb-3 px-1">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Users className="w-4 h-4 text-orange-500" />
                          </div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Employees
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-orange-400">
                          Max: {pkg.maxEmployees}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                        <button
                          onClick={() =>
                            handleEmployeeChange(
                              pkg.id,
                              Math.max(pkg.defaultEmployees, custom.employees - 1)
                            )
                          }
                          disabled={custom.employees <= pkg.defaultEmployees}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-orange-500 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 rounded-lg transition-all"
                        >
                          <span className="text-xl font-bold">-</span>
                        </button>
                        <div className="text-center">
                          <span className="text-xl font-black text-gray-900">
                            {custom.employees}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            handleEmployeeChange(
                              pkg.id,
                              Math.min(pkg.maxEmployees, custom.employees + 1)
                            )
                          }
                          disabled={custom.employees >= pkg.maxEmployees}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-orange-500 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 rounded-lg transition-all"
                        >
                          <span className="text-xl font-bold">+</span>
                        </button>
                      </div>
                    </div>

                    {/* Storage Customization */}
                    <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100 group-hover:bg-white group-hover:border-orange-200 transition-all">
                      <div className="flex items-center justify-between mb-3 px-1">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Database className="w-4 h-4 text-orange-500" />
                          </div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Storage
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-orange-400">
                          Max: {pkg.maxStorage}GB
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                        <button
                          onClick={() =>
                            handleStorageChange(
                              pkg.id,
                              Math.max(pkg.defaultStorage, custom.storage - 5)
                            )
                          }
                          disabled={custom.storage <= pkg.defaultStorage}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-orange-500 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 rounded-lg transition-all"
                        >
                          <span className="text-xl font-bold">-</span>
                        </button>
                        <div className="text-center">
                          <span className="text-xl font-black text-gray-900">
                            {custom.storage} <span className="text-sm font-bold text-gray-400 uppercase">GB</span>
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            handleStorageChange(
                              pkg.id,
                              Math.min(pkg.maxStorage, custom.storage + 5)
                            )
                          }
                          disabled={custom.storage >= pkg.maxStorage}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-orange-500 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 rounded-lg transition-all"
                        >
                          <span className="text-xl font-bold">+</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-10 flex-1">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-4 px-1">
                      Key Features
                    </h4>
                    <ul className="space-y-4">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="mt-1 w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 transition-colors">
                            <Check className="w-3 h-3 text-orange-600 group-hover:text-white transition-colors" />
                          </div>
                          <span className="text-sm font-medium text-gray-600 leading-tight">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    <button
                      onClick={() => handleSelectPlan(pkg)}
                      disabled={isSelecting !== null}
                      className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 ${isSelecting === pkg.id
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-900 text-white hover:bg-[#FF7B1D] hover:shadow-[0_15px_30px_rgba(255,123,29,0.3)] shadow-[0_10px_20px_rgba(0,0,0,0.1)] active:scale-95 translate-y-0 hover:-translate-y-1"
                        }`}
                    >
                      {isSelecting === pkg.id ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        <>
                          Select Plan
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )
                      }
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slide Indicators */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide
                  ? "w-8 bg-orange-600"
                  : "w-2 bg-orange-300"
                  }`}
              />
            ))}
          </div>
        )}
      </div>
      {/* Free Trial Banner */}
      <div className="max-w-4xl mx-auto mt-12 mb-8">
        <div
          className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500
                  rounded-full px-12 py-8 shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black opacity-5"></div>
          <div className="absolute top-1/2 right-0 w-56 h-56 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-24"></div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-3">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Try Free for 14 Days!
            </h2>

            <p className="text-sm md:text-base text-orange-100 mb-4">
              No credit card required • Cancel anytime
            </p>

            <button
              onClick={() => navigate("/login")}
              className="bg-white text-orange-600 hover:bg-orange-50 font-bold
             py-3 px-8 rounded-full text-base transition-all
             duration-300 transform hover:scale-105 shadow-lg
             inline-flex items-center gap-2 group"
            >
              <span>Start Free Trial</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="max-w-7xl mx-auto mt-8 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 rounded-3xl p-12 md:p-16 text-center shadow-2xl relative overflow-hidden">
        {/* Background Animation Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative z-10">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-xl">
            <Shield className="w-10 h-10 text-white" />
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-3 max-w-3xl mx-auto leading-relaxed">
            Get enterprise solutions tailored to your business needs
          </p>
          <p className="text-base md:text-lg text-orange-300 mb-8 max-w-2xl mx-auto">
            Our sales team will help you find the perfect plan with custom
            features, dedicated support, and flexible pricing
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-orange-500 border-opacity-30">
              <Users className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">
                Dedicated Manager
              </h3>
              <p className="text-gray-300 text-sm">
                Personal account manager for your team
              </p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-orange-500 border-opacity-30">
              <Zap className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">
                Custom Integration
              </h3>
              <p className="text-gray-300 text-sm">
                Seamless integration with your tools
              </p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-orange-500 border-opacity-30">
              <Shield className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">
                Priority Support
              </h3>
              <p className="text-gray-300 text-sm">
                24/7 premium support for your business
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-12 rounded-full text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl inline-flex items-center gap-3 group">
            <span>Contact Sales Team</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>

          {/* Additional Info */}
          <p className="text-gray-400 text-sm mt-6">
            Response within 24 hours • Free consultation • No obligations
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
