import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import '../App.css';

function SettingsPage() {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '800px', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px', color: '#1e293b' }}>Cấu hình Hệ thống</h2>
                        
                        <div style={{ marginBottom: '30px' }}>
                            <h4 style={{ color: '#0f172a', marginBottom: '15px' }}>1. Thiết lập tham số Lương & Chấm công</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ color: '#475569', fontWeight: 'bold' }}>Số ngày công chuẩn / tháng</label>
                                    <input type="number" defaultValue="22" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ color: '#475569', fontWeight: 'bold' }}>Mức lương cơ sở tối thiểu (VNĐ)</label>
                                    <input type="number" defaultValue="1800000" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ color: '#475569', fontWeight: 'bold' }}>Tỷ lệ đóng BHXH (%)</label>
                                    <input type="number" defaultValue="10.5" step="0.1" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ color: '#475569', fontWeight: 'bold' }}>Phụ cấp giảng dạy vượt giờ / tiết</label>
                                    <input type="number" defaultValue="150000" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                            <h4 style={{ color: '#0f172a', marginBottom: '15px' }}>2. Tham số Hệ thống Phân quyền</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <input type="checkbox" id="auto-lock" defaultChecked />
                                <label htmlFor="auto-lock" style={{ color: '#475569' }}>Tự động khoá tài khoản Học vụ / Nhân sự sau 6 tháng không đăng nhập.</label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input type="checkbox" id="require-2fa" />
                                <label htmlFor="require-2fa" style={{ color: '#475569' }}>Bắt buộc xác thực 2 bước (2FA) đối với nhóm quyền ADMIN.</label>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button className="btn-secondary" style={{ padding: '10px 20px' }}>Khôi phục mặc định</button>
                            <button className="btn-primary" style={{ padding: '10px 20px' }}>Lưu thay đổi</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
