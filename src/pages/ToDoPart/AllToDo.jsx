import React, { useState, useEffect, useRef } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Check,
  Plus,
  Trash2,
  Calendar,
  Flag,
  Clock,
  Filter,
  X,
  Search,
  Layout,
  CheckCircle,
  MoreVertical,
  AlertCircle,
  Loader2,
  SquarePen,
  Eye,
  LayoutGrid,
  List,
  RotateCcw,
  FileText,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import NumberCard from "../../components/NumberCard";
import Modal from "../../components/common/Modal";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useToggleTaskStatusMutation,
  useUpdateTaskMutation,
} from "../../store/api/taskApi";

export default function TodoPage() {
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskDate, setNewTaskDate] = useState(new Date().toISOString().split("T")[0]);
  const [newTaskTime, setNewTaskTime] = useState(new Date().toTimeString().slice(0, 5));
  const [newTaskCategory, setNewTaskCategory] = useState("General");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("All");

  const [tempPriority, setTempPriority] = useState("all");
  const [tempCategory, setTempCategory] = useState("All");
  const [tempDateFilter, setTempDateFilter] = useState("All");
  const [tempCustomStart, setTempCustomStart] = useState("");
  const [tempCustomEnd, setTempCustomEnd] = useState("");
  const [tempStatus, setTempStatus] = useState("All");

  const [dateFilter, setDateFilter] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [isPriorityFilterOpen, setIsPriorityFilterOpen] = useState(false);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToView, setTaskToView] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const priorityDropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);

  // Date Filter Logic
  const getDateRange = () => {
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];

    let dateFrom = "";
    let dateTo = "";

    if (dateFilter === "Today") {
      dateFrom = formatDate(today);
      dateTo = formatDate(today);
    } else if (dateFilter === "Yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      dateFrom = formatDate(yesterday);
      dateTo = formatDate(yesterday);
    } else if (dateFilter === "Last 7 Days") {
      const last7 = new Date(today);
      last7.setDate(today.getDate() - 7);
      dateFrom = formatDate(last7);
      dateTo = formatDate(today);
    } else if (dateFilter === "This Month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      dateFrom = formatDate(firstDay);
      dateTo = formatDate(today);
    } else if (dateFilter === "Custom") {
      dateFrom = customStart;
      dateTo = customEnd;
    }
    return { dateFrom, dateTo };
  };

  const { dateFrom, dateTo } = getDateRange();

  // API Hooks
  const { data, isLoading } = useGetTasksQuery({
    page: currentPage,
    limit: itemsPerPage,
    priority: filterPriority,
    category: filterCategory !== "All" ? filterCategory : undefined,
    search: searchTerm,
    status: filterStatus !== "All" ? filterStatus : undefined,
    dateFrom,
    dateTo,
    timeframe: dateFilter,
  });

  const [createTask] = useCreateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [toggleTaskStatus] = useToggleTaskStatusMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const tasks = data?.tasks || [];
  const summary = data?.summary || { total: 0, highPriority: 0, active: 0, completed: 0 };
  const pagination = data?.pagination || { totalPages: 1, total: 0 };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  const handleView = (task) => {
    setTaskToView(task);
    setShowFullTitle(false);
    setIsViewModalOpen(true);
  };

  const addTask = async () => {
    if (!newTask.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    if (newTask.length > 250) {
      toast.error("Task title cannot exceed 250 characters");
      return;
    }

    // Validate date is not in the past
    const today = new Date();
    today.setSeconds(0, 0); // Reset seconds/millis for comparison

    // Create date objects for comparison
    const selectedDateTime = new Date(`${newTaskDate}T${newTaskTime}`);

    // Check if the selected time is in the past (when date is today)
    if (selectedDateTime < today) {
      toast.error("Due time cannot be in the past.");
      return;
    }

    try {
      const newTaskObj = {
        title: newTask,
        priority: newTaskPriority,
        due_date: newTaskDate,
        due_time: newTaskTime,
        category: newTaskCategory,
        status: "Pending",
      };

      await createTask(newTaskObj).unwrap();

      toast.success("Task created successfully!");

      // Reset form
      setNewTask("");
      setNewTaskPriority("medium");
      setNewTaskDate(new Date().toISOString().split("T")[0]);
      setNewTaskTime(new Date().toTimeString().slice(0, 5));
      setNewTaskCategory("General");
      setIsAddModalOpen(false);
    } catch (err) {
      toast.error("Failed to create task: " + (err.data?.message || err.message));
    }
  };

  const handleUpdateTask = async () => {
    if (!newTask.trim()) {
      toast.error("Task title is required");
      return;
    }

    if (newTask.length > 250) {
      toast.error("Task title cannot exceed 250 characters");
      return;
    }

    const today = new Date();
    today.setSeconds(0, 0);
    const selectedDateTime = new Date(`${newTaskDate}T${newTaskTime}`);

    if (selectedDateTime < today) {
      toast.error("Due time cannot be in the past.");
      return;
    }

    try {
      await updateTask({
        id: taskToEdit.id,
        title: newTask,
        priority: newTaskPriority,
        due_date: newTaskDate,
        due_time: newTaskTime,
        category: newTaskCategory,
      }).unwrap();

      toast.success("Task updated successfully!");
      setIsEditModalOpen(false);
      setTaskToEdit(null);
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleTaskStatus(id).unwrap();
      toast.success("Task status updated!");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      const isCompleted = newStatus === 'Completed';
      await updateTask({
        id: task.id,
        status: newStatus,
        completed: isCompleted ? 1 : 0
      }).unwrap();
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);

    setNewTask(task.title);
    setNewTaskPriority(task.priority || "medium");
    // ✅ FIX HERE
    setNewTaskDate(formatDateForInput(task.due_date));
    setNewTaskTime(task.due_time?.slice(0, 5));
    setNewTaskCategory(task.category || "General");

    setIsEditModalOpen(true);
  };

  const confirmDelete = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete.id).unwrap();
      toast.success("Task deleted successfully");
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target)) {
        setIsPriorityFilterOpen(false);
      }
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setIsDateFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterPriority("all");
    setFilterCategory("All");
    setFilterStatus("All");
    setDateFilter("All");
    setCustomStart("");
    setCustomEnd("");
  };

  const inputStyles =
    "w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm font-semibold";

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const hasActiveFilters =
    searchTerm || filterPriority !== "all" || dateFilter !== "All" || filterCategory !== "All" || filterStatus !== "All";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 capitalize tracking-tight">My Tasks</h1>
                <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-2 font-bold capitalize tracking-wider">
                  <FiHome className="text-gray-400" size={12} />
                  <span>Additional</span>
                  <span className="text-gray-300">/</span>
                  <span className="text-[#FF7B1D]">
                    To-Do
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Unified Filter Dropdown */}
                <div className="relative" ref={priorityDropdownRef}>
                  <button
                    onClick={() => {
                      if (hasActiveFilters) {
                        clearAllFilters();
                      } else {
                        setTempPriority(filterPriority);
                        setTempCategory(filterCategory);
                        setTempStatus(filterStatus);
                        setTempDateFilter(dateFilter);
                        setTempCustomStart(customStart);
                        setTempCustomEnd(customEnd);
                        setIsPriorityFilterOpen(!isPriorityFilterOpen);
                      }
                    }}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${isPriorityFilterOpen || hasActiveFilters
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    title="Filters"
                  >
                    {hasActiveFilters ? <X size={18} /> : <Filter size={18} />}
                  </button>

                  {isPriorityFilterOpen && (
                    <div className="absolute right-0 mt-2 w-[700px] bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn overflow-hidden">
                      {/* Header */}
                      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-800">Filter Options</span>
                        <button
                          onClick={() => {
                            setTempPriority("all");
                            setTempCategory("All");
                            setTempStatus("All");
                            setTempDateFilter("All");
                            setTempCustomStart("");
                            setTempCustomEnd("");
                          }}
                          className="text-[10px] font-bold text-orange-600 hover:underline hover:text-orange-700 capitalize"
                        >
                          Reset all
                        </button>
                      </div>

                      <div className="p-5 grid grid-cols-2 gap-x-10 gap-y-8">
                        {/* Column 1: Priority */}
                        <div className="space-y-4">
                          <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Priority</span>
                          <div className="grid grid-cols-2 gap-2">
                            {["all", "high", "medium", "low"].map((p) => (
                              <label key={p} className="flex items-center group cursor-pointer">
                                <div className="relative flex items-center">
                                  <input
                                    type="radio"
                                    name="priority_filter"
                                    checked={tempPriority === p}
                                    onChange={() => setTempPriority(p)}
                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-gray-200 transition-all checked:border-[#FF7B1D] checked:border-[5px] hover:border-orange-300"
                                  />
                                </div>
                                <span className={`ml-3 text-sm font-medium transition-colors capitalize ${tempPriority === p ? "text-[#FF7B1D] font-bold" : "text-gray-600 group-hover:text-gray-900"}`}>
                                  {p === "all" ? "All" : p}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Column 2: Status */}
                        <div className="space-y-4">
                          <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Status</span>
                          <div className="grid grid-cols-2 gap-2">
                            {["All", "Active", "Pending", "Completed"].map((s) => (
                              <label key={s} className="flex items-center group cursor-pointer">
                                <div className="relative flex items-center">
                                  <input
                                    type="radio"
                                    name="status_filter"
                                    checked={tempStatus === s}
                                    onChange={() => setTempStatus(s)}
                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-gray-200 transition-all checked:border-[#FF7B1D] checked:border-[5px] hover:border-orange-300"
                                  />
                                </div>
                                <span className={`ml-3 text-sm font-medium transition-colors capitalize ${tempStatus === s ? "text-[#FF7B1D] font-bold" : "text-gray-600 group-hover:text-gray-900"}`}>
                                  {s}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Column 3: Category */}
                        <div className="space-y-4">
                          <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Category</span>
                          <div className="relative">
                            <select
                              value={tempCategory}
                              onChange={(e) => setTempCategory(e.target.value)}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                            >
                              <option value="All">All Categories</option>
                              {["General", "Work", "Personal", "Meeting", "Follow-up", "Documentation", "Research", "Development", "Design", "Testing", "Deployment"].map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Column 4: Date Range */}
                        <div className="space-y-4">
                          <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Date Period</span>
                          <div className="space-y-3">
                            <select
                              value={tempDateFilter}
                              onChange={(e) => setTempDateFilter(e.target.value)}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                            >
                              {["All", "Today", "Yesterday", "Last 7 Days", "This Month", "Custom"].map((range) => (
                                <option key={range} value={range}>{range}</option>
                              ))}
                            </select>

                            {tempDateFilter === "Custom" && (
                              <div className="grid grid-cols-2 gap-2 animate-fadeIn">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-gray-400 uppercase">From</label>
                                  <input
                                    type="date"
                                    value={tempCustomStart}
                                    onChange={(e) => setTempCustomStart(e.target.value)}
                                    className="w-full px-2 py-1.5 border border-gray-200 rounded-sm text-[10px] outline-none focus:border-orange-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-gray-400 uppercase">To</label>
                                  <input
                                    type="date"
                                    value={tempCustomEnd}
                                    onChange={(e) => setTempCustomEnd(e.target.value)}
                                    className="w-full px-2 py-1.5 border border-gray-200 rounded-sm text-[10px] outline-none focus:border-orange-500"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Filter Actions */}
                      <div className="p-4 bg-gray-50 border-t flex gap-3">
                        <button
                          onClick={() => setIsPriorityFilterOpen(false)}
                          className="flex-1 py-2.5 text-[11px] font-bold text-gray-500 capitalize tracking-wider hover:bg-gray-200 transition-colors rounded-sm border border-gray-200 bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setFilterPriority(tempPriority);
                            setFilterCategory(tempCategory);
                            setFilterStatus(tempStatus);
                            setDateFilter(tempDateFilter);
                            setCustomStart(tempCustomStart);
                            setCustomEnd(tempCustomEnd);
                            setIsPriorityFilterOpen(false);
                            setCurrentPage(1);
                          }}
                          className="flex-1 py-2.5 text-[11px] font-bold text-white capitalize tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all rounded-sm shadow-md active:scale-95"
                        >
                          Apply filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>


                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 p-1 rounded-sm border border-gray-200 shadow-inner">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-sm transition-all duration-200 ${viewMode === "grid"
                      ? "bg-white text-orange-600 shadow-sm border border-gray-100"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-sm transition-all duration-200 ${viewMode === "table"
                      ? "bg-white text-orange-600 shadow-sm border border-gray-100"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    <List size={18} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setNewTask("");
                    setNewTaskPriority("medium");
                    const today = new Date();
                    const localDate = today.toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
                    setNewTaskDate(localDate);
                    setNewTaskTime(today.toTimeString().slice(0, 5));
                    setNewTaskCategory("General");
                    setIsAddModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm text-[11px] font-bold transition shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 capitalize tracking-wider"
                >
                  <Plus size={20} />
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`max-w-8xl mx-auto px-4 ${hasActiveFilters ? "pt-4 pb-0" : ""}`}>
        </div>

        <div className="max-w-8xl mx-auto px-4 pb-4 pt-2 mt-0 font-primary w-full flex-1">
          {isLoading ? (
            <div className="flex justify-center flex-col items-center gap-4 py-32">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-semibold animate-pulse">Loading your tasks...</p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                <NumberCard
                  title="Total Tasks"
                  number={summary.total}
                  icon={<Layout className="text-blue-600" size={24} />}
                  iconBgColor="bg-blue-100"
                  lineBorderClass="border-blue-500"
                />
                <NumberCard
                  title="High Priority"
                  number={summary.highPriority}
                  icon={<Flag className="text-red-600" size={24} />}
                  iconBgColor="bg-red-100"
                  lineBorderClass="border-red-500"
                />
                <NumberCard
                  title="Active Tasks"
                  number={summary.active}
                  icon={<Clock className="text-orange-600" size={24} />}
                  iconBgColor="bg-orange-100"
                  lineBorderClass="border-orange-500"
                />
                <NumberCard
                  title="Completed"
                  number={summary.completed}
                  icon={<CheckCircle className="text-green-600" size={24} />}
                  iconBgColor="bg-green-100"
                  lineBorderClass="border-green-500"
                />
              </div>

              {tasks.length > 0 ? (
                <div className="space-y-4">
                  {/* Tasks Content */}
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="bg-white border-2 border-gray-100 rounded-sm shadow-sm hover:shadow-md transition-all p-6 relative group flex flex-col"
                        >
                          {/* Absolute Actions */}
                          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleView(task); }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm bg-white shadow-sm border border-blue-100"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            {!task.completed && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEdit(task); }}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-sm bg-white shadow-sm border border-green-100"
                                title="Edit Task"
                              >
                                <SquarePen size={16} />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDelete(task);
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm bg-white shadow-sm border border-red-100"
                              title="Delete Task"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Icon & Status Section */}
                          <div className="flex flex-col items-center mb-4 transition-transform group-hover:scale-105 duration-300">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-sm group-hover:shadow-md transition-all ${task.completed ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-[#FF7B1D]'
                              }`}>
                              {task.completed ? <CheckCircle size={28} /> : <Clock size={28} />}
                            </div>
                            <div className="mt-3 text-center px-2 h-12 flex items-center justify-center">
                              <h3 className={`text-base font-bold tracking-tight transition-all duration-300 ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                                } line-clamp-2`}>
                                {task.title}
                              </h3>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-sm text-xs font-bold capitalize tracking-wide border border-gray-200">
                                {task.category || 'General'}
                              </span>
                              {!task.completed && (
                                <span className={`px-3 py-1 rounded-sm text-xs font-bold capitalize tracking-wide ${task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                  task.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                  {task.priority || 'Medium'}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Footer Section */}
                          <div className="mt-auto bg-gray-100 -mx-6 -mb-6 px-6 py-4 rounded-b-sm border-t border-gray-200">
                            {/* Stats Info */}
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex flex-col items-center flex-1 border-r border-gray-300">
                                <p className="text-xs text-[#FF7B1D] capitalize font-bold tracking-wide">Due Date</p>
                                <p className="text-sm font-bold text-gray-700 mt-1">{new Date(task.due_date).toLocaleDateString()}</p>
                              </div>
                              <div className="flex flex-col items-center flex-1">
                                <p className="text-xs text-[#FF7B1D] capitalize font-bold tracking-wide">Status</p>
                                <p className={`text-sm font-black mt-1 capitalize ${task.completed ? 'text-green-600' : 'text-gray-600'}`}>
                                  {task.status || (task.completed ? 'Completed' : 'Active')}
                                </p>
                              </div>
                            </div>

                            {/* Progress/Action Bar */}
                            {!task.completed && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleToggleStatus(task.id); }}
                                className="w-full py-2.5 bg-green-600 text-white text-xs font-bold capitalize tracking-wide rounded-sm border border-transparent hover:bg-green-700 shadow-sm transition-all duration-300 flex items-center justify-center gap-2 font-primary"
                              >
                                <Check size={16} strokeWidth={3} />
                                Mark As Complete
                              </button>
                            )}
                            {!!task.completed && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleToggleStatus(task.id); }}
                                className="w-full py-2.5 bg-white text-gray-700 text-xs font-bold capitalize tracking-wide rounded-sm border border-gray-200 hover:bg-gray-50 hover:text-orange-600 transition-all duration-300 flex items-center justify-center gap-2 font-primary shadow-sm"
                              >
                                <RotateCcw size={16} strokeWidth={3} />
                                Undo Completion
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                                <th className="py-3 px-4 font-semibold text-left w-[28%]">Title</th>
                                <th className="py-3 px-4 font-semibold text-left w-[12%]">Category</th>
                                <th className="py-3 px-4 font-semibold text-left w-[12%]">Priority</th>
                                <th className="py-3 px-4 font-semibold text-left w-[15%]">Due Date</th>
                                <th className="py-3 px-4 font-semibold text-left w-[12%]">Due Time</th>
                                <th className="py-3 px-4 font-semibold text-left w-[13%]">Status</th>
                                <th className="py-3 px-4 font-semibold text-right w-[8%]">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {isLoading ? (
                                <tr>
                                  <td colSpan="7" className="py-20 text-center">
                                    <div className="flex justify-center flex-col items-center gap-4">
                                      <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                                      <p className="text-gray-500 font-semibold animate-pulse">Loading tasks...</p>
                                    </div>
                                  </td>
                                </tr>
                              ) : tasks.map((task, idx) => (
                                <tr key={task.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"} hover:bg-orange-50/50 transition-colors group`}>
                                  <td className="py-3 px-4 text-left">
                                    <div className={`text-base font-normal truncate max-w-sm ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`} title={task.title}>
                                      {task.title}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-left whitespace-nowrap">
                                    <div className="text-sm text-gray-600 font-medium capitalize tracking-tight">{task.category || 'General'}</div>
                                  </td>
                                  <td className="py-3 px-4 whitespace-nowrap text-left">
                                    {!task.completed && (
                                      <span className={`px-2 py-0.5 rounded-sm text-xs font-bold capitalize ${task.priority === 'high' ? 'bg-red-50 text-red-600' : task.priority === 'medium' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                                        {task.priority || 'Medium'}
                                      </span>
                                    )}
                                    {!!task.completed && <span className="text-gray-400 font-bold text-xs capitalize">Done</span>}
                                  </td>
                                  <td className="py-3 px-4 whitespace-nowrap text-left">
                                    <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                                      <Calendar size={14} className="text-orange-500" />
                                      {new Date(task.due_date).toLocaleDateString()}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 whitespace-nowrap text-left">
                                    <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                                      <Clock size={14} className="text-orange-500" />
                                      {task.due_time ? new Date(`1970-01-01T${task.due_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : "--:--"}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 whitespace-nowrap text-left">
                                    <div className="relative inline-block">
                                      <span className={`px-3 py-1 rounded-sm text-xs font-bold capitalize tracking-wider border w-fit flex items-center gap-2
                                        ${(task.status === 'Completed' || task.completed) ? 'bg-green-50 text-green-700 border-green-100' :
                                          task.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                            'bg-orange-50 text-orange-700 border-orange-100'
                                        }`}
                                      >
                                        {task.status || (task.completed ? 'Completed' : 'Active')}
                                        <ChevronDown size={12} strokeWidth={3} />
                                      </span>
                                      <select
                                        value={task.status || (task.completed ? 'Completed' : 'Active')}
                                        onChange={(e) => handleStatusChange(task, e.target.value)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[11px]"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <option value="Active">Active</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                      </select>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={() => handleView(task)}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-all"
                                        title="View Details"
                                      >
                                        <Eye size={18} />
                                      </button>
                                      {!task.completed && (
                                        <>
                                          <button
                                            onClick={() => handleToggleStatus(task.id)}
                                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-sm transition-all"
                                            title="Mark Complete"
                                          >
                                            <CheckCircle size={18} />
                                          </button>
                                          <button
                                            onClick={() => handleEdit(task)}
                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-sm transition-all"
                                            title="Edit Task"
                                          >
                                            <SquarePen size={18} />
                                          </button>
                                        </>
                                      )}
                                      {!!task.completed && (
                                        <button
                                          onClick={() => handleToggleStatus(task.id)}
                                          className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-sm transition-all"
                                          title="Mark Incomplete"
                                        >
                                          <RotateCcw size={18} />
                                        </button>
                                      )}
                                      <button
                                        onClick={() => confirmDelete(task)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-all"
                                        title="Delete Task"
                                      >
                                        <Trash2 size={18} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>


                    </div>
                  )}

                  {/* Pagination Section (Global for Grid/List) */}
                  <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200 shadow-sm">
                    <p className="text-sm font-semibold text-gray-700">
                      Showing <span className="text-orange-600">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-orange-600">{Math.min(currentPage * itemsPerPage, pagination.total || 0)}</span> of <span className="text-orange-600">{pagination.total || 0}</span> Tasks
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                          }`}
                      >
                        Previous
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: pagination.totalPages || 1 }, (_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`w-10 h-10 rounded-sm font-bold transition ${currentPage === i + 1 ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md border-orange-500" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage < pagination.totalPages ? currentPage + 1 : currentPage)}
                        disabled={currentPage === pagination.totalPages || pagination.totalPages === 0}
                        className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === pagination.totalPages || pagination.totalPages === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                          }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-24 bg-white rounded-sm border-2 border-dashed border-gray-100 mt-6">
                  <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <List className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 font-primary">
                    {hasActiveFilters ? "No matches found" : "No tasks found"}
                  </h3>
                  <p className="text-gray-500 max-w-xs mx-auto text-sm font-primary mb-6">
                    {hasActiveFilters
                      ? "We couldn't find any tasks matching your search or filters. Time for a broader view!"
                      : "Your task list is currently empty. Start capturing your tasks today!"}
                  </p>
                  {hasActiveFilters ? (
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-2 border-2 border-[#FF7B1D] text-[#FF7B1D] font-bold rounded-sm hover:bg-orange-50 transition-all text-xs uppercase tracking-wider"
                    >
                      Clear Filter
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setNewTask("");
                        setNewTaskPriority("medium");
                        setNewTaskDate(new Date().toISOString().split("T")[0]);
                        setNewTaskTime(new Date().toTimeString().slice(0, 5));
                        setNewTaskCategory("General");
                        setIsAddModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm text-[11px] font-bold transition shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 capitalize tracking-wider"
                    >
                      <Plus size={20} />
                      Create First Task
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <Modal
          isOpen={isAddModalOpen}
          onClose={() => {
            setNewTask("");
            setNewTaskPriority("medium");
            setNewTaskDate(new Date().toISOString().split("T")[0]);
            setNewTaskTime(new Date().toTimeString().slice(0, 5));
            setNewTaskCategory("General");
            setIsAddModalOpen(false);
          }}
          headerVariant="orange"
          title="Create New Task"
          subtitle="Define your next milestone and stay organized"
          icon={<Plus size={24} strokeWidth={3} />}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex justify-end gap-3 w-full">
              <button
                onClick={() => {
                  setNewTask("");
                  setNewTaskPriority("medium");
                  setNewTaskDate(new Date().toISOString().split("T")[0]);
                  setNewTaskTime(new Date().toTimeString().slice(0, 5));
                  setNewTaskCategory("General");
                  setIsAddModalOpen(false);
                }}
                className="px-8 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:shadow-lg transform transition-all active:scale-95 text-sm"
              >

                Create Task
              </button>
            </div>
          }
        >
          <div className="space-y-5 px-1 pb-2">
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <AlertCircle size={16} className="text-[#FF7B1D]" />
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What needs to be done?"
                className={`w-full px-4 py-3 border rounded-sm focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 ${newTask.length > 250 ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#FF7B1D]'}`}
              />
              <div className="flex justify-end mt-1">
                <span className={`text-[10px] font-bold ${newTask.length > 250 ? 'text-red-500' : 'text-gray-400'}`}>
                  {newTask.length}/250 characters
                </span>
              </div>
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Flag size={16} className="text-[#FF7B1D]" />
                Priority <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["high", "medium", "low"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setNewTaskPriority(p)}
                    className={`py-3 rounded-sm font-bold text-[11px] uppercase tracking-widest transition-all border
              ${newTaskPriority === p
                        ? p === "high"
                          ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20"
                          : p === "medium"
                            ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20"
                            : "bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20"
                        : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
                      }
            `}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar size={16} className="text-[#FF7B1D]" />
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (selectedDate < today) {
                      toast.error("Due date cannot be in the past. Please select today or a future date.");
                      return;
                    }
                    setNewTaskDate(e.target.value);
                  }}

                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
                />
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Clock size={16} className="text-[#FF7B1D]" />
                  Due Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
                />
              </div>
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Layout size={16} className="text-[#FF7B1D]" />
                Task Category
              </label>

              <div className="relative">
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 appearance-none"
                >
                  {["General", "Work", "Personal", "Meeting", "Follow-up", "Documentation", "Research", "Development", "Design", "Testing", "Deployment"].map(
                    (cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    )
                  )}
                </select>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <MoreVertical size={16} className="rotate-90" />
                </div>
              </div>
            </div>
          </div>
        </Modal>


        {/* Edit modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          headerVariant="orange"
          title="Refine Task"
          subtitle="Update details to keep your workflow accurate"
          icon={<SquarePen size={24} strokeWidth={3} />}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex justify-end gap-3 w-full">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-8 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTask}
                className="flex items-center justify-center gap-2 px-10 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:shadow-lg transform transition-all active:scale-95 text-sm"
              >
                Save Changes
              </button>
            </div>
          }
        >
          <div className="space-y-5 px-1 pb-2">
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <AlertCircle size={16} className="text-[#FF7B1D]" />
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What needs to be done?"
                className={`w-full px-4 py-3 border rounded-sm focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 ${newTask.length > 250 ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#FF7B1D]'}`}
              />
              <div className="flex justify-end mt-1">
                <span className={`text-[10px] font-bold ${newTask.length > 250 ? 'text-red-500' : 'text-gray-400'}`}>
                  {newTask.length}/250 characters
                </span>
              </div>
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Flag size={16} className="text-[#FF7B1D]" />
                Select Priority <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["high", "medium", "low"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setNewTaskPriority(p)}
                    className={`py-3 rounded-sm font-bold text-[11px] uppercase tracking-widest transition-all border
              ${newTaskPriority === p
                        ? p === "high"
                          ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20"
                          : p === "medium"
                            ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20"
                            : "bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20"
                        : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
                      }
            `}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar size={16} className="text-[#FF7B1D]" />
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
                />
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Clock size={16} className="text-[#FF7B1D]" />
                  Due Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
                />
              </div>
            </div>

            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Layout size={16} className="text-[#FF7B1D]" />
                Task Category
              </label>

              <div className="relative">
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 appearance-none"
                >
                  {["General", "Work", "Personal", "Meeting", "Follow-up", "Documentation", "Research", "Development", "Design", "Testing", "Deployment"].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <MoreVertical size={16} className="rotate-90" />
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          headerVariant="simple"
          maxWidth="max-w-md"
          footer={
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all font-primary text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 font-primary text-xs uppercase tracking-widest"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Trash2 size={20} />
                )}
                {isLoading ? "Deleting..." : "Delete Now"}
              </button>
            </div>
          }
        >
          <div className="flex flex-col items-center text-center text-black font-primary">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={48} className="text-red-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Confirm Delete
            </h2>

            <p className="text-gray-600 mb-2 leading-relaxed">
              Are you sure you want to delete the task{" "}
              <span className="font-bold text-gray-800">"{taskToDelete?.title}"</span>?
            </p>

            <p className="text-xs text-red-500 italic">
              This action cannot be undone. All associated data will be permanently removed.
            </p>
          </div>
        </Modal>

        {/* View Details Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={taskToView?.title?.length > 40 ? `${taskToView.title.substring(0, 40)}...` : taskToView?.title}
          subtitle={`Task Details • ${taskToView?.category || 'General'}`}
          icon={<Layout size={24} />}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition text-xs uppercase tracking-widest font-primary"
              >
                Close Details
              </button>
            </div>
          }
        >
          {taskToView && (
            <div className="space-y-6 text-black bg-white font-primary py-4">


              {/* 2. Stats Grid (Moved to Top) */}
              <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-6 px-2">
                {/* Date */}
                <div className="bg-orange-50 p-3 rounded-sm border border-orange-100 flex flex-col items-center">
                  <p className="text-xs text-[#FF7B1D] capitalize font-bold tracking-wide mb-1">Due Date</p>
                  <p className="text-sm font-black text-gray-800">{new Date(taskToView.due_date).toLocaleDateString()}</p>
                </div>
                {/* Time */}
                <div className="bg-blue-50 p-3 rounded-sm border border-blue-100 flex flex-col items-center">
                  <p className="text-xs text-[#FF7B1D] capitalize font-bold tracking-wide mb-1">Due Time</p>
                  <p className="text-sm font-black text-gray-800">{taskToView.due_time?.slice(0, 5) || '--:--'}</p>
                </div>
                {/* Status */}
                <div className={`p-3 rounded-sm border flex flex-col items-center ${taskToView.completed ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                  <p className="text-xs text-[#FF7B1D] capitalize font-bold tracking-wide mb-1">Status</p>
                  <p className={`text-sm font-black capitalize ${taskToView.completed ? 'text-green-600' : 'text-gray-400'}`}>{taskToView.completed ? 'Completed' : 'Active'}</p>
                </div>
              </div>

              {/* 3. Task Title Section with Label */}
              <div className="space-y-3 px-2">
                <label className="flex items-center gap-2 text-sm font-black text-gray-800 capitalize tracking-wide">
                  <FileText size={16} className="text-[#FF7B1D]" />
                  Task Title
                </label>
                <div className="bg-gray-50 p-5 rounded-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-600 leading-relaxed max-h-[150px] overflow-y-auto custom-scrollbar">
                    {taskToView.title}
                  </p>
                </div>
              </div>

              {/* 4. Tags and Timestamp */}
              <div className="flex flex-col items-center gap-3 pt-2">
                <div className="flex justify-center gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-sm text-xs font-bold capitalize tracking-wide border border-gray-200">
                    {taskToView.category || 'General'}
                  </span>
                  <span className={`px-3 py-1 rounded-sm text-xs font-bold capitalize tracking-wide border ${taskToView.priority === 'high' ? 'bg-red-50 text-red-700 border-red-100' :
                    taskToView.priority === 'medium' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                      'bg-green-50 text-green-700 border-green-100'
                    }`}>
                    {taskToView.priority || 'Medium'} Priority
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                  <Clock size={12} />
                  Last Updated: {new Date(taskToView.updated_at || taskToView.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
