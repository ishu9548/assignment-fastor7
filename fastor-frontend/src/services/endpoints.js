// All API paths aligned with your Express backend routes
export const ENDPOINTS = {
  requestOtp: { method: "POST", path: "/auth/register" }, // Maps to POST /api/auth/register
  verifyOtp: { method: "POST", path: "/auth/login" },     // Maps to POST /api/auth/login
  restaurants: { method: "GET", path: "/restaurant" },      
};

export const DIAL_CODE = "+91";