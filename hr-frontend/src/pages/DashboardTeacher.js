import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function DashboardTeacher() {
    const userName = localStorage.getItem('username') || 'Giảng viên';

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '30px' }}>
                        DASHBOARD GIẢNG VIÊN
                    </h2>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                        <div style={cardPrimary}>
                            <p style={labelStyle}>SỐ TIẾT DẠY THÁNG NÀY</p>
                            <h2 style={valueStyle}>12 Tiết</h2>
                        </div>
                        <div style={cardSuccess}>
                            <p style={labelStyle}>NGÀY PHÉP CÒN LẠI</p>
                            <h2 style={valueStyle}>10 Ngày</h2>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)' }}>
                        <h4 style={{ color: '#1b2559', fontWeight: 'bold', marginBottom: '20px' }}>Xin chào {userName}!</h4>
                        <p style={{ color: '#475569', lineHeight: '1.8' }}>
                            Chào mừng bạn đến với Cổng thông tin dành cho Giảng viên. Tại đây, bạn có thể:
                            <br/>- Xem chấm công và lịch dạy cá nhân.
                            <br/>- Theo dõi phiếu lương hàng tháng.
                            <br/>- Nộp đơn xin nghỉ phép trực tuyến.
                        </p>
                        <p style={{ color: '#ef4444', fontStyle: 'italic', marginTop: '15px' }}>
                            * Lưu ý: Mọi thắc mắc về phiếu lương, vui lòng liên hệ Phòng Kế toán trước ngày 10 hàng tháng.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Styles
const labelStyle = { fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px', opacity: 0.9 };
const valueStyle = { fontSize: '2.4rem', fontWeight: '800', margin: 0 };
const cardPrimary = { flex: 1, background: 'linear-gradient(90deg, #4318ff 0%, #5e3aff 100%)', borderRadius: '20px', padding: '30px', color: '#fff', boxShadow: '0px 18px 40px rgba(67, 24, 255, 0.2)' };
const cardSuccess = { flex: 1, background: 'linear-gradient(90deg, #05cd99 0%, #04b688 100%)', borderRadius: '20px', padding: '30px', color: '#fff', boxShadow: '0px 18px 40px rgba(5, 205, 153, 0.2)' };

export default DashboardTeacher;