import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import '../App.css';

function ProfilePage() {
    const [profile, setProfile] = useState({
        username: '',
        fullName: 'Nguyễn Văn A',
        position: 'Giảng viên',
        department: 'Khoa Công nghệ Thông tin',
        email: 'nguyenvana@university.edu.vn',
        phone: '0987654321'
    });

    useEffect(() => {
        const user = localStorage.getItem('username');
        if (user) {
            setProfile(prev => ({ ...prev, username: user }));
        }
    }, []);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '600px', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px', color: '#1e293b' }}>Hồ sơ Cá nhân</h2>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', fontSize: '1.1rem' }}>
                            <div style={{ color: '#64748b', fontWeight: 'bold' }}>Tên đăng nhập:</div>
                            <div style={{ color: '#0f172a' }}>{profile.username}</div>

                            <div style={{ color: '#64748b', fontWeight: 'bold' }}>Họ và tên:</div>
                            <div style={{ color: '#0f172a' }}>{profile.fullName}</div>

                            <div style={{ color: '#64748b', fontWeight: 'bold' }}>Vị trí/Chức vụ:</div>
                            <div style={{ color: '#0f172a' }}>{profile.position}</div>

                            <div style={{ color: '#64748b', fontWeight: 'bold' }}>Đơn vị công tác:</div>
                            <div style={{ color: '#0f172a' }}>{profile.department}</div>

                            <div style={{ color: '#64748b', fontWeight: 'bold' }}>Email liên hệ:</div>
                            <div style={{ color: '#0f172a' }}>{profile.email}</div>

                            <div style={{ color: '#64748b', fontWeight: 'bold' }}>Số điện thoại:</div>
                            <div style={{ color: '#0f172a' }}>{profile.phone}</div>
                        </div>

                        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                            <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>
                                <i>Lưu ý: Bạn không có quyền tự thay đổi các thông tin cơ bản. Nếu cần cập nhật, vui lòng liên hệ phòng Hành chính - Nhân sự.</i>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
