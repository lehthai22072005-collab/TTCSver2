import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function LeaveRequestPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const [leaveRequests, setLeaveRequests] = useState([]);
    const [newRequest, setNewRequest] = useState({ startDate: '', endDate: '', reason: '' });

    const [empInfo, setEmpInfo] = useState({ id: null, name: '' });
    const [ngayPhepConLai, setNgayPhepConLai] = useState(12);

    const currentUsername = localStorage.getItem("username");
    const currentRole = localStorage.getItem("role");

    // HÀM TÍNH NGÀY NGHỈ ĐÃ ĐƯỢC FIX LỖI TIMEZONE VÀ ĐỊNH DẠNG
    const calculateLeaveDays = (start, end) => {
        if (!start || !end) return 1;
        try {
            // Loại bỏ phần giờ nếu có (chỉ lấy YYYY-MM-DD)
            let startStr = String(start).split('T')[0];
            let endStr = String(end).split('T')[0];

            // Nếu dữ liệu trả về kiểu VN (dd/MM/yyyy) thì đảo lại chuẩn quốc tế
            if (startStr.includes('/')) {
                const p = startStr.split('/');
                startStr = `${p[2]}-${p[1]}-${p[0]}`;
            }
            if (endStr.includes('/')) {
                const p = endStr.split('/');
                endStr = `${p[2]}-${p[1]}-${p[0]}`;
            }

            // Ép cấu trúc ngày về thời gian chuẩn địa phương 00:00:00 để tính chính xác cơ học
            const sDate = new Date(startStr + 'T00:00:00');
            const eDate = new Date(endStr + 'T00:00:00');

            const diffTime = eDate.getTime() - sDate.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;

            return isNaN(diffDays) || diffDays <= 0 ? 1 : diffDays;
        } catch (error) {
            return 1;
        }
    };

    const fetchRequests = async () => {
        try {
            const profileRes = await axios.get(`/api/profile/${currentRole}/${currentUsername}`);
            const employeeId = profileRes.data.id;
            const employeeName = profileRes.data.fullName;
            setEmpInfo({ id: employeeId, name: employeeName });

            const res = await axios.get(`/api/leave-requests/employee/${employeeId}`);
            const sortedData = res.data.sort((a, b) => b.id - a.id);
            setLeaveRequests(sortedData);

            // Tính toán trừ quỹ ngày nghỉ
            const deductedDays = sortedData
                .filter(req => req.status === 'Đã duyệt' || req.status === 'Chờ duyệt')
                .reduce((sum, req) => sum + calculateLeaveDays(req.startDate, req.endDate), 0);

            setNgayPhepConLai(12 - deductedDays);

        } catch (err) {
            console.error("Lỗi tải đơn nghỉ phép:", err);
        }
    };

    useEffect(() => {
        if (currentUsername && currentRole) {
            fetchRequests();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUsername, currentRole]);

    const handleSendRequest = async () => {
        if (!newRequest.startDate || !newRequest.endDate || !newRequest.reason) {
            return alert("Vui lòng điền đầy đủ ngày tháng và lý do!");
        }

        try {
            await axios.post("/api/leave-requests", {
                employeeId: empInfo.id,
                employeeName: empInfo.name,
                startDate: newRequest.startDate,
                endDate: newRequest.endDate,
                reason: newRequest.reason,
                status: "Chờ duyệt"
            });

            alert("✅ Đã gửi đơn xin nghỉ thành công!");
            setShowCreateModal(false);
            setNewRequest({ startDate: '', endDate: '', reason: '' });
            fetchRequests();
        } catch (err) {
            alert("❌ Lỗi khi gửi đơn: " + err.message);
        }
    };

    const openViewModal = (req) => {
        setSelectedRequest(req);
        setShowViewModal(true);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>
                        <h2 style={{ fontWeight: 'bold', textTransform: 'uppercase', color: '#1b2559' }}>Nghỉ phép cá nhân</h2>
                    </div>

                    <div className="card shadow-sm" style={{ padding: '25px', backgroundColor: '#fff', borderRadius: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: '1.2rem', margin: 0, fontWeight: '500', color: '#2b3674' }}>
                            Số ngày phép còn lại trong năm: <b style={{ color: '#05cd99', fontSize: '1.5rem', marginLeft: '10px' }}>{ngayPhepConLai} ngày</b>
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            style={{ backgroundColor: '#4318ff', color: '#fff', padding: '12px 25px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            [ + Tạo đơn nghỉ mới ]
                        </button>
                    </div>

                    <div className="card shadow-sm" style={{ backgroundColor: '#fff', borderRadius: '15px', padding: '20px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ borderBottom: '2px solid #f4f7fe', color: '#a3aed0', textAlign: 'left' }}>
                                <th style={{ padding: '15px' }}>MÃ ĐƠN</th>
                                <th style={{ padding: '15px' }}>TỪ NGÀY</th>
                                <th style={{ padding: '15px' }}>ĐẾN NGÀY</th>
                                <th style={{ padding: '15px' }}>TRẠNG THÁI</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>THAO TÁC</th>
                            </tr>
                            </thead>
                            <tbody>
                            {leaveRequests.length > 0 ? leaveRequests.map((req) => (
                                <tr key={req.id} style={{ borderBottom: '1px solid #f4f7fe', color: '#2b3674' }}>
                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>#{req.id}</td>
                                    <td style={{ padding: '15px' }}>{req.startDate}</td>
                                    <td style={{ padding: '15px' }}>{req.endDate}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={getStatusBadge(req.status)}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <button
                                            onClick={() => openViewModal(req)}
                                            style={{ color: '#4318ff', background: '#f4f7fe', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#a3aed0' }}>Chưa có đơn nghỉ phép nào.</td></tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL TẠO ĐƠN */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '550px', padding: '30px', borderRadius: '20px' }}>
                        <h3 style={{ textAlign: 'center', fontWeight: 'bold', color: '#1b2559', marginBottom: '20px' }}>
                            TẠO ĐƠN NGHỈ PHÉP
                        </h3>
                        <div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Từ ngày:</label>
                                <input type="date" style={inputStyle} onChange={e => setNewRequest({...newRequest, startDate: e.target.value})} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Đến ngày:</label>
                                <input type="date" style={inputStyle} onChange={e => setNewRequest({...newRequest, endDate: e.target.value})} />
                            </div>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Lý do nghỉ:</label>
                                <textarea rows="4" style={inputStyle} placeholder="Nhập lý do chi tiết..." onChange={e => setNewRequest({...newRequest, reason: e.target.value})}></textarea>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                                <button onClick={handleSendRequest} style={{ backgroundColor: '#4318ff', color: 'white', padding: '12px 30px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Gửi đơn duyệt</button>
                                <button onClick={() => setShowCreateModal(false)} style={{ backgroundColor: '#f4f7fe', color: '#1b2559', padding: '12px 30px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Hủy bỏ</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL XEM CHI TIẾT */}
            {showViewModal && selectedRequest && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '500px', padding: '30px', borderRadius: '20px' }}>
                        <h3 style={{ textAlign: 'center', fontWeight: 'bold', color: '#1b2559', marginBottom: '20px', borderBottom: '2px solid #f4f7fe', paddingBottom: '15px' }}>
                            CHI TIẾT ĐƠN NGHỈ MÃ #{selectedRequest.id}
                        </h3>
                        <div style={{ lineHeight: '2', color: '#2b3674', fontSize: '1.05rem' }}>
                            <p><b>Nhân sự:</b> {empInfo.name}</p>
                            <p><b>Thời gian nghỉ:</b> Từ {selectedRequest.startDate} đến {selectedRequest.endDate}</p>
                            <p><b>Trạng thái duyệt:</b> <span style={getStatusBadge(selectedRequest.status)}>{selectedRequest.status}</span></p>
                            <div style={{ marginTop: '20px' }}>
                                <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Lý do trình bày:</p>
                                <div style={{ padding: '15px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', minHeight: '80px' }}>
                                    {selectedRequest.reason}
                                </div>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                                <button onClick={() => setShowViewModal(false)} style={{ backgroundColor: '#f4f7fe', color: '#1b2559', padding: '10px 40px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                                    Đóng lại
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit' };

const getStatusBadge = (status) => {
    if (status === 'Đã duyệt') return { padding: '6px 12px', borderRadius: '8px', backgroundColor: '#e6fffb', color: '#00b8d9', fontWeight: 'bold', fontSize: '0.85rem' };
    if (status === 'Từ chối') return { padding: '6px 12px', borderRadius: '8px', backgroundColor: '#fff1f0', color: '#ff5630', fontWeight: 'bold', fontSize: '0.85rem' };
    return { padding: '6px 12px', borderRadius: '8px', backgroundColor: '#fff7e6', color: '#ffab00', fontWeight: 'bold', fontSize: '0.85rem' };
};

export default LeaveRequestPage;
