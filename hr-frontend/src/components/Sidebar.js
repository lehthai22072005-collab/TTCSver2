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
            { path: '/system-logs', label: 'System Logs' }
        ];
    }
    // 2. Phân quyền cho KẾ TOÁN (ACCOUNTANT)
    else if (role === 'ACCOUNTANT') {
        menuItems = [
            { path: '/dashboard', label: 'Dashboard Kế toán' }, // THÊM MỚI Ở ĐÂY ĐỂ TRÁNH LẠC ĐƯỜNG
            { path: '/attendance', label: 'Quản lý chấm công' },
            { path: '/salary', label: 'Tính lương' },
            { path: '/payment-history', label: 'Lịch sử chi trả' }
        ];
    }
    // 3. Phân quyền cho BAN GIÁM HIỆU (DIRECTOR)
    else if (role === 'DIRECTOR') {
        menuItems = [
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/hr-reports', label: 'Báo cáo nhân sự' },
            { path: '/salary-fund', label: 'Biến động quỹ lương' }
        ];
    }
    // 4. Phân quyền cho PHÒNG NHÂN SỰ (HR)
    else if (role === 'HR') {
        menuItems = [
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/employees', label: 'Quản lý nhân sự' },
            { path: '/approvals', label: 'Phê duyệt đơn từ' },
            { path: '/declarations-approval', label: 'Duyệt Kê khai Giờ dạy' },
            { path: '/rewards', label: 'Khen thưởng & Kỷ luật' },
            { path: '/kpi', label: 'Đánh giá KPI' }
        ];
    }
    // 5. Phân quyền cho GIẢNG VIÊN (TEACHER)
    else if (role === 'TEACHER') {
        menuItems = [
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/my-salary', label: 'Phiếu lương cá nhân' },
            { path: '/declarations', label: 'Kê khai Khối lượng' },
            { path: '/my-kpi', label: 'Đánh giá KPI cá nhân' },
            { path: '/leave-request', label: 'Nghỉ phép' }
        ];
    }
    // 5. Phân quyền cho NHÂN VIÊN (STAFF)
    else if (role === 'STAFF') {
        menuItems = [
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/my-salary', label: 'Phiếu lương tháng' },
            { path: '/my-kpi', label: 'Đánh giá KPI cá nhân' },
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
