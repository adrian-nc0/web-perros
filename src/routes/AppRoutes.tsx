import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import RoleSelectionPage from "../pages/RoleSelectionPage";
import LoginPage from "../pages/auth/LoginPage";
import AdminPage from "../pages/AdminPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelectionPage />} />
        <Route path="/adoptar" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
