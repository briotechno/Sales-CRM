import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  ChevronDown,
  Search,
  HelpCircle,
  FileText,
  Users,
  DollarSign,
  Bell,
  MessageSquare,
  Home,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  Calendar,
} from "lucide-react";
import NumberCard from "../../components/NumberCard";

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      category: "Getting Started",
      icon: <HelpCircle className="w-5 h-5" />,
      color: "from-orange-400 to-orange-500",
      questions: [
        {
          q: "How do I create a new account in Sales+CRM?",
          a: "To create a new account, click on the 'Sign Up' button on the homepage. Fill in your business details, email, and password. You'll receive a verification email to activate your account.",
        },
        {
          q: "What are the system requirements?",
          a: "Sales+CRM is a cloud-based platform that works on any modern web browser (Chrome, Firefox, Safari, Edge). No special software installation is required. For mobile access, we have iOS and Android apps available.",
        },
        {
          q: "How do I import my existing customer data?",
          a: "Navigate to Settings > Business Info > Import Data. You can upload CSV or Excel files with your customer information. Our system will guide you through mapping your fields to our CRM structure.",
        },
      ],
    },
    {
      category: "Features & Functionality",
      icon: <Zap className="w-5 h-5" />,
      color: "from-blue-400 to-blue-500",
      questions: [
        {
          q: "How does the Quotation feature work?",
          a: "The Quotation feature allows you to create professional quotes for clients. Go to 'Quotation' in the sidebar, click 'New Quote', add products/services, set prices, and send directly to clients via email.",
        },
        {
          q: "Can I customize Invoice templates?",
          a: "Yes! Under Settings > Business Info, you can customize your invoice templates with your logo, colors, payment terms, and footer information to match your brand identity.",
        },
        {
          q: "How do I track my expenses?",
          a: "Use the 'My Expenses' feature to log business expenses. You can categorize expenses, upload receipts, and generate expense reports for accounting purposes.",
        },
        {
          q: "What is the Messenger feature used for?",
          a: "The Messenger feature enables internal team communication and client messaging. You can create group chats, share files, and maintain all communication within the CRM platform.",
        },
      ],
    },
    {
      category: "Account & Subscription",
      icon: <DollarSign className="w-5 h-5" />,
      color: "from-green-400 to-green-500",
      questions: [
        {
          q: "How do I upgrade my subscription plan?",
          a: "Go to Settings > Manage Subscription to view available plans. Select your desired plan and complete the payment process. Your upgrade will be activated immediately.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual subscriptions.",
        },
        {
          q: "Can I cancel my subscription anytime?",
          a: "Yes, you can cancel anytime from Settings > Manage Subscription. You'll retain access until the end of your billing period, and no future charges will be applied.",
        },
      ],
    },
    {
      category: "Support & Security",
      icon: <Shield className="w-5 h-5" />,
      color: "from-purple-400 to-purple-500",
      questions: [
        {
          q: "Is my data secure?",
          a: "Absolutely. We use bank-level 256-bit SSL encryption for all data transmission. Our servers are ISO 27001 certified, and we perform regular security audits. Your data is backed up daily.",
        },
        {
          q: "How do I contact customer support?",
          a: "You can reach our support team via the chat widget on the bottom right, email us at support@salescrm.com, or call our hotline during business hours (9 AM - 6 PM EST).",
        },
        {
          q: "Do you offer training for new users?",
          a: "Yes! We provide free onboarding sessions for all new accounts, video tutorials in our knowledge base, and weekly webinars covering different features of the platform.",
        },
      ],
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFAQs = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (item) =>
          item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.a.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <DashboardLayout>
      <div className="min-h-screen ml-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 py-16">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <div className="inline-block p-4 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
              <HelpCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How can we help you?
            </h2>
            <p className="text-lg text-orange-100 max-w-2xl mx-auto">
              Search our knowledge base or browse categories below to find
              answers
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-0 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white border-b py-3">
            <NumberCard
              title={"Support Available"}
              number={"24/7"}
              icon={<Clock className="text-blue-600" size={24} />}
              iconBgColor={"bg-blue-100"}
              lineBorderClass={"border-blue-500"} />

            <NumberCard
              title={"Questions Answered"}
              number={"500+"}
              icon={<CheckCircle className="text-green-600" size={24} />}
              iconBgColor={"bg-green-100"}
              lineBorderClass={"border-green-500"} />

            <NumberCard
              title={"Happy Users"}
              number={"10K+"}
              icon={<Users className="text-orange-600" size={24} />}
              iconBgColor={"bg-orange-100"}
              lineBorderClass={"border-orange-500"} />

            <NumberCard
              title={"Response Time"}
              number={"< 2hrs"}
              icon={<Zap className="text-purple-600" size={24} />}
              iconBgColor={"bg-purple-100"}
              lineBorderClass={"border-purple-500"} />

          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-7xl mx-auto  pb-12">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-sm shadow-lg">
              <MessageSquare className="w-20 h-20 text-orange-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600">
                No results found. Try a different search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredFAQs.map((category, catIndex) => (
                <div key={catIndex} className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`bg-gradient-to-br ${category.color} text-white p-3 rounded-sm shadow-lg`}
                    >
                      {category.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {category.category}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {category.questions.map((item, qIndex) => {
                      const globalIndex = `${catIndex}-${qIndex}`;
                      const isOpen = openIndex === globalIndex;

                      return (
                        <div
                          key={qIndex}
                          className="bg-white rounded-sm shadow-md overflow-hidden border border-gray-200 hover:border-orange-300 transition-all hover:shadow-lg"
                        >
                          <button
                            onClick={() => toggleAccordion(globalIndex)}
                            className="w-full px-6 py-4 text-left flex items-start justify-between hover:bg-orange-50 transition-colors group"
                          >
                            <span className="text-base font-semibold text-gray-800 pr-4 group-hover:text-orange-600 transition-colors">
                              {item.q}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 text-orange-500 flex-shrink-0 transition-transform duration-300 mt-1 ${isOpen ? "transform rotate-180" : ""
                                }`}
                            />
                          </button>

                          <div
                            className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"
                              }`}
                          >
                            <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-blue-50 border-t border-orange-100">
                              <p className="text-gray-700 leading-relaxed">
                                {item.a}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support Section */}
        <div className="max-w-7xl mx-auto   mt-4 pb-12">
          <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 rounded-sm p-10 text-white text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
            <div className="relative z-10">
              <Bell className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-3">Still need help?</h3>
              <p className="text-orange-100 mb-8 text-lg max-w-2xl mx-auto">
                Our support team is here to assist you 24/7. Get personalized
                help from our experts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-orange-600 text-white mb-8  px-8 py-4 rounded-sm font-semibold hover:bg-orange-700 transition-all transform  shadow-lg border-2 border-white/30 flex items-center justify-center gap-2">
                  <Bell size={20} />
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
