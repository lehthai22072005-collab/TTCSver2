import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function ChangePasswordPage() {
    // Các State lưu trữ dữ liệu người dùng nhập
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State hiển thị thông báo
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn trang bị reload khi ấn submit
        setMessage('');

        // 1. Validate form cơ bản
        if (newPassword !== confirmPassword) {
            setIsError(true);
            setMessage('Mật khẩu xác nhận không trùng khớp!');
            return;
        }
        if (newPassword.length < 6) {
            setIsError(true);
            setMessage('Mật khẩu mới phải có ít nhất 6 ký tự!');
            return;
        }

        // 2. Kéo thông tin user đang đăng nhập từ LocalStorage
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');

        if (!username) {
            setIsError(true);
            setMessage('Lỗi phiên đăng nhập, vui lòng đăng nhập lại!');
            return;
        }

        // 3. Gửi Request lên Backend
        try {
            const response = await axios.post('http://localhost:8080/api/accounts/change-password', {
                username: username,
                role: role,
                oldPassword: currentPassword,
                newPassword: newPassword
            });

            // Nếu thành công
            setIsError(false);
            setMessage(response.data.message || 'Đổi mật khẩu thành công!');

            // Xóa rỗng các ô nhập liệu
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (err) {
            setIsError(true);
            setMessage(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>

                    {/* KHUNG CARD ĐỔI MẬT KHẨU TRUNG TÂM */}
                    <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '40px', width: '500px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)', marginTop: '40px' }}>

                        <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '10px' }}>Đổi mật khẩu</h2>
                        <hr style={{ border: 'none', borderTop: '2px solid #f4f7fe', marginBottom: '25px' }} />

                        {/* HIỂN THỊ THÔNG BÁO LỖI / THÀNH CÔNG */}
                        {message && (
                            <div style={{
                                padding: '12px', marginBottom: '20px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem',
                                backgroundColor: isError ? '#fff1f0' : '#e6fff5',
                                color: isError ? '#ff5630' : '#05cd99',
                                border: `1px solid ${isError ? '#ff5630' : '#05cd99'}`
                            }}>
                                {message}
                            </div>
                        )}

                        {/* FORM NHẬP LIỆU */}
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>Mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>Mật khẩu mới</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '30px' }}>
                                <label style={labelStyle}>Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            <button type="submit" style={buttonStyle}>
                                Xác nhận đổi mật khẩu
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}

// === CÁC STYLE ĐỊNH DẠNG TÁI SỬ DỤNG ===
const labelStyle = {
    display: 'block',
    fontWeight: 'bold',
    color: '#2b3674',
    marginBottom: '8px',
    fontSize: '0.95rem'
};

const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    outline: 'none',
    color: '#1b2559',
    fontWeight: '500',
    boxSizing: 'border-box',
    fontSize: '1rem'
};

const buttonStyle = {
    width: '100%',
    backgroundColor: '#4318ff',
    color: 'white',
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0px 10px 20px rgba(67, 24, 255, 0.15)',
    fontSize: '1rem',
    transition: '0.3s'
};

export default ChangePasswordPage;