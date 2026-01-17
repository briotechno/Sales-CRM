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
  KeyRound,
} from "lucide-react";
import { useRedeemKeyMutation, useGetSubscriptionStatsQuery } from "../../store/api/enterpriseApi";
import { useGetPlansQuery } from "../../store/api/planApi";
import { toast } from "react-hot-toast";
import { Loader2, Package } from "lucide-react";

const ManageSubscription = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [productKey, setProductKey] = useState("");

  const { data: statsResponse, isLoading: statsLoading, refetch } = useGetSubscriptionStatsQuery();
  const { data: plansResponse, isLoading: plansLoading } = useGetPlansQuery({ limit: 100 });
  const [redeemKey, { isLoading: isRedeeming }] = useRedeemKeyMutation();

  const stats = statsResponse?.data;
  const activeSubscription = stats?.activeSubscription;
  const activePlanName = activeSubscription?.plan?.toLowerCase() || "starter";

  const handleRedeem = async () => {
    if (!productKey) {
      toast.error("Please enter a product key");
      return;
    }
    try {
      await redeemKey({ productKey }).unwrap();
      toast.success("Product key redeemed successfully! Your plan has been updated.");
      setProductKey("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to redeem product key");
    }
  };

  const dynamicPlans = plansResponse?.data || [];

  const plans = dynamicPlans.map((plan, index) => ({
    id: plan.name.toLowerCase(),
    rank: index + 1,
    name: plan.name,
    description: plan.description || `Perfect for ${plan.name} level operations.`,
    price: {
      monthly: parseFloat(plan.price),
      yearly: parseFloat(plan.price) * 10 // Mock yearly if not in DB
    },
    icon: plan.name.toLowerCase() === 'starter' ? <Zap size={20} /> :
      plan.name.toLowerCase() === 'professional' ? <Crown size={20} /> : <Sparkles size={20} />,
    limits: {
      users: plan.default_users,
      leads: plan.default_leads,
      storage: `${plan.default_storage}GB`
    },
    features: (plan.key_features || "Basic Features,Email Support").split(',').map(f => f.trim()),
    popular: plan.name.toLowerCase() === 'professional'
  }));

  const usageData = stats ? [
    {
      label: "Team Members",
      used: Number(stats.usage?.employees || 0),
      total: activeSubscription?.users,
      unit: "",
      icon: <Users size={16} />,
      color: "bg-blue-500",
      bg: "bg-blue-100"
    },
    {
      label: "Monthly Leads",
      used: Number(stats.usage?.leads || 0),
      total: activeSubscription?.leads,
      unit: "",
      icon: <Zap size={16} />,
      color: "bg-orange-500",
      bg: "bg-orange-100"
    },
    {
      label: "Cloud Storage",
      used: Number(stats.usage?.storage || 0),
      total: activeSubscription?.storage,
      unit: "GB",
      icon: <HardDrive size={16} />,
      color: "bg-purple-500",
      bg: "bg-purple-100"
    },
  ] : [];

  const billingHistory = stats?.billingHistory.map(sub => ({
    id: `SUB-${sub.id.toString().padStart(4, '0')}`,
    date: new Date(sub.onboardingDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    amount: `₹${parseFloat(sub.amount).toLocaleString()}`,
    status: sub.status,
    method: "Product Key"
  })) || [];

  const currentPlan = plans.find((p) => p.id === activePlanName) || plans[0];

  if (statsLoading || plansLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] ml-6">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading Subscription Details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!currentPlan) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] ml-6">
          <Package className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500 font-bold">No Plan Found</p>
        </div>
      </DashboardLayout>
    );
  }

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
              <button
                onClick={() => {
                  refetch();
                  toast.success("Billing data synchronized!");
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all"
              >
                <RefreshCw size={16} />
                Sync Billing
              </button>
              <button
                onClick={() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-900 border border-transparent rounded-lg hover:bg-black shadow-sm transition-all"
              >
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
                      <p className="text-gray-500 text-sm mt-1">
                        Your next charge is <span className="text-gray-900 font-semibold">₹{currentPlan?.price[billingCycle].toLocaleString()}</span> on <span className="text-gray-900 font-semibold text-sm">{activeSubscription ? new Date(activeSubscription.expiryDate).toLocaleDateString() : 'N/A'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <div className="text-sm text-gray-400 font-medium">Billed {activeSubscription?.billingCycle || billingCycle}</div>
                    <div className="text-lg font-bold text-gray-900">₹{currentPlan?.price[billingCycle].toLocaleString()}/mo</div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 sm:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Method</div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FiCreditCard className="text-orange-500" />
                      Product Key Activation
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Plan Created</div>
                    <div className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Calendar size={14} className="text-orange-500" />
                      {activeSubscription ? new Date(activeSubscription.onboardingDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <button className="text-sm font-bold text-orange-600 hover:text-orange-700 underline decoration-2 underline-offset-4 flex items-center gap-1">
                      View details <ArrowRight size={14} />
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
                  {usageData.map((item, idx) => {
                    const isUnlimited = item.total === "Unlimited" || item.total === -1 || item.total === "0" || item.total === 0;
                    // Note: Depending on logic, 0 might mean 0 allowed, OR unlimited. 
                    // But usually leads=0 means 0 allowed. 
                    // However, if we want to show safe UI, let's treat explicit high numbers as unlimited or just string "Unlimited".
                    // Let's assume standard logic: Total is a number. If it's string "Unlimited", handle it.

                    const totalNum = Number(item.total || 0);
                    const isTrulyUnlimited = item.total === "Unlimited" || item.total === -1;

                    const totalDisplay = isTrulyUnlimited ? "∞" : totalNum.toLocaleString();
                    const percentage = isTrulyUnlimited || totalNum === 0
                      ? (item.used > 0 ? 100 : 0) // Full bar if used > 0 but total is 0 (over limit?) or just 0.
                      : Math.min((item.used / totalNum) * 100, 100);

                    return (
                      <div key={idx} className="space-y-3">
                        <div className="flex items-center justify-between text-sm font-semibold">
                          <div className="flex items-center gap-2 text-gray-700">
                            <div className={`p-1.5 rounded-lg ${item.bg || 'bg-gray-50'} text-gray-600`}>
                              {item.icon}
                            </div>
                            {item.label}
                          </div>
                          <div className="text-gray-400">
                            <span className="text-gray-900">{item.used.toLocaleString()}</span> / {totalDisplay} {item.unit}
                          </div>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
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

              {/* REDEEM PRODUCT KEY */}
              <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 bg-gradient-to-br from-white to-orange-50/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <KeyRound className="w-5 h-5 text-orange-600" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Redeem Product Key</h4>
                </div>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Have a license key? Enter it below to instantly upgrade or extend your current subscription.
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    value={productKey}
                    onChange={(e) => setProductKey(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 bg-white border-2 border-orange-100 rounded-xl text-sm font-mono placeholder-gray-300 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-bold"
                  />
                  <button
                    onClick={handleRedeem}
                    disabled={isRedeeming}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isRedeeming ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Zap size={16} />
                    )}
                    Activate Key
                  </button>
                </div>
              </div>

              {/* PAYMENT DETAILS (Existing) */}
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
          <div className="mt-20" id="plans-section">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Explored other possibilities?</h2>
              <p className="text-gray-500">Fine tune your experience by switching to a plan that fits your current momentum.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 pb-12">
              {plans.map((plan) => (
                <div key={plan.id} className={`bg-white rounded-[32px] p-8 border-2 transition-all duration-500 group relative ${plan.id === activePlanName
                  ? "border-orange-500 shadow-2xl shadow-orange-500/10"
                  : "border-gray-100 hover:border-orange-200 hover:shadow-xl"
                  }`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[2px] shadow-lg whitespace-nowrap">
                      MOST POPULAR
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${plan.id === activePlanName ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-600 group-hover:bg-orange-100"
                      }`}>
                      {plan.icon}
                    </div>
                    {plan.id === activePlanName && <BadgeCheck className="text-orange-500" size={24} />}
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
                    disabled={plan.id === activePlanName}
                    onClick={() => toast.error("Online payment integration coming soon. Please use a Product Key to upgrade.")}
                    className={`w-full py-4 rounded-xl font-black text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${plan.id === activePlanName
                      ? "bg-gray-100 text-gray-400 cursor-default shadow-none"
                      : "bg-gray-900 text-white hover:bg-black hover:shadow-gray-900/40 active:scale-95 translate-y-0 hover:-translate-y-1"
                      }`}>
                    {plan.id === activePlanName ? "Active Plan" : plan.rank > currentPlan.rank ? "Move Up to " + plan.name : "Downgrade"}
                    {plan.id !== activePlanName && (plan.rank > currentPlan.rank ? <MoveUp size={16} /> : <MoveDown size={16} />)}
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
