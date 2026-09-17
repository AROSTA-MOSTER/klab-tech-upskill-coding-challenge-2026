import React, { act, useEffect, useState } from "react";
import {
  getPriorityBadgeColor,
  getPriorityColor,
  MENU_OPTIONS,
  TI_CLASSES,
} from "../assets/dummy";
import { Calendar, CheckCircle2, Clock, MoreVerticalIcon } from "lucide-react";
import axios from "axios";
import { format, isToday } from "date-fns";
import TaskModal from "./TaskModal";
import { TASKS_API } from "../config/api";

const TaskItem = ({
  task,
  onRefresh,
  showCompleteCheckbox = true,
  onLogout,
}) => {
  const isTaskDone = (t) =>
    t?.status === "Completed" ||
    [true, 1, "yes", "true"].includes(
      typeof t?.completed === "string"
        ? t.completed.toLowerCase()
        : t?.completed,
    );

  const [isCompleted, setIsCompleted] = useState(() => isTaskDone(task));
  const [showEditModel, setShowEditModel] = useState(false);
  const [subtasks, setSubTasks] = useState(task.subtasks || []);

  useEffect(() => {
    setIsCompleted(isTaskDone(task));
  }, [task.completed, task.status]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");
    return { Authorization: `Bearer ${token}` };
  };

  const borderColor = isCompleted
    ? "border-green-500"
    : getPriorityColor(task.priority).split(" ")[0];

  const progress = subtasks.length
    ? (subtasks.filter((st) => st.completed).length / subtasks.length) * 100
    : 0;

  const taskId = task.id || task._id;

  const handleComplete = async () => {
    const nextCompleted = !isCompleted;
    const newStatus = nextCompleted ? "Completed" : "Pending";
    try {
      await axios.put(
        `${TASKS_API}/${taskId}`,
        { completed: nextCompleted, status: newStatus },
        { headers: getAuthHeaders() },
      );
      setIsCompleted(nextCompleted);
      onRefresh?.();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) onLogout?.();
    }
  };

  const handleAction = (action) => {
    setShowMenu(false);
    if (action === "edit") setShowEditModel(true);
    if (action === "delete") handleDelete();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${TASKS_API}/${taskId}`, {
        headers: getAuthHeaders(),
      });
      onRefresh?.();
    } catch (err) {
      if (err.response?.status === 401) onLogout?.();
    }
  };

  const handleSave = async (updatedTask) => {
    try {
      const payload = (({
        title,
        description,
        priority,
        dueDate,
        completed,
        status,
      }) => ({ title, description, priority, dueDate, completed, status }))(
        updatedTask,
      );

      await axios.put(`${TASKS_API}/${taskId}`, payload, {
        headers: getAuthHeaders(),
      });
      setShowEditModel(false);
      onRefresh?.();
    } catch (err) {
      if (err.response?.status === 401) onLogout?.();
    }
  };

  return (
    <>
      <div className={`${TI_CLASSES.wrapper} ${borderColor}`}>
        <div className="flex justify-between gap-2 sm:gap-4 items-stretch">
          {/* LEFT */}
          <div className="flex flex-col justify-between max-w-[60%]">
            {/* TOP */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3
                  className={`${TI_CLASSES.titleBase} ${
                    isCompleted
                      ? "line-through text-maintxt/60"
                      : "text-maintxt"
                  }`}
                >
                  {task.title}
                </h3>

                <span
                  className={`${TI_CLASSES.priorityBadge} ${getPriorityBadgeColor(
                    task.priority,
                  )} font-medium`}
                >
                  {task.priority}
                </span>
              </div>

              {task.description && (
                <p className={TI_CLASSES.description}>{task.description}</p>
              )}
            </div>

            {/* DATES */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs text-maintxt/50 mt-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {task.dueDate ? format(new Date(task.dueDate), "MMM dd") : "-"}
              </div>

              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {task.createdAt
                  ? `Created ${format(new Date(task.createdAt), "MMM dd")}`
                  : "No date"}
              </div>
            </div>
          </div>

          {/* ACTION BTN */}
          <div className="flex flex-col gap-2 items-end shrink-0">
            <button
              onClick={handleComplete}
              className={`${TI_CLASSES.actionBtn} ${
                isCompleted
                  ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 cursor-pointer"
                  : "bg-green-500/20 text-green-300 hover:bg-green-500/30 cursor-pointer"
              }`}
            >
              {isCompleted ? "Mark as Pending" : "Mark as Completed"}
            </button>

            <button
              onClick={() => setShowEditModel(true)}
              className={TI_CLASSES.secondaryBtn}
            >
              Edit Task
            </button>

            <button onClick={handleDelete} className={TI_CLASSES.dangerBtn}>
              Delete
            </button>
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={showEditModel}
        onClose={() => setShowEditModel(false)}
        taskToEdit={task}
        onSave={handleSave}
      />
    </>
  );
};

export default TaskItem;
