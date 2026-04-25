import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import '../App.css';

function ReportsPage() {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <h3>Xuất Báo cáo Kế toán</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderTop: '4px solid #3b82f6' }}>
                            <h4 style={{ color: '#1e293b', marginBottom: '10px' }}>Báo cáo Tổng hợp Quỹ lương</h4>
                            <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '0.95rem' }}>
                                Kết xuất dữ liệu chi tiết cấu trúc quỹ lương toàn trường (Lương cơ bản, phụ cấp, thưởng, khấu trừ) đóng gói file Excel (.xlsx).
                            </p>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <select style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}>
                                    <option>Tháng 4 / 2026</option>
                                    <option>Tháng 3 / 2026</option>
                                    <option>Tháng 2 / 2026</option>
                                </select>
                                <button className="btn-primary" style={{ padding: '8px 16px' }}>Tải xuống Excel</button>
                            </div>
                        </div>

                        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderTop: '4px solid #10b981' }}>
                            <h4 style={{ color: '#1e293b', marginBottom: '10px' }}>Báo cáo Thuế TNCN & BHXH</h4>
                            <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '0.95rem' }}>
                                Danh sách trích xuất các khoản đóng Thuế thu nhập cá nhân và Bảo hiểm Xã hội của từng nhân sự, sử dụng ký số gửi chi cục Thuế.
                            </p>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <select style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}>
                                    <option>Quý 2 / 2026</option>
                                    <option>Quý 1 / 2026</option>
                                    <option>Năm 2025</option>
                                </select>
                                <button className="btn-primary" style={{ padding: '8px 16px', backgroundColor: '#10b981' }}>Tải xuống PDF</button>
                            </div>
                        </div>

                        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderTop: '4px solid #f59e0b', gridColumn: '1 / span 2' }}>
                            <h4 style={{ color: '#1e293b', marginBottom: '10px' }}>Danh sách Yêu cầu Chuyển khoản (Gửi Ngân hàng)</h4>
                            <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '0.95rem' }}>
                                Bảng kê khai chi tiết Số tài khoản, Tên chủ thẻ, Số tiền để tải lên hệ thống Internet Banking của ngân hàng đối tác.
                            </p>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input type="date" defaultValue="2026-04-19" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} />
                                <button className="btn-secondary" style={{ padding: '8px 16px', color: '#b45309', borderColor: '#fcd34d' }}>Export CSV Format</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportsPage;
