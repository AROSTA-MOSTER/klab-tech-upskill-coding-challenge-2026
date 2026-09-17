import {
  User,
  Mail,
  Home,
  ListChecks,
  CheckCircle2,
  Lock,
  Home as HomeIcon,
  SortDesc,
  SortAsc,
  Award,
  Edit2,
  Trash2,
  MoreVertical,
  Clock,
  Calendar,
  UserRound,
} from "lucide-react";

// BACKEND TEST
// DUMMY DATA
const backendDummy = [
  {
    title: "Buy groceries",
    description: "Milk, bread, eggs, and spinach",
    priority: "Low",
    dueDate: "2025-05-02T18:00:00.000Z",
    completed: "No",
  },
  {
    title: "Book dentist appointment",
    description: "Routine check-up and cleaning",
    priority: "Medium",
    dueDate: "2025-05-10T10:00:00.000Z",
    completed: true,
  },
  {
    title: "Book dentist appointment",
    description: "Routine check-up and cleaning",
    priority: "Medium",
    dueDate: "2025-05-10T10:00:00.000Z",
    completed: true,
  },
  {
    title: "Pay utility bills",
    description: "Electricity and water bills for April",
    priority: "High",
    dueDate: "2025-04-28T12:00:00.000Z",
    completed: "Yes",
  },
];

// FRONTEND DUMMY DATA

// assets/formConstants.js
export const baseControlClasses =
  "w-full px-4 py-2.5 border text-maintxt border-one rounded-2xl bg-two/70 focus:ring-2 focus:ring-maintxt focus:border-one focus:outline-none text-sm";

export const priorityStyles = {
  Low: "bg-green-100/30 text-green-300",
  Medium: "bg-orange-100/30 text-orange-300",
  High: "bg-red-100/30 text-red-300",
};

export const DEFAULT_TASK = {
  title: "",
  description: "",
  priority: "Low",
  dueDate: "",
  completed: false,
  status: "Pending",
  id: null,
};

// LOGIN CSS
export const INPUTWRAPPER =
  "flex items-center bg-two/70 text-maintxt border border-one rounded-2xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-one focus-within:border-maintxt transition-all duration-200";
export const BUTTON_CLASSES =
  "w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2";

// PROFILE CSS
export const INPUT_WRAPPER =
  "flex items-center border border-purple-100 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-200";
export const FULL_BUTTON =
  "w-full bg-gradient-to-r from-two to-one text-maintxt py-2.5 rounded-2xl cursor-pointer hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2";
export const SECTION_WRAPPER =
  "bg-one/50 rounded-3xl shadow-sm border border-one p-4";
export const BACK_BUTTON =
  "hidden flex items-center text-gray-600 hover:text-purple-600 mb-8 transition-colors duration-200";
export const DANGER_BTN =
  "w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl \
   bg-red-500 cursor-pointer lg:bg-red-500/20 border border-red-100/80 lg:border-red-300/50 lg:text-red-300 \
   hover:bg-red-500 hover:border-red-100/80 text-maintxt hover:text-maintxt \
   transition-all duration-200";
export const personalFields = [
  { name: "name", type: "text", placeholder: "Full Name", icon: UserRound },
  { name: "email", type: "email", placeholder: "Email", icon: Mail },
];

// SIDEBAR
export const menuItems = [
  { text: "Dashboard", path: "/", icon: <Home className="w-5 h-5" /> },
  {
    text: "Pending Tasks",
    path: "/pending",
    icon: <ListChecks className="w-5 h-5" />,
  },
  {
    text: "Completed Tasks",
    path: "/complete",
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
];

export const SIDEBAR_CLASSES = {
  desktop:
    "hidden md:flex flex-col fixed h-full w-20 lg:w-64 bg-one/50 rounded-3xl backdrop-blur-sm border-r border-one shadow-md z-20 transition-all duration-300",
  mobileButton:
    "absolute md:hidden inset-x-2 sm:inset-x-4 mt-3 sm:mt-0 flex items-center justify-between bg-one/50 text-maintxt p-2 rounded-3xl shadow-lg border border-one transition",
  mobileDrawerBackdrop: "fixed inset-0 bg-black/40 backdrop-blur-sm",
  mobileDrawer:
    "absolute top-0 left-0 w-66 h-full bg-one/50 backdrop-blur-md border-r border-one shadow-lg z-50 p-4 flex flex-col space-y-6",
};

export const LINK_CLASSES = {
  base: "group flex items-center px-4 py-3 rounded-2xl transition-all duration-300",
  active:
    "bg-gradient-to-r from-two to-one border-l-2 sm:border-l-3 border-one text-maintxt font-medium shadow-sm",
  inactive: "hover:bg-one/50 text-maintxt/50 hover:text-maintxt",
  icon: "transition-transform duration-300 group-hover:scale-120 text-maintxt",
  text: "text-sm font-medium ml-2",
};

export const PRODUCTIVITY_CARD = {
  container: "bg-two/70 rounded-3xl p-3 border border-one",
  header: "flex items-center justify-between mb-2",
  label: "text-xs font-semibold text-maintxt",
  badge: "text-xs bg-two/90 text-maintxt px-2 py-0.5 rounded-full",
  barBg: "w-full h-2 bg-two/90 rounded-full overflow-hidden",
  barFg:
    "h-full bg-gradient-to-r from-two to-maintxt rounded-full animate-pulse",
};

export const TIP_CARD = {
  container:
    "bg-gradient-to-r from-two to-two/10 rounded-3xl p-4 border border-one",
  iconWrapper: "p-2 bg-one/50 rounded-xl",
  title: "text-sm font-semibold text-maintxt",
  text: "text-xs text-maintxt/50 mt-1",
};

// SIGNUP
export const FIELDS = [
  { name: "name", type: "text", placeholder: "Full Name", icon: User },
  { name: "email", type: "email", placeholder: "Email", icon: Mail },
  { name: "password", type: "password", placeholder: "Password", icon: Lock },
];

export const Inputwrapper =
  "flex items-center bg-two/70 border border-one rounded-2xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-one focus-within:border-maintxt transition-all duration-200";
export const BUTTONCLASSES =
  "w-full bg-gradient-to-r from-two to-one cursor-pointer text-maintxt text-md font-semibold py-2.5 rounded-2xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2";
export const MESSAGE_SUCCESS =
  "bg-green-500/20 text-green-300 p-3 rounded-2xl text-sm mb-3 border border-green-300/50";
export const MESSAGE_ERROR =
  "bg-red-500/20 text-red-300 p-3 rounded-2xl text-sm mb-3 border border-red-300/50";

// TASK ITEM
export const getPriorityColor = (priority) => {
  const colors = {
    low: "borde-one bg-green-100/70 text-green-700",
    medium: "border-one bg-orange-100/70 text-purple-600",
    high: "border-one bg-red-100/70 text-fuchsia-800",
  };
  return (
    colors[priority?.toLowerCase()] ||
    "border-gray-500 bg-gray-50/50 text-gray-700"
  );
};

export const getPriorityBadgeColor = (priority) => {
  const colors = {
    low: "bg-green-500/20 text-green-300",
    medium: "bg-orange-500/20 text-orange-300",
    high: "bg-red-500/20 text-red-300",
  };
  return colors[priority?.toLowerCase()] || "bg-gray-100 text-gray-700";
};

// DASHBOARD
// UI Constants
export const WRAPPER = "p-2 sm:p-0 h-full overflow-hidden";
export const HEADER =
  "flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 md:mb-4 gap-3 rounded-3xl bg-one/50 p-4 border border-one";
export const ADD_BUTTON =
  "flex items-center gap-2 bg-gradient-to-r from-two to-one text-maintxt px-4 py-2 rounded-2xl shadow-md hover:shadow-lg cursor-pointer md:hover:scale-105 transition-all duration-200 w-full sm:w-auto justify-center text-sm md:text-base";
export const STATS_GRID =
  "grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4";
export const STAT_CARD =
  "p-3 md:p-4 rounded-3xl bg-one/50 shadow-sm border hover:shadow-md transition-all duration-300 min-w-0";
export const ICON_WRAPPER = "p-1.5 md:p-2 rounded-xl";
export const VALUE_CLASS = "text-lg md:text-2xl font-bold truncate";
export const LABEL_CLASS = "text-xs text-maintxt truncate";

// Stats definitions
export const STATS = [
  {
    key: "total",
    label: "Total Tasks",
    icon: HomeIcon,
    iconColor: "bg-one/30 text-maintxt",
    borderColor: "border-one",
    valueKey: "total",
    gradient: true,
  },
  {
    key: "lowPriority",
    label: "Low Priority",
    borderColor: "border-green-300",
    valueKey: "lowPriority",
    textColor: "text-green-300",
  },
  {
    key: "mediumPriority",
    label: "Medium Priority",
    borderColor: "border-orange-300",
    valueKey: "mediumPriority",
    textColor: "text-orange-300",
  },
  {
    key: "highPriority",
    label: "High Priority",
    borderColor: "border-red-300",
    valueKey: "highPriority",
    textColor: "text-red-300",
  },
];

// Filter options
export const FILTER_OPTIONS = ["all", "pending", "completed", "today", "week", "high", "medium", "low"];
export const FILTER_LABELS = {
  all: "All Tasks",
  pending: "Pending Tasks",
  completed: "Completed Tasks",
  today: "Today's Tasks",
  week: "This Week",
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

// Empty state
export const EMPTY_STATE = {
  wrapper: "p-6 bg-one/50 rounded-3xl shadow-sm border border-one text-center",
  iconWrapper:
    "w-16 h-16 bg-one/30 rounded-full flex items-center justify-center mx-auto mb-4",
  btn: "px-4 py-2 bg-gradient-to-r from-two to-one text-maintxt rounded-2xl text-md font-medium hover:shadow-lg cursor-pointer hover:scale-105 transition-all duration-200",
};

// Filter UI Constants
export const FILTER_WRAPPER =
  "flex items-center justify-between bg-one/50 border border-one p-4 rounded-3xl shadow-sm";
export const SELECT_CLASSES =
  "px-3 py-2 border border-one rounded-xl bg-two/70 outline-none focus:ring-2 focus:ring-one sm:hidden text-sm text-maintxt";
export const TABS_WRAPPER = "hidden sm:flex space-x-1 bg-two/70 p-1 rounded-xl";
export const TAB_BASE =
  "px-3 py-1.5 rounded-xl text-xs font-medium transition-all";
export const TAB_ACTIVE = "bg-one/10 text-maintxt shadow-sm border border-one";
export const TAB_INACTIVE = "text-maintxt/50 hover:bg-two";

// COMPLETE TASK
export const SORT_OPTIONS = [
  { id: "newest", label: "Newest", icon: <SortDesc className="w-3 h-3" /> },
  { id: "oldest", label: "Oldest", icon: <SortAsc className="w-3 h-3" /> },
  { id: "priority", label: "Priority", icon: <Award className="w-3 h-3" /> },
];

// CSS class groups
export const CT_CLASSES = {
  page: "h-full overflow-hidden p-2 sm:p-0",
  header: "flex flex-col w-full mb-3 md:mb-4 gap-3 md:gap-4",
  titleWrapper:
    "flex flex-col sm:flex-row w-full sm:items-center justify-between bg-one/50 rounded-3xl p-4 shadow-sm border border-one gap-3",
  title: "text-xl md:text-2xl lg:text-3xl font-bold text-maintxt truncate",
  subtitle: "text-xs md:text-sm text-maintxt/50 ml-1",
  sortContainer: "w-full",
  sortBox:
    "flex w-full items-center justify-between bg-one/50 p-4 rounded-3xl shadow-sm border border-one whitespace-nowrap",
  filterLabel:
    "flex items-center gap-2 text-maintxt font-medium whitespace-nowrap",
  select:
    "px-3 py-2 border border-one rounded-xl bg-two/70 focus:ring-2 focus:ring-one outline-none sm:hidden text-sm text-maintxt",
  btnGroup: "hidden sm:flex space-x-1 bg-two/70 p-1 rounded-xl ml-2 md:ml-3",
  btnBase:
    "px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1",
  btnActive: "bg-one/10 text-maintxt shadow-sm border border-one rounded-xl",
  btnInactive: "text-maintxt/50 hover:text-maintxt hover:bg-two rounded-xl",
  list: "space-y-3 md:space-y-4",
  emptyState:
    "p-6 bg-one/50 rounded-3xl shadow-sm border border-one text-center",
  emptyIconWrapper:
    "w-16 h-16 bg-one/30 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4",
  emptyTitle: "text-lg font-semibold text-maintxt mb-1",
  emptyText: "text-sm text-maintxt/50",
};

// constants/cssClasses.js
export const layoutClasses = {
  container: "p-2 sm:p-0 h-full overflow-hidden",
  headerWrapper: "flex flex-col w-full mb-3 md:mb-4 gap-3 md:gap-4",
  sortBox:
    "flex w-full items-center justify-between bg-one/50 p-4 rounded-3xl shadow-sm border border-one whitespace-nowrap",
  select:
    "px-3 py-2 border border-one rounded-xl bg-two/70 focus:ring-2 focus:ring-one outline-none sm:hidden text-sm text-maintxt",
  tabWrapper: "hidden sm:flex space-x-1 bg-two/70 p-1 rounded-xl ml-2 md:ml-3",
  tabButton: (active) =>
    `px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
      active
        ? "bg-one/10 text-maintxt shadow-sm border border-one"
        : "text-maintxt/50 hover:text-maintxt hover:bg-two"
    }`,
  addBox:
    "hidden md:block p-5 border-2 border-dashed border-purple-200 rounded-xl hover:border-purple-400 transition-colors cursor-pointer mb-6 bg-purple-50/50 group",
  emptyState: "bg-one/50 rounded-3xl shadow-sm border border-one text-center",
  emptyIconBg:
    "w-16 h-16 bg-one/30 rounded-full flex items-center justify-center mx-auto mb-4",
  emptyBtn:
    "px-4 py-2 bg-one/30 hover:scale-110 text-maintxt/70 hover:text-maintxt rounded-xl text-sm font-medium transition-all duration-300",
};

// TASK ITEM
// Menu options for task actions
export const MENU_OPTIONS = [
  {
    action: "edit",
    label: "Edit Task",
    icon: <Edit2 size={14} className="text-maintxt" />,
  },
  {
    action: "delete",
    label: "Delete Task",
    icon: <Trash2 size={14} className="text-red-600" />,
  },
];

// CSS class groups for TaskItem
export const TI_CLASSES = {
  wrapper:
    "group p-4 sm:p-5 rounded-3xl shadow-md bg-one/50 border-l-4 hover:shadow-lg transition-all duration-300 border border-one",
  leftContainer: "flex items-start gap-2 sm:gap-3 flex-1 min-w-0",
  completeBtn:
    "mt-0.5 sm:mt-1 p-1 sm:p-1.5 rounded-full hover:bg-one/30 transition-colors duration-300",
  checkboxIconBase: "w-4 h-4 sm:w-5 sm:h-5",
  actionBtn:
    "px-3 py-1.5 rounded-xl text-xs md:text-sm font-medium border border-one \
    transition-all duration-200",
  secondaryBtn:
    "px-3 py-1.5 rounded-xl text-xs md:text-sm bg-two/70 cursor-pointer border border-one lg:bg-two/50 text-maintxt \
   hover:bg-two/70 transition-colors",

  dangerBtn:
    "px-3 py-1.5 rounded-xl text-xs md:text-sm bg-red-500/30 cursor-pointer lg:bg-red-500/20 border border-red-300/50 text-red-300 \
   hover:bg-red-500/30 transition-colors",
  titleBase: "text-base sm:text-lg font-semibold truncate",
  priorityBadge: "text-xs px-2 py-0.5 rounded-full shrink-0",
  description: "text-sm text-maintxt/50 line-clamp-3 leading-snug",
  subtasksContainer:
    "mt-3 sm:mt-4 space-y-2 sm:space-y-3 bg-purple-50/30 p-2 sm:p-3 rounded-lg border border-purple-100",
  progressBarBg: "h-1.5 bg-purple-100 rounded-full overflow-hidden",
  progressBarFg:
    "h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all duration-300",
  rightContainer: "flex flex-col items-end gap-2 sm:gap-3",
  menuButton:
    "p-1 sm:p-1.5 hover:bg-one/30 rounded-lg text-maintxt/50 hover:text-maintxt transition-colors duration-200",
  menuDropdown:
    "absolute right-0 mt-1 w-40 sm:w-48 bg-two border border-one rounded-2xl shadow-2xl z-10 overflow-hidden animate-fadeIn",
  dateRow:
    "flex items-center gap-1.5 text-xs font-medium whitespace-nowrap text-maintxt/50",
  createdRow:
    "flex items-center gap-1.5 text-xs font-medium whitespace-nowrap text-maintxt/50",
};
// APP.JSX
// const user = {
//   avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
//     data.name || "User"
//   )}&background=random`,
// };
