import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useGetClientByIdQuery,
  useUpdateClientMutation,
  useGetClientQuotationsQuery,
  useGetClientFilesQuery,
  useAddClientFileMutation,
  useDeleteClientFileMutation,
} from "../../store/api/clientApi";
import { useCreateQuotationMutation, useDeleteQuotationMutation } from "../../store/api/quotationApi";
import CreateQuotationModal from "../QuotationPart/CreateQuotationModal";
import ViewQuotationModal from "../QuotationPart/ViewQuotationModal";
import { toast } from "react-hot-toast";
import {
  Edit2,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  Plus,
  ArrowLeft,
  User,
  Hash,
  Globe,
  Download,
  Trash2,
  Trash,
  Check,
  X,
  File,
  Shield,
  Layers,
  Zap,
  History,
  Eye,
  FileCheck,
  DownloadCloud,
  Users,
  CheckCircle,
  AlertCircle,
  UserCheck,
  Link,
  Target,
  Gift,
  Building2,
  Map
} from "lucide-react";
import ActionGuard from "../../components/common/ActionGuard";
import Modal from "../../components/common/Modal";
import { FaBuilding } from "react-icons/fa";

export default function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: clientResponse, isLoading, isError } = useGetClientByIdQuery(id);
  const { data: quotationsResponse } = useGetClientQuotationsQuery(id);
  const { data: filesResponse } = useGetClientFilesQuery(id);
  const [updateClient] = useUpdateClientMutation();
  const [addClientFile, { isLoading: isUploading }] = useAddClientFileMutation();
  const [deleteClientFile] = useDeleteClientFileMutation();
  const [createQuotation] = useCreateQuotationMutation();
  const [deleteQuotation] = useDeleteQuotationMutation();

  const [activeTab, setActiveTab] = useState("documents");
  const [isEditing, setIsEditing] = useState(false);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [showViewQuotationModal, setShowViewQuotationModal] = useState(false);
  const [selectedViewQuotation, setSelectedViewQuotation] = useState(null);
  const [quotationFormData, setQuotationFormData] = useState({
    customerType: "Individual",
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    billingAddress: "",
    shippingAddress: "",
    state: "",
    pincode: "",
    gstin: "",
    pan: "",
    cin: "",
    quotationNo: `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    quotationDate: new Date().toISOString().split("T")[0],
    validUntil: "",
    salesExecutive: "",
    currency: "INR",
    lineItems: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    totalAmount: 0,
    terms_and_conditions: "",
    status: "Draft",
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null, // 'file' or 'quotation'
    id: null,
    title: "",
    message: ""
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const client = clientResponse?.data;
  const quotations = quotationsResponse?.data || [];
  const files = filesResponse?.data || [];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  const handleUpdateField = async (field, value) => {
    try {
      await updateClient({ id, [field]: value }).unwrap();
      toast.success("Client updated successfully");
    } catch (error) {
      toast.error("Failed to update client");
    }
  };

  const handleAddFile = async (e) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < uploadedFiles.length; i++) {
      formData.append("files", uploadedFiles[i]);
    }
    formData.append("description", "Uploaded from client profile");

    try {
      await addClientFile({ id, data: formData }).unwrap();
      toast.success("Files uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload files");
    }
  };

  const openQuotationModal = () => {
    setQuotationFormData((prev) => ({
      ...prev,
      customerType: client.type === "business" ? "Business" : "Individual",
      companyName: client.type === "business" ? client.company_name : `${client.first_name} ${client.last_name}`,
      contactPerson: client.type === "business" ? `${client.first_name} ${client.last_name}` : "",
      email: client.email || "",
      phone: client.phone || "",
      billingAddress: client.address || "",
      state: client.state || "",
      pincode: client.zip_code || "",
      gstin: client.tax_id || "",
    }));
    setShowQuotationModal(true);
  };

  const handleCreateQuotationSubmit = async () => {
    try {
      await createQuotation({ ...quotationFormData, client_id: id }).unwrap();
      toast.success("Quotation created successfully");
      setShowQuotationModal(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create quotation");
    }
  };

  const handleViewQuotation = (quotation) => {
    setSelectedViewQuotation(quotation);
    setShowViewQuotationModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 font-bold border-green-200";
      case "Pending":
        return "bg-orange-100 text-orange-700 font-bold border-orange-200";
      case "Rejected":
        return "bg-red-100 text-red-700 font-bold border-red-200";
      case "Draft":
        return "bg-gray-100 text-gray-700 font-bold border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 font-bold border-gray-200";
    }
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteModal.type === 'file') {
        await deleteClientFile({ clientId: id, fileId: deleteModal.id }).unwrap();
        toast.success("Document deleted successfully");
      } else if (deleteModal.type === 'quotation') {
        await deleteQuotation(deleteModal.id).unwrap();
        toast.success("Quotation deleted successfully");
      }
      setDeleteModal({ ...deleteModal, isOpen: false });
    } catch (err) {
      toast.error(`Failed to delete ${deleteModal.type}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteFile = (fileId) => {
    setDeleteModal({
      isOpen: true,
      type: 'file',
      id: fileId,
      title: "Delete Document",
      message: "Are you sure you want to delete this document? This action cannot be undone."
    });
  };

  const handleDeleteQuotation = (qId) => {
    setDeleteModal({
      isOpen: true,
      type: 'quotation',
      id: qId,
      title: "Delete Quotation",
      message: "Are you sure you want to delete this quotation? This action cannot be undone."
    });
  };

  const getFileDownloadUrl = (file) => {
    const baseUrl = (import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api/').replace('/api/', '');
    return file.path.startsWith('http') ? file.path : `${baseUrl}${file.path.startsWith('/') ? '' : '/'}${file.path}`;
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>;
  if (isError || !client) return <div className="flex items-center justify-center h-screen text-red-500">Error loading client profile</div>;

  return (
    <div className="flex bg-[#F8FAFC] font-primary min-h-screen">
      {/* Sidebar - Consistent with Lead Profile */}
      <div className="w-[360px] bg-white border-r border-gray-100 shadow-sm flex-shrink-0">
        {/* Profile Header Gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-32 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/40 rounded-sm transition-all text-white shadow-sm"
          >
            <ArrowLeft size={16} strokeWidth={3} />
          </button>

          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-xl border-1 border-white relative group overflow-hidden">
              {client.type === 'business' ? (
                <div className="w-full h-full rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-3xl">
                  <FaBuilding size={32} />
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-3xl shadow-inner">
                  {client.first_name?.[0]?.toUpperCase() || "C"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Basic Info */}
        <div className="pt-14 px-6 text-center border-b border-gray-100 pb-3 mt-3">
          <h2 className="text-2xl font-bold text-slate-800 capitalize tracking-tight mb-0.5 truncate w-full px-4" title={client.type === 'business' ? client.company_name : `${client.first_name} ${client.last_name}`}>
            {client.type === 'business' ? client.company_name : `${client.first_name} ${client.last_name}`}
          </h2>
          <span className="text-[13px] font-extrabold capitalize tracking-wide text-orange-600">
            {client.type || "Individual"} Client
          </span>
          <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
            <p className="text-slate-600 font-bold text-[13px] flex items-center gap-1.5">
              <Phone size={13} className="text-orange-500" />
              {client.phone || "N/A"}
            </p>
            <p className="text-slate-600 font-bold text-[13px] flex items-center gap-1.5">
              <Mail size={13} className="text-orange-500" />
              {client.email || "N/A"}
            </p>
          </div>
          {client.lead_id && (
            <div className="mt-3 flex justify-center">
              <button
                onClick={() => navigate(`/crm/leads/profile/${client.lead_id}`)}
                className="flex items-center gap-2 px-4 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-full text-[12px] font-black transition-all border border-orange-100 shadow-sm active:scale-95 group"
              >
                <Users size={13} className="group-hover:scale-110 transition-transform" />
                Linked Lead: #{client.lead_id}
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="px-6 py-2.5 grid grid-cols-1 border-b border-gray-100">
          <ActionGuard permission="quotation_create" module="Financial Documents" type="create">
            <button
              onClick={openQuotationModal}
              className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-sm text-sm font-bold capitalize tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 w-full"
            >
              <Plus size={16} /> New Quotation
            </button>
          </ActionGuard>
        </div>

        {/* Info Sections */}
        <div className="px-6 py-2 space-y-4 pb-20">
          <section>
            <h3 className="text-slate-800 font-bold text-[15px] capitalize tracking-tight flex items-center gap-2 mb-2">
              <User size={14} className="text-orange-500" />
              Basic Information
            </h3>
            <div className="space-y-0.5 text-left">
              <InfoItem label="Client ID" value={`#CL-${client.id}`} icon={Hash} />
              <InfoItem label="Industry" value={client.industry} icon={Briefcase} />
              <InfoItem label="Position" value={client.position} icon={UserCheck} />
              <InfoItem label="Source" value={client.source} icon={Globe} />
              <InfoItem label="Website" value={client.website} icon={Link} />
              <InfoItem label="Employees" value={client.number_of_employees} icon={Users} />
              <InfoItem label="Tax ID / GST" value={client.tax_id} icon={FileText} />
            </div>
          </section>

          {(client.budget || client.services || client.project_type) && (
            <section className="pt-3 border-t border-gray-100">
              <h3 className="text-slate-800 font-bold text-[15px] capitalize tracking-tight flex items-center gap-2 mb-2">
                <DollarSign size={14} className="text-orange-500" />
                Engagement Details
              </h3>
              <div className="space-y-0.5 text-left">
                <InfoItem label="Budget" value={client.budget ? `₹${client.budget}` : null} icon={DollarSign} />
                <InfoItem label="Project Type" value={client.project_type} icon={Target} />
                <InfoItem label="Services" value={client.services} icon={Layers} />
              </div>
            </section>
          )}

          {(client.start_date || client.end_date || client.subscription_date || client.birthday) && (
            <section className="pt-3 border-t border-gray-100">
              <h3 className="text-slate-800 font-bold text-[15px] capitalize tracking-tight flex items-center gap-2 mb-2">
                <Calendar size={14} className="text-orange-500" />
                Timeline
              </h3>
              <div className="space-y-0.5 text-left">
                <InfoItem label="Start Date" value={client.start_date ? new Date(client.start_date).toLocaleDateString() : null} icon={Calendar} />
                <InfoItem label="End Date" value={client.end_date ? new Date(client.end_date).toLocaleDateString() : null} icon={Calendar} />
                <InfoItem label="Subscription" value={client.subscription_date ? new Date(client.subscription_date).toLocaleDateString() : null} icon={Zap} />
                <InfoItem label="Birthday" value={client.birthday ? new Date(client.birthday).toLocaleDateString() : null} icon={Gift} />
              </div>
            </section>
          )}

          <section className="pt-3 border-t border-gray-100">
            <h3 className="text-slate-800 font-bold text-[15px] capitalize tracking-tight flex items-center gap-2 mb-2">
              <MapPin size={14} className="text-orange-500" />
              Location
            </h3>
            <div className="space-y-0.5 text-left">
              <InfoItem label="Address" value={client.address} icon={Map} />
              <InfoItem label="City" value={client.city} icon={Building2} />
              <InfoItem label="State" value={client.state} icon={Globe} />
              <InfoItem label="Zip Code" value={client.zip_code} icon={Hash} />
              <InfoItem label="Country" value={client.country} icon={Globe} />
            </div>
          </section>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Tabs Navigation */}
        <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
          <div className="flex w-full items-center justify-between px-8">
            <div className="flex">
              <TabButton active={activeTab === "documents"} onClick={() => setActiveTab("documents")} label="Digital" icon={<FileText size={18} />} />
              <TabButton active={activeTab === "quotations"} onClick={() => setActiveTab("quotations")} label="Quotations" icon={<DollarSign size={18} />} />
            </div>
            <div className="flex items-center gap-3 py-4">
              {activeTab === "documents" ? (
                <ActionGuard permission="clients_edit" module="Client Management" type="update">
                  <label className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-sm text-xs font-bold capitalize tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95 group">
                    <Plus size={14} className="group-hover:rotate-90 transition-transform" />
                    {isUploading ? "Uploading..." : "Upload Document"}
                    <input type="file" multiple className="hidden" onChange={handleAddFile} disabled={isUploading} />
                  </label>
                </ActionGuard>
              ) : (
                <ActionGuard permission="quotation_create" module="Financial Documents" type="create">
                  <button
                    onClick={openQuotationModal}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-sm text-xs font-bold capitalize tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95 group"
                  >
                    <Plus size={14} className="group-hover:rotate-90 transition-transform" />
                    New Record
                  </button>
                </ActionGuard>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {/* Quick Metrics - Matrix Style from ClientManagement */}
          <div className="max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
            <StatusCard label="Active Quotations" value={quotations.length} color="blue" icon={<DollarSign size={18} />} />
            <StatusCard label="Stored Assets" value={files.length} color="orange" icon={<FileText size={18} />} />
            <StatusCard label="Account Status" value={client.status} color="green" icon={<CheckCircle size={18} />} />
          </div>

          {/* Content Tab: Documents */}
          {activeTab === "documents" && (
            <div className="max-w-7xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
                <FileText className="text-orange-500" size={20} />
                <h2 className="text-xl font-bold text-slate-800 capitalize tracking-tight">Client Repository</h2>
              </div>

              <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                      <th className="py-3 px-6 font-semibold border-b border-orange-400">S.N</th>
                      <th className="py-3 px-6 font-semibold border-b border-orange-400">Document Name</th>
                      <th className="py-3 px-6 font-semibold border-b border-orange-400">Origin</th>
                      <th className="py-3 px-6 font-semibold border-b border-orange-400">Uploaded On</th>
                      <th className="py-3 px-6 font-semibold border-b border-orange-400 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {files.map((file, index) => (
                      <tr key={file.id} className="border-t hover:bg-gray-50 transition-colors group">
                        <td className="py-4 px-6 font-medium text-gray-500">{index + 1}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-50 rounded-sm text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                              <FileText size={16} />
                            </div>
                            <span className="font-bold text-gray-800 hover:text-orange-600 transition-colors cursor-default">{file.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-sm text-[10px] font-bold border uppercase tracking-widest ${file.source === 'lead' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}>
                            {file.source === 'lead' ? 'Lead Conversion' : 'Direct Upload'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[13px] font-bold text-orange-500 uppercase tracking-tighter">
                          {new Date(file.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2 text-gray-400">
                            <button
                              onClick={() => window.open(getFileDownloadUrl(file), '_blank')}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-all" title="Download">
                              <Download size={18} />
                            </button>
                            <ActionGuard permission="clients_edit" module="Client Management" type="update">
                              <button
                                onClick={() => handleDeleteFile(file.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-all" title="Delete">
                                <Trash2 size={18} />
                              </button>
                            </ActionGuard>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {files.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-24 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-200 gap-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center shadow-inner">
                              <FileText size={32} />
                            </div>
                            <div className="space-y-1">
                              <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">No documents found.</p>
                              <p className="text-xs text-gray-400">Try uploading a new file.</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Content Tab: Quotations */}
          {activeTab === "quotations" && (
            <div className="max-w-7xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
                <DollarSign className="text-orange-500" size={20} />
                <h2 className="text-xl font-bold text-slate-800 capitalize tracking-tight">Financial Records</h2>
              </div>

              <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                      <th className="py-3 px-6 font-semibold border-b border-orange-400">S.N</th>
                      <th className="py-3 px-6 font-semibold border-b border-orange-400">Identifier</th>
                      <th className="py-3 px-6 font-semibold border-b border-orange-400">Issue Date</th>
                      <th className="py-3 px-6 font-semibold border-b border-orange-400">Valuation</th>
                      <th className="py-3 px-6 font-semibold border-b border-orange-400 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {quotations.map((q, index) => (
                      <tr key={q.id} className="border-t hover:bg-gray-50 transition-colors group">
                        <td className="py-4 px-6 font-medium text-gray-500">{index + 1}</td>
                        <td className="py-4 px-6 font-bold text-gray-800 hover:text-orange-600 transition-colors cursor-default">#{q.quotation_id}</td>
                        <td className="py-4 px-6 text-[13px] font-bold text-orange-500 uppercase tracking-tighter">
                          {new Date(q.quotation_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-6 font-bold text-gray-900">{formatCurrency(q.total_amount)}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2 text-gray-400">
                            <ActionGuard permission="quotation_view" module="Financial Documents" type="read">
                              <button 
                                onClick={() => handleViewQuotation(q)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-all" title="View Details">
                                <Eye size={18} />
                              </button>
                            </ActionGuard>
                            <ActionGuard permission="quotation_delete" module="Financial Documents" type="delete">
                              <button
                                onClick={() => handleDeleteQuotation(q.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-all" title="Delete">
                                <Trash2 size={18} />
                              </button>
                            </ActionGuard>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {quotations.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-24 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-200 gap-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center shadow-inner">
                              <DollarSign size={32} />
                            </div>
                            <div className="space-y-1">
                              <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">No records found.</p>
                              <p className="text-xs text-gray-400">Create a new quotation to get started.</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateQuotationModal
        showModal={showQuotationModal}
        setShowModal={setShowQuotationModal}
        formData={quotationFormData}
        setFormData={setQuotationFormData}
        handleInputChange={(e) => setQuotationFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
        handleCreateQuotation={handleCreateQuotationSubmit}
      />

      <ViewQuotationModal
        showViewModal={showViewQuotationModal}
        setShowViewModal={setShowViewQuotationModal}
        selectedQuote={selectedViewQuotation}
        getStatusColor={getStatusColor}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        headerVariant="simple"
        maxWidth="max-w-md"
        footer={
          <div className="flex gap-4 w-full">
            <button
              onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all font-primary text-xs capitalize tracking-normal bg-white"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 disabled:opacity-50 font-primary text-xs capitalize tracking-normal"
            >
              {isDeleting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Trash2 size={20} />
              )}
              {isDeleting ? "Deleting..." : "Delete Now"}
            </button>
          </div>
        }
      >
        <div className="flex flex-col items-center text-center text-black font-primary">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={48} className="text-red-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Confirm {deleteModal.title}
          </h2>

          <p className="text-gray-600 mb-2 leading-relaxed">
            {deleteModal.message}
          </p>

          <p className="text-xs text-red-500 italic">
            This action cannot be undone. All associated data will be permanently removed.
          </p>
        </div>
      </Modal>
    </div>
  );
}

function InfoItem({ label, value, icon: IconComponent }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 group">
      <div className="flex items-center gap-2 text-slate-500">
        {IconComponent && <IconComponent size={14} className="text-slate-400 group-hover:text-orange-500 transition-colors" />}
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-center gap-2 flex-1 justify-end truncate">
        <span className="font-bold text-sm text-right break-words max-w-[140px] capitalize truncate text-slate-800 tracking-tight" title={value}>
          {value || "—"}
        </span>
      </div>
    </div>
  );
}

function TabButton({ active, label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-8 py-5 text-[15px] font-bold capitalize tracking-tight transition-all border-b-2 ${active ? 'border-orange-500 text-orange-600 bg-orange-50/10' : 'border-transparent text-black hover:bg-gray-50'
        }`}
    >
      <span className={active ? 'text-orange-500' : 'text-black'}>{icon}</span>
      {label}
    </button>
  );
}

function StatusCard({ label, value, color, icon }) {
  const configs = {
    blue: { border: 'border-t-blue-500', bg: 'bg-blue-50/50', text: 'text-blue-500' },
    orange: { border: 'border-t-orange-500', bg: 'bg-orange-50/50', text: 'text-orange-500' },
    green: { border: 'border-t-green-500', bg: 'bg-green-50/50', text: 'text-green-500' },
  };
  const config = configs[color];

  return (
    <div className={`rounded-sm shadow-sm border border-gray-200 p-4 border-t-4 bg-white transition-all duration-300 ${config.border} ${config.bg}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm">
            {React.cloneElement(icon, { className: config.text, size: 18 })}
          </div>
          <h3 className="text-sm font-bold text-gray-800 capitalize tracking-tight">{label}</h3>
        </div>
        <span className="bg-white text-gray-700 text-[14px] font-bold px-3 py-1 rounded-full border border-gray-100 shadow-sm min-w-[28px] text-center">
          {value}
        </span>
      </div>
    </div>
  );
}
