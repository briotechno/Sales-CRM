import React, { useState, useEffect } from "react";
import { Building2, Save, Mail, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";
// 👉 tamari actual API hook lagavo
// import { useUpdateEnterpriseMutation } from "../../store/api/enterpriseApi";

const EditEnterpriseModal = ({ isOpen, onClose, enterprise, refetchDashboard }) => {
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("Enterprise");
  const [status, setStatus] = useState("Active");
  const [users, setUsers] = useState(0);

  // const [updateEnterprise, { isLoading }] = useUpdateEnterpriseMutation();
  const isLoading = false;

  useEffect(() => {
    if (enterprise) {
      setName(enterprise.name || "");
      setOwner(enterprise.owner || "");
      setEmail(enterprise.email || "");
      setPlan(enterprise.plan || "Enterprise");
      setStatus(enterprise.status || "Active");
      setUsers(enterprise.users || 0);
    }
  }, [enterprise]);

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("Enterprise name is required");
      return;
    }

    try {
      const payload = {
        name,
        owner,
        email,
        plan,
        status,
        users,
      };

      // await updateEnterprise({ id: enterprise.id, data: payload }).unwrap();

      if (refetchDashboard) refetchDashboard();

      toast.success("Enterprise updated successfully");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update enterprise");
    }
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        className="px-6 py-2.5 rounded-sm border-2 border-gray-300 font-semibold hover:bg-gray-100"
      >
        Cancel
      </button>
      <button
        onClick={handleUpdate}
        disabled={isLoading}
        className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50"
      >
        <Save size={18} />
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Enterprise"
      subtitle={enterprise?.id}
      icon={<Building2 size={24} />}
      footer={footer}
    >
      <div className="space-y-5 text-black">

        {/* Enterprise Name */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Enterprise Name <span className="text-red-500">*</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-2 rounded-lg focus:border-[#FF7B1D]"
          />
        </div>

        {/* Owner */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Owner Name
          </label>
          <input
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="w-full px-4 py-3 border-2 rounded-lg focus:border-[#FF7B1D]"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Mail size={14} /> Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border-2 rounded-lg focus:border-[#FF7B1D]"
          />
        </div>

        {/* Plan & Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Plan
            </label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-lg"
            >
              <option>Basic</option>
              <option>Professional</option>
              <option>Enterprise</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-lg"
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Trial</option>
            </select>
          </div>
        </div>

        {/* Users */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Users size={14} /> Total Users
          </label>
          <input
            type="number"
            value={users}
            onChange={(e) => setUsers(e.target.value)}
            className="w-full px-4 py-3 border-2 rounded-lg focus:border-[#FF7B1D]"
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditEnterpriseModal;
