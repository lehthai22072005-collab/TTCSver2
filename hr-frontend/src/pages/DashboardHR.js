import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function DashboardHR() {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '30px' }}>Dashboard Phòng Nhân Sự</h2>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={cardStyle}>
                            <h3 style={{ color: '#2b3674' }}>Quản lý nhân sự</h3>
                            <p style={{ color: '#a3aed0' }}>Tra cứu, thêm mới và cập nhật thông tin hồ sơ của toàn bộ nhân viên.</p>
                        </div>
                        <div style={cardStyle}>
                            <h3 style={{ color: '#2b3674' }}>Phê duyệt đơn từ</h3>
                            <p style={{ color: '#a3aed0' }}>Xử lý các đơn xin nghỉ phép, theo dõi tiến trình phê duyệt.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '15px',
    padding: '20px',
    flex: 1,
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
};

export default DashboardHR;
