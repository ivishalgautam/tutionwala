export const endpoints = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    refresh: "/auth/refresh",
    username: "/auth/username",
  },

  profile: "/users/me",
  users: { getAll: "/users" },
  leads: { getAll: "/leads" },
  files: {
    upload: "/upload/files",
    getFiles: "/upload",
  },
  categories: {
    getAll: "/categories",
  },
  subCategories: {
    getAll: "/subCategories",
  },
  boards: {
    getAll: "/boards",
  },
};
