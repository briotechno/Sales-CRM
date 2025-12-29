import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Check,
  X,
  CreditCard,
  Calendar,
  Users,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  Download,
  Clock,
  Shield,
} from "lucide-react";

const ManageSubscription = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState("professional");

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: { monthly: 2499, yearly: 24990 },
      icon: <Zap className="w-6 h-6" />,
      color: "from-orange-100 to-orange-50",
      borderColor: "border-orange-200",
      buttonColor: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      popular: false,
      features: [
        { text: "Up to 5 team members", included: true },
        { text: "1,000 leads per month", included: true },
        { text: "Basic CRM features", included: true },
        { text: "Email support", included: true },
        { text: "Mobile app access", included: true },
        { text: "Custom pipelines", included: false },
        { text: "Advanced analytics", included: false },
        { text: "API access", included: false },
        { text: "Priority support", included: false },
      ],
    },
    {
      id: "professional",
      name: "Professional",
      price: { monthly: 6499, yearly: 64990 },
      icon: <Crown className="w-6 h-6" />,
      color: "from-orange-500 to-orange-400",
      borderColor: "border-orange-500",
      buttonColor:
        "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700",
      popular: true,
      features: [
        { text: "Up to 25 team members", included: true },
        { text: "10,000 leads per month", included: true },
        { text: "Advanced CRM features", included: true },
        { text: "Priority email support", included: true },
        { text: "Mobile app access", included: true },
        { text: "Custom pipelines", included: true },
        { text: "Advanced analytics", included: true },
        { text: "API access", included: true },
        { text: "24/7 Priority support", included: false },
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: { monthly: 16499, yearly: 164990 },
      icon: <Sparkles className="w-6 h-6" />,
      color: "from-gray-900 to-gray-800",
      borderColor: "border-gray-300",
      buttonColor: "bg-gray-900 text-white hover:bg-gray-800",
      popular: false,
      features: [
        { text: "Unlimited team members", included: true },
        { text: "Unlimited leads", included: true },
        { text: "All CRM features", included: true },
        { text: "Dedicated support", included: true },
        { text: "Mobile app access", included: true },
        { text: "Custom pipelines", included: true },
        { text: "Advanced analytics", included: true },
        { text: "API access", included: true },
        { text: "24/7 Priority support", included: true },
      ],
    },
  ];

  const currentPlan = {
    name: "Professional",
    nextBilling: "January 15, 2025",
    amount: "₹6,499",
    status: "Active",
  };

  return (
    <DashboardLayout>
      <div className="p-0 bg-gradient-to-br from-gray-0 to-gray-100 ml-6 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-orange-100 shadow-sm">
          <div className="max-w-8xl ml-2 mx-auto px-0 py-4">
            <div className="flex items-center justify-between">
              {/* Left Side */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Manage Subscription
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700 text-sm" />
                  <span className="text-gray-400"></span> Settings /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    All Subscription
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-0 py-0 mt-4">
          {/* Current Plan Card */}
          <div className="bg-white rounded-sm shadow-lg border-2 border-orange-200 p-6 mb-12 transform   duration-300">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {currentPlan.name} Plan
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      {currentPlan.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      <span>Next billing: {currentPlan.nextBilling}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="font-semibold text-gray-800">
                        {currentPlan.amount}/month
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-orange-100 text-orange-700 rounded-lg font-semibold hover:bg-orange-200  duration-200 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Invoice
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 duration-200 flex items-center gap-2">
                  Update Payment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-full p-2 shadow-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                    billingCycle === "monthly"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-orange-600"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 relative ${
                    billingCycle === "yearly"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-orange-600"
                  }`}
                >
                  Yearly
                  <span className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full font-bold">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-sm shadow-xl border-2 ${
                  plan.borderColor
                } overflow-hidden transform  transition-all duration-300 ${
                  plan.popular ? "ring-4 ring-orange-200" : ""
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-bl-2xl font-bold text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </div>
                )}

                {/* Plan Header */}
                <div
                  className={`bg-gradient-to-r ${plan.color} p-8 text-center`}
                >
                  <div
                    className={`inline-flex p-4 rounded-2xl mb-4 ${
                      plan.id === "professional"
                        ? "bg-white/20 backdrop-blur-sm"
                        : "bg-white"
                    }`}
                  >
                    <div
                      className={
                        plan.id === "professional"
                          ? "text-white"
                          : "text-orange-500"
                      }
                    >
                      {plan.icon}
                    </div>
                  </div>
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      plan.id === "professional" || plan.id === "enterprise"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <div
                    className={`flex items-end justify-center gap-2 ${
                      plan.id === "professional" || plan.id === "enterprise"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    <span className="text-5xl font-bold">
                      ₹{plan.price[billingCycle].toLocaleString("en-IN")}
                    </span>
                    <span className="text-lg mb-2 opacity-80">
                      /{billingCycle === "monthly" ? "mo" : "yr"}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="p-8">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        {feature.included ? (
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                            <X className="w-3 h-3 text-gray-400" />
                          </div>
                        )}
                        <span
                          className={`text-sm ${
                            feature.included ? "text-gray-700" : "text-gray-400"
                          }`}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full py-4 rounded-xl font-bold transition-all duration-300 transform  flex items-center justify-center gap-2 ${
                      plan.buttonColor
                    } ${
                      selectedPlan === plan.id ? "ring-4 ring-orange-200" : ""
                    }`}
                  >
                    {selectedPlan === plan.id ? "Current Plan" : "Choose Plan"}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-sm p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Secure Payments</h4>
                  <p className="text-sm text-gray-600">
                    256-bit SSL encryption
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Cancel Anytime</h4>
                  <p className="text-sm text-gray-600">
                    No long-term contracts
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-sm p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">24/7 Support</h4>
                  <p className="text-sm text-gray-600">Always here to help</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageSubscription;
