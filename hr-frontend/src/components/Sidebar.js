import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

function Sidebar() {
    const location = useLocation();
    const role = localStorage.getItem('role');

    // Hàm kiểm tra xem link có đang được chọn không để đổi màu
    const activeClass = (path) => location.pathname === path ? "active-link" : "";

    let menuItems = [];

    if (role === 'ADMIN') {
        menuItems = [
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/accounts', label: 'Quản lý tài khoản' },
            { path: '/settings', label: 'Cấu hình hệ thống' },
            { path: '/system-logs', label: 'Nhật ký hệ thống' },
            { path: '/change-password', label: 'Đổi mật khẩu' }
        ];
    } else if (role === 'ACCOUNTANT') {
        menuItems = [
            { path: '/employees', label: 'Quản lý nhân sự' },
            { path: '/attendance', label: 'Quản lý chấm công' },
            { path: '/salary', label: 'Tính lương' },
            { path: '/payment-history', label: 'Lịch sử chi trả' }
        ];
    } else if (role === 'DIRECTOR') {
        menuItems = [
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/approvals', label: 'Phê duyệt' },
            { path: '/hr-reports', label: 'Báo cáo nhân sự' },
            { path: '/salary-fund', label: 'Quỹ lương' }
        ];
    } else {
        // Mặc định hoặc dành cho Nhân viên (TEACHER, Giảng viên...)
        menuItems = [
            { path: '/dashboard', label: 'Trang chủ' },
            { path: '/profile', label: 'Trang cá nhân' },
            { path: '/leave-request', label: 'Yêu cầu Nghỉ phép' },
            { path: '/my-attendance', label: 'Chấm công cá nhân' },
            { path: '/my-salary', label: 'Phiếu lương' },
            { path: '/my-contract', label: 'Hợp đồng cá nhân' }
        ];
    }

    return (
        <div className="sidebar">
            <div className="sidebar-header">MyAdmin</div>
            <ul className="sidebar-menu">
                {menuItems.map((item, index) => (
                    <li key={index} className={item.path ? activeClass(item.path) : "action-link"}>
                        {item.path ? (
                            <Link to={item.path}>{item.label}</Link>
                        ) : (
                            <a href="#!" onClick={(e) => { e.preventDefault(); item.action(); }} style={{ cursor: 'pointer', color: '#10b981', fontWeight: 'bold' }}>
                                {item.label}
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;
