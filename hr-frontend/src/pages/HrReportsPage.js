import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

// Dữ liệu biến động nhân sự (Line Chart)
const lineData = [
    { name: 'Tháng 1', moi: 4, nghi: 1 },
    { name: 'Tháng 2', moi: 10, nghi: 2 },
    { name: 'Tháng 3', moi: 7, nghi: 3 },
];

// Dữ liệu tỷ lệ phòng ban (Pie Chart)
const pieData = [
    { name: 'Khoa CNTT', value: 40 },
    { name: 'Kế toán', value: 20 },
    { name: 'Hành chính', value: 40 },
];

const COLORS = ['#4318ff', '#05cd99', '#ffb547'];

function HrReportsPage() {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ backgroundColor: '#f4f7fe', minHeight: '100vh', padding: '30px' }}>

                    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                        {/* Header Section */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h2 style={{ fontWeight: 'bold', color: '#1b2559', textTransform: 'uppercase' }}>
                                Báo cáo nhân sự
                            </h2>
                            <div style={filterBoxStyle}>
                                <span style={{ color: '#707eae', fontSize: '0.9rem', marginRight: '10px' }}>Thời gian:</span>
                                <select style={selectStyle}><option>[ Tháng ]</option></select>
                                <select style={{ ...selectStyle, marginLeft: '10px' }}><option>[ 03/2026 ]</option></select>
                            </div>
                        </div>

                        {/* Line Chart Section */}
                        <div style={cardStyle}>
                            <h5 style={chartTitleStyle}>| Biểu đồ: Nhân sự theo thời gian (Tăng/Giảm)</h5>
                            <p style={subTitleStyle}>(Dữ liệu so sánh số người mới và số người nghỉ việc)</p>
                            <div style={{ height: '350px', marginTop: '20px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={lineData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9edf7" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a3aed0', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#a3aed0', fontSize: 12}} />
                                        <Tooltip contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'}} />
                                        <Legend iconType="circle" />
                                        <Line type="monotone" dataKey="moi" stroke="#4318ff" strokeWidth={4} name="Người mới" dot={{ r: 6, fill: '#4318ff' }} activeDot={{ r: 8 }} />
                                        <Line type="monotone" dataKey="nghi" stroke="#ee5d50" strokeWidth={4} name="Nghỉ việc" dot={{ r: 6, fill: '#ee5d50' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Pie Chart Section */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', marginTop: '30px' }}>
                            <div style={cardStyle}>
                                <h5 style={chartTitleStyle}>| Biểu đồ: Tỷ lệ theo phòng ban</h5>
                                <div style={{ display: 'flex', alignItems: 'center', height: '300px' }}>
                                    <ResponsiveContainer width="50%" height="100%">
                                        <PieChart>
                                            <Pie data={pieData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div style={{ width: '50%', paddingLeft: '40px' }}>
                                        {pieData.map((item, index) => (
                                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px dashed #e2e8f0', paddingBottom: '5px' }}>
                                                <span style={{ color: '#707eae', fontWeight: '500' }}>- {item.name}:</span>
                                                <span style={{ color: '#1b2559', fontWeight: 'bold' }}>{item.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Export Button */}
                        <div style={{ textAlign: 'center', marginTop: '40px' }}>
                            <button style={exportBtnStyle} onClick={() => alert("Hệ thống: Đang chuẩn bị dữ liệu và xuất file PDF...")}>
                                [ XUẤT BÁO CÁO PDF ]
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Styles tối ưu ---
const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)',
    border: 'none'
};

const filterBoxStyle = {
    backgroundColor: '#fff',
    padding: '10px 20px',
    borderRadius: '15px',
    boxShadow: '0px 10px 20px rgba(112, 144, 176, 0.05)'
};

const selectStyle = {
    padding: '8px 12px',
    borderRadius: '10px',
    border: '1px solid #e0e5f2',
    color: '#2b3674',
    fontWeight: '600',
    outline: 'none'
};

const chartTitleStyle = {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1b2559',
    marginBottom: '5px'
};

const subTitleStyle = {
    color: '#a3aed0',
    fontSize: '0.9rem',
    marginBottom: '20px'
};

const exportBtnStyle = {
    backgroundColor: '#fff',
    color: '#1b2559',
    border: '3px solid #1b2559',
    padding: '15px 40px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '8px 8px 0px #000',
    transition: 'all 0.2s'
};

export default HrReportsPage;