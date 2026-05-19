import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, Legend as LineLegend } from 'recharts';

function HRReportsPage() {
    const [reportData, setReportData] = useState({
        departmentDistribution: {},
        recentChanges: [],
        turnoverTrends: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/dashboard/hr-reports");
                setReportData(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Lỗi khi tải báo cáo nhân sự:", err);
                setLoading(false);
            }
        };
        fetchReport();
    }, []);

    // 1. Xử lý dữ liệu cho Biểu đồ Tròn (Pie Chart)
    const COLORS = ['#4318ff', '#05cd99', '#ff9800', '#ee5d50', '#8b5cf6', '#e2e8f0'];
    const pieData = Object.keys(reportData.departmentDistribution).map((key, index) => ({
        name: key,
        value: reportData.departmentDistribution[key]
    }));

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '30px', textTransform: 'uppercase' }}>
                        BÁO CÁO NHÂN SỰ
                    </h2>

                    {loading ? (
                        <div style={{ textAlign: 'center', color: '#4318ff', fontWeight: 'bold', padding: '50px' }}>
                            ⏳ Đang tổng hợp dữ liệu từ hệ thống...
                        </div>
                    ) : (
                        <>
                            {/* HÀNG 1: BIỂU ĐỒ */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '30px' }}>

                                {/* BIỂU ĐỒ TRÒN - PHÒNG BAN */}
                                <div style={cardStyle}>
                                    <h4 style={cardTitle}>Tỷ lệ nhân sự theo phòng ban</h4>
                                    <div style={{ width: '100%', height: 300 }}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <PieTooltip formatter={(value) => [`${value} người`, 'Số lượng']} />
                                                <PieLegend verticalAlign="bottom" height={36} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* BIỂU ĐỒ ĐƯỜNG - BIẾN ĐỘNG */}
                                <div style={cardStyle}>
                                    <h4 style={cardTitle}>Biến động Tuyển dụng & Thôi việc</h4>
                                    <div style={{ width: '100%', height: 300 }}>
                                        <ResponsiveContainer>
                                            <LineChart data={reportData.turnoverTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="month" />
                                                <YAxis allowDecimals={false} />
                                                <LineTooltip />
                                                <LineLegend />
                                                <Line type="monotone" dataKey="tuyenMoi" name="Tuyển mới" stroke="#4318ff" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                                                <Line type="monotone" dataKey="thoiViec" name="Thôi việc" stroke="#ee5d50" strokeWidth={3} dot={{ r: 5 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                            </div>

                            {/* HÀNG 2: BẢNG DANH SÁCH NHÂN SỰ MỚI NHẤT */}
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h4 style={{ ...cardTitle, margin: 0 }}>Danh sách nhân sự mới nhất</h4>
                                    <span style={{ backgroundColor: '#e6fffb', color: '#00b8d9', padding: '5px 15px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                        Cập nhật tự động
                                    </span>
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                    <tr style={{ borderBottom: '2px solid #f4f7fe', color: '#a3aed0', textAlign: 'left', fontSize: '0.85rem' }}>
                                        <th style={{ padding: '15px' }}>MÃ NV</th>
                                        <th style={{ padding: '15px' }}>HỌ VÀ TÊN</th>
                                        <th style={{ padding: '15px' }}>PHÒNG BAN/KHOA</th>
                                        <th style={{ padding: '15px' }}>CHỨC VỤ</th>
                                        <th style={{ padding: '15px' }}>TRẠNG THÁI</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {reportData.recentChanges.length > 0 ? reportData.recentChanges.map((emp, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid #f4f7fe', color: '#2b3674' }}>
                                            <td style={{ padding: '15px', fontWeight: 'bold' }}>{emp.id}</td>
                                            <td style={{ padding: '15px', fontWeight: '600' }}>{emp.fullName}</td>
                                            <td style={{ padding: '15px' }}>{emp.department || "Chưa cập nhật"}</td>
                                            <td style={{ padding: '15px' }}>{emp.academicDegree || "N/A"}</td>
                                            <td style={{ padding: '15px' }}>
                                                    <span style={{ padding: '5px 12px', borderRadius: '8px', backgroundColor: '#e6fffb', color: '#00b8d9', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                        {emp.status}
                                                    </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#a3aed0' }}>Không có dữ liệu nhân sự.</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

const cardStyle = { backgroundColor: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)' };
const cardTitle = { color: '#1b2559', fontWeight: 'bold', marginBottom: '20px' };

export default HRReportsPage;