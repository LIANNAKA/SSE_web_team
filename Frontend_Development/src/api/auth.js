import axiosInstance from "../axiosInstance";

export const adminLogin = async (email, password) => {
  return await axiosInstance.post("/api/admin/login", { email, password });
};
