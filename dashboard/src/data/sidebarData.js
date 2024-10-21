import {
  CalendarDays,
  CircleHelp,
  Crown,
  Kanban,
  PieChart,
  Shapes,
  Users,
} from "lucide-react";

const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

const size = 18;

export const ALLROUTES = [
  {
    title: "Dashboard",
    path: "/",
    roles: [ROLES.ADMIN],
    icon: <PieChart size={size} />,
  },
  {
    title: "Users",
    path: "/users/[id]",
    roles: [ROLES.ADMIN],
    icon: <Users size={size} />,
  },
  {
    title: "Users",
    path: "/users",
    roles: [ROLES.ADMIN],
    icon: <Users size={size} />,
  },
  {
    title: "Users",
    path: "/users/create/tutor",
    roles: [ROLES.ADMIN],
    icon: <Users size={size} />,
  },
  {
    title: "Users",
    path: "/users/create/student",
    roles: [ROLES.ADMIN],
    icon: <Users size={size} />,
  },
  {
    title: "Leads",
    path: "/leads",
    roles: [],
    icon: <Users size={size} />,
  },
  {
    title: "Leads",
    path: "/leads/create",
    roles: [],
    icon: <Users size={size} />,
  },
  {
    title: "Leads",
    path: "/leads/[id]",
    roles: [],
    icon: <Users size={size} />,
  },
  {
    title: "Leads",
    path: "/leads/[id]/convert-to-member",
    roles: [],
    icon: <Users size={size} />,
  },
  {
    title: "Category",
    path: "/categories",
    roles: [ROLES.ADMIN],
    icon: <Shapes size={size} />,
  },
  {
    title: "Category",
    path: "/categories/create",
    roles: [ROLES.ADMIN],
    icon: <Users size={size} />,
  },
  {
    title: "Category",
    path: "/categories/edit/[id]",
    roles: [ROLES.ADMIN],
    icon: <Users size={size} />,
  },
  {
    title: "Category",
    path: "/categories/view/[id]",
    roles: [ROLES.ADMIN],
    icon: <Shapes size={size} />,
  },
  {
    title: "Sub Category",
    path: "/sub-categories",
    roles: [ROLES.ADMIN],
    icon: <Shapes size={size} />,
  },
  {
    title: "Sub Category",
    path: "/sub-categories/create",
    roles: [ROLES.ADMIN],
    icon: <Users size={size} />,
  },
  {
    title: "Sub Category",
    path: "/sub-categories/edit/[id]",
    roles: [ROLES.ADMIN],
    icon: <Users size={size} />,
  },
  {
    title: "Sub Category",
    path: "/sub-categories/view/[id]",
    roles: [ROLES.ADMIN],
    icon: <Users size={size} />,
  },
  {
    title: "Sub Category",
    path: "/sub-categories/checkFields/[id]",
    roles: [ROLES.ADMIN],
    icon: <Users size={size} />,
  },
  {
    title: "Board",
    path: "/boards",
    roles: [ROLES.ADMIN],
    icon: <Kanban size={size} />,
  },
  {
    title: "Board",
    path: "/boards/subject/[id]",
    roles: [ROLES.ADMIN],
    icon: <Users size={size} />,
  },
  {
    title: "Queries",
    path: "/queries",
    roles: [ROLES.ADMIN],
    icon: <CircleHelp size={size} />,
  },
];
