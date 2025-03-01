export const endpoints = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    refresh: "/auth/refresh",
    username: "/auth/username",
    verifyOtp: "/auth/otp/verify",
    sendOtp: "/auth/otp/send",
    kycOtpRequest: "/zoop/kyc/otp/request",
    kycOtpVerify: "/zoop/kyc/otp/verify",
  },

  profile: "/users/me",
  users: { getAll: "/users" },
  products: {
    getAll: "/products",
    admin: "/products/admin/getAll",
    attribute: {
      getAll: "/product-attributes",
      term: "/product-attribute-terms",
    },
  },
  categories: {
    getAll: "/categories",
  },
  subCategories: {
    getAll: "/subCategories",
  },
  brands: {
    getAll: "/",
  },
  points: {
    getAll: "/points",
  },
  requirements: {
    getAll: "/requirements",
  },
  banners: {
    getAll: "/banners",
  },
  brands: {
    getAll: "/brands",
  },
  blogs: {
    getAll: "/blogs",
  },
  files: {
    upload: "/upload/files",
    getFiles: "/upload",
    deleteKey: "/upload/s3",
    preSignedUrl: "/upload/presigned-url",
    preSignedUrls: "/upload/presigned-urls",
  },
  cart: {
    getAll: "/carts",
  },
  orders: {
    getAll: "/orders",
  },
  enquiries: {
    getAll: "/enquiries",
  },
  myStudents: {
    getAll: "/tutor-student-map",
  },
  reviews: {
    getAll: "/reviews",
  },
  queries: {
    getAll: "/queries",
  },
  feedbacks: {
    getAll: "/feedbacks",
  },
  creditApplies: {
    getAll: "/credit-applies",
  },
  otp: {
    send: "/auth/send",
    verify: "/auth/verify",
  },
  tutor: {
    getAll: "/tutors",
    courses: "/tutors/courses",
  },
  student: {
    getAll: "/students",
  },
  followUps: {
    getAll: "/followUps",
  },
};
