import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function SalaryPage() {
    const currentMonthNum = new Date().getMonth() + 1;
    const currentYearNum = new Date().getFullYear();
    const formattedCurrentMonth = `${String(currentMonthNum).padStart(2, '0')}/${currentYearNum}`;
    const [month, setMonth] = useState(formattedCurrentMonth);
    const [salaryPreview, setSalaryPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [attendanceUploaded, setAttendanceUploaded] = useState(false);

    useEffect(() => {
        const fetchAttendanceStatus = async () => {
            try {
                const res = await axios.get(`/api/attendance/month-status?month=${encodeURIComponent(month)}`);
                setAttendanceUploaded(res.data.uploaded);
            } catch (err) {
                setAttendanceUploaded(false);
            }
        };

        setSalaryPreview([]);
        fetchAttendanceStatus();
    }, [month]);

    // 1. Xem trước bảng lương nháp dựa trên dữ liệu chấm công thực tế
    const handleCalculate = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/salary/preview?month=${month}`);
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
                await axios.post(`/api/salary/lock?month=${month}`);
                alert("🔒 Hệ thống: Đã chốt và khóa bảng lương thành công!");
                // Điều hướng tự động sang trang Lịch sử chi trả để kiểm tra kết quả
                window.location.href = "/payment-history";
            } catch (err) {
                console.error(err);
                alert("Lỗi hệ thống khi thực hiện chốt bảng lương!");
            }
        }
    };

    const handleExportExcel = async () => {
        if (!attendanceUploaded) {
            return alert(`Tháng ${month} chưa upload file chấm công nên chưa thể xuất Excel.`);
        }

        try {
            const res = await axios.get(`/api/salary/export?month=${encodeURIComponent(month)}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `BangLuong_${month.replace('/', '_')}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            const errorText = err.response?.data instanceof Blob
                ? await err.response.data.text()
                : err.response?.data;
            alert(errorText || "Không thể xuất file Excel.");
        }
    };

    // VÒNG LẶP TỰ ĐỘNG TẠO MẢNG CHỨA 12 THÁNG CỦA NĂM HIỆN TẠI
    const monthsArray = Array.from({ length: 12 }, (_, i) => {
        const monthNum = String(i + 1).padStart(2, '0');
        return `${monthNum}/${currentYearNum}`;
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

                            <button
                                onClick={handleExportExcel}
                                disabled={!attendanceUploaded}
                                title={!attendanceUploaded ? `Tháng ${month} chưa upload chấm công` : ''}
                                style={{ padding: '10px 20px', backgroundColor: attendanceUploaded ? '#05cd99' : '#a3aed0', color: '#fff', border: 'none', borderRadius: '12px', cursor: attendanceUploaded ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}
                            >
                                Xuất Excel 📊
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
                                    <th style={{ padding: '15px', fontSize: '13px' }}>LƯƠNG CƠ BẢN</th>
                                    <th style={{ padding: '15px', fontSize: '13px', color: '#4318ff' }}>HỆ SỐ</th>
                                    <th style={{ padding: '15px', fontSize: '13px', color: '#ee5d50' }}>TIỀN GIẢNG DẠY</th>
                                    <th style={{ padding: '15px' }}>THUẾ TNCN</th>
                                    <th style={{ padding: '15px', color: '#05cd99' }}>THƯỞNG</th>
                                    <th style={{ padding: '15px', color: '#ee5d50' }}>PHẠT</th>
                                    <th style={{ padding: '15px', fontSize: '13px' }}>THỰC LĨNH</th>
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
                                            <td style={{ padding: '15px', color: '#2b3674' }}>
                                                {(s.employee?.baseSalary || 10000000).toLocaleString()}đ
                                            </td>
                                            <td style={{ padding: '15px', color: '#4318ff', fontWeight: 'bold' }}>
                                                x {s.heSoLuong || 1.0}
                                            </td>
                                            <td style={{ padding: '15px', color: '#ee5d50', fontWeight: 'bold' }}>
                                                {s.tietDay > 0 ? `${s.tietDay} tiết - ` : ''}{(s.tienGiangDay || 0).toLocaleString()}đ
                                            </td>
                                            <td style={{ padding: '15px' }}>{(s.thueTncn || 0).toLocaleString()}đ</td>
                                            <td style={{ padding: '15px', color: '#05cd99', fontWeight: 'bold' }}>{s.tienThuong ? '+' + s.tienThuong.toLocaleString() : 0}đ</td>
                                            <td style={{ padding: '15px', color: '#ee5d50', fontWeight: 'bold' }}>{s.tienPhat ? '-' + s.tienPhat.toLocaleString() : 0}đ</td>
                                            <td style={{ padding: '15px', color: '#4318ff', fontWeight: 'bold' }}>
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
