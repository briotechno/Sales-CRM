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
  Pencil,
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
  const [newTaskTime, setNewTaskTime] = useState("09:00");
  const [newTaskCategory, setNewTaskCategory] = useState("General");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState("all");
  const [dateFilter, setDateFilter] = useState("All");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPriorityFilterOpen, setIsPriorityFilterOpen] = useState(false);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
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
    priority: filterPriority,
    search: searchTerm,
    dateFrom,
    dateTo,
  });

  const [createTask] = useCreateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [toggleTaskStatus] = useToggleTaskStatusMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const tasks = data?.tasks || [];
  const summary = data?.summary || { total: 0, highPriority: 0, active: 0, completed: 0 };

  const addTask = async () => {
    if (!newTask.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(newTaskDate);

    if (selectedDate < today) {
      toast.error("Due date cannot be in the past. Please select today or a future date.");
      return;
    }

    try {
      const newTaskObj = {
        title: newTask,
        priority: newTaskPriority,
        due_date: newTaskDate,
        due_time: newTaskTime,
        category: newTaskCategory,
      };

      await createTask(newTaskObj).unwrap();

      toast.success("Task created successfully!");

      // Reset form
      setNewTask("");
      setNewTaskPriority("medium");
      setNewTaskDate(new Date().toISOString().split("T")[0]);
      setNewTaskTime("09:00");
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
    setDateFilter("All");
    setCustomStart("");
    setCustomEnd("");
  };

  const inputStyles =
    "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 shadow-sm font-semibold";

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const hasActiveFilters =
    searchTerm || filterPriority !== "all" || dateFilter !== "All";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white border-b sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Tasks</h1>
                <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1.5">
                  <FiHome className="text-gray-400" size={14} />
                  Additional / <span className="text-[#FF7B1D] font-medium">To-Do</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Priority Filter */}
                <div className="relative" ref={priorityDropdownRef}>
                  <button
                    onClick={() => setIsPriorityFilterOpen(!isPriorityFilterOpen)}
                    className={`p-2 rounded-sm border transition shadow-sm ${isPriorityFilterOpen || filterPriority !== "all"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <Filter size={18} />
                  </button>

                  {isPriorityFilterOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                      <div className="py-1">
                        {["all", "high", "medium", "low"].map((p) => (
                          <button
                            key={p}
                            onClick={() => {
                              setFilterPriority(p);
                              setIsPriorityFilterOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${filterPriority === p
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {p === "all" ? "All Priorities" : p.charAt(0).toUpperCase() + p.slice(1) + " Priority"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Date Filter */}
                <div className="relative" ref={dateDropdownRef}>
                  <button
                    onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
                    className={`p-2 rounded-sm border transition shadow-sm ${isDateFilterOpen || dateFilter !== "All"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <Calendar size={18} />
                  </button>

                  {isDateFilterOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                      <div className="py-1">
                        {["All", "Today", "Yesterday", "Last 7 Days", "This Month", "Custom"].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setDateFilter(option);
                              setIsDateFilterOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${dateFilter === option
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Show Custom Date Range Only When Selected */}
                {dateFilter === "Custom" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="px-2 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm shadow-sm"
                    />
                    <span className="text-gray-400 text-xs font-bold">to</span>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="px-2 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm shadow-sm"
                    />
                  </div>
                )}

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm w-64 shadow-sm"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-sm font-bold transition shadow-md text-sm active:scale-95 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                >
                  <Plus size={18} />
                  NEW TASK
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4">
          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap items-center justify-between bg-orange-50 border border-orange-200 rounded-sm p-3 gap-3 animate-fadeIn">
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="text-orange-600" size={16} />
                <span className="text-sm font-bold text-orange-800 uppercase tracking-wider">
                  ACTIVE FILTERS:
                </span>
                {searchTerm && <span className="text-xs bg-white px-3 py-1 rounded-sm border border-orange-200 text-orange-700 shadow-sm font-bold">Search: "{searchTerm}"</span>}
                {filterPriority !== "all" && <span className="text-xs bg-white px-3 py-1 rounded-sm border border-orange-200 text-orange-700 shadow-sm font-bold">Priority: {filterPriority.toUpperCase()}</span>}
                {dateFilter !== "All" && dateFilter !== "Custom" && <span className="text-xs bg-white px-3 py-1 rounded-sm border border-orange-200 text-orange-700 shadow-sm font-bold">Period: {dateFilter}</span>}
                {dateFilter === "Custom" && customStart && <span className="text-xs bg-white px-3 py-1 rounded-sm border border-orange-200 text-orange-700 shadow-sm font-bold">From: {customStart}</span>}
                {dateFilter === "Custom" && customEnd && <span className="text-xs bg-white px-3 py-1 rounded-sm border border-orange-200 text-orange-700 shadow-sm font-bold">To: {customEnd}</span>}
              </div>
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-orange-300 text-orange-600 rounded-sm hover:bg-orange-100 transition shadow-sm text-xs font-bold active:scale-95 uppercase"
              >
                <X size={14} />
                Clear All
              </button>
            </div>
          )}
        </div>

        <div className="max-w-8xl mx-auto p-4 mt-0 font-primary w-full flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
              <p className="text-gray-500 font-medium">Loading your tasks...</p>
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
                  {/* All Tasks Grid - 4 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`group bg-white rounded-lg border-l-4 ${task.completed
                          ? 'border-l-green-500 border-r border-t border-b border-green-200 opacity-90 hover:opacity-100'
                          : task.priority === 'high' ? 'border-l-red-500 border-r border-t border-b border-gray-200' :
                            task.priority === 'medium' ? 'border-l-orange-500 border-r border-t border-b border-gray-200' :
                              'border-l-green-500 border-r border-t border-b border-gray-200'
                          } p-4 hover:shadow-md transition-all duration-200`}
                      >
                        <div className="space-y-3">
                          {/* Header with badges */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {/* Status Badge */}
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${task.completed
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-100 text-orange-700'
                                }`}>
                                {task.completed ? 'Completed' : 'Active'}
                              </span>

                              {/* Priority Badge - only for active tasks */}
                              {!task.completed && (
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${task.priority === 'high' ? 'bg-red-50 text-red-600' :
                                  task.priority === 'medium' ? 'bg-orange-50 text-orange-600' :
                                    'bg-green-50 text-green-600'
                                  }`}>
                                  {task.priority || 'Medium'}
                                </span>
                              )}
                            </div>

                            {/* Actions Dropdown */}
                            <div className="flex items-center gap-1">
                              {!task.completed && (
                                <button
                                  onClick={() => handleEdit(task)}
                                  className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                  title="Edit"
                                >
                                  <Pencil size={14} />
                                </button>
                              )}
                              <button
                                onClick={() => confirmDelete(task)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Category */}
                          <div>
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[9px] font-medium uppercase inline-block">
                              {task.category || 'General'}
                            </span>
                          </div>

                          {/* Task Title */}
                          <h3 className={`text-sm font-bold leading-tight line-clamp-2 min-h-[2.5rem] ${task.completed ? 'text-gray-600 line-through' : 'text-gray-900'
                            }`}>
                            {task.title}
                          </h3>

                          {/* Date and Time */}
                          <div className="flex flex-col gap-1.5 text-[11px] text-gray-500 pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={12} className="text-orange-500 flex-shrink-0" />
                              <span className="font-medium">
                                {task.completed
                                  ? `Done: ${new Date(task.updated_at || task.due_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`
                                  : `Due: ${new Date(task.due_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`
                                }
                              </span>
                            </div>
                            {!task.completed && task.due_time && (
                              <div className="flex items-center gap-1.5">
                                <Clock size={12} className="text-orange-500 flex-shrink-0" />
                                <span className="font-medium">{task.due_time?.slice(0, 5)}</span>
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          {!task.completed && (
                            <button
                              onClick={() => handleToggleStatus(task.id)}
                              className="w-full mt-2 py-2 text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded transition-colors flex items-center justify-center gap-1.5"
                            >
                              <Check size={14} strokeWidth={2.5} />
                              Mark Complete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="group relative">
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg p-16 text-center border-2 border-dashed border-gray-200">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-orange-100">
                        <CheckCircle className="w-10 h-10 text-orange-500" strokeWidth={2} />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Master Your Day
                      </h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm font-normal leading-relaxed">
                        {searchTerm || filterPriority !== "all" || dateFilter !== "All"
                          ? "We couldn't find any tasks matching your filters. Time for a broader view!"
                          : "Your workspace is pristine. Ready to conquer your next big objective?"}
                      </p>

                      <div className="flex items-center justify-center gap-3">
                        {searchTerm || filterPriority !== "all" || dateFilter !== "All" ? (
                          <button
                            onClick={clearAllFilters}
                            className="px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-all text-sm"
                          >
                            Reset Filters
                          </button>
                        ) : (
                          <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-sm font-bold transition shadow-md text-sm active:scale-95 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                          >
                            <Plus size={18} />
                            NEW TASK
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          headerVariant="orange"
          title="Create New Task"
          subtitle="Define your next milestone and stay organized"
          icon={<Plus size={24} strokeWidth={3} />}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex justify-end gap-3 w-full">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-8 py-2.5 rounded-sm border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:shadow-lg transform transition-all active:scale-95 text-sm"
              >
                <Plus size={18} />
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
              />
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
                    className={`py-3 rounded-lg font-bold text-[11px] uppercase tracking-widest transition-all border-2
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
                  min={new Date().toISOString().split('T')[0]}
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 appearance-none"
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
          icon={<Pencil size={24} strokeWidth={3} />}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex justify-end gap-3 w-full">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-8 py-2.5 rounded-sm border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all text-sm"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
              />
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
                    className={`py-3 rounded-lg font-bold text-[11px] uppercase tracking-widest transition-all border-2
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 appearance-none"
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
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-50"
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
          <div className="flex flex-col items-center text-center text-black">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <AlertCircle size={48} className="text-red-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Confirm Delete
            </h2>

            <p className="text-gray-600 mb-2 leading-relaxed">
              Are you sure you want to delete the designation{" "}
              <span className="font-bold text-gray-800">"{taskToDelete?.title}"</span>?
            </p>

            <p className="text-sm text-red-500 italic">
              This action cannot be undone. All associated data will be permanently removed.
            </p>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}