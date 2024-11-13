import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Users from "./pages/Users";
import MedicalRepository from "./pages/MedicalRepository";
import Announcements from "./pages/Announcements";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { UserProvider } from '@/contexts/UserContext';
import MedicalProfile from "@/pages/MedicalProfile/MedicalProfile";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/users" element={<Users />} />
              <Route path="/medical-repository" element={<MedicalRepository />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/medical-profile/:id" element={<MedicalProfile />} />
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
