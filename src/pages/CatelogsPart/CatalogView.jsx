import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    Package,
    DollarSign,
    Grid,
    CheckCircle,
    Share2,
    Phone,
    Mail,
    ExternalLink,
    Star,
    Award,
    Clock,
    Truck,
    Shield,
    Users,
    Download,
    Heart,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
    Zap,
    TrendingUp,
    Target,
} from "lucide-react";

// Mock data with enhanced fields
const mockCatalogs = [
    {
        id: "CAT001",
        name: "CRM Software Suite",
        category: "Customer Relationship Management",
        vendor: "TechSol Innovations",
        images: [
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=720&fit=crop",
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&h=720&fit=crop",
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1280&h=720&fit=crop",
        ],
        description:
            "Complete customer relationship management solution with sales pipeline tracking, lead management, and automated reporting. Perfect for small to medium businesses looking to scale their sales operations.",
        minPrice: 15000,
        maxPrice: 250000,
        skus: 45,
        rating: 4.8,
        reviews: 127,
        features: [
            "Lead Tracking & Scoring",
            "Sales Pipeline Visualization",
            "Automated Email Marketing",
            "Detailed Analytics & Reporting",
            "Mobile App Access",
            "Custom Workflows",
            "Integration APIs",
            "24/7 Support",
        ],
        specifications: {
            "Deployment": "Cloud-based / On-premise",
            "Users": "Unlimited",
            "Storage": "500GB - 5TB",
            "API Access": "REST & GraphQL",
            "Mobile Support": "iOS & Android",
            "Updates": "Automatic",
        },
        warranty: "12 Months Premium Support",
        deliveryTime: "Instant Setup",
        support: "24/7 Email & Phone Support",
        status: "Active",
        testimonials: [
            {
                name: "Rajesh Kumar",
                company: "Tech Innovations Ltd",
                rating: 5,
                comment: "Exceptional CRM solution! Increased our sales efficiency by 40%.",
            },
            {
                name: "Priya Sharma",
                company: "Digital Solutions Inc",
                rating: 4.5,
                comment: "Great features and excellent customer support. Highly recommended!",
            },
        ],
    },
    {
        id: "CAT002",
        name: "ERP Solutions",
        category: "Enterprise Resource Planning",
        vendor: "Enterprise Systems Pro",
        images: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&h=720&fit=crop",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=720&fit=crop",
        ],
        description:
            "Enterprise resource planning software for business automation. Integrate all your business processes into a single system.",
        minPrice: 50000,
        maxPrice: 500000,
        skus: 120,
        rating: 4.6,
        reviews: 89,
        features: [
            "Inventory Management",
            "Financial Accounting",
            "Supply Chain Management",
            "Human Resources Module",
            "Production Planning",
            "Quality Control",
        ],
        specifications: {
            "Deployment": "Cloud-based",
            "Users": "50-1000",
            "Modules": "12 Core Modules",
            "Integration": "SAP, Oracle Compatible",
        },
        warranty: "24 Months Enterprise Support",
        deliveryTime: "2-4 Weeks Implementation",
        support: "Dedicated Account Manager",
        status: "Active",
        testimonials: [],
    },
    {
        id: "CAT003",
        name: "Project Management Tools",
        category: "Project Management",
        vendor: "Agile Solutions",
        images: [
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1280&h=720&fit=crop",
        ],
        description: "Advanced project tracking and team collaboration platform.",
        minPrice: 8000,
        maxPrice: 120000,
        skus: 78,
        rating: 4.7,
        reviews: 203,
        features: ["Task Management", "Gantt Charts", "Time Tracking", "File Sharing"],
        specifications: {
            "Deployment": "Cloud-based",
            "Team Size": "5-500 members",
            "Projects": "Unlimited",
        },
        warranty: "6 Months Support",
        deliveryTime: "Instant Access",
        support: "Email Support",
        status: "Inactive",
        testimonials: [],
    },
    {
        id: "CAT004",
        name: "Analytics Dashboard",
        category: "Business Intelligence",
        vendor: "Data Insights Corp",
        images: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&h=720&fit=crop",
        ],
        description: "Business intelligence and data visualization software.",
        minPrice: 12000,
        maxPrice: 180000,
        skus: 156,
        rating: 4.9,
        reviews: 156,
        features: ["Real-time Data", "Custom Reports", "Data Export", "API Integration"],
        specifications: {
            "Data Sources": "100+ Integrations",
            "Dashboards": "Unlimited",
            "Users": "Unlimited",
        },
        warranty: "12 Months Support",
        deliveryTime: "24 Hours",
        support: "24/7 Support",
        status: "Active",
        testimonials: [],
    },
    {
        id: "CAT005",
        name: "HR Management System",
        category: "Human Resources",
        vendor: "HR Tech Solutions",
        images: [
            "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1280&h=720&fit=crop",
        ],
        description: "Complete human resource management and payroll solution.",
        minPrice: 20000,
        maxPrice: 350000,
        skus: 92,
        rating: 4.5,
        reviews: 78,
        features: ["Payroll Processing", "Attendance Tracking", "Employee Portal", "Recruitment"],
        specifications: {
            "Employees": "50-5000",
            "Payroll": "Automated",
            "Compliance": "India Tax Compliant",
        },
        warranty: "18 Months Support",
        deliveryTime: "1 Week Setup",
        support: "Phone & Email",
        status: "Active",
        testimonials: [],
    },
    {
        id: "CAT006",
        name: "Accounting Software",
        category: "Finance & Accounting",
        vendor: "FinTech Pro",
        images: [
            "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1280&h=720&fit=crop",
        ],
        description: "Comprehensive financial management and accounting platform.",
        minPrice: 10000,
        maxPrice: 200000,
        skus: 67,
        rating: 4.4,
        reviews: 92,
        features: ["Invoicing", "Expense Tracking", "Tax Preparation", "Bank Reconciliation"],
        specifications: {
            "Compliance": "GST Ready",
            "Reports": "50+ Templates",
            "Multi-currency": "Yes",
        },
        warranty: "12 Months Support",
        deliveryTime: "Instant",
        support: "Business Hours Support",
        status: "Inactive",
        testimonials: [],
    },
];

export default function CatalogView() {
    const { id } = useParams();
    const [catalog, setCatalog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("features");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        // Simulate API fetch delay
        setTimeout(() => {
            const foundCatalog = mockCatalogs.find((c) => c.id === id);
            setCatalog(foundCatalog);
            setLoading(false);
        }, 500);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading catalog...</p>
                </div>
            </div>
        );
    }

    if (!catalog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50">
                <div className="text-center bg-white p-12 rounded-3xl shadow-2xl">
                    <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Catalog Not Found</h2>
                    <p className="text-gray-600 mb-6">The catalog you're looking for doesn't exist.</p>
                    <Link
                        to="/additional/catelogs"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                    >
                        <ArrowLeft size={20} />
                        Back to Catalogs
                    </Link>
                </div>
            </div>
        );
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: catalog.name,
                    text: catalog.description,
                    url: window.location.href,
                });
            } catch (err) {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % catalog.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + catalog.images.length) % catalog.images.length);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 font-sans">
            {/* Premium Header */}
            <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-2.5 rounded-xl shadow-lg">
                                <Package size={28} />
                            </div>
                            <div>
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
                                    TechSol Catalogs
                                </span>
                                <p className="text-xs text-gray-500">Premium Business Solutions</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-full transition-all shadow-md hover:shadow-lg"
                        >
                            <Share2 size={16} />
                            Share
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
                    <span className="text-gray-400">{catalog.category}</span>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{catalog.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Left Column - Image Gallery */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <div className="relative overflow-hidden rounded-3xl shadow-2xl aspect-video bg-gradient-to-br from-gray-100 to-gray-200 group">
                            <img
                                src={catalog.images[currentImageIndex]}
                                alt={catalog.name}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />

                            {/* Status Badge */}
                            <div className={`absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-md ${catalog.status === "Active"
                                ? "bg-green-500/90 text-white"
                                : "bg-gray-500/90 text-white"
                                }`}>
                                {catalog.status}
                            </div>

                            {/* Image Navigation */}
                            {catalog.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft size={24} className="text-gray-800" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight size={24} className="text-gray-800" />
                                    </button>

                                    {/* Image Indicators */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                        {catalog.images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                className={`h-2 rounded-full transition-all ${idx === currentImageIndex
                                                    ? "w-8 bg-white"
                                                    : "w-2 bg-white/50 hover:bg-white/75"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {catalog.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {catalog.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`relative overflow-hidden rounded-xl aspect-video transition-all ${idx === currentImageIndex
                                            ? "ring-4 ring-orange-500 shadow-lg"
                                            : "opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white p-5 rounded-2xl shadow-lg border border-orange-100 text-center hover:shadow-xl transition-all transform hover:-translate-y-1">
                                <div className="text-orange-500 mb-2 flex justify-center">
                                    <Grid size={28} />
                                </div>
                                <div className="text-3xl font-bold text-gray-800">{catalog.skus}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-1">SKUs</div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-lg border border-orange-100 text-center hover:shadow-xl transition-all transform hover:-translate-y-1">
                                <div className="text-green-500 mb-2 flex justify-center">
                                    <DollarSign size={28} />
                                </div>
                                <div className="text-2xl font-bold text-gray-800">
                                    ₹{catalog.minPrice.toLocaleString()} - ₹{catalog.maxPrice.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-1">Price Range</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-8">
                        {/* Product Header */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                                    {catalog.category}
                                </span>
                            </div>
                            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
                                {catalog.name}
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-orange-500 pl-6 py-2 bg-gradient-to-r from-orange-50 to-transparent">
                                {catalog.description}
                            </p>
                        </div>

                        {/* Vendor & Quick Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <Award className="text-orange-500" size={24} />
                                    <span className="text-sm text-gray-500 font-medium">Vendor</span>
                                </div>
                                <p className="text-lg font-bold text-gray-800">{catalog.vendor}</p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <Clock className="text-blue-500" size={24} />
                                    <span className="text-sm text-gray-500 font-medium">Delivery</span>
                                </div>
                                <p className="text-lg font-bold text-gray-800">{catalog.deliveryTime}</p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <Shield className="text-green-500" size={24} />
                                    <span className="text-sm text-gray-500 font-medium">Warranty</span>
                                </div>
                                <p className="text-lg font-bold text-gray-800">{catalog.warranty}</p>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <Users className="text-purple-500" size={24} />
                                    <span className="text-sm text-gray-500 font-medium">Support</span>
                                </div>
                                <p className="text-lg font-bold text-gray-800">{catalog.support}</p>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <Zap className="text-orange-400" size={28} />
                                    <h3 className="text-3xl font-bold">Ready to Get Started?</h3>
                                </div>
                                <p className="text-gray-300 mb-6 text-lg">
                                    Connect with our sales team for personalized pricing and implementation support.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                    <button className="bg-white text-gray-900 px-6 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3 group">
                                        <Mail size={20} className="group-hover:scale-110 transition-transform" />
                                        <span>Enquire Now</span>
                                    </button>
                                    <button className="bg-transparent border-2 border-white/30 text-white px-6 py-4 rounded-xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-3 group">
                                        <Phone size={20} className="group-hover:scale-110 transition-transform" />
                                        <span>Schedule Call</span>
                                    </button>
                                </div>

                                <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
                                    <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                                        <Download size={16} />
                                        Download Brochure
                                    </button>
                                    <span className="text-gray-600">•</span>
                                    <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                                        <MessageCircle size={16} />
                                        Live Chat
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabbed Content Section */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Tab Headers */}
                    <div className="flex border-b border-gray-200 bg-gray-50">
                        <button
                            onClick={() => setActiveTab("features")}
                            className={`flex-1 px-8 py-5 font-semibold transition-all relative ${activeTab === "features"
                                ? "text-orange-600 bg-white"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <CheckCircle size={20} />
                                <span>Key Features</span>
                            </div>
                            {activeTab === "features" && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("specifications")}
                            className={`flex-1 px-8 py-5 font-semibold transition-all relative ${activeTab === "specifications"
                                ? "text-orange-600 bg-white"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Target size={20} />
                                <span>Specifications</span>
                            </div>
                            {activeTab === "specifications" && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                            )}
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-10">
                        {activeTab === "features" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {catalog.features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-5 bg-gradient-to-r from-orange-50 to-transparent rounded-xl border border-orange-100 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-800 font-semibold text-lg">{feature}</p>
                                        </div>
                                        <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "specifications" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(catalog.specifications).map(([key, value], index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all"
                                    >
                                        <span className="text-gray-600 font-medium text-lg">{key}</span>
                                        <span className="text-gray-900 font-bold text-lg">{value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} TechSol Solutions. All rights reserved. | Catalog ID: {catalog.id}
                    </p>
                </div>
            </main>
        </div>
    );
}
