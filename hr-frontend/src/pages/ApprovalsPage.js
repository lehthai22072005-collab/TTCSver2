import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function ApprovalsPage() {
    const [approvals, setApprovals] = useState([]);
    const [filter, setFilter] = useState('Tất cả');

    // 1. Lấy tất cả các đơn xin nghỉ phép từ Database
    const fetchApprovals = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/leave-requests");
            // Sắp xếp đơn mới nhất lên đầu
            const sortedData = res.data.sort((a, b) => b.id - a.id);
            setApprovals(sortedData);
        } catch (err) {
            console.error("Lỗi lấy danh sách đơn:", err);
        }
    };

    useEffect(() => {
        fetchApprovals();
    }, []);

    // 2. Xử lý nút bấm Duyệt / Từ chối
    const handleAction = async (id, action) => {
        const statusText = action === 'approve' ? 'Đã duyệt' : 'Từ chối';

        // Cảnh báo xác nhận trước khi thực hiện
        if(!window.confirm(`Xác nhận chuyển trạng thái đơn #${id} thành: ${statusText}?`)) return;

        try {
            await axios.put(`http://localhost:8080/api/leave-requests/${id}/status?status=${statusText}`);
            alert(`✅ Đã ${statusText} cho đơn mã #${id}`);
            fetchApprovals(); // Tải lại bảng để cập nhật trạng thái mới
        } catch (err) {
            alert("❌ Có lỗi xảy ra khi cập nhật: " + err.message);
        }
    };

    // 3. Logic Bộ lọc
    const filteredApprovals = approvals.filter(item =>
        filter === 'Tất cả' ? true : item.status === filter
    );

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ backgroundColor: '#f4f7fe', minHeight: '100vh', padding: '30px' }}>

                    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h2 style={{ fontWeight: 'bold', color: '#1b2559', textTransform: 'uppercase', margin: 0 }}>
                                Phê duyệt đơn từ
                            </h2>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: '#707eae', fontSize: '0.9rem', fontWeight: 'bold' }}>Lọc trạng thái:</span>
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

                        <div style={tableCardStyle}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ borderBottom: '1px solid #e9edf7' }}>
                                    <th style={thStyle}>MÃ ĐƠN</th>
                                    <th style={thStyle}>NGƯỜI GỬI</th>
                                    <th style={thStyle}>LÝ DO</th>
                                    <th style={thStyle}>THỜI GIAN NGHỈ</th>
                                    <th style={thStyle}>TRẠNG THÁI</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>THAO TÁC</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredApprovals.length > 0 ? filteredApprovals.map((item) => (
                                    <tr key={item.id} style={trStyle}>
                                        <td style={tdStyle}>#{item.id}</td>
                                        <td style={{ ...tdStyle, fontWeight: '700', color: '#1b2559' }}>{item.employeeName}</td>
                                        <td style={{ ...tdStyle, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {item.reason}
                                        </td>
                                        <td style={{ ...tdStyle, color: '#4318ff', fontWeight: '500' }}>{item.startDate} &rarr; {item.endDate}</td>
                                        <td style={tdStyle}>
                                            <span style={getStatusBadge(item.status)}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                            {item.status === 'Chờ duyệt' ? (
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    <button onClick={() => handleAction(item.id, 'approve')} style={{ ...btnAction, backgroundColor: '#05cd99' }}>
                                                        Duyệt
                                                    </button>
                                                    <button onClick={() => handleAction(item.id, 'reject')} style={{ ...btnAction, backgroundColor: '#ee5d50' }}>
                                                        Từ chối
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{ color: '#a3aed0', fontSize: '0.85rem', fontWeight: 'bold' }}>Đã xử lý</span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#a3aed0' }}>Không tìm thấy đơn nào phù hợp bộ lọc.</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        <p style={{ marginTop: '20px', color: '#707eae', fontSize: '0.85rem', fontStyle: 'italic' }}>
                            * Lưu ý: Các đơn đã phê duyệt hoặc từ chối sẽ được lưu lịch sử và cập nhật đồng bộ sang màn hình của nhân viên.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Styles ---
const tableCardStyle = { backgroundColor: '#fff', borderRadius: '20px', padding: '20px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)', border: 'none' };
const thStyle = { textAlign: 'left', padding: '15px 10px', color: '#a3aed0', fontSize: '0.85rem', fontWeight: '500', textTransform: 'uppercase' };
const tdStyle = { padding: '20px 10px', fontSize: '0.95rem', color: '#2b3674' };
const trStyle = { borderBottom: '1px solid #f4f7fe' };
const selectStyle = { padding: '8px 15px', borderRadius: '10px', border: '1px solid #e0e5f2', color: '#2b3674', fontWeight: '600', outline: 'none', cursor: 'pointer' };
const btnAction = { padding: '6px 15px', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', transition: 'transform 0.1s' };

const getStatusBadge = (status) => {
    if (status === 'Đã duyệt') return { padding: '6px 12px', borderRadius: '8px', backgroundColor: '#e6fffb', color: '#00b8d9', fontWeight: 'bold', fontSize: '0.85rem' };
    if (status === 'Từ chối') return { padding: '6px 12px', borderRadius: '8px', backgroundColor: '#fff1f0', color: '#ff5630', fontWeight: 'bold', fontSize: '0.85rem' };
    return { padding: '6px 12px', borderRadius: '8px', backgroundColor: '#fff7e6', color: '#ffab00', fontWeight: 'bold', fontSize: '0.85rem' };
};

export default ApprovalsPage;