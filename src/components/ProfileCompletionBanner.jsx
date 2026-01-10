import React from 'react';
import { useGetUserProfileQuery } from '../store/api/userApi';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProfileCompletionBanner = () => {
    const { user } = useSelector((state) => state.auth);
    const { data: profile, isLoading } = useGetUserProfileQuery();
    const location = useLocation();

    // Don't show on profile page itself, if loading, or if not an employee
    if (isLoading || !profile || location.pathname === '/profile' || user?.role !== 'Employee') return null;

    // Only show for employees (assuming admins have a specific flag or we check role)
    // For now, let's assume if it's a regular user profile, we check it.
    // If the system has roles, we should check profile.role === 'employee'

    const essentialFields = [
        'gender', 'father_name', 'mother_name', 'marital_status',
        'permanent_address_l1', 'permanent_city', 'permanent_state', 'permanent_country', 'permanent_pincode',
        'aadhar_number', 'pan_number', 'aadhar_front', 'aadhar_back', 'pan_card',
        'ifsc_code', 'account_number', 'account_holder_name', 'branch_name'
    ];

    const completedFields = essentialFields.filter(field => {
        const value = profile[field];
        return value !== null && value !== undefined && value !== '' && value !== 'null';
    });

    const completionPercentage = Math.round((completedFields.length / essentialFields.length) * 100);

    if (completionPercentage === 100) return null;

    return (
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 px-4 py-3 sm:px-6 lg:px-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-200 opacity-20 rounded-full blur-2xl group-hover:bg-orange-300 transition-all duration-700"></div>

            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-200 ring-4 ring-white">
                        <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-orange-900 font-bold flex items-center gap-2">
                            Complete Your Profile
                            <span className="bg-orange-200 text-orange-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-black">
                                {completionPercentage}% DONE
                            </span>
                        </h3>
                        <p className="text-orange-700 text-sm font-medium">
                            Some essential details are missing. Please complete your profile to enable all features.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto">
                    {/* Progress Bar */}
                    <div className="flex-1 sm:w-48 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>

                    <Link
                        to="/profile"
                        className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-sm font-bold shadow-lg shadow-orange-200 transition-all hover:scale-105 active:scale-95 group"
                    >
                        Complete Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProfileCompletionBanner;
