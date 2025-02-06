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
  {
    link: "/course/add",
    roles: [ROLES.TUTOR],
  },
  {
    link: "/tutors",
    roles: [],
  },
  {
    link: "/tutors/[slug]",
    roles: [],
  },
  {
    link: "/dashboard",
    roles: [ROLES.TUTOR, ROLES.STUDENT],
  },
  {
    link: "/dashboard/enquiries",
    roles: [ROLES.TUTOR, ROLES.STUDENT],
  },
  {
    link: "/dashboard/enquiries/[slug]/chat",
    roles: [ROLES.TUTOR, ROLES.STUDENT],
  },
  {
    link: "/categories",
    roles: [],
  },
  {
    link: "/categories/[slug]",
    roles: [],
  },
];
