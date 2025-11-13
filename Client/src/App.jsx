import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import LoginPage from './pages/LoginPage';
import EmployeeList from './pages/EmployeeList';
import GuestList from './pages/GuestList';
import RoomList from './pages/RoomList';
import DashboardHome from './pages/DashboardHome';
import EarningsReport from './pages/EarningsReport';
import ReservationList from './pages/ReservationList';
import HousekeepingList from './pages/HousekeepingList';
import './App.css';

function App() {
  const adminRoles = ['ROLE_Admin'];
  const managerRoles = ['ROLE_Admin', 'ROLE_Manager'];

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>

          <Route index element={<DashboardHome />} />

          <Route element={<RoleBasedRoute allowedRoles={adminRoles} />}>
            <Route path="employees" element={<EmployeeList />} />
            <Route path="reports" element={<EarningsReport />} />
          </Route>

          <Route path="reservations" element={<ReservationList />} />
          <Route path="guests" element={<GuestList />} />
          <Route path="rooms" element={<RoomList />} />
          <Route path="housekeeping" element={<HousekeepingList />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;