import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function LeaveRequestPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const [leaveRequests, setLeaveRequests] = useState([
        { id: '01', startDate: '2026-03-01', endDate: '2026-03-02', reason: 'Nghỉ ốm', status: 'Chờ duyệt' },
        { id: '02', startDate: '2026-03-05', endDate: '2026-03-05', reason: 'Việc gia đình', status: 'Đồng ý' },
        { id: '03', startDate: '2026-03-10', endDate: '2026-03-11', reason: 'Đi khám bệnh', status: 'Từ chối' },
    ]);

    const [newRequest, setNewRequest] = useState({ startDate: '', endDate: '', reason: '' });

    // Hàm mở Modal xem chi tiết
    const openViewModal = (req) => {
        setSelectedRequest(req);
        setShowViewModal(true);
    };

    const handleSendRequest = () => {
        alert("Đã gửi đơn xin nghỉ!");
        setShowCreateModal(false);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>
                        <h2 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Nghỉ phép</h2>
                    </div>

                    <div className="card p-4 mb-4 shadow-sm" style={{ border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                            Số ngày phép còn lại: <b style={{ marginLeft: '10px' }}>5 ngày</b>
                        </p>
                        <button
                            className="btn-primary"
                            onClick={() => setShowCreateModal(true)}
                            style={{ padding: '10px 25px', borderRadius: '4px' }}
                        >
                            [ + Tạo đơn ]
                        </button>
                    </div>

                    <div className="card shadow-sm" style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                        <table className="data-table" style={{ marginTop: 0 }}>
                            <thead style={{ backgroundColor: '#f8fafc' }}>
                            <tr>
                                <th>ID</th>
                                <th>Từ ngày</th>
                                <th>Đến ngày</th>
                                <th>Trạng thái</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {leaveRequests.map((req) => (
                                <tr key={req.id}>
                                    <td>{req.id}</td>
                                    <td>{req.startDate}</td>
                                    <td>{req.endDate}</td>
                                    <td>
                                            <span style={{
                                                fontWeight: 'bold',
                                                color: req.status === 'Đồng ý' ? '#10b981' : (req.status === 'Từ chối' ? '#ef4444' : '#f59e0b')
                                            }}>
                                                {req.status}
                                            </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={() => openViewModal(req)}
                                            style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            [Xem]
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL TẠO ĐƠN NGHỈ */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '550px', border: '2px solid #000', padding: 0 }}>
                        <h3 style={{ textAlign: 'center', background: '#f8fafc', padding: '15px', borderBottom: '1px solid #000', fontWeight: 'bold', margin: 0 }}>
                            TẠO ĐƠN NGHỈ
                        </h3>
                        <div style={{ padding: '30px' }}>
                            <div className="form-group mb-3" style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center' }}>
                                <label>Từ ngày:</label>
                                <input type="date" className="form-control" onChange={e => setNewRequest({...newRequest, startDate: e.target.value})} />
                            </div>
                            <div className="form-group mb-3" style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center' }}>
                                <label>Đến ngày:</label>
                                <input type="date" className="form-control" onChange={e => setNewRequest({...newRequest, endDate: e.target.value})} />
                            </div>
                            <div className="form-group mb-4">
                                <label className="mb-2 d-block">Lý do:</label>
                                <textarea className="form-control" rows="3" style={{ border: '1px solid #000' }} onChange={e => setNewRequest({...newRequest, reason: e.target.value})}></textarea>
                            </div>
                            <div className="d-flex justify-content-center gap-5">
                                <button className="btn-primary" onClick={handleSendRequest} style={{ padding: '10px 30px' }}>[ Gửi đơn ]</button>
                                <button className="btn-secondary" onClick={() => setShowCreateModal(false)} style={{ padding: '10px 30px', background: 'none', border: 'none', color: '#000' }}>[ Hủy ]</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL XEM CHI TIẾT (Form nút xem bạn yêu cầu) */}
            {showViewModal && selectedRequest && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '550px', border: '2px solid #3b82f6', padding: 0 }}>
                        <h3 style={{ textAlign: 'center', background: '#eff6ff', padding: '15px', borderBottom: '1px solid #3b82f6', fontWeight: 'bold', margin: 0 }}>
                            CHI TIẾT ĐƠN NGHỈ
                        </h3>
                        <div style={{ padding: '30px', lineHeight: '2' }}>
                            <p><b>Mã đơn:</b> <span style={{ marginLeft: '45px' }}>{selectedRequest.id}</span></p>
                            <p><b>Từ ngày:</b> <span style={{ marginLeft: '40px' }}>{selectedRequest.startDate}</span></p>
                            <p><b>Đến ngày:</b> <span style={{ marginLeft: '35px' }}>{selectedRequest.endDate}</span></p>
                            <p><b>Trạng thái:</b>
                                <span style={{
                                    marginLeft: '32px',
                                    fontWeight: 'bold',
                                    color: selectedRequest.status === 'Đồng ý' ? '#10b981' : (selectedRequest.status === 'Từ chối' ? '#ef4444' : '#f59e0b')
                                }}>
                                    {selectedRequest.status}
                                </span>
                            </p>
                            <div className="mt-3">
                                <p><b>Lý do nghỉ:</b></p>
                                <div style={{ padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', minHeight: '60px' }}>
                                    {selectedRequest.reason}
                                </div>
                            </div>
                            <div className="text-center mt-4">
                                <button
                                    className="btn-secondary"
                                    onClick={() => setShowViewModal(false)}
                                    style={{ padding: '8px 40px', border: '1px solid #000' }}
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

export default LeaveRequestPage;