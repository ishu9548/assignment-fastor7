import { request } from "./apiClient.js";
import { DIAL_CODE, ENDPOINTS } from "./endpoints.js";

export function requestOtp(phone) {
  return request({ ...ENDPOINTS.requestOtp, body: { phone, dial_code: DIAL_CODE } });
}

// Returns { token, raw }. The token field name is read defensively; adjust if the Postman response differs.
export async function verifyOtp(phone, otp) {
  const data = await request({ ...ENDPOINTS.verifyOtp, body: { phone, otp, dial_code: DIAL_CODE } });
  const token = data?.data?.token ?? data?.token ?? data?.data?.access_token ?? data?.access_token;
  if (!token) throw new Error("Login succeeded but no token was returned by the server.");
  return { token, raw: data };
}
