import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function SalaryPage() {
    // Mặc định chọn tháng mới nhất để tiện thao tác test
    const [month, setMonth] = useState('04/2026');
    const [salaryPreview, setSalaryPreview] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Xem trước bảng lương nháp dựa trên dữ liệu chấm công thực tế
    const handleCalculate = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8080/api/salary/preview?month=${month}`);
            setSalaryPreview(res.data);
        } catch (err) {
            // Hiển thị trực tiếp thông báo chặn hoặc thông báo lỗi từ Backend nhả về
            alert(err.response?.data || "Lỗi khi tính toán bảng lương!");
        } finally {
            setLoading(false);
        }
    };

    // 2. Chốt khóa bảng lương chính thức chuyển trạng thái sang Đã Chi Trả
    const handleLockSalary = async () => {
        if (salaryPreview.length === 0) return alert("Vui lòng chạy tính lương để có dữ liệu nháp trước khi chốt!");

        if (window.confirm(`Xác nhận khóa chính thức bảng lương tháng ${month}? Dữ liệu sau khi khóa sẽ được lưu lịch sử và không thể chỉnh sửa lại.`)) {
            try {
                await axios.post(`http://localhost:8080/api/salary/lock?month=${month}`);
                alert("🔒 Hệ thống: Đã chốt và khóa bảng lương thành công!");
                // Điều hướng tự động sang trang Lịch sử chi trả để kiểm tra kết quả
                window.location.href = "/payment-history";
            } catch (err) {
                console.error(err);
                alert("Lỗi hệ thống khi thực hiện chốt bảng lương!");
            }
        }
    };

    // VÒNG LẶP TỰ ĐỘNG TẠO MẢNG CHỨA 12 THÁNG NĂM 2026
    const monthsArray = Array.from({ length: 12 }, (_, i) => {
        const monthNum = String(i + 1).padStart(2, '0');
        return `${monthNum}/2026`;
    });

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '30px' }}>TÍNH TOÁN LƯƠNG</h2>

                    <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '30px' }}>
                            <span style={{ color: '#2b3674', fontWeight: '500' }}>Chọn kỳ tính lương:</span>

                            {/* BỘ CHỌNDropdown ĐÃ ĐƯỢC NÂNG CẤP LÊN ĐỦ 12 THÁNG */}
                            <select
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid #e0e5f2', outline: 'none', color: '#2b3674', fontWeight: '600', backgroundColor: '#f8fafc', cursor: 'pointer' }}
                            >
                                {monthsArray.map(m => (
                                    <option key={m} value={m}>Tháng {m}</option>
                                ))}
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
                                    <th style={{ padding: '15px', fontSize: '13px' }}>CÔNG TÍNH</th>
                                    <th style={{ padding: '15px', fontSize: '13px' }}>TIẾT DẠY</th>
                                    <th style={{ padding: '15px', fontSize: '13px' }}>LƯƠNG CB</th>
                                    <th style={{ padding: '15px', fontSize: '13px' }}>TỔNG LĨNH</th>
                                </tr>
                                </thead>
                                <tbody>
                                {salaryPreview.length > 0 ? (
                                    salaryPreview.map((s, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f4f7fe' }}>
                                            <td style={{ padding: '15px', color: '#2b3674' }}>NV{s.employee?.id || s.id}</td>
                                            <td style={{ padding: '15px', color: '#2b3674', fontWeight: 'bold' }}>
                                                {s.employee?.fullName || "N/A"}
                                            </td>
                                            <td style={{ padding: '15px', color: '#2b3674' }}>{s.ngayCong || 0} ngày</td>
                                            <td style={{ padding: '15px', color: '#2b3674' }}>{s.tietDay || 0} tiết</td>
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
                                        <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#a3aed0', fontWeight: '500' }}>
                                            Chưa có dữ liệu tính toán. Vui lòng lựa chọn kỳ lương và nhấn nút chạy tính lương.
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