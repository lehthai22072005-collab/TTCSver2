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
        notifications: []
    });

    // STATE MỚI: Dùng để lưu dữ liệu phụ cấp dự tính hiển thị trên biểu đồ
    const [budgets, setBudgets] = useState({
        "01/2026": 0,
        "02/2026": 0,
        "03/2026": 0
    });

    // STATE MỚI: Dùng cho ô nhập liệu cập nhật ngân sách
    const [inputMonth, setInputMonth] = useState("03/2026");
    const [inputAmount, setInputAmount] = useState("");

    // Hàm lấy ngân sách từ Backend
    const fetchBudgets = async () => {
        try {
            // Lấy dữ liệu 3 tháng hiển thị trên chart
            const res1 = await axios.get("http://localhost:8080/api/budget/01-2026");
            const res2 = await axios.get("http://localhost:8080/api/budget/02-2026");
            const res3 = await axios.get("http://localhost:8080/api/budget/03-2026");

            setBudgets({
                "01/2026": res1.data.phuCapDuTinh || 0,
                "02/2026": res2.data.phuCapDuTinh || 0,
                "03/2026": res3.data.phuCapDuTinh || 0,
            });
        } catch (err) {
            console.error("Lỗi lấy phụ cấp dự tính:", err);
        }
    };

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
        fetchBudgets(); // Gọi luôn hàm lấy ngân sách khi load trang
    }, []);

    // HÀM MỚI: Xử lý khi nhấn nút Lưu dự tính
    const handleSaveBudget = async () => {
        if (!inputAmount) {
            alert("Vui lòng nhập số tiền!");
            return;
        }
        try {
            await axios.post('http://localhost:8080/api/budget/save', {
                thangNam: inputMonth,
                phuCapDuTinh: parseFloat(inputAmount) * 1000000 // Đổi từ triệu VNĐ sang VNĐ
            });
            alert("Đã cập nhật phụ cấp dự tính thành công!");
            setInputAmount("");
            fetchBudgets(); // Gọi lại hàm để biểu đồ tự động cập nhật ngay lập tức
        } catch (err) {
            console.error(err);
            alert("Lỗi khi lưu phụ cấp dự tính!");
        }
    };

    // ĐÃ FIX: Không gán cứng nữa, lấy trực tiếp từ state budgets chia cho 1 triệu
    const formattedChartData = [
        { name: 'Tháng 1', Luong: (stats.chartData["01/2026"] || 0) / 1000000, PhuCap: budgets["01/2026"] / 1000000 },
        { name: 'Tháng 2', Luong: (stats.chartData["02/2026"] || 0) / 1000000, PhuCap: budgets["02/2026"] / 1000000 },
        { name: 'Tháng 3', Luong: (stats.chartData["03/2026"] || 0) / 1000000, PhuCap: budgets["03/2026"] / 1000000 },
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
                        {/* GIAO DIỆN MỚI: Ô nhập liệu cho kế toán */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h4 style={{ color: '#1b2559', fontWeight: 'bold', margin: 0 }}>Biến động chi phí lương (triệu VNĐ)</h4>

                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#f4f7fe', padding: '10px 15px', borderRadius: '10px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2b3674' }}>Cài đặt dự tính:</span>
                                <select
                                    value={inputMonth}
                                    onChange={(e) => setInputMonth(e.target.value)}
                                    style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #e2e8f0', outline: 'none' }}
                                >
                                    <option value="01/2026">Tháng 1</option>
                                    <option value="02/2026">Tháng 2</option>
                                    <option value="03/2026">Tháng 3</option>
                                </select>
                                <input
                                    type="number"
                                    value={inputAmount}
                                    onChange={(e) => setInputAmount(e.target.value)}
                                    placeholder="Số tiền (Triệu)"
                                    style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #e2e8f0', width: '120px', outline: 'none' }}
                                />
                                <button
                                    onClick={handleSaveBudget}
                                    style={{ backgroundColor: '#05cd99', color: '#fff', border: 'none', padding: '6px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>

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