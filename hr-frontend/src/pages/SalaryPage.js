import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function SalaryPage() {
    const [month, setMonth] = useState('03/2026');
    const [salaryPreview, setSalaryPreview] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8080/api/salary/preview?month=${month}`);
            setSalaryPreview(res.data);
        } catch (err) {
            // Nếu Backend trả về lỗi (400 Bad Request), nó sẽ nhảy vào đây
            alert(err.response?.data || "Lỗi khi tính lương!");
        } finally {
            setLoading(false);
        }
    };

    // 2. Chốt lương (LOCK) - Chuyển sang trạng thái đã chi trả
    const handleLockSalary = async () => {
        if (salaryPreview.length === 0) return alert("Vui lòng tính lương trước khi chốt!");
        if (window.confirm(`Xác nhận chốt bảng lương tháng ${month}? Dữ liệu sau khi chốt sẽ không thể sửa đổi.`)) {
            try {
                await axios.post(`http://localhost:8080/api/salary/lock?month=${month}`);
                alert("🔒 Đã chốt lương thành công!");
                // Chuyển hướng sang trang lịch sử chi trả
                window.location.href = "/payment-history";
            } catch (err) {
                console.error(err);
                alert("Lỗi khi thực hiện chốt lương!");
            }
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '30px' }}>TÍNH TOÁN LƯƠNG</h2>

                    <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '30px' }}>
                            <span style={{ color: '#2b3674', fontWeight: '500' }}>Tháng:</span>
                            <select
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid #e0e5f2', outline: 'none', color: '#2b3674' }}
                            >
                                <option value="03/2026">03/2026</option>
                                <option value="04/2026">04/2026</option>
                                <option value="05/2026">05/2026</option>
                            </select>

                            <button
                                onClick={handleCalculate}
                                disabled={loading}
                                style={{ padding: '10px 20px', backgroundColor: '#4318ff', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}
                            >
                                {loading ? "Đang xử lý..." : "[ Chạy tính lương ]"}
                            </button>

                            <button
                                onClick={handleLockSalary}
                                style={{ padding: '10px 20px', backgroundColor: '#ee5d50', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Chốt lương 🔒
                            </button>
                        </div>

                        <h4 style={{ color: '#2b3674', marginBottom: '20px', fontWeight: 'bold' }}>BẢNG LƯƠNG NHÁP</h4>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                                <thead>
                                <tr style={{ textAlign: 'left', color: '#a3aed0', borderBottom: '2px solid #f4f7fe' }}>
                                    <th style={{ padding: '15px', fontSize: '13px' }}>MÃ NV</th>
                                    <th style={{ padding: '15px', fontSize: '13px' }}>HỌ TÊN</th>
                                    <th style={{ padding: '15px', fontSize: '13px' }}>CÔNG</th>
                                    <th style={{ padding: '15px', fontSize: '13px' }}>TIẾT DẠY</th>
                                    <th style={{ padding: '15px', fontSize: '13px' }}>LƯƠNG CB</th>
                                    <th style={{ padding: '15px', fontSize: '13px' }}>TỔNG LĨNH</th>
                                </tr>
                                </thead>
                                <tbody>
                                {salaryPreview.length > 0 ? (
                                    salaryPreview.map((s, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f4f7fe' }}>
                                            {/* Hiển thị ID từ employee, fallback về id chính nếu employee null */}
                                            <td style={{ padding: '15px', color: '#2b3674' }}>NV{s.employee?.id || s.id}</td>

                                            <td style={{ padding: '15px', color: '#2b3674', fontWeight: 'bold' }}>
                                                {s.employee?.fullName || "N/A"}
                                            </td>

                                            <td style={{ padding: '15px', color: '#2b3674' }}>{s.ngayCong || 0}</td>

                                            <td style={{ padding: '15px', color: '#2b3674' }}>{s.tietDay || 0}</td>

                                            <td style={{ padding: '15px', color: '#2b3674' }}>
                                                {(s.luongCoBan || 0).toLocaleString()}đ
                                            </td>

                                            <td style={{ padding: '15px', color: '#05cd99', fontWeight: 'bold' }}>
                                                {(s.thucLinh || 0).toLocaleString()}đ
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#a3aed0' }}>
                                            Chưa có dữ liệu. Vui lòng nhấn nút tính lương.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SalaryPage;