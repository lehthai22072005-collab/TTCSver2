import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function MySalaryPage() {
    // Dữ liệu mẫu danh sách phiếu lương
    const [salaryList] = useState([
        { id: 1, month: '03/2026', status: 'Đã chốt', total: '11.000.000đ', date: '05/04/2026' },
        { id: 2, month: '02/2026', status: 'Đã thanh toán', total: '10.500.000đ', date: '05/03/2026' },
    ]);

    const handleViewDetail = (month) => {
        alert(`Hệ thống: Đang tải chi tiết bảng lương tháng ${month}...`);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ backgroundColor: '#f4f7fe', minHeight: '100vh', padding: '30px' }}>

                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '25px', textTransform: 'uppercase' }}>
                            Phiếu lương cá nhân
                        </h2>

                        {/* Thẻ tóm tắt nhanh */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                            <div style={summaryCardStyle}>
                                <p style={labelStyle}>Tổng thu nhập năm 2026</p>
                                <h3 style={{ color: '#4318ff', fontWeight: 'bold', margin: 0 }}>21.500.000 đ</h3>
                            </div>
                            <div style={summaryCardStyle}>
                                <p style={labelStyle}>Tháng gần nhất (03/26)</p>
                                <h3 style={{ color: '#05cd99', fontWeight: 'bold', margin: 0 }}>11.000.000 đ</h3>
                            </div>
                        </div>

                        {/* Bảng danh sách phiếu lương */}
                        <div style={tableCardStyle}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ borderBottom: '1px solid #f4f7fe' }}>
                                    <th style={thStyle}>Tháng</th>
                                    <th style={thStyle}>Ngày chốt</th>
                                    <th style={thStyle}>Tổng thực lĩnh</th>
                                    <th style={thStyle}>Trạng thái</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {salaryList.map((item) => (
                                    <tr key={item.id} style={trStyle}>
                                        <td style={{ ...tdStyle, fontWeight: '700' }}>{item.month}</td>
                                        <td style={tdStyle}>{item.date}</td>
                                        <td style={{ ...tdStyle, color: '#4318ff', fontWeight: '700' }}>{item.total}</td>
                                        <td style={tdStyle}>
                                                <span style={getStatusStyle(item.status)}>
                                                    {item.status}
                                                </span>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleViewDetail(item.month)}
                                                style={btnDetailStyle}
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <p style={{ marginTop: '20px', color: '#707eae', fontSize: '0.85rem', fontStyle: 'italic' }}>
                            * Mọi thắc mắc về bảng lương vui lòng phản hồi trong vòng 3 ngày kể từ ngày chốt lương.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Styles chuyên nghiệp ---
const summaryCardStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0px 10px 20px rgba(112, 144, 176, 0.05)',
    border: 'none'
};

const tableCardStyle = {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '25px',
    boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)'
};

const thStyle = {
    textAlign: 'left',
    padding: '15px 10px',
    color: '#a3aed0',
    fontSize: '0.85rem',
    fontWeight: '500',
    textTransform: 'uppercase'
};

const tdStyle = {
    padding: '20px 10px',
    fontSize: '0.95rem',
    color: '#2b3674'
};

const trStyle = {
    borderBottom: '1px solid #f4f7fe'
};

const labelStyle = {
    fontSize: '0.85rem',
    color: '#a3aed0',
    marginBottom: '5px'
};

const btnDetailStyle = {
    padding: '8px 18px',
    backgroundColor: '#f4f7fe',
    color: '#4318ff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

const getStatusStyle = (status) => {
    const isPaid = status === 'Đã thanh toán';
    return {
        padding: '5px 12px',
        borderRadius: '8px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        backgroundColor: isPaid ? '#e6fffb' : '#fff7e6',
        color: isPaid ? '#00b8d9' : '#ffab00'
    };
};

export default MySalaryPage;