import React, { useCallback, useMemo, useState } from "react";
import {
  ADD_BUTTON,
  EMPTY_STATE,
  FILTER_LABELS,
  FILTER_OPTIONS,
  FILTER_WRAPPER,
  HEADER,
  ICON_WRAPPER,
  LABEL_CLASS,
  SELECT_CLASSES,
  STAT_CARD,
  STATS,
  STATS_GRID,
  TAB_ACTIVE,
  TAB_BASE,
  TAB_INACTIVE,
  TABS_WRAPPER,
  VALUE_CLASS,
  WRAPPER,
} from "../assets/dummy";
import { Calendar, FilterIcon, HomeIcon, PlusCircleIcon } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import TaskItem from "../components/TaskItem";
import axios from "axios";
import TaskModal from "../components/TaskModal";
import { TASKS_API } from "../config/api";

const Dashboard = () => {
  const { tasks, refreshTasks } = useOutletContext();
  const [showModel, setShowModel] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState("all");

  const stats = useMemo(
    () => ({
      total: tasks.length,
      lowPriority: tasks.filter((t) => t.priority?.toLowerCase() === "low")
        .length,
      mediumPriority: tasks.filter(
        (t) => t.priority?.toLowerCase() === "medium",
      ).length,
      highPriority: tasks.filter((t) => t.priority?.toLowerCase() === "high")
        .length,
      completed: tasks.filter(
        (t) =>
          t.completed === true ||
          t.completed === 1 ||
          (typeof t.completed === "string" &&
            t.completed.toLowerCase() === "yes"),
      ).length,
    }),
    [tasks],
  );

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        const isCompleted =
          task.status === "Completed" ||
          task.completed === true ||
          task.completed === 1 ||
          (typeof task.completed === "string" &&
            task.completed.toLowerCase() === "yes");

        switch (filter) {
          case "pending":
            return !isCompleted;
          case "completed":
            return isCompleted;
          case "today":
            return dueDate.toDateString() === today.toDateString();
          case "week":
            return dueDate >= today && dueDate <= nextWeek;
          case "high":
          case "medium":
          case "low":
            return task.priority?.toLowerCase() === filter;
          default:
            return true;
        }
      }),
    [tasks, filter],
  );

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
    <div className={WRAPPER}>
      {/* header */}
      <div className={HEADER}>
        <div className="flex gap-4 min-w-0">
          <div className="flex items-center justify-center shrink-0">
            <HomeIcon className="w-10 h-10 text-maintxt" />
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-xl md:text-3xl font-bold text-maintxt leading-tight">
              Task Overview
            </h1>
            <p className="text-sm text-maintxt/60 leading-tight ml-1">
              Manage your task efficiently
            </p>
          </div>
        </div>
        <button onClick={() => setShowModel(true)} className={ADD_BUTTON}>
          <PlusCircleIcon size={22} />
          Add New Task
        </button>
      </div>

      {/* stats grid */}
      <div className={STATS_GRID}>
        {STATS.map(
          ({
            key,
            label,
            icon: Icon,
            iconColor,
            borderColor,
            valueKey,
            textColor,
            gradient,
          }) => (
            <div key={key} className={`${STAT_CARD} ${borderColor}`}>
              <div className="flex items-center gap-2 md:gap-3">
                {Icon && (
                  <div className={`${ICON_WRAPPER} ${iconColor}`}>
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                )}

                <div className="min-w-0">
                  <p
                    className={`${VALUE_CLASS} ${
                      gradient
                        ? "bg-linear-to-r from-maintxt/70 to-two bg-clip-text text-transparent"
                        : textColor
                    }`}
                  >
                    {stats[valueKey]}
                  </p>
                  <p className={LABEL_CLASS}>{label}</p>
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      {/* contents */}
      <div className="space-y-3 md:space-y-4">
        {/* filter */}
        <div className={FILTER_WRAPPER}>
          <div className="flex items-center gap-2 min-w-0">
            <FilterIcon className="w-5 h-5 text-maintxt shrink-0" />
            <h2 className="text-base md:text-lg font-semibold text-maintxt truncate">
              {FILTER_LABELS[filter]}
            </h2>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={SELECT_CLASSES}
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>

          <div className={TABS_WRAPPER}>
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`${TAB_BASE} ${
                  filter === opt ? TAB_ACTIVE : TAB_INACTIVE
                }`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* task list */}
        <div className="space-y-3 md:space-y-4">
          {filteredTasks.length === 0 ? (
            <div className={EMPTY_STATE.wrapper}>
              <div className={EMPTY_STATE.iconWrapper}>
                <Calendar className="w-8 h-8 text-maintxt" />
              </div>
              <h3 className="text-lg font-semibold text-maintxt mb-1">
                No tasks found
              </h3>
              <p className="text-sm text-maintxt/50 mb-4">
                {filter === "all"
                  ? "Create your first task to get started"
                  : "No tasks match this filter"}
              </p>
              <button
                onClick={() => setShowModel(true)}
                className={EMPTY_STATE.btn}
              >
                Add new task
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task._id || task.id}
                task={task}
                onRefresh={refreshTasks}
                showCompleteCheckbox
                onEdit={() => {
                  setSelectedTask(task);
                  setShowModel(true);
                }}
              />
            ))
          )}
        </div>

        {/* add task desktop */}
        <div
          className="hidden md:flex items-center justify-center p-2 border-2 border-dashed border-two
         rounded-2xl hover:border-maintxt  text-one hover:text-maintxt bg-one/50 cursor-pointer transition-colors"
          onClick={() => setShowModel(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          <span className="font-medium">Add New Task</span>
        </div>
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

export default Dashboard;
