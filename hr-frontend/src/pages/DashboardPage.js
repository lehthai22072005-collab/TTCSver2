import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const expenseData = [
  { name: 'Tháng 1', Lương: 40000000, Phụ_Cấp: 5000000, Thưởng: 2000000 },
  { name: 'Tháng 2', Lương: 40000000, Phụ_Cấp: 5000000, Thưởng: 1500000 },
  { name: 'Tháng 3', Lương: 42000000, Phụ_Cấp: 5500000, Thưởng: 3000000 },
  { name: 'Tháng 4', Lương: 42000000, Phụ_Cấp: 5500000, Thưởng: 1000000 },
];

const pieData = [
  { name: 'Quản lý', value: 30 },
  { name: 'Giảng viên', value: 50 },
  { name: 'Nhân viên khác', value: 20 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

function DashboardPage() {
    const role = localStorage.getItem('role');
    const [stats, setStats] = useState({ employees: 0, teachers: 0, totalUsers: 15, activeUsers: 12 });
    const [announcements, setAnnouncements] = useState(() => {
        const saved = localStorage.getItem('announcements');
        return saved ? JSON.parse(saved) : [];
    });
    const [newAnnouncement, setNewAnnouncement] = useState('');

    useEffect(() => {
        const employeeDataStr = localStorage.getItem('employeeData');
        if (employeeDataStr) {
            const employees = JSON.parse(employeeDataStr);
            setStats({ 
                employees: employees.length, 
                teachers: employees.filter(emp => emp.position === 'Giảng viên').length,
                totalUsers: employees.length + 5,
                activeUsers: employees.length + 2
            });
        } else {
            axios.get("http://localhost:8080/api/employees")
                .then(res => {
                    const data = res.data;
                    setStats({ 
                        employees: data.length, 
                        teachers: data.filter(emp => emp.position === 'Giảng viên').length,
                        totalUsers: data.length + 5,
                        activeUsers: data.length + 2
                    });
                })
                .catch(err => console.error("Lỗi:", err));
        }
    }, []);

    const handleSendAnnouncement = (e) => {
        e.preventDefault();
        if (!newAnnouncement.trim()) return;
        setAnnouncements([{ id: Date.now(), text: newAnnouncement, date: new Date().toLocaleString('vi-VN') }, ...announcements]);
        setNewAnnouncement('');
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    {role === 'DIRECTOR' ? (
                        <>
                            <h2>Báo cáo tổng quan (Dành cho Ban Giám Hiệu)</h2>
                            <div className="stats-grid" style={{ marginTop: '20px' }}>
                                <div className="stat-card border-blue" style={{ flex: 1, backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <p>TỔNG SỐ NHÂN SỰ</p>
                                    <h4>{stats.employees}</h4>
                                </div>
                                <div className="stat-card border-green" style={{ flex: 1, backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <p>GIẢNG VIÊN CƠ HỮU</p>
                                    <h4>{stats.teachers}</h4>
                                </div>
                                <div className="stat-card border-purple" style={{ flex: 1, backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeftColor: '#a855f7' }}>
                                    <p>TỔNG QUỸ LƯƠNG TẠM TÍNH</p>
                                    <h4>48,500,000 VNĐ</h4>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
                                <div style={{ flex: 2, backgroundColor: '#fff', padding: '20px', borderRadius: '12px', minWidth: '400px' }}>
                                    <h4 style={{ marginBottom: '20px' }}>Biểu đồ chi phí lương & phụ cấp (VNĐ)</h4>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={expenseData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="Lương" stackId="a" fill="#8884d8" />
                                            <Bar dataKey="Phụ_Cấp" stackId="a" fill="#82ca9d" />
                                            <Bar dataKey="Thưởng" stackId="a" fill="#ffc658" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '12px', minWidth: '300px' }}>
                                    <h4 style={{ marginBottom: '20px', textAlign: 'center' }}>Cơ cấu nhân sự</h4>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </>
                    ) : role === 'TEACHER' ? (
                        <>
                            <div className="stats-grid">
                                <div className="stat-card border-blue" style={{ flex: 1, backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <p>SỐ TIẾT DẠY TRONG THÁNG</p>
                                    <h4>45 Tiết</h4>
                                </div>
                                <div className="stat-card border-green" style={{ flex: 1, backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <p>LƯƠNG DỰ KIẾN</p>
                                    <h4 style={{ color: '#10b981' }}>15,500,000 VNĐ</h4>
                                </div>
                            </div>
                            <div className="welcome-section" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
                                <div style={{ flex: '1', minWidth: '300px' }}>
                                    <h3>Dashboard Cá Nhân</h3>
                                    <p>Chào mừng bạn quay trở lại. Chúc bạn một ngày làm việc hiệu quả!</p>
                                </div>
                                <div style={{ flex: '1', minWidth: '350px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px' }}>
                                    <h4 style={{ margin: '0 0 15px 0' }}>Bảng thông báo chung</h4>
                                    {announcements.length > 0 ? (
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '200px', overflowY: 'auto' }}>
                                            {announcements.map(msg => (
                                                <li key={msg.id} style={{ padding: '10px', borderBottom: '1px solid #f1f5f9' }}><p style={{ margin: 0 }}>{msg.text}</p><small style={{ color: '#94a3b8' }}>{msg.date}</small></li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p style={{ color: '#64748b' }}>Chưa có thông báo mới nào.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="stats-grid">
                                <div className="stat-card border-blue"><p>SỐ NHÂN VIÊN</p><h4>{stats.employees}</h4></div>
                                <div className="stat-card border-green"><p>SỐ GIẢNG VIÊN</p><h4>{stats.teachers}</h4></div>
                                {role === 'ADMIN' && (
                                    <>
                                        <div className="stat-card border-purple" style={{ borderLeftColor: '#a855f7' }}><p>TỔNG SỐ NGƯỜI DÙNG</p><h4>{stats.totalUsers}</h4></div>
                                        <div className="stat-card border-yellow" style={{ borderLeftColor: '#eab308' }}><p>SỐ NGƯỜI ĐANG HOẠT ĐỘNG</p><h4>{stats.activeUsers}</h4></div>
                                    </>
                                )}
                            </div>
                            <div className="welcome-section" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                <div style={{ flex: '1', minWidth: '300px' }}>
                                    <h3>Dashboard Tổng Quan</h3>
                                    <p>Chào mừng bạn quay trở lại hệ thống quản trị.</p>
                                </div>
                                <div style={{ flex: '1', minWidth: '350px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px' }}>
                                    <h4 style={{ margin: '0 0 15px 0' }}>Gửi thông báo tới toàn thể</h4>
                                    <form onSubmit={handleSendAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <textarea value={newAnnouncement} onChange={e => setNewAnnouncement(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical' }} />
                                        <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end', padding: '8px 16px' }}>Gửi đi</button>
                                    </form>
                                    {announcements.length > 0 && (
                                        <div style={{ marginTop: '20px' }}>
                                            <h5>Lịch sử thông báo</h5>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '200px', overflowY: 'auto' }}>
                                                {announcements.map(msg => (
                                                    <li key={msg.id} style={{ padding: '10px', borderBottom: '1px solid #f1f5f9' }}><p style={{ margin: 0 }}>{msg.text}</p><small style={{ color: '#94a3b8' }}>{msg.date}</small></li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
