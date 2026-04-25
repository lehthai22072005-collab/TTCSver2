import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function SystemLogPage() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            // Mock System Logs if backend has no logs
            const res = await axios.get('http://localhost:8080/api/system-logs');
            if (res.data.length === 0) {
                setLogs([
                    { id: 1, userRole: 'ADMIN', action: 'Tạo tài khoản', details: 'Đã tạo tài khoản cho NV001', timestamp: new Date().toISOString() },
                    { id: 2, userRole: 'ACCOUNTANT', action: 'Lệnh tính lương', details: 'Tính lương tháng 10/2023', timestamp: new Date(Date.now() - 3600000).toISOString() },
                    { id: 3, userRole: 'ADMIN', action: 'Cấu hình hệ thống', details: 'Cập nhật số ngày công chuẩn = 22', timestamp: new Date(Date.now() - 7200000).toISOString() },
                ]);
            } else {
                setLogs(res.data);
            }
        } catch (err) {
            console.error("Lỗi lấy danh sách System Logs:", err);
            // Fallback mock
            setLogs([
                { id: 1, userRole: 'ADMIN', action: 'Tạo tài khoản', details: 'Đã tạo tài khoản cho NV001', timestamp: new Date().toISOString() }
            ]);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <h2>Nhật ký hệ thống (System Logs)</h2>
                    <p style={{ color: '#64748b', marginBottom: '20px' }}>Theo dõi các thao tác cấu hình và quản trị của toàn hệ thống (Dành do Admin/IT)</p>
                    
                    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                                    <th style={{ padding: '12px 10px', color: '#475569' }}>Thời gian</th>
                                    <th style={{ padding: '12px 10px', color: '#475569' }}>Người thực hiện (Role)</th>
                                    <th style={{ padding: '12px 10px', color: '#475569' }}>Hành động</th>
                                    <th style={{ padding: '12px 10px', color: '#475569' }}>Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px 10px', color: '#64748b' }}>{new Date(log.timestamp).toLocaleString('vi-VN')}</td>
                                        <td style={{ padding: '12px 10px' }}>
                                            <span style={{ 
                                                padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold',
                                                backgroundColor: log.userRole === 'ADMIN' ? '#fee2e2' : '#e0e7ff',
                                                color: log.userRole === 'ADMIN' ? '#991b1b' : '#3730a3'
                                            }}>
                                                {log.userRole}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 10px', fontWeight: '500', color: '#0f172a' }}>{log.action}</td>
                                        <td style={{ padding: '12px 10px', color: '#475569' }}>{log.details}</td>
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

export default SystemLogPage;
