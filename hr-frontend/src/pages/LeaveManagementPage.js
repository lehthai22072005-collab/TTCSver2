import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function LeaveManagementPage() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/leave-requests');
            setRequests(res.data);
        } catch (err) {
            console.error("Lỗi lấy danh sách nghỉ phép:", err);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        if (!window.confirm(`Bạn muốn chuyển trạng thái đơn sang ${newStatus}?`)) return;
        try {
            await axios.put(`http://localhost:8080/api/leave-requests/${id}/status?status=${newStatus}`);
            fetchRequests();
        } catch (err) {
            console.error("Lỗi cập nhật trạng thái:", err);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <h2>Quản Lý Yêu Cầu Nghỉ Phép (Kế Toán - Nhân Sự)</h2>
                    
                    <div style={{ marginTop: '20px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                                    <th style={{ padding: '10px' }}>ID</th>
                                    <th style={{ padding: '10px' }}>Nhân viên</th>
                                    <th style={{ padding: '10px' }}>Từ ngày</th>
                                    <th style={{ padding: '10px' }}>Đến ngày</th>
                                    <th style={{ padding: '10px' }}>Lý do</th>
                                    <th style={{ padding: '10px' }}>Trạng thái</th>
                                    <th style={{ padding: '10px' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((r, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '10px' }}>{r.id}</td>
                                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{r.employeeName || `EMP-${r.employeeId}`}</td>
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
                                        <td style={{ padding: '10px' }}>
                                            {r.status === 'PENDING' && (
                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                    <button className="btn-primary" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => handleUpdateStatus(r.id, 'APPROVED')}>Duyệt</button>
                                                    <button className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none' }} onClick={() => handleUpdateStatus(r.id, 'REJECTED')}>Từ chối</button>
                                                </div>
                                            )}
                                        </td>
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

export default LeaveManagementPage;
