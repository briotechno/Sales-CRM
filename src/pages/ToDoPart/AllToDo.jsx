import React, { useState } from "react";
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
  Search,
  X,
} from "lucide-react";

export default function TodoPage() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Follow up with Client ABC",
      priority: "high",
      dueDate: "2025-11-20",
      dueTime: "10:00",
      completed: false,
      category: "Sales",
    },
    {
      id: 2,
      title: "Update CRM records",
      priority: "medium",
      dueDate: "2025-11-19",
      dueTime: "14:30",
      completed: false,
      category: "CRM",
    },
    {
      id: 3,
      title: "Prepare quarterly report",
      priority: "high",
      dueDate: "2025-11-21",
      dueTime: "09:00",
      completed: true,
      category: "Reports",
    },
    {
      id: 4,
      title: "Team meeting notes",
      priority: "low",
      dueDate: "2025-11-18",
      dueTime: "16:00",
      completed: false,
      category: "Admin",
    },
  ]);
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("General");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterType, setFilterType] = useState("Today");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskObj = {
        id: Date.now(),
        title: newTask,
        priority: newTaskPriority,
        dueDate: newTaskDate || new Date().toISOString().split("T")[0],
        dueTime: newTaskTime || "09:00",
        completed: false,
        category: newTaskCategory,
      };
      // Add new task at the beginning of the array
      setTasks([newTaskObj, ...tasks]);
      // Reset form
      setNewTask("");
      setNewTaskPriority("medium");
      setNewTaskDate("");
      setNewTaskTime("");
      setNewTaskCategory("General");
      setIsAddModalOpen(false);
    }
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-50";
      case "medium":
        return "text-orange-500 bg-orange-50";
      case "low":
        return "text-green-500 bg-green-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const activeTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-0 via-white to-orange-50 ml-4 p-0">
        {/* Header */}
        <div className="bg-white border-b ">
          <div className="max-w-8xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left: Title only */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  All To-Do Task
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700 text-sm" />
                  <span className="text-gray-400"></span> Additional /{" "}
                  <span className="text-[#FF7B1D] font-medium">To-Do</span>
                </p>
              </div>

              {/* Right: Filter + Add Button */}
              <div className="flex items-center gap-4">
                {/* Date Filter Dropdown */}
                <div className="flex items-center gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-3 border border-gray-200  rounded-sm hover:bg-gray-50 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Today">Today</option>
                    <option value="Yesterday">Yesterday</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="This Month">This Month</option>
                    <option value="Custom">Custom</option>
                  </select>

                  {/* Show Custom Date Range Only When Selected */}
                  {filterType === "Custom" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        className="px-5 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="text-gray-600">to</span>
                      <input
                        type="date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        className="px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  )}
                </div>
                {/* Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="text-gray-400" size={20} />
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-5 py-3 border border-gray-200  rounded-sm 
                       focus:border-orange-500 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                {/* Button */}
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
                >
                  <Plus size={24} />
                  Add New Task
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl ml-2 mt-4 mx-auto p-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-sm p-5 shadow-md border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {tasks.length}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Check className="text-orange-600" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-sm p-5 shadow-md border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {activeTasks.length}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Clock className="text-blue-600" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-sm p-5 shadow-md border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {completedTasks.length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Check className="text-green-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Active Tasks */}
          {activeTasks.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Clock className="text-orange-500 mr-2" size={28} />
                Active Tasks ({activeTasks.length})
              </h2>
              <div className="space-y-3">
                {activeTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-sm p-5 shadow-md hover:shadow-xl transition-all border-l-4 border-orange-500"
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-1 w-6 h-6 border-2 border-orange-500 rounded-full hover:bg-orange-100 transition-colors flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {task.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 items-center text-sm">
                          <span
                            className={`px-3 py-1 rounded-full font-medium ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            <Flag size={14} className="inline mr-1" />
                            {task.priority.toUpperCase()}
                          </span>
                          <span className="text-gray-500 flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {task.dueDate}
                          </span>
                          <span className="text-gray-500 flex items-center">
                            <Clock size={14} className="mr-1" />
                            {task.dueTime}
                          </span>
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                            {task.category}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-sm transition-colors flex-shrink-0"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Check className="text-green-500 mr-2" size={28} />
                Completed Tasks ({completedTasks.length})
              </h2>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-50 rounded-sm p-5 shadow-md border-l-4 border-green-500 opacity-75"
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        <Check size={16} className="text-white" />
                      </button>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-500 line-through mb-2">
                          {task.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 items-center text-sm">
                          <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full font-medium">
                            {task.category}
                          </span>
                          <span className="text-gray-400 flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {task.dueDate}
                          </span>
                          <span className="text-gray-400 flex items-center">
                            <Clock size={14} className="mr-1" />
                            {task.dueTime}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-sm transition-colors flex-shrink-0"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <div className="bg-white rounded-sm shadow-lg p-12 text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={40} className="text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No tasks found
              </h3>
              <p className="text-gray-500">
                Add a new task to get started with your productivity journey!
              </p>
            </div>
          )}
        </div>

        {/* Add Task Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-xl w-full max-w-2xl">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Plus size={28} />
                  Add New Task
                </h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-white hover:bg-orange-700 p-2 rounded-sm transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* Task Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="What needs to be done?"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Priority *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setNewTaskPriority("high")}
                      className={`py-3 px-4 rounded-sm font-semibold border-2 transition ${
                        newTaskPriority === "high"
                          ? "bg-red-500 text-white border-red-500"
                          : "bg-white text-red-500 border-red-200 hover:bg-red-50"
                      }`}
                    >
                      <Flag size={18} className="inline mr-2" />
                      High
                    </button>
                    <button
                      onClick={() => setNewTaskPriority("medium")}
                      className={`py-3 px-4 rounded-sm font-semibold border-2 transition ${
                        newTaskPriority === "medium"
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-orange-500 border-orange-200 hover:bg-orange-50"
                      }`}
                    >
                      <Flag size={18} className="inline mr-2" />
                      Medium
                    </button>
                    <button
                      onClick={() => setNewTaskPriority("low")}
                      className={`py-3 px-4 rounded-sm font-semibold border-2 transition ${
                        newTaskPriority === "low"
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-white text-green-500 border-green-200 hover:bg-green-50"
                      }`}
                    >
                      <Flag size={18} className="inline mr-2" />
                      Low
                    </button>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={newTaskDate}
                      onChange={(e) => setNewTaskDate(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Due Time *
                    </label>
                    <input
                      type="time"
                      value={newTaskTime}
                      onChange={(e) => setNewTaskTime(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 cursor-pointer"
                  >
                    <option value="General">General</option>
                    <option value="Sales">Sales</option>
                    <option value="CRM">CRM</option>
                    <option value="Reports">Reports</option>
                    <option value="Admin">Admin</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-sm hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className="
    px-8 py-3 rounded-sm font-semibold 
    bg-gradient-to-r from-orange-500 to-orange-600 
    text-white shadow-md transition 
    hover:from-orange-600 hover:to-orange-700 hover:shadow-lg
  "
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
