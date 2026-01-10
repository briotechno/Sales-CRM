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
  const [filterType, setFilterType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const dropdownRef = useRef(null);

  // API Hooks
  const { data, isLoading } = useGetTasksQuery({
    priority: filterPriority,
    search: searchTerm,
    timeframe: filterType,
  });

  const [createTask] = useCreateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [toggleTaskStatus] = useToggleTaskStatusMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const tasks = data?.tasks || [];

  const addTask = async () => {
    if (!newTask.trim()) {
      toast.error("Please enter a task title");
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <DashboardLayout>
      <div className="ml-6 min-h-screen bg-gray-50/50 flex flex-col font-primary">
        {/* Header Section */}
        <div className="bg-white border-b sticky top-0 z-30">
          <div className="max-w-8xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-400 text-sm" />
                  Additional / <span className="text-[#FF7B1D] font-medium">To-Do</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Priority Filter */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`p-3 rounded-sm border transition-all shadow-sm ${isFilterOpen || filterPriority !== "all" || filterType !== "All"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <Filter size={20} />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                      <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Filter by Priority & Period</p>

                      </div>
                      <div className="p-2 space-y-3">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 mb-2 px-2">PRIORITY</p>
                          <div className="space-y-1">
                            {["all", "high", "medium", "low"].map((p) => (
                              <button
                                key={p}
                                onClick={() => { setFilterPriority(p); setIsFilterOpen(false); }}
                                className={`block w-full text-left px-3 py-2 text-xs rounded-sm transition-colors ${filterPriority === p
                                  ? "bg-orange-50 text-orange-600 font-bold"
                                  : "text-gray-700 hover:bg-gray-50"
                                  }`}
                              >
                                {p === "all" ? "All Priorities" : p.charAt(0).toUpperCase() + p.slice(1) + " Priority"}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="border-t pt-3">
                          <p className="text-[10px] font-bold text-gray-400 mb-2 px-2">TIMEFRAME</p>
                          <div className="space-y-1">
                            {["All", "Today", "Yesterday", "Last 7 Days", "This Month"].map((t) => (
                              <button
                                key={t}
                                onClick={() => { setFilterType(t); setIsFilterOpen(false); }}
                                className={`block w-full text-left px-3 py-2 text-xs rounded-sm transition-colors ${filterType === t
                                  ? "bg-orange-50 text-orange-600 font-bold"
                                  : "text-gray-700 hover:bg-gray-50"
                                  }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]/20 focus:border-[#FF7B1D] text-sm md:w-64 transition-all"
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:shadow-lg transition-all flex items-center gap-2 font-bold shadow-md"
                >
                  <Plus size={20} />
                  New Task
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto py-6 font-primary w-full flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
              <p className="text-gray-500 font-medium">Loading your tasks...</p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <NumberCard
                  title="Total Tasks"
                  number={tasks.length}
                  icon={<Layout className="text-blue-600" size={24} />}
                  iconBgColor="bg-blue-100"
                  lineBorderClass="border-blue-500"
                />
                <NumberCard
                  title="High Priority"
                  number={tasks.filter(t => t.priority === "high").length}
                  icon={<Flag className="text-red-600" size={24} />}
                  iconBgColor="bg-red-100"
                  lineBorderClass="border-red-500"
                />
                <NumberCard
                  title="Active Tasks"
                  number={activeTasks.length}
                  icon={<Clock className="text-orange-600" size={24} />}
                  iconBgColor="bg-orange-100"
                  lineBorderClass="border-orange-500"
                />
                <NumberCard
                  title="Completed"
                  number={completedTasks.length}
                  icon={<CheckCircle className="text-green-600" size={24} />}
                  iconBgColor="bg-green-100"
                  lineBorderClass="border-green-500"
                />
              </div>

              {tasks.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                  {/* Active Tasks Column */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-2 px-2">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-orange-100 rounded-xl shadow-inner">
                          <Clock className="text-orange-600" size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Tasks</h2>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Tasks to be done</p>
                        </div>
                      </div>
                      <span className="px-4 py-1.5 bg-orange-600 text-white text-sm rounded-full font-black shadow-lg shadow-orange-600/20">
                        {activeTasks.length}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activeTasks.map((task) => (
                        <div
                          key={task.id}
                          className="group bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 relative overflow-hidden"
                        >
                          <div className={`absolute top-0 left-0 bottom-0 w-2 ${task.priority === 'high' ? 'bg-red-500' :
                            task.priority === 'medium' ? 'bg-orange-500' :
                              'bg-green-500'
                            }`}></div>

                          <div className="space-y-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${task.priority === 'high' ? 'bg-red-50 text-red-600' :
                                  task.priority === 'medium' ? 'bg-orange-50 text-orange-600' :
                                    'bg-green-50 text-green-600'
                                  }`}>
                                  {task.priority || 'Medium'}
                                </span>
                                <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-gray-100">
                                  {task.category || 'General'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleEdit(task)}
                                  className="p-2 text-orange-600 hover:bg-orange-50 rounded-sm transition-colors"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  onClick={() => confirmDelete(task)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-black text-gray-900 leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
                                {task.title}
                              </h3>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-[12px] font-black text-gray-500 uppercase tracking-tight bg-gray-100/50 px-2.5 py-1.5 rounded-lg">
                                  <Calendar size={16} className="text-orange-500" />
                                  {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-1.5 text-[12px] font-black text-gray-500 uppercase tracking-tight bg-gray-100/50 px-2.5 py-1.5 rounded-lg">
                                  <Clock size={16} className="text-orange-500" />
                                  {task.due_time?.slice(0, 5)}
                                </div>
                              </div>

                              <button
                                onClick={() => handleToggleStatus(task.id)}
                                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-lg ${task.priority === 'high' ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white hover:shadow-red-500/20' :
                                  task.priority === 'medium' ? 'bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white hover:shadow-orange-500/20' :
                                    'bg-green-50 text-green-500 hover:bg-green-500 hover:text-white hover:shadow-green-500/20'
                                  }`}
                              >
                                <Check size={20} className="stroke-[3px]" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {activeTasks.length === 0 && (
                        <div className="md:col-span-2 text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                          </div>
                          <h3 className="text-lg font-black text-gray-900">Zero Active Tasks</h3>
                          <p className="text-sm text-gray-400 font-bold max-w-[200px] mx-auto mt-1">You're all caught up! Enjoy your free time.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Completed Tasks Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-2 px-2">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-green-100 rounded-xl shadow-inner">
                          <CheckCircle className="text-green-600" size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Completed</h2>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Successfully finished</p>
                        </div>
                      </div>
                      <span className="px-4 py-1.5 bg-green-600 text-white text-sm rounded-full font-black shadow-lg shadow-green-600/20">
                        {completedTasks.length}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-70 hover:opacity-100 transition-opacity duration-500">
                      {completedTasks.map((task) => (
                        <div
                          key={task.id}
                          className="group bg-gray-50/50 rounded-3xl border border-gray-100 p-6 transition-all duration-300 relative overflow-hidden flex items-start gap-4 hover:bg-white hover:shadow-xl hover:shadow-green-500/5"
                        >
                          <button
                            onClick={() => handleToggleStatus(task.id)}
                            className="mt-1 flex-shrink-0 w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20 hover:scale-110 active:scale-95 transition-all"
                          >
                            <Check size={16} strokeWidth={4} />
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-md font-bold text-gray-400 line-through truncate group-hover:text-gray-500 transition-colors">
                                {task.title}
                              </h3>
                              <button
                                onClick={() => confirmDelete(task)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                              <span className="bg-white text-gray-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-gray-100 shadow-sm">
                                {task.category || 'General'}
                              </span>
                              <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm">
                                <Calendar size={12} className="text-green-500/50" />
                                Done on {new Date(task.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {completedTasks.length === 0 && (
                        <div className="md:col-span-2 text-center py-16 bg-white/50 rounded-3xl border-2 border-dashed border-gray-100">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <AlertCircle className="w-8 h-8 text-gray-300" />
                          </div>
                          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest italic">No completions yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100 mt-6 shadow-sm overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                  <div className="relative z-10 text-black">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 w-32 h-32 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner shadow-white border-2 border-white rotate-3 group-hover:rotate-6 transition-transform duration-500">
                      <CheckCircle className="w-16 h-16 text-orange-500" strokeWidth={1.5} />
                    </div>

                    <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                      Master Your Day
                    </h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-10 text-lg font-medium leading-relaxed italic">
                      {searchTerm || filterPriority !== "all" || filterType !== "All"
                        ? "We couldn't find any tasks matching your filters. Time for a broader view!"
                        : "Your workspace is pristine. Ready to conquer your next big objective?"}
                    </p>

                    <div className="flex items-center justify-center gap-4">
                      {searchTerm || filterPriority !== "all" || filterType !== "All" ? (
                        <button
                          onClick={() => { setSearchTerm(""); setFilterPriority("all"); setFilterType("All"); }}
                          className="px-10 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 hover:shadow-2xl transition-all active:scale-95 text-sm uppercase tracking-widest"
                        >
                          Reset Filters
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsAddModalOpen(true)}
                          className="px-12 py-4 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-700 hover:shadow-2xl hover:shadow-orange-600/20 transition-all active:scale-95 text-sm uppercase tracking-widest"
                        >
                          Add Your First Task
                        </button>
                      )}
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
            <div className="flex justify-end gap-3 w-full bg-gray-50 py-5 rounded-b-3xl border-t border-gray-100">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-6 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all font-primary"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all font-primary"
              >
                Create Task
              </button>
            </div>
          }
        >
          <div className="space-y-6 px-2">

            {/* Task Title */}
            <div>
              <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                <AlertCircle size={14} className="text-orange-500" />
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold text-gray-700 placeholder:text-gray-300 shadow-inner"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                <Flag size={14} className="text-orange-500" />
                Priority <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["high", "medium", "low"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setNewTaskPriority(p)}
                    className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all
              ${newTaskPriority === p
                        ? p === "high"
                          ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                          : p === "medium"
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                            : "bg-green-500 text-white shadow-lg shadow-green-500/20"
                        : "bg-gray-50 text-gray-400 hover:bg-white hover:shadow-sm border border-gray-100"
                      }
            `}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  <Calendar size={14} className="text-orange-500" />
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold text-gray-700 shadow-inner"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  <Clock size={14} className="text-orange-500" />
                  Due Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold text-gray-700 shadow-inner"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                <Layout size={14} className="text-orange-500" />
                Task Category
              </label>

              <div className="relative">
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold text-gray-700 appearance-none shadow-inner"
                >
                  {["General", "Sales", "CRM", "Reports", "Admin", "Marketing", "Support"].map(
                    (cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    )
                  )}
                </select>

                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
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
            <div className="flex justify-end gap-3 w-full bg-gray-50/50 p-4 rounded-b-3xl mt-6 border-t border-gray-100">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-8 py-3 rounded-2xl text-gray-600 font-black hover:bg-white hover:shadow-sm transition-all text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTask}
                className="px-10 py-3 rounded-2xl bg-orange-600 text-white font-black hover:bg-orange-700 hover:shadow-xl hover:shadow-orange-600/20 transition-all text-xs uppercase tracking-widest shadow-lg shadow-orange-600/10 active:scale-95"
              >
                Save Changes
              </button>
            </div>
          }
        >
          <div className="space-y-8 p-2">
            <div>
              <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                <AlertCircle size={16} className="text-orange-500" />
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold text-gray-700 placeholder:text-gray-300 shadow-inner"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                <Flag size={16} className="text-orange-500" />
                Select Priority <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                {["high", "medium", "low"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setNewTaskPriority(p)}
                    className={`py-4 px-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${newTaskPriority === p
                      ? p === 'high' ? 'bg-red-500 text-white shadow-xl shadow-red-500/20' :
                        p === 'medium' ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' :
                          'bg-green-500 text-white shadow-xl shadow-green-500/20'
                      : 'bg-gray-50 text-gray-400 hover:bg-white hover:shadow-sm border border-gray-100'
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                  <Calendar size={16} className="text-orange-500" />
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold text-gray-700 shadow-inner"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                  <Clock size={16} className="text-orange-500" />
                  Due Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold text-gray-700 shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                <Layout size={16} className="text-orange-500" />
                Task Category
              </label>
              <div className="relative group/select">
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold text-gray-700 appearance-none shadow-inner"
                >
                  {["General", "Sales", "CRM", "Reports", "Admin", "Marketing", "Support"].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within/select:text-orange-500 transition-colors">
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