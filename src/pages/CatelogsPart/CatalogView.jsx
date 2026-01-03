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
} from "lucide-react";

// Mock data to simulate fetching from a database
// In a real app, this would be an API call based on the ID
const mockCatalogs = [
    {
        id: "CAT001",
        name: "CRM Software Suite",
        image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=720&fit=crop",
        description:
            "Complete customer relationship management solution with sales pipeline tracking, lead management, and automated reporting. Perfect for small to medium businesses looking to scale their sales operations.",
        minPrice: 15000,
        maxPrice: 250000,
        skus: 45,
        features: [
            "Lead Tracking & Scoring",
            "Sales Pipeline Visualization",
            "Automated Email Marketing",
            "Detailed Analytics & Reporting",
            "Mobile App Access",
        ],
        status: "Active",
    },
    {
        id: "CAT002",
        name: "ERP Solutions",
        image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&h=720&fit=crop",
        description:
            "Enterprise resource planning software for business automation. Integrate all your business processes into a single system.",
        minPrice: 50000,
        maxPrice: 500000,
        skus: 120,
        features: [
            "Inventory Management",
            "Financial Accounting",
            "Supply Chain Management",
            "Human Resources Module",
        ],
        status: "Active",
    },
    {
        id: "CAT003",
        name: "Project Management Tools",
        image:
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1280&h=720&fit=crop",
        description: "Advanced project tracking and team collaboration platform.",
        minPrice: 8000,
        maxPrice: 120000,
        skus: 78,
        features: ["Task Management", "Gantt Charts", "Time Tracking", "File Sharing"],
        status: "Inactive",
    },
    {
        id: "CAT004",
        name: "Analytics Dashboard",
        image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&h=720&fit=crop",
        description: "Business intelligence and data visualization software.",
        minPrice: 12000,
        maxPrice: 180000,
        skus: 156,
        features: ["Real-time Data", "Custom Reports", "Data Export", "API Integration"],
        status: "Active",
    },
    {
        id: "CAT005",
        name: "HR Management System",
        image:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1280&h=720&fit=crop",
        description: "Complete human resource management and payroll solution.",
        minPrice: 20000,
        maxPrice: 350000,
        skus: 92,
        features: ["Payroll Processing", "Attendance Tracking", "Employee Portal", "Recruitment"],
        status: "Active",
    },
    {
        id: "CAT006",
        name: "Accounting Software",
        image:
            "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1280&h=720&fit=crop",
        description: "Comprehensive financial management and accounting platform.",
        minPrice: 10000,
        maxPrice: 200000,
        skus: 67,
        features: ["Invoicing", "Expense Tracking", "Tax Preparation", "Bank Reconciliation"],
        status: "Inactive",
    },
];

export default function CatalogView() {
    const { id } = useParams();
    const [catalog, setCatalog] = useState(null);
    const [loading, setLoading] = useState(true);

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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!catalog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Catalog Not Found</h2>
                <Link
                    to="/additional/catelogs"
                    className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                >
                    Back to Catalogs
                </Link>
            </div>
        );
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Navbar / Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-lg">
                            <Package size={24} />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                            TechSol Catalogs
                        </span>
                    </div>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <Share2 size={16} />
                        Share
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - Image */}
                    <div className="space-y-6">
                        <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-video bg-gray-200 group">
                            <img
                                src={catalog.image}
                                alt={catalog.name}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold text-gray-800 shadow-sm">
                                ID: {catalog.id}
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                                <div className="text-orange-500 mb-2 flex justify-center">
                                    <Grid size={24} />
                                </div>
                                <div className="text-2xl font-bold text-gray-800">{catalog.skus}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">SKUs</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow col-span-2">
                                <div className="text-green-500 mb-2 flex justify-center">
                                    <DollarSign size={24} />
                                </div>
                                <div className="text-2xl font-bold text-gray-800">
                                    ₹{catalog.minPrice.toLocaleString()} - ₹{catalog.maxPrice.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Price Range</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                                <div className="text-blue-500 mb-2 flex justify-center">
                                    <CheckCircle size={24} />
                                </div>
                                <div className="text-lg font-bold text-gray-800 mt-1">{catalog.status}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Status</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details & CTA */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
                                {catalog.name}
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-orange-500 pl-4 py-1 bg-orange-50/50">
                                {catalog.description}
                            </p>
                        </div>

                        {/* Features List (Mocked if not in data) */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CheckCircle className="text-orange-500" size={20} />
                                Key Features
                            </h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {(catalog.features || ["Feature 1", "Feature 2", "Feature 3", "Feature 4"]).map(
                                    (feature, index) => (
                                        <li key={index} className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                            {feature}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>

                        {/* CTA Section */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <h3 className="text-2xl font-bold mb-2 relative z-10">Interested in this Catalog?</h3>
                            <p className="text-gray-300 mb-6 relative z-10">
                                Get in touch with our sales team to discuss pricing and implementation.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                                <button className="flex-1 bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                                    <Mail size={18} />
                                    Enquire Now
                                </button>
                                <button className="flex-1 bg-transparent border border-white/30 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                    <Phone size={18} />
                                    Schedule Call
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500 text-center">
                                &copy; {new Date().getFullYear()} TechSol Solutions. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
