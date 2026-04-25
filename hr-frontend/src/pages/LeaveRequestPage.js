import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function LeaveRequestPage() {
    const [requests, setRequests] = useState([]);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: ''
    });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const employeeId = localStorage.getItem('employeeId') || '1'; // Mock employee ID
            const res = await axios.get(`http://localhost:8080/api/leave-requests/employee/${employeeId}`);
            setRequests(res.data);
        } catch (err) {
            console.error("Lỗi lấy danh sách nghỉ phép:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const employeeId = localStorage.getItem('employeeId') || '1';
            const employeeName = localStorage.getItem('username') || 'Giáo viên';
            await axios.post('http://localhost:8080/api/leave-requests', {
                employeeId,
                employeeName,
                ...formData
            });
            alert("Yêu cầu nghỉ phép đã được gửi!");
            setFormData({ startDate: '', endDate: '', reason: '' });
            fetchRequests();
        } catch (err) {
            console.error("Lỗi gửi yêu cầu nghỉ phép:", err);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <h2>Yêu Cầu Nghỉ Phép</h2>

                    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                        <div style={{ flex: '1', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <h4 style={{ marginBottom: '15px' }}>Tạo Đơn Xin Nghỉ</h4>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div>
                                    <label>Từ ngày</label>
                                    <input type="date" required value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                                </div>
                                <div>
                                    <label>Đến ngày</label>
                                    <input type="date" required value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                                </div>
                                <div>
                                    <label>Lý do nghỉ</label>
                                    <textarea required value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} rows="4" style={{ width: '100%', padding: '8px', marginTop: '5px' }}></textarea>
                                </div>
                                <button type="submit" className="btn-primary">Gửi Đơn</button>
                            </form>
                        </div>

                        <div style={{ flex: '2', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <h4 style={{ marginBottom: '15px' }}>Lịch Sử Ngày Phép</h4>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                                        <th style={{ padding: '10px' }}>ID</th>
                                        <th style={{ padding: '10px' }}>Từ ngày</th>
                                        <th style={{ padding: '10px' }}>Đến ngày</th>
                                        <th style={{ padding: '10px' }}>Lý do</th>
                                        <th style={{ padding: '10px' }}>Trạng thái phép</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((r, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '10px' }}>{r.id}</td>
                                            <td style={{ padding: '10px' }}>{r.startDate}</td>
                                            <td style={{ padding: '10px' }}>{r.endDate}</td>
                                            <td style={{ padding: '10px' }}>{r.reason}</td>
                                            <td style={{ padding: '10px' }}>
                                                <span style={{
                                                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem',
                                                    backgroundColor: r.status === 'APPROVED' ? '#dcfce7' : r.status === 'REJECTED' ? '#fee2e2' : '#fef9c3',
                                                    color: r.status === 'APPROVED' ? '#166534' : r.status === 'REJECTED' ? '#991b1b' : '#854d0e'
                                                }}>
                                                    {r.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {requests.length === 0 && (
                                        <tr><td colSpan="5" style={{ padding: '10px', textAlign: 'center' }}>Chưa có yêu cầu nào</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeaveRequestPage;
