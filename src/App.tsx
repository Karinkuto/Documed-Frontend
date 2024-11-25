import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Users from "./pages/Users";
import Announcements from "./pages/Announcements";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import PrivateRoute from "./components/PrivateRoute";
import MedicalProfile from "@/pages/MedicalProfile/MedicalProfile";
import MedicalRepository from "@/pages/MedicalRepository";
import { useEffect } from 'react';
import { startSessionTimer, resetSessionTimer, clearSessionTimer } from '@/utils/auth';
import { useUser } from '@/contexts/UserContext';

function App() {
  const { user, logout } = useUser();

  useEffect(() => {
    const handleUserActivity = () => {
      if (user) {
        resetSessionTimer(handleSessionTimeout);
      }
    };

    const handleSessionTimeout = () => {
      if (user) {
        logout();
        window.location.href = '/login?timeout=true';
      }
    };

    if (user) {
      startSessionTimer(handleSessionTimeout);
      window.addEventListener('mousemove', handleUserActivity);
      window.addEventListener('keypress', handleUserActivity);
      window.addEventListener('click', handleUserActivity);
      window.addEventListener('scroll', handleUserActivity);
    }

    return () => {
      clearSessionTimer();
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    };
  }, [user, logout]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="users" element={<Users />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="settings" element={<Settings />} />
          <Route path="medical-profile" element={<MedicalProfile />} />
          <Route path="medical-profile/:id" element={<MedicalProfile />} />
          <Route path="medical-repository" element={<MedicalRepository />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
