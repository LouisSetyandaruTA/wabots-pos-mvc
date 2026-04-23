import { jwtDecode } from "jwt-decode";

export const getUser = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("Token error:", err);
    return null;
  }
};