import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import '../App.css';

function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Mật khẩu mới và xác nhận mật khẩu không khớp!');
            return;
        }

        // Fake success
        setMessage('Đổi mật khẩu thành công! (Mock)');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '500px', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px', color: '#1e293b' }}>Đổi mật khẩu</h2>
                        
                        {message && (
                            <div style={{ marginBottom: '20px', padding: '10px', borderRadius: '6px', backgroundColor: message.includes('thành công') ? '#dcfce7' : '#fee2e2', color: message.includes('thành công') ? '#166534' : '#991b1b', fontWeight: 'bold' }}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ color: '#475569', fontWeight: 'bold' }}>Mật khẩu hiện tại</label>
                                <input 
                                    type="password" 
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} 
                                    required 
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ color: '#475569', fontWeight: 'bold' }}>Mật khẩu mới</label>
                                <input 
                                    type="password" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} 
                                    required 
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ color: '#475569', fontWeight: 'bold' }}>Xác nhận mật khẩu mới</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} 
                                    required 
                                />
                            </div>

                            <button type="submit" className="btn-primary" style={{ padding: '12px', fontSize: '1rem', marginTop: '10px' }}>Xác nhận đổi mật khẩu</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordPage;
