import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddNoteModal from "../../../components/LeadManagement/LeadPipLineStatus/AddNotes";
import CreateCallLogModal from "../../../components/LeadManagement/LeadPipLineStatus/CreateCallLogModal";
import AddMeetingModal from "../../../components/LeadManagement/LeadPipLineStatus/AddMeetingModal";
import {
  useAddLeadNoteMutation,
  useAddLeadCallMutation,
  useAddLeadFileMutation,
  useAddLeadMeetingMutation,
  useUpdateLeadNoteMutation,
  useUpdateLeadFileMutation,
  useUpdateLeadMeetingMutation,
  useDeleteLeadNoteMutation,
  useDeleteLeadCallMutation,
  useDeleteLeadFileMutation,
  useDeleteLeadMeetingMutation,
  useHitCallMutation,
  useUpdateLeadStatusMutation,
  useUpdateLeadMutation,
  useGetLeadByIdQuery,
  useGetAssignmentSettingsQuery
} from "../../../store/api/leadApi";
import { useCreateQuotationMutation } from "../../../store/api/quotationApi";
import CreateQuotationModal from "../../QuotationPart/CreateQuotationModal";
import EditLeadModal from "../../../pages/LeadsManagement/EditLeadPopup";
import LeadSidebar from "./LeadSidebar";
import LeadTabs from "./LeadTable";
import CallActionPopup from "../../../components/AddNewLeads/CallActionPopup";
import LeadDeleteConfirmationModal from "../../../components/LeadManagement/LeadPipLineStatus/LeadDeleteConfirmationModal";
import { toast } from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import {
  Edit2,
  ChevronDown,
  Star,
  ArrowLeftCircle,
  PhoneCall,
  Calendar,
  FileText,
  Phone,
  File,
  Mail,
  Users,
  Zap,
} from "lucide-react";

export default function CRMLeadDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  // State Management
  const [activeTab, setActiveTab] = useState("activities");
  const [isEditingLead, setIsEditingLead] = useState(false);
  const [isEditingOwner, setIsEditingOwner] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("High");
  const [selectedSort, setSelectedSort] = useState("Last 7 Days");
  const [showEditLeadModal, setShowEditLeadModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [pipelineStage, setPipelineStage] = useState("Not Contacted");
  const [callPopupData, setCallPopupData] = useState({ isOpen: false, lead: null, initialResponse: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, itemId: null });

  // Data Fetching
  const passedLead = location.state?.lead;
  const { data: leadFromQuery, isLoading: leadLoading } = useGetLeadByIdQuery(passedLead?.id, { skip: !passedLead?.id });
  const { data: rules } = useGetAssignmentSettingsQuery();
  const [showQuotationModal, setShowQuotationModal] = useState(false);
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

  // Format currency to match the display format
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "₹0";
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;
    if (isNaN(numericValue)) return "₹0";

    const [intPart] = numericValue.toFixed(0).split(".");
    const lastThree = intPart.substring(intPart.length - 3);
    const otherNumbers = intPart.substring(0, intPart.length - 3);
    const formatted =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
      (otherNumbers ? "," : "") +
      lastThree;
    return "₹" + formatted;
  };

  // Get lead data from query or navigation state
  const [leadData, setLeadData] = useState(null);

  useEffect(() => {
    if (leadFromQuery) {
      setLeadData({
        ...leadFromQuery,
        name: leadFromQuery.name,
        address: leadFromQuery.address || leadFromQuery.location,
        company: leadFromQuery.type === "Person" ? "Individual" : leadFromQuery.organization_name || leadFromQuery.name,
        dateCreated: leadFromQuery.created_at,
        value: formatCurrency(leadFromQuery.value || leadFromQuery.estimated_value),
        dueDate: leadFromQuery.created_at,
        followUp: leadFromQuery.next_call_at ? new Date(leadFromQuery.next_call_at).toISOString().split("T")[0] : "-",
        source: leadFromQuery.lead_source || "Google",
        email: leadFromQuery.email,
        phone: leadFromQuery.mobile_number || leadFromQuery.phone,
        status: leadFromQuery.status,
        tag: leadFromQuery.tag || "Not Contacted",
        tags: leadFromQuery.tags || [],
        services: leadFromQuery.services || [],
        priority: leadFromQuery.priority || "High",
        visibility: leadFromQuery.visibility,
        id: leadFromQuery.id,
        owner: { name: leadFromQuery.employee_name || "Unassigned", img: "https://i.pravatar.cc/150?img=12" },
        assigner: { name: "Khushi Soni", img: "https://i.pravatar.cc/150?img=5" },
        modifiedBy: { name: "Darlee Robertson", img: "https://i.pravatar.cc/150?img=8" },
        city: leadFromQuery.city || "-",
        state: leadFromQuery.state || "-",
        pincode: leadFromQuery.pincode || "-",
        altMobileNumber: leadFromQuery.alt_mobile_number || "-",
        gender: leadFromQuery.gender || "Male",
        fullName: leadFromQuery.full_name || leadFromQuery.name,
        profileImage: leadFromQuery.profile_image || null,
        assigned_to: leadFromQuery.assigned_to,
        call_count: leadFromQuery.call_count || 0
      });
      setPipelineStage(leadFromQuery.tag || "Not Contacted");
    } else if (passedLead && !leadData) {
      setLeadData({
        ...passedLead,
        phone: passedLead.mobile_number || passedLead.phone,
        call_count: passedLead.call_count || 0
      });
    }
  }, [leadFromQuery, passedLead]);

  const isTabsEnabled = leadData?.tag === "Follow Up" || leadData?.tag === "Won" || leadData?.tag === "Interested" || leadData?.status === "In Progress";
  const canNotQualified = (leadData?.call_count || 0) >= (rules?.max_call_attempts || 5);

  const handleLeadInfoSave = async (updatedData) => {
    try {
      const processedTags = typeof updatedData.tags === 'string'
        ? updatedData.tags.split(',').map(t => t.trim()).filter(t => t !== "")
        : (Array.isArray(updatedData.tags) ? updatedData.tags : []);

      const processedServices = typeof updatedData.services === 'string'
        ? updatedData.services.split(',').map(s => s.trim()).filter(s => s !== "")
        : (Array.isArray(updatedData.services) ? updatedData.services : []);

      // Map frontend fields back to backend expected fields
      const apiData = {
        name: updatedData.name,
        fullName: updatedData.fullName,
        gender: updatedData.gender,
        email: updatedData.email,
        mobile_number: updatedData.phone,
        alt_mobile_number: updatedData.altMobileNumber,
        address: updatedData.address,
        city: updatedData.city,
        state: updatedData.state,
        pincode: updatedData.pincode,
        estimated_value: updatedData.value,
        status: updatedData.status,
        visibility: updatedData.visibility,
        tag: updatedData.tag,
        tags: processedTags,
        services: processedServices,
        priority: updatedData.priority,
        owner_name: updatedData.ownerName,
        assigner_name: updatedData.assignerName,
      };

      await updateLead({ id: updatedData.id, data: apiData }).unwrap();

      // Update local state for immediate feedback
      setLeadData((prev) => ({
        ...prev,
        ...updatedData,
        tags: processedTags,
        services: processedServices,
        owner: { ...prev.owner, name: updatedData.ownerName || prev.owner.name },
        assigner: { ...prev.assigner, name: updatedData.assignerName || prev.assigner.name },
      }));

      setShowEditLeadModal(false);
    } catch (error) {
      console.error("Failed to update lead:", error);
      throw error; // Rethrow to let modal handle toast
    }
  };

  const handleLeadUpdate = (field, value) => {
    setLeadData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleQuotationInputChange = (e) => {
    const { name, value } = e.target;
    setQuotationFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openQuotationModal = () => {
    setQuotationFormData(prev => ({
      ...prev,
      customerType: leadData.company && leadData.company !== "Individual" ? "Business" : "Individual",
      companyName: leadData.name || "",
      contactPerson: leadData.company && leadData.company !== "Individual" ? leadData.name : "",
      email: leadData.email || "",
      phone: leadData.phone || "",
      billingAddress: leadData.address || "",
      state: leadData.state || "",
      pincode: leadData.pincode || "",
      quotationNo: `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    }));
    setShowQuotationModal(true);
  };

  const handleCreateQuotation = async () => {
    try {
      const payload = {
        quotation_id: quotationFormData.quotationNo,
        customer_type: quotationFormData.customerType,
        company_name: quotationFormData.companyName,
        contact_person: quotationFormData.contactPerson,
        email: quotationFormData.email,
        phone: quotationFormData.phone,
        billing_address: quotationFormData.billingAddress,
        shipping_address: quotationFormData.shippingAddress,
        state: quotationFormData.state,
        pincode: quotationFormData.pincode,
        gstin: quotationFormData.gstin,
        pan_number: quotationFormData.pan,
        cin_number: quotationFormData.cin,
        quotation_date: quotationFormData.quotationDate,
        valid_until: quotationFormData.validUntil,
        sales_executive: quotationFormData.salesExecutive,
        currency: quotationFormData.currency,
        line_items: quotationFormData.lineItems,
        subtotal: quotationFormData.subtotal,
        tax: quotationFormData.tax,
        discount: quotationFormData.discount,
        total_amount: quotationFormData.totalAmount,
        terms_and_conditions: quotationFormData.terms_and_conditions,
        status: quotationFormData.status,
      };

      await createQuotation(payload).unwrap();
      toast.success("Quotation created successfully");
      setShowQuotationModal(false);
    } catch (err) {
      toast.error(err?.data?.message || "Error saving quotation");
    }
  };

  const [activeModal, setActiveModal] = useState({ type: null, isOpen: false });

  // Mutations
  const [updateLead] = useUpdateLeadMutation();
  const [createQuotation] = useCreateQuotationMutation();
  const [addLeadNote] = useAddLeadNoteMutation();
  const [addLeadCall] = useAddLeadCallMutation();
  const [addLeadFile] = useAddLeadFileMutation();
  const [addLeadMeeting] = useAddLeadMeetingMutation();
  const [updateLeadNote] = useUpdateLeadNoteMutation();
  const [updateLeadFile] = useUpdateLeadFileMutation();
  const [updateLeadMeeting] = useUpdateLeadMeetingMutation();
  const [deleteLeadNote, { isLoading: isDeletingNote }] = useDeleteLeadNoteMutation();
  const [deleteLeadCall, { isLoading: isDeletingCall }] = useDeleteLeadCallMutation();
  const [deleteLeadFile, { isLoading: isDeletingFile }] = useDeleteLeadFileMutation();
  const [deleteLeadMeeting, { isLoading: isDeletingMeeting }] = useDeleteLeadMeetingMutation();

  const handleSaveNote = async (noteData) => {
    try {
      if (editItem) {
        await updateLeadNote({
          leadId: passedLead?.id,
          noteId: editItem.id,
          data: { title: noteData.title, description: noteData.description }
        }).unwrap();
        toast.success("Note updated successfully");
      } else {
        const formData = new FormData();
        formData.append('title', noteData.title);
        formData.append('description', noteData.description);
        if (noteData.files) {
          Array.from(noteData.files).forEach(file => formData.append('files', file));
        }

        await addLeadNote({ id: passedLead?.id, data: formData }).unwrap();
        toast.success("Note added successfully");
      }
      setEditItem(null);
      setActiveModal({ type: null, isOpen: false });
    } catch (error) {
      toast.error(`Failed to ${editItem ? 'update' : 'add'} note`);
      console.error(error);
    }
  };

  const handleEditItem = (type, item) => {
    setEditItem(item);
    setActiveModal({ type, isOpen: true });
  };

  const handleDeleteClick = (type, itemId) => {
    setDeleteModal({ isOpen: true, type, itemId });
  };

  const handleConfirmDelete = async () => {
    const { type, itemId } = deleteModal;
    try {
      if (type === 'note') {
        await deleteLeadNote({ leadId: passedLead?.id, noteId: itemId }).unwrap();
        toast.success("Note deleted successfully");
      } else if (type === 'call') {
        await deleteLeadCall({ leadId: passedLead?.id, callId: itemId }).unwrap();
        toast.success("Call log deleted successfully");
      } else if (type === 'file') {
        await deleteLeadFile({ leadId: passedLead?.id, fileId: itemId }).unwrap();
        toast.success("File deleted successfully");
      } else if (type === 'meeting') {
        await deleteLeadMeeting({ leadId: passedLead?.id, meetingId: itemId }).unwrap();
        toast.success("Meeting deleted successfully");
      }
      setDeleteModal({ isOpen: false, type: null, itemId: null });
    } catch (error) {
      toast.error(`Failed to delete ${type}`);
      console.error(error);
    }
  };

  const handleSaveCall = async (callData) => {
    try {
      await addLeadCall({ id: passedLead?.id, data: callData }).unwrap();
      toast.success("Call logged successfully");
      setActiveModal({ type: null, isOpen: false });
    } catch (error) {
      toast.error("Failed to log call");
      console.error(error);
    }
  };

  const handleSaveFile = async (fileData) => {
    try {
      if (editItem) {
        await updateLeadFile({
          leadId: passedLead?.id,
          fileId: editItem.id,
          data: { title: fileData.title, description: fileData.description }
        }).unwrap();
        toast.success("File updated successfully");
      } else {
        const formData = new FormData();
        formData.append('title', fileData.title);
        formData.append('description', fileData.description || '');
        if (fileData.files) {
          Array.from(fileData.files).forEach(file => {
            formData.append('files', file);
          });
        }
        await addLeadFile({ id: passedLead?.id, data: formData }).unwrap();
        toast.success("File uploaded successfully");
      }
      setEditItem(null);
      setActiveModal({ type: null, isOpen: false });
    } catch (error) {
      toast.error(`Failed to ${editItem ? 'update' : 'upload'} file`);
      console.error(error);
    }
  };

  const handleSaveMeeting = async (meetingData) => {
    try {
      if (editItem) {
        await updateLeadMeeting({
          leadId: passedLead?.id,
          meetingId: editItem.id,
          data: meetingData
        }).unwrap();
        toast.success("Meeting updated successfully");
      } else {
        await addLeadMeeting({ id: passedLead?.id, data: meetingData }).unwrap();
        toast.success("Meeting scheduled successfully");
      }
      setEditItem(null);
      setActiveModal({ type: null, isOpen: false });
    } catch (error) {
      toast.error(`Failed to ${editItem ? 'update' : 'schedule'} meeting`);
      console.error(error);
    }
  };

  const handleDownload = (filePath, fileName) => {
    if (!filePath) {
      toast.error("File path not found");
      return;
    }

    try {
      const baseUrl = (import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api/').replace('/api/', '');
      const url = filePath.startsWith('http') ? filePath : `${baseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`;

      // For images and PDFs, opening in new tab is often better than direct download which might be blocked
      window.open(url, '_blank');
      toast.success("Opening file...");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to open file");
    }
  };

  const [updateLeadStatus] = useUpdateLeadStatusMutation();

  const handleUpdateStatus = async (status) => {
    try {
      let backendStatus = status;
      let backendTag = leadData?.tag;

      if (status === "In Progress") {
        backendStatus = "In Progress";
        backendTag = "Follow Up";
      } else if (status === "Not Qualified") {
        backendStatus = "Not Qualified";
        backendTag = "Dropped"; // Or Lost
      } else if (status === "Not Connected") {
        openCallAction(); // Just open call action choice
      }

      await updateLeadStatus({ id: leadData?.id, status: backendStatus, tag: backendTag }).unwrap();
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const [hitCallMutation] = useHitCallMutation();

  const handleHitCall = async (callData) => {
    try {
      await hitCallMutation({
        id: callData.id,
        status: callData.status,
        next_call_at: callData.next_call_at,
        drop_reason: callData.drop_reason,
        create_reminder: callData.create_reminder
      }).unwrap();

      // If call was connected, automatically move to In Progress
      if (callData.response === "connected") {
        await updateLeadStatus({
          id: callData.id,
          status: "In Progress",
          tag: "Follow Up"
        }).unwrap();
        toast.success("Lead moved to In Progress");
      } else {
        toast.success("Lead status updated based on call response");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update call status");
    }
  };

  const openCallAction = (initialResponse = null) => {
    setCallPopupData({ isOpen: true, lead: passedLead, initialResponse });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-0 flex flex-col">
        {/* Back Button */}
        <div className="bg-white px-8 py-4 border-b">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            <ArrowLeftCircle size={22} className="text-gray-500" />
            Back to Leads
          </button>
        </div>

        <div className="flex flex-1">
          {/* Left Sidebar */}
          <LeadSidebar
            leadData={leadData}
            isEditingLead={isEditingLead}
            isEditingOwner={isEditingOwner}
            setIsEditingOwner={setIsEditingOwner}
            handleLeadUpdate={handleLeadUpdate}
            setShowEditLeadModal={setShowEditLeadModal}
            formatCurrency={formatCurrency}
            handleHitCall={openCallAction}
            setShowModal={openQuotationModal}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Pipeline Status */}
            <div className="p-8 bg-white border-b shadow-sm">
              <div className="w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 capitalize tracking-wide flex items-center gap-2">
                      <Zap className="w-5 h-5 text-orange-500 fill-orange-500" /> Lead Status
                    </h2>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => openCallAction()}
                        className={`px-5 py-2 rounded-sm text-sm font-semibold capitalize tracking-wide border transition-all active:scale-95 shadow-sm ${leadData?.tag === "Not Connected" || leadData?.tag === "Not Contacted" || leadData?.status === "Not Connected"
                          ? "bg-orange-500 text-white border-orange-500 ring-2 ring-orange-500 ring-opacity-20 translate-y-[-1px]"
                          : "bg-white text-gray-500 border-gray-200 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50"
                          }`}
                      >
                        Call Action
                      </button>
                      <button
                        onClick={() => openCallAction()}
                        className={`px-5 py-2 rounded-sm text-sm font-semibold capitalize tracking-wide border transition-all active:scale-95 shadow-sm ${leadData?.status === "In Progress" || leadData?.tag === "Follow Up"
                          ? "bg-blue-500 text-white border-blue-500 ring-2 ring-blue-500 ring-opacity-20 translate-y-[-1px]"
                          : "bg-white text-gray-500 border-gray-200 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50"
                          }`}
                      >
                        In Progress
                      </button>
                      <button
                        disabled={!canNotQualified}
                        onClick={() => handleUpdateStatus("Not Qualified")}
                        className={`px-5 py-2 rounded-sm text-sm font-semibold capitalize tracking-wide border transition-all active:scale-95 shadow-sm ${leadData?.status === "Not Qualified" || leadData?.tag === "Lost"
                          ? "bg-red-500 text-white border-red-500 ring-2 ring-red-500 ring-opacity-20 translate-y-[-1px]"
                          : canNotQualified
                            ? "bg-white text-gray-500 border-gray-200 hover:border-red-500 hover:text-red-500 hover:bg-red-50"
                            : "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                          }`}
                      >
                        Not Qualified
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-2">
                    <span className="text-xs font-bold text-gray-400 capitalize tracking-wide">Active Pipeline Stage</span>
                    <div className="relative inline-block text-left">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className={`font-bold px-6 py-3 rounded-sm shadow-lg flex items-center gap-3 transition-all active:scale-95 text-sm capitalize tracking-wide border border-transparent ${pipelineStage === 'Lost' ? 'bg-red-600 hover:bg-red-700 text-white' :
                          pipelineStage === 'Closed' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' :
                            (pipelineStage === 'Contacted' || pipelineStage === 'Follow Up') ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                              'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                      >
                        {pipelineStage}
                        <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                      </button>

                      {showDropdown && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn">
                          <ul className="py-1">
                            {["Not Contacted", "Contacted", "Follow Up", "Closed", "Lost"].map(
                              (stage) => (
                                <li
                                  key={stage}
                                  onClick={() => {
                                    setPipelineStage(stage);
                                    setShowDropdown(false);
                                  }}
                                  className="px-4 py-3 hover:bg-orange-50 hover:text-orange-600 cursor-pointer text-sm font-semibold capitalize tracking-wide transition-colors border-b border-gray-50 last:border-0"
                                >
                                  {stage}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-stretch w-full overflow-hidden rounded-sm" style={{ height: "54px" }}>
                  {["Not Contacted", "Contacted", "Follow Up", "Closed", "Lost"].map((stage, idx, arr) => {
                    const isActive = pipelineStage === stage;
                    const colors = {
                      "Not Contacted": isActive ? "bg-purple-600" : "bg-purple-400 opacity-60",
                      "Contacted": isActive ? "bg-blue-400" : "bg-blue-200 opacity-60",
                      "Follow Up": isActive ? "bg-blue-600" : "bg-blue-300 opacity-60",
                      "Closed": isActive ? "bg-yellow-500" : "bg-yellow-300 opacity-60",
                      "Lost": isActive ? "bg-red-600" : "bg-red-300 opacity-60"
                    };

                    let clipPath = "";
                    if (idx === 0) clipPath = "polygon(0 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 0 100%)";
                    else if (idx === arr.length - 1) clipPath = "polygon(24px 0, 100% 0, 100% 100%, 24px 100%, 0 50%)";
                    else clipPath = "polygon(24px 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 24px 100%, 0 50%)";

                    return (
                      <div
                        key={stage}
                        onClick={() => setPipelineStage(stage)}
                        className={`relative flex-1 ${colors[stage]} flex items-center justify-center cursor-pointer transition-all duration-300 group ${isActive ? 'z-10 shadow-inner' : '-ml-6 first:ml-0'}`}
                        style={{ clipPath }}
                      >
                        <span className={`relative z-10 font-bold capitalize tracking-wide text-sm transition-all ${isActive ? 'text-white scale-105' : 'text-white/80 group-hover:text-white'}`}>
                          {stage}
                        </span>
                        {isActive && (
                          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/30"></div>
                        )}
                        {!isActive && (
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-white/10 transition-colors"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white border-b">
              <div className="flex px-0 overflow-x-auto no-scrollbar">
                {[
                  { id: "activities", label: "Activities", Icon: Zap },
                  { id: "notes", label: "Notes", Icon: FileText },
                  { id: "calls", label: "Calls", Icon: Phone },
                  { id: "files", label: "Files", Icon: File },
                  { id: "email", label: "Email", Icon: Mail },
                  { id: "whatsapp", label: "WhatsApp", Icon: FaWhatsapp },
                  { id: "meeting", label: "Meeting", Icon: Users },
                ].map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => isTabsEnabled && setActiveTab(id)}
                    disabled={!isTabsEnabled}
                    className={`px-6 py-4 font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${!isTabsEnabled
                      ? "opacity-40 cursor-not-allowed border-transparent text-gray-300"
                      : activeTab === id
                        ? "border-orange-500 text-orange-500 bg-orange-50/30 shadow-sm"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <Icon size={id === 'whatsapp' ? 20 : 18} className={id === 'whatsapp' && activeTab === id ? 'text-[#25D366]' : ''} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <LeadTabs
              activeTab={activeTab}
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
              showSortDropdown={showSortDropdown}
              setShowSortDropdown={setShowSortDropdown}
              onAddClick={(type) => {
                setEditItem(null);
                setActiveModal({ type, isOpen: true });
              }}
              onEditClick={handleEditItem}
              onDeleteClick={handleDeleteClick}
              onDownloadClick={handleDownload}
              leadId={passedLead?.id}
            />
          </div>
        </div>
      </div>

      <LeadDeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: null, itemId: null })}
        onConfirm={handleConfirmDelete}
        isLoading={isDeletingNote || isDeletingCall || isDeletingFile || isDeletingMeeting}
        title={`Delete Lead ${deleteModal.type === 'note' ? 'Note' : deleteModal.type === 'call' ? 'Call Log' : deleteModal.type === 'file' ? 'File' : 'Meeting'}`}
        message={`Are you sure you want to delete this ${deleteModal.type}? This action cannot be undone.`}
      />

      {/* Modals */}
      {activeModal.type === 'note' && (
        <AddNoteModal
          open={activeModal.isOpen}
          onClose={() => {
            setActiveModal({ type: null, isOpen: false });
            setEditItem(null);
          }}
          onSave={handleSaveNote}
          editData={editItem}
        />
      )}

      {activeModal.type === 'file' && (
        <AddNoteModal
          open={activeModal.isOpen}
          onClose={() => {
            setActiveModal({ type: null, isOpen: false });
            setEditItem(null);
          }}
          onSave={handleSaveFile}
          title={editItem ? "Edit File Info" : "Upload File"}
          editData={editItem}
        />
      )}

      {activeModal.type === 'call' && (
        <CreateCallLogModal
          open={activeModal.isOpen}
          onClose={() => setActiveModal({ type: null, isOpen: false })}
          onSave={handleSaveCall}
        />
      )}

      {activeModal.type === 'meeting' && (
        <AddMeetingModal
          open={activeModal.isOpen}
          onClose={() => {
            setActiveModal({ type: null, isOpen: false });
            setEditItem(null);
          }}
          onSave={handleSaveMeeting}
          editData={editItem}
        />
      )}

      {showEditLeadModal && (
        <EditLeadModal
          open={showEditLeadModal}
          onClose={() => setShowEditLeadModal(false)}
          leadData={leadData}
          onSave={handleLeadInfoSave}
        />
      )}

      {showQuotationModal && (
        <CreateQuotationModal
          showModal={showQuotationModal}
          setShowModal={setShowQuotationModal}
          formData={quotationFormData}
          handleInputChange={handleQuotationInputChange}
          handleCreateQuotation={handleCreateQuotation}
          setFormData={setQuotationFormData}
        />
      )}

      {callPopupData.isOpen && (
        <CallActionPopup
          isOpen={callPopupData.isOpen}
          onClose={() => setCallPopupData({ isOpen: false, lead: null, initialResponse: null })}
          lead={callPopupData.lead}
          initialResponse={callPopupData.initialResponse}
          rules={rules}
          onHitCall={handleHitCall}
        />
      )}
    </>
  );
}


