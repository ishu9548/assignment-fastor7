export const isValidIndianMobile = (value) => /^[6-9]\d{9}$/.test(value);
export const isValidOtp = (value) => /^\d{6}$/.test(value);
export const formatCurrency = (value) => `₹${Number(value).toFixed(2)}`;
