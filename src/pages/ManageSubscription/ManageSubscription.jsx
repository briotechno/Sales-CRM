import React, { useState } from "react";
import { FiHome, FiDownload, FiCreditCard, FiExternalLink } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Check,
  X,
  Calendar,
  Users,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  Shield,
  BadgeCheck,
  ChevronRight,
  MoveUp,
  MoveDown,
  History,
  HardDrive,
  CreditCard as CardIcon,
  RefreshCw,
} from "lucide-react";

const ManageSubscription = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [activePlanId, setActivePlanId] = useState("professional");

  const plans = [
    {
      id: "starter",
      rank: 1,
      name: "Starter",
      description: "Perfect for small teams and startups just getting started.",
      price: { monthly: 2499, yearly: 24990 },
      icon: <Zap size={20} />,
      limits: { users: 5, leads: 1000, storage: "5GB" },
      features: ["5 Team Members", "1,000 Leads/mo", "Basic CRM", "Email Support"],
    },
    {
      id: "professional",
      rank: 2,
      name: "Professional",
      description: "The most popular choice for growing businesses needing more power.",
      price: { monthly: 6499, yearly: 64990 },
      icon: <Crown size={20} />,
      limits: { users: 25, leads: 10000, storage: "50GB" },
      features: ["25 Team Members", "10,000 Leads/mo", "Advanced CRM", "Priority Support", "API Access"],
      popular: true,
    },
    {
      id: "enterprise",
      rank: 3,
      name: "Enterprise",
      description: "Complete control and unlimited power for large scale operations.",
      price: { monthly: 16499, yearly: 164990 },
      icon: <Sparkles size={20} />,
      limits: { users: "Unlimited", leads: "Unlimited", storage: "500GB" },
      features: ["Unlimited Team", "Unlimited Leads", "Custom Branding", "Dedicated Manager", "24/7 Support"],
    },
  ];

  const usageData = [
    { label: "Team Members", used: 18, total: 25, icon: <Users size={16} />, color: "bg-blue-500" },
    { label: "Monthly Leads", used: 7420, total: 10000, icon: <Zap size={16} />, color: "bg-orange-500" },
    { label: "Cloud Storage", used: 32, total: 50, unit: "GB", icon: <HardDrive size={16} />, color: "bg-purple-500" },
  ];

  const billingHistory = [
    { id: "INV-2024-001", date: "Dec 15, 2023", amount: "₹6,499.00", status: "Paid", method: "Visa •••• 4242" },
    { id: "INV-2023-012", date: "Nov 15, 2023", amount: "₹6,499.00", status: "Paid", method: "Visa •••• 4242" },
    { id: "INV-2023-011", date: "Oct 15, 2023", amount: "₹6,499.00", status: "Paid", method: "Visa •••• 4242" },
  ];

  const currentPlan = plans.find((p) => p.id === activePlanId);

  return (
    <DashboardLayout>
      <div className="p-0 bg-[#F9FAFB] ml-6 min-h-screen pb-12">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-[40]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">Billing & subscription</h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 font-medium">
                <FiHome className="text-gray-400" />
                <ChevronRight size={14} />
                <span>Settings</span>
                <ChevronRight size={14} />
                <span className="text-orange-500">Subscription</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all">
                <RefreshCw size={16} />
                Sync Billing
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-900 border border-transparent rounded-lg hover:bg-black shadow-sm transition-all">
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 mt-8 space-y-8">
          {/* Top Section: Active Plan & Quick Stats */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* CURRENT PLAN CARD */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 opacity-[0.03] rounded-full -mr-16 -mt-16"></div>

                <div className="flex items-start justify-between">
                  <div className="flex gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                      {currentPlan.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-900">{currentPlan.name} Plan</h2>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                          Active
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">Your next charge is <span className="text-gray-900 font-semibold">₹{currentPlan.price[billingCycle].toLocaleString()}</span> on <span className="text-gray-900 font-semibold text-sm">Jan 15, 2025</span></p>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <div className="text-sm text-gray-400 font-medium">Billed {billingCycle}ly</div>
                    <div className="text-lg font-bold text-gray-900">₹{currentPlan.price[billingCycle].toLocaleString()}/mo</div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 sm:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Method</div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FiCreditCard className="text-orange-500" />
                      Visa •••• 4242
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Plan Created</div>
                    <div className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Calendar size={14} className="text-orange-500" />
                      Oct 12, 2023
                    </div>
                  </div>
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <button className="text-sm font-bold text-orange-600 hover:text-orange-700 underline decoration-2 underline-offset-4 flex items-center gap-1">
                      Update details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* USAGE METRICS */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-gray-900">Usage & Limits</h3>
                  <button className="text-sm font-semibold text-gray-400 hover:text-gray-600">See details</button>
                </div>
                <div className="grid gap-8">
                  {usageData.map((item, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex items-center justify-between text-sm font-semibold">
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="p-1.5 bg-gray-50 rounded-lg text-gray-400 group-hover:text-orange-500 transition-colors">
                            {item.icon}
                          </span>
                          {item.label}
                        </div>
                        <div className="text-gray-400">
                          <span className="text-gray-900">{item.used.toLocaleString()}</span> / {item.total === "Unlimited" ? "∞" : item.total.toLocaleString()} {item.unit || ""}
                        </div>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${(item.used / (item.total === 'Unlimited' ? item.used : item.total)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Billing cycle & Summary side panel */}
            <div className="space-y-6">
              {/* BILLING TOGGLE - MATCHING IMAGE */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 flex justify-center">
                <div className="bg-white rounded-[20px] p-2 flex items-center gap-1 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#f1f5f9] w-full max-w-[340px]">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${billingCycle === "monthly"
                        ? "bg-[#FF7B1D] text-white shadow-[0_8px_16px_rgba(255,123,29,0.2)]"
                        : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle("yearly")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${billingCycle === "yearly"
                        ? "bg-[#FF7B1D] text-white shadow-[0_8px_16px_rgba(255,123,29,0.2)]"
                        : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    Yearly
                    <span className={`px-2 py-0.5 text-[9px] font-black tracking-tighter rounded-full ${billingCycle === "yearly" ? "bg-white text-[#FF7B1D]" : "bg-[#FF7B1D] text-white"
                      }`}>
                      SAVE 20%
                    </span>
                  </button>
                </div>
              </div>

              {/* PAYMENT DETAILS */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Support & Help</h4>
                <div className="space-y-4">
                  <a href="#" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Shield className="w-5 h-5 text-orange-500" />
                      </div>
                      <span className="text-sm font-bold text-gray-700 group-hover:text-orange-700">Privacy Policy</span>
                    </div>
                    <FiExternalLink className="text-gray-300 group-hover:text-orange-400" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <History className="w-5 h-5 text-orange-500" />
                      </div>
                      <span className="text-sm font-bold text-gray-700 group-hover:text-orange-700">Billing Terms</span>
                    </div>
                    <FiExternalLink className="text-gray-300 group-hover:text-orange-400" />
                  </a>
                </div>
                <div className="mt-8 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl text-white text-center">
                  <p className="text-xs font-medium text-gray-400 mb-2">Need localized assistance?</p>
                  <p className="text-sm font-bold mb-4">Chat with our billing squad</p>
                  <button className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all shadow-lg active:scale-95">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BILLING HISTORY TABLE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Billing History</h3>
                <p className="text-sm text-gray-500">Download and manage your past invoices.</p>
              </div>
              <button className="px-4 py-2 text-sm font-bold text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 flex items-center gap-2 transition-all">
                <FiDownload /> Download All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Invoice ID</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Billing Date</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {billingHistory.map((inv, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="text-sm font-bold text-gray-900">{inv.id}</div>
                        <div className="text-xs text-gray-400">{inv.method}</div>
                      </td>
                      <td className="px-8 py-4 text-sm font-medium text-gray-600">{inv.date}</td>
                      <td className="px-8 py-4 text-sm font-bold text-gray-900">{inv.amount}</td>
                      <td className="px-8 py-4">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-green-50 text-green-600 border border-green-100">
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors">
                          <FiDownload size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-gray-50/50 border-t border-gray-50 text-center">
              <button className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-all">
                View complete billing history
              </button>
            </div>
          </div>

          {/* PLAN UPGRADE SECTION */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Explored other possibilities?</h2>
              <p className="text-gray-500">Fine tune your experience by switching to a plan that fits your current momentum.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 pb-12">
              {plans.map((plan) => (
                <div key={plan.id} className={`bg-white rounded-[32px] p-8 border-2 transition-all duration-500 group relative ${plan.id === activePlanId
                    ? "border-orange-500 shadow-2xl shadow-orange-500/10"
                    : "border-gray-100 hover:border-orange-200 hover:shadow-xl"
                  }`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-10 -translate-y-1/2 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[2px] shadow-lg">
                      Popular Choice
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${plan.id === activePlanId ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-600 group-hover:bg-orange-100"
                      }`}>
                      {plan.icon}
                    </div>
                    {plan.id === activePlanId && <BadgeCheck className="text-orange-500" size={24} />}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <div className="mb-8 items-baseline gap-1 flex">
                    <span className="text-4xl font-black text-gray-900 tracking-tighter">₹{plan.price[billingCycle].toLocaleString()}</span>
                    <span className="text-gray-400 font-medium text-sm">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>

                  <ul className="space-y-4 mb-10 min-h-[160px]">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                        <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                          <Check className="text-green-500" size={12} />
                        </div>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <button
                    disabled={plan.id === activePlanId}
                    onClick={() => setActivePlanId(plan.id)}
                    className={`w-full py-4 rounded-xl font-black text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${plan.id === activePlanId
                        ? "bg-gray-100 text-gray-400 cursor-default shadow-none"
                        : "bg-gray-900 text-white hover:bg-black hover:shadow-gray-900/40 active:scale-95 translate-y-0 hover:-translate-y-1"
                      }`}>
                    {plan.id === activePlanId ? "Active Component" : plan.rank > currentPlan.rank ? "Move Up to " + plan.name : "Downgrade"}
                    {plan.id !== activePlanId && (plan.rank > currentPlan.rank ? <MoveUp size={16} /> : <MoveDown size={16} />)}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageSubscription;
