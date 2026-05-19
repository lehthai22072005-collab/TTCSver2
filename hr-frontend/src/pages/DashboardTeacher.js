import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function DashboardTeacher() {
    const userName = localStorage.getItem('username') || 'Giảng viên';
    const role = localStorage.getItem('role') || 'TEACHER';

    // State lưu dữ liệu thật
    const [tietDay, setTietDay] = useState(0);
    const [ngayPhep, setNgayPhep] = useState(12); // Mặc định 12 ngày phép/năm
    const [thangHienTai, setThangHienTai] = useState("tháng này");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Lấy Employee ID từ Profile
                const profileRes = await axios.get(`http://localhost:8080/api/profile/${role}/${userName}`);
                const empId = profileRes.data.id;

                // 2. Kéo toàn bộ dữ liệu chấm công thật của người này
                const attendanceRes = await axios.get(`http://localhost:8080/api/attendance/employee/${empId}`);
                const attendanceData = attendanceRes.data;

                if (attendanceData && attendanceData.length > 0) {
                    // Sắp xếp để tìm ra tháng chấm công mới nhất
                    const sortedData = attendanceData.sort((a,b) => new Date(b.ngayCham) - new Date(a.ngayCham));
                    const latestRecord = sortedData[0];
                    const latestMonthStr = latestRecord.ngayCham.substring(0, 7); // Cắt lấy "YYYY-MM" (VD: 2026-04)

                    // Hiển thị tên tháng lên giao diện
                    setThangHienTai(latestMonthStr.split('-').reverse().join('/'));

                    // Lọc ra tất cả các ngày đi làm trong tháng đó
                    const currentMonthRecords = attendanceData.filter(r => r.ngayCham.startsWith(latestMonthStr));

                    // CỘNG DỒN TỔNG SỐ TIẾT DẠY
                    const totalTiet = currentMonthRecords.reduce((sum, r) => sum + r.soTietDay, 0);
                    setTietDay(totalTiet);
                } else {
                    setTietDay(0);
                    setThangHienTai("Chưa có dữ liệu");
                }

                // 3. Kéo dữ liệu đơn nghỉ phép để trừ đi số ngày phép (nếu có API)
                try {
                    const leaveRes = await axios.get(`http://localhost:8080/api/leave-requests/employee/${empId}`);
                    const leaveData = leaveRes.data;
                    // Lọc các đơn đã được BGH duyệt
                    const approvedLeaves = leaveData.filter(req => req.status === 'APPROVED' || req.status === 'Đồng ý');
                    setNgayPhep(12 - approvedLeaves.length);
                } catch (e) {
                    // Nếu chưa làm API nghỉ phép thì cứ để mặc định 12
                }

                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu Dashboard Giảng viên:", error);
                setLoading(false);
            }
        };

        if(userName) fetchData();
    }, [userName, role]);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '30px' }}>
                        DASHBOARD GIẢNG VIÊN
                    </h2>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                        <div style={cardPrimary}>
                            <p style={labelStyle}>SỐ TIẾT DẠY ({thangHienTai})</p>
                            <h2 style={valueStyle}>
                                {loading ? '...' : `${tietDay} Tiết`}
                            </h2>
                        </div>
                        <div style={cardSuccess}>
                            <p style={labelStyle}>NGÀY PHÉP CÒN LẠI TRONG NĂM</p>
                            <h2 style={valueStyle}>
                                {loading ? '...' : `${ngayPhep} Ngày`}
                            </h2>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)' }}>
                        <h4 style={{ color: '#1b2559', fontWeight: 'bold', marginBottom: '20px' }}>Xin chào {userName}!</h4>
                        <p style={{ color: '#475569', lineHeight: '1.8' }}>
                            Chào mừng bạn đến với Cổng thông tin dành cho Giảng viên. Tại đây, bạn có thể:
                            <br/>- Xem chấm công và lịch dạy cá nhân.
                            <br/>- Theo dõi phiếu lương hàng tháng.
                            <br/>- Nộp đơn xin nghỉ phép trực tuyến.
                        </p>
                        <p style={{ color: '#ef4444', fontStyle: 'italic', marginTop: '15px' }}>
                            * Lưu ý: Số tiết dạy trên Dashboard được đồng bộ tự động từ dữ liệu chấm công mới nhất do phòng Hành chính cập nhật.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Styles
const labelStyle = { fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px', opacity: 0.9, textTransform: 'uppercase' };
const valueStyle = { fontSize: '2.4rem', fontWeight: '800', margin: 0 };
const cardPrimary = { flex: 1, background: 'linear-gradient(90deg, #4318ff 0%, #5e3aff 100%)', borderRadius: '20px', padding: '30px', color: '#fff', boxShadow: '0px 18px 40px rgba(67, 24, 255, 0.2)' };
const cardSuccess = { flex: 1, background: 'linear-gradient(90deg, #05cd99 0%, #04b688 100%)', borderRadius: '20px', padding: '30px', color: '#fff', boxShadow: '0px 18px 40px rgba(5, 205, 153, 0.2)' };

export default DashboardTeacher;