import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function PaymentHistoryPage() {
    // Dữ liệu mẫu theo Wireframe: Tháng | Ngày chốt | Trạng thái
    const [history] = useState([
        { id: 1, month: '02/26', lockDate: '28/02', status: 'Đã chi' },
        { id: 2, month: '01/26', lockDate: '31/01', status: 'Đã chi' },
    ]);

    // State cho Modal xem chi tiết
    const [showDetail, setShowDetail] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');

    // Dữ liệu bảng lương giả lập để hiển thị lại (Read-only)
    const mockSalaryDetails = [
        { id: 'GV001', name: 'Nguyen Van A', workDays: 26, periods: 40, total: 11000000 },
        { id: 'NV002', name: 'Tran Thi B', workDays: 24, periods: 35, total: 9500000 }
    ];

    const handleViewDetail = (month) => {
        setSelectedMonth(month);
        setShowDetail(true);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    {/* Header chuẩn Wireframe */}
                    <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>
                        <h2 style={{ fontWeight: 'bold' }}>LỊCH SỬ CHI TRẢ</h2>
                    </div>

                    <div className="card shadow-sm" style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
                        <table className="data-table" style={{ marginTop: 0 }}>
                            <thead>
                            <tr style={{ backgroundColor: '#f8fafc' }}>
                                <th>Tháng</th>
                                <th>Ngày chốt</th>
                                <th>Trạng thái</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {history.map((item) => (
                                <tr key={item.id}>
                                    <td style={{ fontWeight: 'bold' }}>{item.month}</td>
                                    <td>{item.lockDate}</td>
                                    <td>
                                        <span style={{ color: '#10b981', fontWeight: '500' }}>{item.status}</span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleViewDetail(item.month)}
                                            style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
                                        >
                                            [Xem chi tiết]
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL CHI TIẾT BẢNG LƯƠNG (READ-ONLY) */}
            {showDetail && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '800px', borderRadius: '4px', border: '2px solid #000' }}>
                        <h3 style={{ textAlign: 'center', background: '#f8fafc', padding: '15px', borderBottom: '1px solid #000' }}>
                            CHI TIẾT BẢNG LƯƠNG THÁNG {selectedMonth}
                        </h3>
                        <div style={{ padding: '20px' }}>
                            <p style={{ fontStyle: 'italic', marginBottom: '15px', color: '#64748b' }}>
                                (Hiển thị lại bảng lương đã chốt - chế độ chỉ đọc)
                            </p>

                            <table className="data-table">
                                <thead>
                                <tr style={{ backgroundColor: '#f1f5f9' }}>
                                    <th>Mã NV</th>
                                    <th>Họ tên</th>
                                    <th>Công</th>
                                    <th>Tiết dạy</th>
                                    <th>Tổng nhận</th>
                                </tr>
                                </thead>
                                <tbody>
                                {mockSalaryDetails.map((s, idx) => (
                                    <tr key={idx}>
                                        <td>{s.id}</td>
                                        <td className="font-bold">{s.name}</td>
                                        <td>{s.workDays}</td>
                                        <td>{s.periods}</td>
                                        <td style={{ fontWeight: 'bold' }}>{(s.total / 1000000)}tr</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                                <button
                                    className="btn-secondary"
                                    onClick={() => setShowDetail(false)}
                                    style={{ padding: '10px 40px', border: '1px solid #000' }}
                                >
                                    [ Đóng ]
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PaymentHistoryPage;