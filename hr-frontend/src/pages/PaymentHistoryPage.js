import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import '../App.css';

function PaymentHistoryPage() {
    const [history] = useState([
        { id: 'GD_001', date: '05/04/2026', title: 'Thanh toán lương kỳ tháng 3/2026', amount: 156000000, method: 'Chuyển khoản Ngân hàng', status: 'Thành công' },
        { id: 'GD_002', date: '05/03/2026', title: 'Thanh toán lương kỳ tháng 2/2026', amount: 154500000, method: 'Chuyển khoản Ngân hàng', status: 'Thành công' },
        { id: 'GD_003', date: '15/02/2026', title: 'Chi trả tiền thưởng Tết Nguyên Đán', amount: 85000000, method: 'Chuyển khoản Ngân hàng', status: 'Thành công' },
        { id: 'GD_004', date: '05/02/2026', title: 'Thanh toán lương kỳ tháng 1/2026', amount: 152000000, method: 'Chuyển khoản Ngân hàng', status: 'Thành công' },
    ]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <div className="header-action">
                        <h3>Lịch sử Chi trả</h3>
                        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>🔄</span> Đồng bộ hệ thống</button>
                    </div>
                    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Mã GD</th>
                                    <th>Ngày thanh toán</th>
                                    <th>Nội dung chi trả</th>
                                    <th>Tổng số tiền</th>
                                    <th>Phương thức chuyển</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((record, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: 'bold', color: '#64748b' }}>{record.id}</td>
                                        <td>{record.date}</td>
                                        <td>{record.title}</td>
                                        <td style={{ color: '#0ea5e9', fontWeight: 'bold' }}>{formatCurrency(record.amount)}</td>
                                        <td>{record.method}</td>
                                        <td><span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>{record.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentHistoryPage;
