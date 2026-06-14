import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Key, X, Camera } from 'lucide-react';
import axios from 'axios';
import '../App.css';
import './TopBar.css';

function TopBar() {
    const userName = localStorage.getItem('username') || 'Admin';
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout', { username: userName });
        } catch (error) {
            console.error('Không thể ghi nhận đăng xuất:', error);
        }
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('employeeId');
        localStorage.removeItem('fullName');
        navigate('/');
    };

    // Tự động đóng popover khi click ra ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <div className="top-bar">
            <span className="system-title">HỆ THỐNG QUẢN LÝ NHÂN SỰ</span>
            <div className="user-info" ref={dropdownRef}>
                <button className="avatar-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    {userInitial}
                </button>

                {dropdownOpen && (
                    <div className="google-dropdown">
                        <button className="close-btn" onClick={() => setDropdownOpen(false)}>
                            <X size={20} />
                        </button>
                        
                        <div className="dropdown-header">
                            <p className="email-text">{userName}@ptit.edu.vn</p>
                            <div className="large-avatar-wrapper">
                                <div className="large-avatar">
                                    {userInitial}
                                </div>
                                <div className="camera-icon-wrapper">
                                    <Camera size={14} />
                                </div>
                            </div>
                            <h3>Chào {userName}!</h3>
                            
                            <button className="manage-account-btn" onClick={() => { setDropdownOpen(false); navigate('/change-password'); }}>
                                <Key size={16} /> Quản lý mật khẩu
                            </button>
                        </div>
                        
                        <div className="dropdown-body">
                            <div className="account-item" onClick={() => { setDropdownOpen(false); navigate('/profile'); }}>
                                <div className="small-avatar">i</div>
                                <div className="account-details">
                                    <span className="account-name">Thông tin cá nhân</span>
                                    <span className="account-email">Xem hồ sơ nhân sự</span>
                                </div>
                            </div>
                        </div>

                        <div className="dropdown-footer">
                            <button className="logout-btn" onClick={handleLogout}>
                                <LogOut size={18} style={{marginRight: '8px'}} /> Đăng xuất khỏi hệ thống
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TopBar;
