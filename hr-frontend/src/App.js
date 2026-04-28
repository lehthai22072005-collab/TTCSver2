import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeePage from './pages/EmployeePage';
import AttendancePage from './pages/AttendancePage';
import ContractPage from './pages/ContractPage';
import SalaryPage from './pages/SalaryPage';
// Thay đổi import: dùng AccountManagementPage thay vì AccountPage
import AccountManagementPage from './pages/AccountManagementPage';
import ProfilePage from './pages/ProfilePage';
import MyAttendancePage from './pages/MyAttendancePage';
import MySalaryPage from './pages/MySalaryPage';
import MyContractPage from './pages/MyContractPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import PaymentHistoryPage from './pages/PaymentHistoryPage';
import ReportsPage from './pages/HrReportsPage';
import DepartmentPage from './pages/DepartmentPage';
import SettingsPage from './pages/SettingsPage';
import SystemLogPage from './pages/SystemLogPage';
import LeaveRequestPage from './pages/LeaveRequestPage';
import LeaveManagementPage from './pages/LeaveManagementPage';
import ApprovalsPage from './pages/ApprovalsPage';
import HrReportsPage from './pages/HrReportsPage';
import SalaryFundPage from './pages/SalaryFundPage';
// Bổ sung thêm trang cấu hình cho Admin
import SystemConfigPage from './pages/SystemConfigPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/employees" element={<EmployeePage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/contracts" element={<ContractPage />} />
                <Route path="/salary" element={<SalaryPage />} />

                {/* Sửa lại route này để nhận file AccountManagementPage.js mới của bạn */}
                <Route path="/accounts" element={<AccountManagementPage />} />

                {/* Các route dành cho Admin */}
                <Route path="/departments" element={<DepartmentPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/system-logs" element={<SystemLogPage />} />
                {/* Bổ sung route cấu hình hệ thống khớp với Sidebar */}
                <Route path="/system-config" element={<SystemConfigPage />} />

                {/* Các route dành cho kế toán (Accountant) */}
                <Route path="/payment-history" element={<PaymentHistoryPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/leave-management" element={<LeaveManagementPage />} />

                {/* Các route dành cho Ban Giám Hiệu (Director) */}
                <Route path="/approvals" element={<ApprovalsPage />} />
                <Route path="/hr-reports" element={<HrReportsPage />} />
                <Route path="/salary-fund" element={<SalaryFundPage />} />

                {/* Các route dành cho cá nhân (Self-service) */}
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