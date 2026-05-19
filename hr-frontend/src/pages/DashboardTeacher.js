import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function DashboardTeacher() {
    const userName = localStorage.getItem('username') || 'Giảng viên';
    const role = localStorage.getItem('role') || 'TEACHER';

    const [tietDay, setTietDay] = useState(0);
    const [ngayPhep, setNgayPhep] = useState(12);
    const [thangHienTai, setThangHienTai] = useState("tháng này");
    const [loading, setLoading] = useState(true);

    // ĐỒNG BỘ HÀM TÍNH NGÀY KHÔNG LỆCH TIMEZONE
    const calculateLeaveDays = (start, end) => {
        if (!start || !end) return 1;
        try {
            let startStr = String(start).split('T')[0];
            let endStr = String(end).split('T')[0];

            if (startStr.includes('/')) {
                const p = startStr.split('/');
                startStr = `${p[2]}-${p[1]}-${p[0]}`;
            }
            if (endStr.includes('/')) {
                const p = endStr.split('/');
                endStr = `${p[2]}-${p[1]}-${p[0]}`;
            }

            const sDate = new Date(startStr + 'T00:00:00');
            const eDate = new Date(endStr + 'T00:00:00');

            const diffTime = eDate.getTime() - sDate.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;

            return isNaN(diffDays) || diffDays <= 0 ? 1 : diffDays;
        } catch (error) {
            return 1;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileRes = await axios.get(`http://localhost:8080/api/profile/${role}/${userName}`);
                const empId = profileRes.data.id;

                const attendanceRes = await axios.get(`http://localhost:8080/api/attendance/employee/${empId}`);
                const attendanceData = attendanceRes.data;

                if (attendanceData && attendanceData.length > 0) {
                    const sortedData = attendanceData.sort((a,b) => new Date(b.ngayCham) - new Date(a.ngayCham));
                    const latestRecord = sortedData[0];
                    const latestMonthStr = latestRecord.ngayCham.substring(0, 7);

                    setThangHienTai(latestMonthStr.split('-').reverse().join('/'));

                    const currentMonthRecords = attendanceData.filter(r => r.ngayCham.startsWith(latestMonthStr));
                    const totalTiet = currentMonthRecords.reduce((sum, r) => sum + r.soTietDay, 0);
                    setTietDay(totalTiet);
                } else {
                    setTietDay(0);
                    setThangHienTai("Chưa có dữ liệu");
                }

                try {
                    const leaveRes = await axios.get(`http://localhost:8080/api/leave-requests/employee/${empId}`);
                    const leaveData = leaveRes.data;

                    const deductedDays = leaveData
                        .filter(req => req.status === 'Đã duyệt' || req.status === 'Chờ duyệt')
                        .reduce((sum, req) => sum + calculateLeaveDays(req.startDate, req.endDate), 0);

                    setNgayPhep(12 - deductedDays);
                } catch (e) {
                    console.error("Lỗi đồng bộ danh sách đơn từ nghỉ phép:", e);
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
                            Chào mừng bạn đến với Cổng thông tin dành cho Giảng viên. Hệ thống tự động liên thông dữ liệu đơn từ nghỉ phép trực tuyến gửi Ban Giám Hiệu.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const labelStyle = { fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px', opacity: 0.9, textTransform: 'uppercase' };
const valueStyle = { fontSize: '2.4rem', fontWeight: '800', margin: 0 };
const cardPrimary = { flex: 1, background: 'linear-gradient(90deg, #4318ff 0%, #5e3aff 100%)', borderRadius: '20px', padding: '30px', color: '#fff', boxShadow: '0px 18px 40px rgba(67, 24, 255, 0.2)' };
const cardSuccess = { flex: 1, background: 'linear-gradient(90deg, #05cd99 0%, #04b688 100%)', borderRadius: '20px', padding: '30px', color: '#fff', boxShadow: '0px 18px 40px rgba(5, 205, 153, 0.2)' };

export default DashboardTeacher;