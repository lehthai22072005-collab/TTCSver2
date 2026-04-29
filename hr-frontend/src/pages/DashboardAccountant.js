import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DashboardAccountant() {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalSalaryFund: 0,
        chartData: {},
        notifications: [] // Khởi tạo mảng thông báo rỗng
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/dashboard/stats");
                setStats(res.data);
            } catch (err) {
                console.error("Lỗi đồng bộ Dashboard:", err);
            }
        };
        fetchStats();
    }, []);

    const formattedChartData = [
        { name: 'Tháng 1', Luong: (stats.chartData["01/2026"] || 0) / 1000000, PhuCap: 5 },
        { name: 'Tháng 2', Luong: (stats.chartData["02/2026"] || 0) / 1000000, PhuCap: 8 },
        { name: 'Tháng 3', Luong: (stats.chartData["03/2026"] || 0) / 1000000, PhuCap: 10 },
    ];

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '30px' }}>DASHBOARD ACCOUNTANT</h2>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                        <div style={cardPrimary}>
                            <p style={labelStyle}>TỔNG SỐ NHÂN SỰ</p>
                            <h2 style={valueStyle}>{stats.totalEmployees} người</h2>
                        </div>
                        <div style={cardSecondary}>
                            <p style={{...labelStyle, color: '#a3aed0'}}>QUỸ LƯƠNG THÁNG 03/2026</p>
                            <h2 style={{...valueStyle, color: '#1b2559'}}>
                                {stats.totalSalaryFund.toLocaleString()}đ
                            </h2>
                        </div>
                    </div>

                    <div style={chartContainer}>
                        <h4 style={{ color: '#1b2559', marginBottom: '25px', fontWeight: 'bold' }}>Biến động chi phí lương (triệu VNĐ)</h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={formattedChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Luong" fill="#4318ff" name="Lương thực trả" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="PhuCap" fill="#05cd99" name="Phụ cấp dự tính" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* MỤC THÔNG BÁO ĐÃ ĐƯỢC ĐỒNG BỘ SQL */}
                    <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)' }}>
                        <h4 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '15px' }}>Thông báo hệ thống</h4>
                        <ul style={{ color: '#475569', lineHeight: '2', listStyle: 'none', padding: 0 }}>
                            {stats.notifications && stats.notifications.length > 0 ? (
                                stats.notifications.map((note) => (
                                    <li key={note.id} style={{ marginBottom: '8px', borderBottom: '1px solid #f4f7fe', paddingBottom: '5px' }}>
                                        • {note.noiDung}
                                        <small style={{ color: '#a3aed0', marginLeft: '10px' }}>
                                            ({new Date(note.timestamp).toLocaleDateString()})
                                        </small>
                                    </li>
                                ))
                            ) : (
                                <li>• Không có thông báo nào từ hệ thống.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

const cardPrimary = { flex: 1, background: 'linear-gradient(90deg, #4318ff 0%, #5e3aff 100%)', borderRadius: '20px', padding: '30px', color: '#fff', boxShadow: '0px 18px 40px rgba(67, 24, 255, 0.2)' };
const cardSecondary = { flex: 1, background: '#fff', border: '2px solid #05cd99', borderRadius: '20px', padding: '30px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)' };
const labelStyle = { fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px' };
const valueStyle = { fontSize: '2.4rem', fontWeight: '800', margin: 0 };
const chartContainer = { backgroundColor: '#fff', borderRadius: '20px', padding: '30px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)' };

export default DashboardAccountant;