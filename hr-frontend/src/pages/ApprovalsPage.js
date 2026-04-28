import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function ApprovalsPage() {
    // 1. Dữ liệu mẫu khớp Wireframe
    const [requests, setRequests] = useState([
        {
            id: '01', employeeId: 'GV001', name: 'Nguyễn Văn A', dept: 'Khoa CNTT',
            from: '01/03/2026', to: '02/03/2026', days: 2,
            type: 'Nghỉ phép năm', reason: 'Xin nghỉ việc gia đình', status: 'Chờ duyệt'
        },
        {
            id: '02', employeeId: 'NV002', name: 'Trần Thị B', dept: 'Hành chính',
            from: '05/03/2026', to: '05/03/2026', days: 1,
            type: 'Nghỉ ốm', reason: 'Đi khám bệnh', status: 'Chờ duyệt'
        }
    ]);

    const [filter, setFilter] = useState('Tất cả');
    const [selectedRequest, setSelectedRequest] = useState(null); // Đơn đang xem chi tiết
    const [note, setNote] = useState(''); // Ghi chú duyệt

    // 2. Hàm xử lý Duyệt / Từ chối
    const handleAction = (id, newStatus) => {
        setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
        setSelectedRequest(null);
        alert(`Hệ thống: Đã ${newStatus} đơn số ${id}`);
    };

    const filteredRequests = filter === 'Tất cả' ? requests : requests.filter(r => r.status === filter);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ maxWidth: '1000px' }}>

                    {/* Header chuẩn Wireframe */}
                    <div style={{ borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '20px' }}>
                        <h2 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Phê duyệt đơn từ</h2>
                    </div>

                    {/* Bộ lọc trạng thái */}
                    <div style={{ marginBottom: '20px' }}>
                        <select
                            style={{ padding: '8px 15px', border: '1px solid #000', cursor: 'pointer' }}
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="Tất cả">[ Lọc trạng thái ▼ ]</option>
                            <option value="Chờ duyệt">Chờ duyệt</option>
                            <option value="Đồng ý">Đã đồng ý</option>
                            <option value="Từ chối">Đã từ chối</option>
                        </select>
                    </div>

                    {/* Bảng danh sách chuẩn Wireframe 2 */}
                    <div style={{ border: '1px solid #000', backgroundColor: '#fff' }}>
                        <table className="data-table" style={{ marginTop: 0 }}>
                            <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #000' }}>
                                <th>ID</th>
                                <th>Nhân viên</th>
                                <th>Từ ngày</th>
                                <th>Đến ngày</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredRequests.map((req) => (
                                <tr key={req.id} style={{ borderBottom: '1px dashed #ccc' }}>
                                    <td>{req.id}</td>
                                    <td>{req.employeeId}</td>
                                    <td>{req.from}</td>
                                    <td>{req.to}</td>
                                    <td style={{
                                        fontWeight: 'bold',
                                        color: req.status === 'Chờ duyệt' ? '#f59e0b' : req.status === 'Đồng ý' ? '#10b981' : '#ef4444'
                                    }}>
                                        {req.status}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => setSelectedRequest(req)}
                                            style={{ background: 'none', border: '1px solid #000', padding: '2px 10px', cursor: 'pointer' }}
                                        >
                                            [ Xem chi tiết ]
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Action nhanh bên ngoài nếu cần */}
                    <div style={{ marginTop: '20px', fontSize: '0.9rem', fontStyle: 'italic' }}>
                        * Nhấn "Xem chi tiết" để thực hiện Đồng ý hoặc Từ chối đơn.
                    </div>
                </div>
            </div>

            {/* MODAL CHI TIẾT ĐƠN NGHỈ - Khớp chuẩn Wireframe 3 */}
            {selectedRequest && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#fff', width: '500px', border: '2px solid #000', padding: '0'
                    }}>
                        <div style={{ borderBottom: '1px solid #000', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                            CHI TIẾT ĐƠN NGHỈ
                        </div>

                        <div style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <span><b>ID:</b> {selectedRequest.id}</span>
                                <span><b>Trạng thái:</b> {selectedRequest.status}</span>
                            </div>

                            <div style={{ border: '1px dashed #000', padding: '10px', marginBottom: '15px' }}>
                                <p>Mã NV: {selectedRequest.employeeId}</p>
                                <p>Họ tên: {selectedRequest.name}</p>
                                <p>Phòng ban: {selectedRequest.dept}</p>
                            </div>

                            <div style={{ border: '1px dashed #000', padding: '10px', marginBottom: '15px' }}>
                                <p>Từ ngày: {selectedRequest.from}</p>
                                <p>Đến ngày: {selectedRequest.to}</p>
                                <p>Số ngày nghỉ: {selectedRequest.days} ngày</p>
                            </div>

                            <div style={{ border: '1px dashed #000', padding: '10px', marginBottom: '15px' }}>
                                <p>Loại phép: {selectedRequest.type}</p>
                                <p>Lý do: [ {selectedRequest.reason} ]</p>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label>Ghi chú duyệt:</label>
                                <textarea
                                    style={{ width: '100%', height: '60px', border: '1px solid #000', marginTop: '5px' }}
                                    placeholder="Nhập lý do nếu từ chối..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                <button onClick={() => setSelectedRequest(null)} style={{ border: '1px solid #000', padding: '8px 20px', cursor: 'pointer' }}>[ Đóng ]</button>
                                <div>
                                    <button
                                        onClick={() => handleAction(selectedRequest.id, 'Đồng ý')}
                                        style={{ backgroundColor: '#fff', border: '2px solid #000', padding: '8px 20px', cursor: 'pointer', marginRight: '10px', fontWeight: 'bold' }}
                                    >
                                        [ Đồng ý ✔ ]
                                    </button>
                                    <button
                                        onClick={() => handleAction(selectedRequest.id, 'Từ chối')}
                                        style={{ backgroundColor: '#fff', border: '2px solid #000', padding: '8px 20px', cursor: 'pointer', fontWeight: 'bold', color: 'red' }}
                                    >
                                        [ Từ chối ✘ ]
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ApprovalsPage;