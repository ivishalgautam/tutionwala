const ROLES = {
  ADMIN: "admin",
  USER: "user",
  TUTOR: "tutor",
  STUDENT: "student",
};

export const allRoutes = [
  {
    link: "/",
    roles: [],
  },
  {
    link: "/categories/[slug]",
    roles: [ROLES.USER],
  },
  {
    link: "/complete-profile/tutor",
    roles: [ROLES.TUTOR],
  },
  {
    link: "/search/[subCatSlug]",
    roles: [],
  },
  {
    link: "/follow-ups/[slug]",
    roles: [ROLES.TUTOR],
  },
];
