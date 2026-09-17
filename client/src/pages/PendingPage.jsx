import React, { useCallback, useMemo, useState } from "react";
import { ADD_BUTTON, layoutClasses, SORT_OPTIONS } from "../assets/dummy";
import {
  Clock,
  FilterIcon,
  ListCheckIcon,
  Plus,
  PlusCircleIcon,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import TaskItem from "../components/TaskItem";
import TaskModal from "../components/TaskModal";
import { TASKS_API } from "../config/api";

const PendingPage = () => {
  const { tasks = [], refreshTasks } = useOutletContext();
  const [sortBy, setSortBy] = useState("newest");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModel, setShowModel] = useState(false);

  const sortedPendingTasks = useMemo(() => {
    const list = Array.isArray(tasks) ? tasks : [];
    const filtered = list.filter((t) => {
      const isDone =
        t.status === "Completed" ||
        t.completed === true ||
        t.completed === 1 ||
        (typeof t.completed === "string" &&
          ["yes", "completed", "true"].includes(t.completed.toLowerCase()));
      return !isDone;
    });
    return filtered.sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      const order = { high: 3, medium: 2, low: 1 };
      return (order[b.priority?.toLowerCase()] || 0) - (order[a.priority?.toLowerCase()] || 0);
    });
  }, [tasks, sortBy]);

  const handleTaskSave = useCallback(async (taskData) => {
    try {
      const taskId = taskData.id || taskData._id;
      if (taskId) {
        const token = localStorage.getItem("token");
        await axios.put(`${TASKS_API}/${taskId}`, taskData, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      }
      refreshTasks();
      setShowModel(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error saving tasks: ", error);
    }
  }, [refreshTasks]);

  return (
    <div className={layoutClasses.container}>
      <div className={layoutClasses.headerWrapper}>
        <div
          className="flex flex-col sm:flex-row w-full sm:items-center justify-between bg-one/50
         rounded-3xl p-4 shadow-sm border border-one gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <ListCheckIcon className="w-10 h-10 text-maintxt shrink-0" />

            <div className="flex flex-col min-w-0">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-maintxt truncate">
                <span className="truncate">Pending Tasks</span>
              </h1>
              <p className="text-xs md:text-sm text-maintxt/50">
                {sortedPendingTasks.length} task
                {sortedPendingTasks.length !== 1 && "s"} needing your attention
              </p>
            </div>
          </div>
          <button onClick={() => setShowModel(true)} className={ADD_BUTTON}>
            <PlusCircleIcon size={22} />
            Add New Task
          </button>
        </div>

        <div className={layoutClasses.sortBox}>
          <div className="flex items-center gap-2 text-maintxt font-medium">
            <FilterIcon className="w-6 h-6 text-maintxt" />
            <span className="text-lg text-maintxt whitespace-nowrap">Sort by </span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={layoutClasses.select}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Priority</option>
          </select>

          <div className={layoutClasses.tabWrapper}>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={layoutClasses.tabButton(sortBy === opt.id)}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sortedPendingTasks.length === 0 ? (
          <div className={layoutClasses.emptyState}>
            <div className="max-w-xs mx-auto py-6">
              <div className={layoutClasses.emptyIconBg}>
                <Clock className="w-8 h-8 text-maintxt" />
              </div>

              <h3 className="text-lg font-semibold text-maintxt mb-2">
                All caught up!
              </h3>
              <p className="text-sm text-maintxt/50 mb-4">
                No pending tasks - Greate Work!
              </p>
              <button
                onClick={() => setShowModel(true)}
                className={layoutClasses.emptyBtn}
              >
                Create New Task
              </button>
            </div>
          </div>
        ) : (
          sortedPendingTasks.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              showCompleteCheckbox
              onRefresh={refreshTasks}
            />
          ))
        )}
      </div>

      <TaskModal
        isOpen={!!selectedTask || showModel}
        onClose={() => {
          setShowModel(false);
          setSelectedTask(null);
        }}
        taskToEdit={selectedTask}
        onSave={handleTaskSave}
      />
    </div>
  );
};

export default PendingPage;
