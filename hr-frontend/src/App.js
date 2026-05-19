import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardAccountant from './pages/DashboardAccountant';
import DashboardTeacher from './pages/DashboardTeacher';
import DashboardDirector from './pages/DashboardDirector'; // 1. IMPORT Ở ĐÂY

// ... các trang khác giữ nguyên ...
import EmployeePage from './pages/EmployeePage';
import AttendancePage from './pages/AttendancePage';
import ContractPage from './pages/ContractPage';
import SalaryPage from './pages/SalaryPage';
import AccountManagementPage from './pages/AccountManagementPage';
import ProfilePage from './pages/ProfilePage';
import MyAttendancePage from './pages/MyAttendancePage';
import MySalaryPage from './pages/MySalaryPage';
import MyContractPage from './pages/MyContractPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import PaymentHistoryPage from './pages/PaymentHistoryPage';
import DepartmentPage from './pages/DepartmentPage';
import SettingsPage from './pages/SettingsPage';
import SystemLogPage from './pages/SystemLogPage';
import LeaveRequestPage from './pages/LeaveRequestPage';
import LeaveManagementPage from './pages/LeaveManagementPage';
import ApprovalsPage from './pages/ApprovalsPage';
import HrReportsPage from './pages/HRReportsPage';
import SalaryFundPage from './pages/SalaryFluctuationPage';
import SystemConfigPage from './pages/SystemConfigPage';
import PaymentDetailPage from './pages/PaymentDetailPage';

const DashboardRouter = () => {
    const role = localStorage.getItem('role');

    if (role === 'ADMIN') return <DashboardAdmin />;
    if (role === 'ACCOUNTANT') return <DashboardAccountant />;
    if (role === 'TEACHER') return <DashboardTeacher />;
    if (role === 'DIRECTOR') return <DashboardDirector />; // 2. MỞ KHÓA Ở ĐÂY

    return <Navigate to="/" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardRouter />} />

                {/* Giữ nguyên toàn bộ Route bên dưới của bạn */}
                <Route path="/payment-history/detail/:month" element={<PaymentDetailPage />} />
                <Route path="/employees" element={<EmployeePage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/contracts" element={<ContractPage />} />
                <Route path="/salary" element={<SalaryPage />} />
                <Route path="/accounts" element={<AccountManagementPage />} />
                <Route path="/departments" element={<DepartmentPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/system-logs" element={<SystemLogPage />} />
                <Route path="/system-config" element={<SystemConfigPage />} />
                <Route path="/payment-history" element={<PaymentHistoryPage />} />
                <Route path="/leave-management" element={<LeaveManagementPage />} />
                <Route path="/approvals" element={<ApprovalsPage />} />
                <Route path="/hr-reports" element={<HrReportsPage />} />
                <Route path="/salary-fund" element={<SalaryFundPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/my-attendance" element={<MyAttendancePage />} />
                <Route path="/my-salary" element={<MySalaryPage />} />
                <Route path="/my-contract" element={<MyContractPage />} />
                <Route path="/change-password" element={<ChangePasswordPage />} />
                <Route path="/leave-request" element={<LeaveRequestPage />} />
            </Routes>
        </Router>
    );
}

export default App;