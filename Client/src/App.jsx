import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
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

  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const stompClient = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        reconnectDelay: 5000,
        onConnect: () => {
          stompClient.subscribe('/topic/reservations', (message) => {
            const reservation = JSON.parse(message.body);
            if (showToast) {
              showToast(`Rezervare nouă: ${reservation.guestFirstName} ${reservation.guestLastName} - Camera ${reservation.roomNumber}`, 'success');
            }
          });
        },
        onStompError: (frame) => {
          console.error('Eroare STOMP:', frame);
        },
      });

      stompClient.activate();

      return () => {
        stompClient.deactivate();
      };
    }
  }, [user, showToast]);

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