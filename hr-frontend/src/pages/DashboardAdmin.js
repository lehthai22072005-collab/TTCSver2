import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar'; // Nhớ kiểm tra đường dẫn import Sidebar
import TopBar from '../components/TopBar';   // Nhớ kiểm tra đường dẫn import TopBar
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DashboardAdmin() {
    // Tạm thời dùng Mock Data để giao diện hiển thị đẹp, sau này bạn nối API sau
    const [stats, setStats] = useState({
        totalAccounts: 5,
        activeAccounts: 4,
        lockedAccounts: 1,
        rolesData: [
            { name: 'Admin', value: 1 },
            { name: 'Kế toán', value: 1 },
            { name: 'Ban Giám Hiệu', value: 1 },
            { name: 'Giảng viên/Nhân viên', value: 2 },
        ],
        recentLogs: [
            { id: 1, time: '11:20 15/05/2026', action: 'Tạo tài khoản mới', user: 'thai' },
            { id: 2, time: '10:10 15/05/2026', action: 'Update config', user: 'admin' },
            { id: 3, time: '10:05 15/05/2026', action: 'Khóa user nam', user: 'admin' },
        ]
    });

    const COLORS = ['#4318ff', '#05cd99', '#ffce20', '#f65160'];

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '30px' }}>DASHBOARD HỆ THỐNG (ADMIN)</h2>

                    {/* HÀNG 1: THỐNG KÊ TỔNG QUAN */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                        <div style={cardPrimary}>
                            <p style={labelStyle}>TỔNG SỐ TÀI KHOẢN</p>
                            <h2 style={valueStyle}>{stats.totalAccounts}</h2>
                        </div>
                        <div style={cardSuccess}>
                            <p style={labelStyle}>ĐANG HOẠT ĐỘNG (ACTIVE)</p>
                            <h2 style={valueStyle}>{stats.activeAccounts}</h2>
                        </div>
                        <div style={cardDanger}>
                            <p style={labelStyle}>ĐANG BỊ KHÓA (LOCKED)</p>
                            <h2 style={valueStyle}>{stats.lockedAccounts}</h2>
                        </div>
                    </div>

                    {/* HÀNG 2: BIỂU ĐỒ & NHẬT KÝ */}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {/* Biểu đồ phân bổ quyền */}
                        <div style={{ flex: 1, backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)' }}>
                            <h4 style={{ color: '#1b2559', fontWeight: 'bold', marginBottom: '20px' }}>Phân bổ quyền (Roles)</h4>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={stats.rolesData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.rolesData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Nhật ký hoạt động gần đây */}
                        <div style={{ flex: 1.5, backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h4 style={{ color: '#1b2559', fontWeight: 'bold', margin: 0 }}>Nhật ký hoạt động mới nhất</h4>
                                <a href="/system-logs" style={{ color: '#4318ff', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>Xem tất cả &rarr;</a>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#475569' }}>
                                <thead>
                                <tr style={{ borderBottom: '2px solid #f4f7fe', textAlign: 'left' }}>
                                    <th style={{ padding: '10px 0', fontSize: '14px' }}>THỜI GIAN</th>
                                    <th style={{ padding: '10px 0', fontSize: '14px' }}>HÀNH ĐỘNG</th>
                                    <th style={{ padding: '10px 0', fontSize: '14px' }}>USER</th>
                                </tr>
                                </thead>
                                <tbody>
                                {stats.recentLogs.map((log) => (
                                    <tr key={log.id} style={{ borderBottom: '1px solid #f4f7fe' }}>
                                        <td style={{ padding: '15px 0', fontSize: '14px' }}>{log.time}</td>
                                        <td style={{ padding: '15px 0', fontSize: '14px', fontWeight: '500', color: '#1b2559' }}>{log.action}</td>
                                        <td style={{ padding: '15px 0', fontSize: '14px' }}>
                                            <span style={{ backgroundColor: '#f4f7fe', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>{log.user}</span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Các style tái sử dụng
const labelStyle = { fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px', opacity: 0.8 };
const valueStyle = { fontSize: '2.4rem', fontWeight: '800', margin: 0 };
const cardPrimary = { flex: 1, background: 'linear-gradient(90deg, #4318ff 0%, #5e3aff 100%)', borderRadius: '20px', padding: '30px', color: '#fff', boxShadow: '0px 18px 40px rgba(67, 24, 255, 0.2)' };
const cardSuccess = { flex: 1, background: 'linear-gradient(90deg, #05cd99 0%, #04b688 100%)', borderRadius: '20px', padding: '30px', color: '#fff', boxShadow: '0px 18px 40px rgba(5, 205, 153, 0.2)' };
const cardDanger = { flex: 1, background: 'linear-gradient(90deg, #f65160 0%, #e54655 100%)', borderRadius: '20px', padding: '30px', color: '#fff', boxShadow: '0px 18px 40px rgba(246, 81, 96, 0.2)' };

export default DashboardAdmin;