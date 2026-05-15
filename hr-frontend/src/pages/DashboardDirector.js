import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

function DashboardDirector() {
    // Dữ liệu giả lập cho BGH nhìn tổng quan
    const dataGrowth = [
        { name: 'T1', nhanSu: 40 }, { name: 'T2', nhanSu: 42 },
        { name: 'T3', nhanSu: 45 }, { name: 'T4', nhanSu: 48 },
    ];

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '30px' }}>TỔNG QUAN HỆ THỐNG (BAN GIÁM HIỆU)</h2>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                        <div style={cardInfo}>
                            <p style={labelStyle}>TỔNG NHÂN SỰ TOÀN TRƯỜNG</p>
                            <h2 style={valueStyle}>120 Người</h2>
                        </div>
                        <div style={cardInfo}>
                            <p style={labelStyle}>TỔNG QUỸ LƯƠNG THÁNG</p>
                            <h2 style={{...valueStyle, color: '#4318ff'}}>1.2 tỷ VNĐ</h2>
                        </div>
                        <div style={cardInfo}>
                            <p style={labelStyle}>ĐƠN CHỜ DUYỆT</p>
                            <h2 style={{...valueStyle, color: '#ee5d50'}}>05 Đơn</h2>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)' }}>
                        <h4 style={{ color: '#1b2559', fontWeight: 'bold', marginBottom: '20px' }}>Biến động quy mô nhân sự</h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dataGrowth}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="nhanSu" stroke="#4318ff" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

const labelStyle = { fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px', color: '#a3aed0' };
const valueStyle = { fontSize: '2rem', fontWeight: '800', margin: 0, color: '#1b2559' };
const cardInfo = { flex: 1, backgroundColor: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.05)' };

export default DashboardDirector;