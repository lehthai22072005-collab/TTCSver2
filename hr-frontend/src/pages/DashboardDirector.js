import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function DashboardDirector() {
    const userName = localStorage.getItem('username') || 'Giám đốc';

    // State lưu trữ dữ liệu đồng bộ từ Database
    const [directorStats, setDirectorStats] = useState({
        totalEmployees: 0,
        pendingLeaves: 0,
        totalSalaryFund: 0,
        monthlyTrend: {}
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/dashboard/director-stats");
                setDirectorStats(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Lỗi khi tải thông số Dashboard BGH:", err);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Tự động phân tách mảng dựng biểu đồ cột biến động quỹ lương 12 tháng năm 2026
    const formattedTrendData = Array.from({ length: 12 }, (_, i) => {
        const monthNum = String(i + 1).padStart(2, '0');
        const key = `${monthNum}/2026`;
        return {
            name: `Tháng ${i + 1}`,
            "Quỹ lương chi trả": (directorStats.monthlyTrend?.[key] || 0) / 1000000 // Chuyển sang đơn vị Triệu đồng
        };
    });

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '30px', textTransform: 'uppercase' }}>
                        Báo cáo tổng quan của Ban Giám Hiệu
                    </h2>

                    {/* HÀNG THẺ TIÊU CHÍ THỐNG KÊ REAL-TIME */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                        <div style={cardInfo}>
                            <p style={labelStyle}>TỔNG SỐ NHÂN SỰ TOÀN TRƯỜNG</p>
                            <h2 style={valueStyle}>{loading ? "..." : `${directorStats.totalEmployees} người`}</h2>
                        </div>

                        <div style={directorStats.pendingLeaves > 0 ? cardWarningActive : cardWarningEmpty}>
                            <p style={labelStyle}>ĐƠN NGHỈ PHÉP CHỜ PHÊ DUYỆT</p>
                            <h2 style={valueStyle}>
                                {loading ? "..." : `${directorStats.pendingLeaves} đơn từ`}
                            </h2>
                        </div>

                        <div style={cardSuccess}>
                            <p style={labelStyle}>TỔNG CHI QUỸ LƯƠNG TÍCH LŨY</p>
                            <h2 style={valueStyle}>
                                {loading ? "..." : `${(directorStats.totalSalaryFund || 0).toLocaleString()}đ`}
                            </h2>
                        </div>
                    </div>

                    {/* BIỂU ĐỒ ĐIỀU TRA BIẾN ĐỘNG QUỸ LƯƠNG */}
                    <div style={chartContainer}>
                        <h4 style={{ color: '#1b2559', fontWeight: 'bold', marginBottom: '25px' }}>
                            Biểu đồ diễn biến chi trả quỹ lương năm 2026 (triệu VNĐ)
                        </h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={formattedTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value.toLocaleString()} Triệuđ`, "Chi phí"]} />
                                <Bar dataKey="Quỹ lương chi trả" fill="#4318ff" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* THÔNG TIN CHÀO MỪNG */}
                    <div style={{ marginTop: '30px', padding: '25px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.05)' }}>
                        <h4 style={{ color: '#1b2559', fontWeight: 'bold', marginBottom: '10px' }}>Xin chào Thầy {userName}!</h4>
                        <p style={{ color: '#475569', margin: 0, lineHeight: '1.6' }}>
                            Hệ thống đã tự động liên thông dữ liệu. Mọi thay đổi về hồ sơ nhân viên từ phòng hành chính, thao tác khóa sổ bảng lương của kế toán viên, hay đơn từ xin phép của giảng viên gửi lên đều sẽ ngay lập tức được cập nhật số liệu trực quan tại đây để phục vụ công tác quản lý vĩ mô.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

// CẤU TRÚC GIAO DIỆN MÀU SẮC ĐỒ HỌA CHUYÊN NGHIỆP
const labelStyle = { fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px', opacity: 0.9 };
const valueStyle = { fontSize: '2.2rem', fontWeight: '800', margin: 0 };
const chartContainer = { backgroundColor: '#fff', borderRadius: '20px', padding: '30px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.06)' };

const cardInfo = { flex: 1, background: 'linear-gradient(90deg, #4318ff 0%, #5e3aff 100%)', borderRadius: '20px', padding: '25px 30px', color: '#fff', boxShadow: '0px 18px 40px rgba(67, 24, 255, 0.2)' };
const cardSuccess = { flex: 1, background: 'linear-gradient(90deg, #05cd99 0%, #04b688 100%)', borderRadius: '20px', padding: '25px 30px', color: '#fff', boxShadow: '0px 18px 40px rgba(5, 205, 153, 0.2)' };

// Thẻ cảnh báo đơn từ thông minh (Đổi màu cam rực lửa nếu có đơn đang xếp hàng chờ duyệt)
const cardWarningActive = { flex: 1, background: 'linear-gradient(90deg, #ff9800 0%, #ff5722 100%)', borderRadius: '20px', padding: '25px 30px', color: '#fff', boxShadow: '0px 18px 40px rgba(255, 152, 0, 0.3)' };
const cardWarningEmpty = { flex: 1, background: '#fff', border: '2px solid #cbd5e1', borderRadius: '20px', padding: '25px 30px', color: '#1b2559' };

export default DashboardDirector;