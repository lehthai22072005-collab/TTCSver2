import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function SystemLogPage() {
    // Dữ liệu mẫu khớp với Wireframe 5
    const [logs] = useState([
        { time: '10:00', action: 'Login', user: 'thai' },
        { time: '10:05', action: 'Khóa user nam', user: 'admin' },
        { time: '10:10', action: 'Update config', user: 'admin' },
        { time: '11:20', action: 'Tạo tài khoản mới', user: 'thai' },
    ]);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    {/* Tiêu đề in hoa có gạch chân chuẩn Wireframe */}
                    <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>
                        <h2 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>System Logs</h2>
                    </div>

                    {/* Bảng nhật ký hệ thống */}
                    <div className="card shadow-sm" style={{ backgroundColor: '#fff', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                        <table className="data-table" style={{ marginTop: 0 }}>
                            <thead style={{ backgroundColor: '#f8fafc' }}>
                            <tr>
                                <th style={{ width: '150px' }}>Thời gian</th>
                                <th>Hành động</th>
                                <th style={{ width: '200px' }}>Người thực hiện</th>
                            </tr>
                            </thead>
                            <tbody>
                            {logs.map((log, index) => (
                                <tr key={index}>
                                    <td style={{ color: '#64748b' }}>{log.time}</td>
                                    <td style={{ fontWeight: '500' }}>{log.action}</td>
                                    <td>
                                            <span style={{
                                                padding: '4px 12px',
                                                backgroundColor: '#f1f5f9',
                                                borderRadius: '15px',
                                                fontSize: '0.85rem',
                                                fontWeight: 'bold',
                                                color: '#475569'
                                            }}>
                                                {log.user}
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <p style={{ marginTop: '15px', color: '#94a3b8', fontSize: '0.9rem italic' }}>
                        * Hiển thị 10 dòng nhật ký gần nhất của hệ thống.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SystemLogPage;