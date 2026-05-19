import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
    const location = useLocation();
    const role = localStorage.getItem('role');
    const activeClass = (path) => location.pathname === path ? "active-link" : "";

    let menuItems = [];

    // 1. Phân quyền cho ADMIN (Quản trị hệ thống)
    if (role === 'ADMIN') {
        menuItems = [
            { path: '/dashboard', label: 'Dashboard hệ thống' },
            { path: '/accounts', label: 'Quản lý tài khoản' },
            { path: '/system-config', label: 'Cấu hình hệ thống' },
            { path: '/system-logs', label: 'System Logs' },
            { path: '/change-password', label: 'Đổi mật khẩu' }
        ];
    }
    // 2. Phân quyền cho KẾ TOÁN (ACCOUNTANT)
    else if (role === 'ACCOUNTANT') {
        menuItems = [
            { path: '/dashboard', label: 'Dashboard Kế toán' }, // THÊM MỚI Ở ĐÂY ĐỂ TRÁNH LẠC ĐƯỜNG
            { path: '/employees', label: 'Quản lý nhân sự' },
            { path: '/attendance', label: 'Quản lý chấm công' },
            { path: '/salary', label: 'Tính lương' },
            { path: '/payment-history', label: 'Lịch sử chi trả' },
            { path: '/profile', label: 'Thông tin cá nhân' }
        ];
    }
    // 3. Phân quyền cho BAN GIÁM HIỆU (DIRECTOR)
    else if (role === 'DIRECTOR') {
        menuItems = [
            { path: '/dashboard', label: 'Trang chủ' },
            { path: '/approvals', label: 'Phê duyệt đơn từ' },
            { path: '/hr-reports', label: 'Báo cáo nhân sự' },
            { path: '/salary-fund', label: 'Biến động quỹ lương' }
        ];
    }
    // 4. Phân quyền cho GIẢNG VIÊN (TEACHER)
    else if (role === 'TEACHER') {
        menuItems = [
            { path: '/dashboard', label: 'Trang chủ' },
            { path: '/profile', label: 'Thông tin cá nhân' },
            { path: '/my-salary', label: 'Phiếu lương cá nhân' },
            { path: '/leave-request', label: 'Nghỉ phép' }
        ];
    }
    // 5. Phân quyền cho NHÂN VIÊN (STAFF)
    else if (role === 'STAFF') {
        menuItems = [
            { path: '/dashboard', label: 'Trang chủ' },
            { path: '/profile', label: 'Thông tin cá nhân' },
            { path: '/my-salary', label: 'Phiếu lương tháng' },
            { path: '/leave-request', label: 'Gửi đơn nghỉ phép' }
        ];
    }

    return (
        <div className="sidebar">
            <div className="sidebar-header">HỆ THỐNG QUẢN LÍ NHÂN SỰ</div>
            <ul className="sidebar-menu">
                {menuItems.map((item, index) => (
                    <li key={index} className={activeClass(item.path)}>
                        <Link to={item.path}>{item.label}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;