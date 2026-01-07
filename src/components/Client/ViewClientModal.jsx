import React from "react";
import Modal from "../common/Modal";
import { User, Building2, Mail, Phone, MapPin, Calendar, Globe, CreditCard } from "lucide-react";

const ViewClientModal = ({ isOpen, onClose, client }) => {
    if (!client) return null;

    const isPerson = client.type === "person";
    const title = isPerson ? `${client.first_name} ${client.last_name || ''}` : client.company_name;
    const subTitle = isPerson ? "Personal Client Profile" : "Organization Profile";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            subtitle={subTitle}
            icon={isPerson ? <User className="text-white" /> : <Building2 className="text-white" />}
            maxWidth="max-w-3xl"
        >
            <div className="space-y-8 text-black">
                {/* Header Info */}
                <div className="flex items-start justify-between bg-orange-50 p-6 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-full ${isPerson ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>
                            {isPerson ? <User size={32} /> : <Building2 size={32} />}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{client.type}</p>
                            <div className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {client.status ? client.status.toUpperCase() : 'ACTIVE'}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Client ID</p>
                        <p className="font-mono font-bold text-gray-800">#{client.id?.toString().padStart(4, '0')}</p>
                    </div>
                </div>

                {/* Contact Information */}
                <div>
                    <h4 className="flex items-center gap-2 font-bold text-gray-800 border-b pb-2 mb-4">
                        <Mail className="text-orange-500" size={18} /> Contact Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                            <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                                {client.email}
                            </p>
                        </div>
                        <div className="group">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                            <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                                {client.phone}
                            </p>
                        </div>
                        <div className="group">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Website</label>
                            <p className="font-medium text-blue-600 flex items-center gap-2 mt-1">
                                {client.website ? (
                                    <a href={client.website} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                                        <Globe size={14} /> {client.website}
                                    </a>
                                ) : "N/A"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Business/Personal Details */}
                <div>
                    <h4 className="flex items-center gap-2 font-bold text-gray-800 border-b pb-2 mb-4">
                        <Building2 className="text-orange-500" size={18} /> {isPerson ? "Additional Info" : "Company Details"}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isPerson && (
                            <>
                                <div className="group">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Company</label>
                                    <p className="font-medium text-gray-800 mt-1">{client.company_name || "N/A"}</p>
                                </div>
                                <div className="group">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Position</label>
                                    <p className="font-medium text-gray-800 mt-1">{client.position || "N/A"}</p>
                                </div>
                                <div className="group">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Birthday</label>
                                    <p className="font-medium text-gray-800 mt-1 flex items-center gap-1">
                                        {client.birthday ? (
                                            <><Calendar size={14} /> {new Date(client.birthday).toLocaleDateString()}</>
                                        ) : "N/A"}
                                    </p>
                                </div>
                            </>
                        )}
                        {!isPerson && (
                            <>
                                <div className="group">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Industry</label>
                                    <p className="font-medium text-gray-800 mt-1">{client.industry || "N/A"}</p>
                                </div>
                                <div className="group">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Employee Count</label>
                                    <p className="font-medium text-gray-800 mt-1">{client.number_of_employees || "N/A"}</p>
                                </div>
                            </>
                        )}
                        <div className="group">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Source</label>
                            <p className="font-medium text-gray-800 mt-1 capitalize">{client.source || "N/A"}</p>
                        </div>
                        <div className="group">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tax ID</label>
                            <p className="font-medium text-gray-800 mt-1 flex items-center gap-1">
                                {client.tax_id ? <><CreditCard size={14} /> {client.tax_id}</> : "N/A"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div>
                    <h4 className="flex items-center gap-2 font-bold text-gray-800 border-b pb-2 mb-4">
                        <MapPin className="text-orange-500" size={18} /> Location
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-800">
                            {client.address && <span className="block">{client.address}</span>}
                            <span>
                                {[client.city, client.state, client.zip_code, client.country].filter(Boolean).join(", ")}
                            </span>
                            {![client.address, client.city, client.state, client.zip_code, client.country].some(Boolean) && "No address provided"}
                        </p>
                    </div>
                </div>

                {/* Notes */}
                {client.notes && (
                    <div>
                        <h4 className="flex items-center gap-2 font-bold text-gray-800 border-b pb-2 mb-4">
                            Notes
                        </h4>
                        <div className="bg-yellow-50 p-4 rounded-lg text-sm text-gray-800 border border-yellow-100">
                            {client.notes}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ViewClientModal;
