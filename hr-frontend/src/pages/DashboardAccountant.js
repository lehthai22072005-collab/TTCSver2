import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DashboardAccountant() {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        chartData: {},
        budgetData: {},
        notifications: []
    });

    // Quản lý tháng cần xem Quỹ lương đã chốt (Mặc định hiển thị tháng mới nhất vừa tính - Tháng 4)
    const [selectedFundMonth, setSelectedFundMonth] = useState("04/2026");

    // Quản lý tháng và số tiền khi kế toán thiết lập phụ cấp dự tính
    const [inputMonth, setInputMonth] = useState("04/2026");
    const [inputAmount, setInputAmount] = useState("");

    // Hàm đồng bộ dữ liệu tổng hợp từ Backend
    const fetchStats = async () => {
        try {
            const res = await axios.get("/api/dashboard/stats");
            setStats(res.data);
        } catch (err) {
            console.error("Lỗi đồng bộ hệ thống Dashboard:", err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Xử lý lưu thiết lập phụ cấp dự tính cho tháng được chọn
    const handleSaveBudget = async () => {
        if (!inputAmount) return alert("Vui lòng nhập số tiền dự tính!");
        try {
            const rawAmount = parseFloat(inputAmount);
            const amountToSave = rawAmount < 10000 ? rawAmount * 1000000 : rawAmount;
            await axios.post('/api/budget/save', {
                thangNam: inputMonth,
                phuCapDuTinh: amountToSave
            });
            alert(`Cập nhật phụ cấp dự tính cho ${inputMonth} thành công!`);
            setInputAmount("");
            fetchStats(); // Tải lại dữ liệu để biểu đồ cập nhật lập tức
        } catch (err) {
            alert("Lỗi khi lưu phụ cấp dự tính!");
        }
    };

    // VÒNG LẶP ĐỘNG TẠO DỮ LIỆU BIỂU ĐỒ 12 THÁNG TOÀN DIỆN
    const formattedChartData = Array.from({ length: 12 }, (_, i) => {
        const monthNum = String(i + 1).padStart(2, '0');
        const key = `${monthNum}/2026`;
        return {
            name: `Tháng ${i + 1}`,
            Luong: (stats.chartData?.[key] || 0) / 1000000,   // Đổi sang đơn vị Triệu VNĐ
            PhuCap: (stats.budgetData?.[key] || 0) / 1000000  // Đổi sang đơn vị Triệu VNĐ
        };
    });

    // Mảng danh sách 12 tháng phục vụ render các ô lựa chọn (Select)
    const monthsArray = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0') + "/2026");

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '30px' }}>DASHBOARD ACCOUNTANT</h2>

                    {/* HÀNG 1: THỐNG KÊ TỔNG QUAN */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                        <div style={cardPrimary}>
                            <p style={labelStyle}>TỔNG SỐ NHÂN SỰ</p>
                            <h2 style={valueStyle}>{stats.totalEmployees} người</h2>
                        </div>

                        {/* THIẾT KẾ MỚI: Thẻ xem quỹ lương chốt linh hoạt 12 tháng */}
                        <div style={cardSecondary}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <p style={{...labelStyle, color: '#a3aed0', margin: 0}}>QUỸ LƯƠNG ĐÃ CHỐT</p>
                                <select
                                    value={selectedFundMonth}
                                    onChange={(e) => setSelectedFundMonth(e.target.value)}
                                    style={{ padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e0', outline: 'none', fontWeight: 'bold', color: '#2b3674', backgroundColor: '#f8fafc', cursor: 'pointer' }}
                                >
                                    {monthsArray.map(m => <option key={m} value={m}>Tháng {m.split('/')[0]}</option>)}
                                </select>
                            </div>
                            <h2 style={{...valueStyle, color: '#1b2559'}}>
                                {(stats.chartData?.[selectedFundMonth] || 0).toLocaleString()}đ
                            </h2>
                        </div>
                    </div>

                    {/* HÀNG 2: BIỂU ĐỒ DIỄN BIẾN ĐỦ 12 THÁNG */}
                    <div style={chartContainer}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h4 style={{ color: '#1b2559', fontWeight: 'bold', margin: 0 }}>Biến động chi phí lương cả năm (triệu VNĐ)</h4>

                            {/* CÀI ĐẶT DỰ TÍNH CHO TOÀN BỘ 12 THÁNG */}
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#f4f7fe', padding: '10px 15px', borderRadius: '10px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2b3674' }}>Cài đặt dự tính:</span>
                                <select
                                    value={inputMonth}
                                    onChange={(e) => setInputMonth(e.target.value)}
                                    style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: '600' }}
                                >
                                    {monthsArray.map(m => <option key={m} value={m}>Tháng {m.split('/')[0]}</option>)}
                                </select>
                                <input
                                    type="number"
                                    value={inputAmount}
                                    onChange={(e) => setInputAmount(e.target.value)}
                                    placeholder="VNĐ hoặc Triệu"
                                    style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #e2e8f0', width: '130px', outline: 'none' }}
                                />
                                <button
                                    onClick={handleSaveBudget}
                                    style={{ backgroundColor: '#05cd99', color: '#fff', border: 'none', padding: '6px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={formattedChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(val) => `${val} tr`} />
                                <Tooltip formatter={(value) => [`${(value * 1000000).toLocaleString('vi-VN')} đ`]} />
                                <Legend />
                                <Bar dataKey="Luong" fill="#4318ff" name="Lương thực trả" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="PhuCap" fill="#05cd99" name="Phụ cấp dự tính" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* HÀNG 3: THÔNG BÁO HỆ THỐNG */}
                    <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)' }}>
                        <h4 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '15px' }}>Thông báo hệ thống</h4>
                        <ul style={{ color: '#475569', lineHeight: '2', listStyle: 'none', padding: 0 }}>
                            {stats.notifications && stats.notifications.length > 0 ? (
                                stats.notifications.map((note) => (
                                    <li key={note.id} style={{ ...liStyle }}>
                                        • {note.noiDung || note.action}
                                        <small style={{ color: '#a3aed0', marginLeft: '10px' }}>
                                            ({note.timestamp && note.timestamp.includes('/') ? note.timestamp : (note.timestamp ? new Date(note.timestamp).toLocaleDateString() : '')})
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
const cardSecondary = { flex: 1, background: '#fff', border: '2px solid #05cd99', borderRadius: '20px', padding: '25px 30px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)', display: 'flex', flexDirection: 'column', justifyContent: 'center' };
const labelStyle = { fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px' };
const valueStyle = { fontSize: '2.4rem', fontWeight: '800', margin: 0 };
const chartContainer = { backgroundColor: '#fff', borderRadius: '20px', padding: '30px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)' };
const liStyle = { marginBottom: '8px', borderBottom: '1px solid #f4f7fe', paddingBottom: '5px' };

export default DashboardAccountant;
