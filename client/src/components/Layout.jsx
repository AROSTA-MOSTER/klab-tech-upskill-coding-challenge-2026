import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { Circle, Clock } from "lucide-react";
import { TASKS_API } from "../config/api";

const Layout = ({ onLogout, user }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("NO auth token found");

      const { data } = await axios.get(TASKS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.tasks)
        ? data.tasks
        : Array.isArray(data?.data)
        ? data.data
        : [];
      setTasks(arr);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load tasks");
      if (err.response?.status === 401) onLogout();
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(
      (t) =>
        t.status === "Completed" ||
        t.completed === true ||
        t.completed === 1 ||
        (typeof t.completed === "string" &&
          ["yes", "completed", "true"].includes(t.completed.toLowerCase()))
    ).length;

    const totalCount = tasks.length;
    const pendingCount = totalCount - completedTasks;
    const completionPercentage = totalCount
      ? Math.round((completedTasks / totalCount) * 100)
      : 0;

    return {
      totalCount,
      completedTasks,
      pendingCount,
      completionPercentage,
    };
  }, [tasks]);

  // STATISTIC CARD
  const StatCard = ({ title, value, icon }) => (
    <div
      className="p-2 sm:p-3 rounded-3xl bg-two/70 shadow-sm border border-one hover:shadow-md 
    transition-all duration-300 hover:border-maintxt group"
    >
      <div className="flex items-center gap-2">
        <div
          className="p-1.5 rounded-lg bg-linear-to-br from-two/30 to-maintxt/30 
        group-hover:from-two/50 group-hover:to-maintxt/50"
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p
            className="text-lg sm:text-xl font-bold bg-linear-to-r from-maintxt/70 to-two 
          bg-clip-text text-transparent"
          >
            {value}
          </p>
          <p className="text-sm text-maintxt/50 font-medium">{title}</p>
        </div>
      </div>
    </div>
  );

  // LOADING
  if (loading)
    return (
      <div className="min-h-screen bg-basedark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-one" />
      </div>
    );

  // ERROR
  if (error)
    return (
      <div className="min-h-screen bg-basedark p-6 flex items-center justify-center">
        <div className="bg-two text-red-600 p-4 rounded-xl border border-one/50 max-w-md">
          <p className="font-medium mb-2">Error loading tasks</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchTasks}
            className="mt-4 py-2 px-4 bg-one/50 text-red-700 rounded-lg 
          text-sm font-medium hover:bg-one/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-basedark sm:p-4 sm:pt-0">
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} tasks={tasks} />

      <div className="ml-0 xl:ml-64 lg:ml-64 md:ml-16 pt-18 md:pl-4 md:pt-0 transition-all duration-300">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 md:gap-4">
          <div className="xl:col-span-2 space-y-3 sm:space-y-4">
            <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
          </div>

          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-one/50 rounded-3xl p-4 sm:p-5 m-2 sm:m-0 sm:mb-4 shadow-sm border border-one">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-maintxt">
                Task Statistics
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <StatCard
                  title="Total Tasks"
                  value={stats.totalCount}
                  icon={
                    <Circle
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-maintxt"
                    />
                  }
                />
                <StatCard
                  title="Completed"
                  value={stats.completedTasks}
                  icon={
                    <Circle
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-300"
                    />
                  }
                />
                <StatCard
                  title="Pending"
                  value={stats.pendingCount}
                  icon={
                    <Circle
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-maintxt"
                    />
                  }
                />
                <StatCard
                  title="Completion Rate"
                  value={`${stats.completionPercentage}%`}
                  icon={
                    <Circle
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-maintxt"
                    />
                  }
                />
              </div>

              <hr className="my-3 sm:my-4 border-one" />

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between text-maintxt">
                  <span className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                    <Circle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-one fill-one" />
                    Task Progress
                  </span>
                  <span className="text-xs bg-two/70 text-maintxt px-1.5 py-0.5 sm:px-2 rounded-full">
                    {stats.completedTasks} / {stats.totalCount}
                  </span>
                </div>

                <div className="relative pt-1">
                  <div className="flex gap-1.5 items-center">
                    <div className="flex-1 h-3 bg-two/70 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-two to-maintxt rounded-full transition-all
                       duration-500 animate-pulse"
                        style={{ width: `${stats.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-one/50 rounded-3xl p-4 sm:p-5 m-2 sm:m-0 shadow-sm border border-one">
              <h3
                className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-maintxt flex
               items-center gap-2"
              >
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-maintxt" />
                Task History
              </h3>

              <div className="space-y-2 sm:space-y-3">
                {tasks.slice(0, 3).map((task) => (
                  <div
                    key={task._id || task.id}
                    className="flex items-center justify-between p-3
                  bg-two/70 rounded-3xl transition-colors duration-200 border border-transparent
                   hover:border-one"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-maintxt truncate whitespace-normal">
                        {task.title}
                      </p>
                      <p className="text-xs text-maintxt/50 mt-0.5">
                        {task.createdAt
                          ? new Date(task.createdAt).toLocaleDateString()
                          : "No Date"}
                      </p>
                    </div>

                    <span
                      className={`px-2 py-1 text-xs rounded-full shrink-0 ml-2 ${
                        task.completed || task.status === "Completed"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-one/10 text-maintxt"
                      }`}
                    >
                      {task.completed || task.status === "Completed" ? "Done" : "Pending"}
                    </span>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div className="text-center px-2 py-4">
                    <div
                      className="w-16 h-16 bg-one/30 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Clock className="w-8 h-8 text-maintxt" />
                    </div>
                    <p className="text-lg font-semibold text-maintxt mb-1">No recent activity</p>
                    <p className="text-sm text-maintxt/50">
                      Tasks will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
