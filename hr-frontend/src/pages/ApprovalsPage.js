import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function ApprovalsPage() {
    // Quản lý danh sách đơn từ để có thể thao tác phê duyệt/từ chối
    const [approvals, setApprovals] = useState([
        { id: '01', staffId: 'GV001', from: '01/03/2026', to: '02/03/2026', status: 'Chờ duyệt', type: 'Nghỉ phép năm' },
        { id: '02', staffId: 'NV002', from: '05/03/2026', to: '05/03/2026', status: 'Chờ duyệt', type: 'Việc riêng' },
    ]);

    const [filter, setFilter] = useState('Tất cả');

    // Hàm xử lý phê duyệt nhanh
    const handleAction = (id, action) => {
        const statusText = action === 'approve' ? 'Đã duyệt' : 'Từ chối';
        setApprovals(approvals.map(item =>
            item.id === id ? { ...item, status: statusText } : item
        ));
        alert(`Hệ thống: Đã thực hiện ${statusText} cho đơn mã ${id}`);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ backgroundColor: '#f4f7fe', minHeight: '100vh', padding: '30px' }}>

                    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                        {/* Header & Bộ lọc */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h2 style={{ fontWeight: 'bold', color: '#1b2559', textTransform: 'uppercase', margin: 0 }}>
                                Phê duyệt đơn từ
                            </h2>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: '#707eae', fontSize: '0.9rem' }}>Lọc trạng thái:</span>
                                <select
                                    style={selectStyle}
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                >
                                    <option>Tất cả</option>
                                    <option>Chờ duyệt</option>
                                    <option>Đã duyệt</option>
                                    <option>Từ chối</option>
                                </select>
                            </div>
                        </div>

                        {/* Bảng danh sách đơn từ */}
                        <div style={tableCardStyle}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ borderBottom: '1px solid #e9edf7' }}>
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>NHÂN VIÊN</th>
                                    <th style={thStyle}>LOẠI ĐƠN</th>
                                    <th style={thStyle}>TỪ NGÀY</th>
                                    <th style={thStyle}>ĐẾN NGÀY</th>
                                    <th style={thStyle}>TRẠNG THÁI</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>THAO TÁC</th>
                                </tr>
                                </thead>
                                <tbody>
                                {approvals.map((item) => (
                                    <tr key={item.id} style={trStyle}>
                                        <td style={tdStyle}>{item.id}</td>
                                        <td style={{ ...tdStyle, fontWeight: '700', color: '#1b2559' }}>{item.staffId}</td>
                                        <td style={tdStyle}>{item.type}</td>
                                        <td style={tdStyle}>{item.from}</td>
                                        <td style={tdStyle}>{item.to}</td>
                                        <td style={tdStyle}>
                                                <span style={getStatusBadge(item.status)}>
                                                    {item.status}
                                                </span>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                            {item.status === 'Chờ duyệt' ? (
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    <button
                                                        onClick={() => handleAction(item.id, 'approve')}
                                                        style={{ ...btnAction, backgroundColor: '#05cd99' }}
                                                    >
                                                        Duyệt
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(item.id, 'reject')}
                                                        style={{ ...btnAction, backgroundColor: '#ee5d50' }}
                                                    >
                                                        Từ chối
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{ color: '#a3aed0', fontSize: '0.85rem' }}>Đã xử lý</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <p style={{ marginTop: '20px', color: '#707eae', fontSize: '0.85rem', fontStyle: 'italic' }}>
                            * Lưu ý: Các đơn đã phê duyệt hoặc từ chối sẽ được lưu lịch sử và gửi thông báo tới nhân viên.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Styles chuyên nghiệp ---
const tableCardStyle = {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)',
    border: 'none'
};

const thStyle = {
    textAlign: 'left',
    padding: '15px 10px',
    color: '#a3aed0',
    fontSize: '0.85rem',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.02em'
};

const tdStyle = {
    padding: '20px 10px',
    fontSize: '0.95rem',
    color: '#2b3674'
};

const trStyle = {
    borderBottom: '1px solid #f4f7fe'
};

const selectStyle = {
    padding: '8px 15px',
    borderRadius: '10px',
    border: '1px solid #e0e5f2',
    color: '#2b3674',
    fontWeight: '600',
    outline: 'none',
    cursor: 'pointer'
};

const btnAction = {
    padding: '6px 15px',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'transform 0.1s'
};

const getStatusBadge = (status) => {
    let colors = { bg: '#fff7e6', text: '#ffab00' }; // Chờ duyệt
    if (status === 'Đã duyệt') colors = { bg: '#e6fffb', text: '#00b8d9' };
    if (status === 'Từ chối') colors = { bg: '#fff1f0', text: '#ff5630' };

    return {
        padding: '5px 12px',
        borderRadius: '8px',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        backgroundColor: colors.bg,
        color: colors.text
    };
};

export default ApprovalsPage;