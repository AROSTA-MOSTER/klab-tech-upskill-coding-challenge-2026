import React, { useCallback, useMemo, useState } from "react";
import { ADD_BUTTON, CT_CLASSES, SORT_OPTIONS } from "../assets/dummy";
import { CheckCircle2, FilterIcon, PlusCircleIcon } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import TaskItem from "../components/TaskItem";
import TaskModal from "../components/TaskModal";
import { TASKS_API } from "../config/api";

const CompletePage = () => {
  const { tasks = [], refreshTasks } = useOutletContext();
  const [sortBy, setSortBy] = useState("newest");
  const [showModel, setShowModel] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const sortedCompletedTasks = useMemo(() => {
    return tasks
      .filter((task) =>
        task.status === "Completed" ||
        [true, 1, "yes"].includes(
          typeof task.completed === "string"
            ? task.completed.toLowerCase()
            : task.completed,
        ),
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "priority":
            const order = { high: 3, medium: 2, low: 1 };
            return (
              (order[b.priority?.toLowerCase()] || 0) -
              (order[a.priority?.toLowerCase()] || 0)
            );
          default:
            return 0;
        }
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
    <div className={CT_CLASSES.page}>
      {/* header */}
      <div className={CT_CLASSES.header}>
        <div className={CT_CLASSES.titleWrapper}>
          {/* LEFT: ICON + TEXT */}
          <div className="flex items-center gap-3 min-w-0">
            <CheckCircle2 className="w-10 h-10 text-maintxt shrink-0" />

            <div className="flex flex-col min-w-0">
              <h1 className={CT_CLASSES.title}>
                <span className="truncate">Completed Tasks</span>
              </h1>
              <p className={CT_CLASSES.subtitle}>
                {sortedCompletedTasks.length} task
                {sortedCompletedTasks.length !== 1 && "s"} marked as completed
              </p>
            </div>
          </div>

          {/* RIGHT: ADD BUTTON */}
          <button onClick={() => setShowModel(true)} className={ADD_BUTTON}>
            <PlusCircleIcon size={22} />
            Add New Task
          </button>
        </div>

        {/* sort control */}
        <div className={CT_CLASSES.sortContainer}>
          <div className={CT_CLASSES.sortBox}>
            <div className={CT_CLASSES.filterLabel}>
              <FilterIcon className="w-6 h-6 text-maintxt" />
              <span className="text-lg text-maintxt whitespace-nowrap">
                Sort by
              </span>
            </div>

            {/* mobile */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={CT_CLASSES.select}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* desktop */}
            <div className={CT_CLASSES.btnGroup}>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={[
                    CT_CLASSES.btnBase,
                    sortBy === opt.id
                      ? CT_CLASSES.btnActive
                      : CT_CLASSES.btnInactive,
                  ].join(" ")}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* task list */}
      <div className={CT_CLASSES.list}>
        {sortedCompletedTasks.length === 0 ? (
          <div className={CT_CLASSES.emptyState}>
            <div className={CT_CLASSES.emptyIconWrapper}>
              <CheckCircle2 className="w-8 h-8 text-maintxt" />
            </div>
            <h3 className={CT_CLASSES.emptyTitle}>No completed tasks yet!</h3>
            <p className={CT_CLASSES.emptyText}>
              Complete some tasks they will appear here.
            </p>
          </div>
        ) : (
          sortedCompletedTasks.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onRefresh={refreshTasks}
              showCompleteCheckbox={false}
              className="opacity-90 hover:opacity-100 transition-opacity text-sm md:text-base"
            />
          ))
        )}
      </div>

      {/* modal */}
      <TaskModal
        isOpen={showModel || !!selectedTask}
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

export default CompletePage;
