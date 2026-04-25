import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function TopBar() {
    const userName = localStorage.getItem('username') || 'Admin';

    return (
        <div className="top-bar">
            <span className="system-title">HỆ THỐNG QUẢN LÝ NHÂN SỰ</span>
            <div className="user-info">
                <span>Chào {userName} | <Link to="/" style={{ color: '#fff', textDecoration: 'none' }} onClick={() => localStorage.removeItem('username')}>Đăng xuất</Link></span>
            </div>
        </div>
    );
}

export default TopBar;
