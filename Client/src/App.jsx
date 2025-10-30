import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import EmployeeList from './EmployeeList';
import GuestList from './GuestList';
import RoomList from './RoomList';
import DashboardHome from './pages/DashboardHome';
import EarningsReport from './pages/EarningsReport';
import ReservationList from './pages/ReservationList';
import './App.css'; 

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardHome />} />
          <Route path="reservations" element={<ReservationList />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="guests" element={<GuestList />} />
          <Route path="rooms" element={<RoomList />} />
          <Route path="reports" element={<EarningsReport />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;