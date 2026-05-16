import { Routes, Route } from "react-router-dom";
import Login from "views/auth/Login";

export default function Auth() {
  return (
    <div className="flex h-screen items-center justify-center bg-lightPrimary">
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}