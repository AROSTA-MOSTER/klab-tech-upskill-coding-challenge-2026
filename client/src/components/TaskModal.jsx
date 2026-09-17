import React, { useCallback, useEffect, useState } from "react";
import {
  baseControlClasses,
  DEFAULT_TASK,
  priorityStyles,
} from "../assets/dummy";
import {
  AlignLeft,
  Calendar,
  CheckCircle,
  FlagIcon,
  PlusCircleIcon,
  Save,
  X,
} from "lucide-react";
import { TASKS_API } from "../config/api";

const TaskModal = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
  const [taskData, setTaskData] = useState(DEFAULT_TASK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!isOpen) return;
    if (taskToEdit) {
      const isDone =
        taskToEdit.status === "Completed" ||
        taskToEdit.completed === true ||
        taskToEdit.completed === 1 ||
        String(taskToEdit.completed).toLowerCase() === "yes" ||
        String(taskToEdit.completed).toLowerCase() === "true";

      setTaskData({
        ...DEFAULT_TASK,
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        priority: taskToEdit.priority || "Low",
        dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.split("T")[0] : "",
        completed: isDone,
        status: isDone ? "Completed" : "Pending",
        id: taskToEdit.id || taskToEdit._id,
      });
    } else {
      setTaskData(DEFAULT_TASK);
    }
    setError(null);
  }, [isOpen, taskToEdit]);

  const handleChange = useCallback(async (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  });

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (taskData.dueDate < today) {
        setError("Due date cannot be in the past.");
        return;
      }
      setLoading(true);
      setError(true);

      try {
        const taskId = taskData.id || taskData._id;
        const isEdit = Boolean(taskId);
        const url = isEdit ? `${TASKS_API}/${taskId}` : TASKS_API;
        const resp = await fetch(url, {
          method: isEdit ? "PUT" : "POST",
          headers: getHeaders(),
          body: JSON.stringify(taskData),
        });
        if (!resp.ok) {
          if (resp.status === 401) return onLogout?.();
          const err = await resp.json();
          throw new Error(err.message || "Failed to save task");
        }
        const saved = await resp.json();
        onSave?.(saved);
        onClose();
      } catch (err) {
        console.error(err);
        setError(err.message || "An unexpected error occured");
      } finally {
        setLoading(false);
      }
    },
    [taskData, today, getHeaders, onLogout, onSave, onClose],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-basedark/70 z-50 flex items-center justify-center p-4">
      <div
        className="bg-one/70 border border-one rounded-3xl max-w-md w-full shadow-lg relative p-6
       animate-fadeIn"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-maintxt flex items-center gap-2">
            {taskData.id ? (
              <Save className="text-maintxt w-5 h-5" />
            ) : (
              <PlusCircleIcon className="text-maintxt w-5 h-5" />
            )}
            {taskData.id ? "Edit task" : "Create New Task"}
          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-two bg-two/70 rounded-xl transition-colors text-white hover:text-maintxt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* from to fill to create a task */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              className="text-sm text-red-600 bg-transparent p-3 rounded-xl
           border border-red-100"
            >
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-maintxt mb-1">
              Task Title
            </label>
            <div
              className="flex items-center bg-two/70 border border-one rounded-2xl px-3 py-2.5 focus-within:ring-2
             focus-within:ring-maintxt focus-within:border-one transition-all duration-200"
            >
              <input
                type="text"
                name="title"
                required
                value={taskData.title}
                onChange={handleChange}
                className="w-full focus:outline-none text-sm text-maintxt"
                placeholder="Enter task title"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-maintxt mb-1">
              <AlignLeft className="w-4 h-4 text-maintxt" /> Description
            </label>

            <textarea
              name="description"
              row="3"
              onChange={handleChange}
              value={taskData.description}
              className={baseControlClasses}
              placeholder="Add details about your task"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-maintxt mb-1">
                <FlagIcon className="w-4 h-4 text-maintxt" /> Priority
              </label>
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                className={`${baseControlClasses} ${
                  priorityStyles[taskData.priority]
                }`}
              >
                <option className="bg-two">Low</option>
                <option className="bg-two">Medium</option>
                <option className="bg-two">High</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-maintxt mb-1">
                <Calendar className="w-4 h-4 text-maintxt" /> Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                required
                min={today}
                value={taskData.dueDate}
                onChange={handleChange}
                className={baseControlClasses}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-maintxt mb-1">
              <CheckCircle className="w-4 h-4 text-maintxt" /> Status
            </label>
            <div className="flex gap-4">
              {[
                { val: "Pending", label: "Pending" },
                { val: "Completed", label: "Completed" },
              ].map(({ val, label }) => (
                <label key={val} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    className="h-4 w-4 accent-one border-one focus:ring-one cursor-pointer"
                    name="status"
                    value={val}
                    checked={taskData.status === val}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setTaskData((prev) => ({
                        ...prev,
                        status: newStatus,
                        completed: newStatus === "Completed",
                      }));
                    }}
                  />
                  <span className="ml-2 text-maintxt text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            className="w-full bg-linear-to-r from-two to-one text-white font-medium
             py-2.5 px-4 rounded-xl hover:rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50
             hover:shadow-md shadow-sm cursor-pointer transition-all duration-300"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              "Saving..."
            ) : taskData.id ? (
              <>
                <Save className="w-4 h-4" />
                Update Task
              </>
            ) : (
              <>
                <PlusCircleIcon className="w-4 h-4" />
                Create Task
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
