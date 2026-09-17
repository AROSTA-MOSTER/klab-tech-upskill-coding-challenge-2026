import React, { useEffect, useState } from "react";
import {
  LINK_CLASSES,
  menuItems,
  PRODUCTIVITY_CARD,
  SIDEBAR_CLASSES,
} from "../assets/dummy";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ user, tasks }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showModel, setShowModel] = useState(false);

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.completed).length || 0;
  const productivity =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const username = user?.name || "User";
  const initial = username.charAt(0).toUpperCase();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  const renderMenuItems = (isMobile = false) => (
    <ul className="space-y-2">
      {menuItems.map(({ text, path, icon }) => (
        <li key={text}>
          <NavLink
            to={path}
            className={({ isActive }) =>
              [
                LINK_CLASSES.base,
                isActive ? LINK_CLASSES.active : LINK_CLASSES.inactive,
                isMobile ? "justify-start" : "lg:justify-start",
              ].join(" ")
            }
            onClick={() => setMobileOpen(false)}
          >
            <span className={LINK_CLASSES.icon}>{icon}</span>
            <span
              className={`${
                isMobile ? "block" : "hidden lg:block"
              } ${LINK_CLASSES.text}`}
            >
              {text}
            </span>
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={SIDEBAR_CLASSES.desktop}>
        <div className="p-5 border-b border-one lg:block hidden">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-linear-to-br from-two to-one
             flex items-center justify-center text-maintxt font-bold shadow-md"
            >
              {initial}
            </div>

            <div>
              <h2 className="text-lg font-bold text-maintxt">
                Hey, {username}
              </h2>
              <p className="text-sm text-one font-medium">
                Let's crush some tasks!
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6 flex-1">
          <div className={PRODUCTIVITY_CARD.container}>
            <div className={PRODUCTIVITY_CARD.header}>
              <h3 className={PRODUCTIVITY_CARD.label}>PRODUCTIVITY</h3>
              <span className={PRODUCTIVITY_CARD.badge}>{productivity}%</span>
            </div>
            <div className={PRODUCTIVITY_CARD.barBg}>
              <div
                className={PRODUCTIVITY_CARD.barFg}
                style={{ width: `${productivity}%` }}
              />
            </div>
          </div>

          {renderMenuItems()}
        </div>
      </div>

      {/* Mobile menu */}
      {/* Mobile quick nav (replaces menu button) */}
      {!mobileOpen && (
        <div className={SIDEBAR_CLASSES.mobileButton + " flex"}>
          {menuItems.map(({ text, path, icon }) => (
            <NavLink
              key={text}
              to={path}
              className={({ isActive }) =>
                `flex items-start gap-1 px-2 py-2 rounded-2xl text-sm sm:text-base font-medium transition-all
                  ${isActive ? "bg-two/70 border border-l-3 sm:border-l-3 border-one text-maintxt font-medium shadow-sm"
                     : "hover:bg-two/50 text-maintxt/50 hover:text-maintxt"}`
              }
            >
              <span className="w-3 h-3 mr-2">{icon}</span>
              <span className="inline sm:hidden items-start">
                {text.split(" ")[0]}
              </span>
              <span className="sm:inline hidden items-start">{text}</span>
            </NavLink>
          ))}
        </div>
      )}

      {/* Mobile drawer
      {mobileOpen && (
        <div className="fix inset-0 z-40">
          <div
            className={SIDEBAR_CLASSES.mobileDrawerBackdrop}
            onClick={() => setMobileOpen(false)}
          ></div>

          <div
            className={SIDEBAR_CLASSES.mobileDrawer}
            onclick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b border-one pb-2">
              <h2 className="text-lg font-bold text-maintxt">Menu</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-maintxt"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-6 mt-10">
              <div
                className="w-12 h-12 rounded-full bg-linear-to-br from-two to-one
             flex items-center justify-center text-maintxt text-xl font-bold shadow-md"
              >
                {initial}
              </div>
              <div>
                <h2 className="text-lg font-bold text-maintxt">
                  Hey, {username}
                </h2>
                <p className="text-sm text-maintxt/50 font-medium">
                  Let's crush some tasks!
                </p>
              </div>
            </div>

            {renderMenuItems(true)}
          </div>
        </div>
      )} */}
    </>
  );
};

export default Sidebar;
