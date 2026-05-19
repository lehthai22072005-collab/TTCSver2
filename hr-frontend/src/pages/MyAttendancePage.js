import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import '../App.css';

function MyAttendancePage() {
    const [attendanceList, setAttendanceList] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- STATE CHO PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Hiển thị 10 dòng mỗi trang

    const currentUsername = localStorage.getItem("username");
    const currentRole = localStorage.getItem("role");

    useEffect(() => {
        const fetchMyAttendance = async () => {
            try {
                const profileRes = await axios.get(`http://localhost:8080/api/profile/${currentRole}/${currentUsername}`);
                const empId = profileRes.data.id;

                const attendanceRes = await axios.get(`http://localhost:8080/api/attendance/employee/${empId}`);

                // SẮP XẾP: Mới nhất lên đỉnh
                const sortedData = attendanceRes.data.sort((a, b) => {
                    const dateA = new Date(`${a.ngayCham}T${a.gioVao}`);
                    const dateB = new Date(`${b.ngayCham}T${b.gioVao}`);
                    return dateB - dateA;
                });

                setAttendanceList(sortedData);
                setLoading(false);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu chấm công cá nhân:", err);
                setLoading(false);
            }
        };

        if (currentUsername && currentRole) {
            fetchMyAttendance();
        }
    }, [currentRole, currentUsername]);

    // --- LOGIC CẮT DỮ LIỆU ĐỂ PHÂN TRANG ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = attendanceList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(attendanceList.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h3 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '25px' }}>CHẤM CÔNG CÁ NHÂN</h3>

                    <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.05)' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#4318ff', fontWeight: 'bold' }}>⏳ Đang đồng bộ dữ liệu chấm công...</div>
                        ) : (
                            <>
                                <table className="data-table" style={{ marginTop: 0, width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                    <tr style={{ borderBottom: '2px solid #f4f7fe', textAlign: 'left', color: '#a3aed0', fontSize: '0.85rem' }}>
                                        <th style={{ padding: '15px' }}>NGÀY THÁNG</th>
                                        <th style={{ padding: '15px' }}>THỜI GIAN VÀO (CHECK-IN)</th>
                                        <th style={{ padding: '15px' }}>SỐ TIẾT ĐÃ DẠY</th>
                                        <th style={{ padding: '15px' }}>TRẠNG THÁI</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {currentItems.length > 0 ? (
                                        currentItems.map((record, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #f4f7fe', color: '#2b3674' }}>
                                                <td style={{ padding: '15px', fontWeight: '500' }}>{record.ngayCham}</td>
                                                <td style={{ padding: '15px', fontWeight: 'bold', color: '#0ea5e9' }}>{record.gioVao}</td>
                                                <td style={{ padding: '15px', fontWeight: '600' }}>{record.soTietDay} tiết</td>
                                                <td style={{ padding: '15px' }}>
                                                        <span style={statusBadge(record.trangThai)}>
                                                            {record.trangThai}
                                                        </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#a3aed0' }}>
                                                Chưa có dữ liệu lịch sử chấm công nào ghi nhận trong hệ thống.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>

                                {/* THANH ĐIỀU HƯỚNG PHÂN TRANG */}
                                {totalPages > 1 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                                        <span style={{ color: '#a3aed0', fontSize: '0.9rem' }}>
                                            Đang hiển thị {indexOfFirstItem + 1} đến {Math.min(indexOfLastItem, attendanceList.length)} trong tổng số {attendanceList.length} bản ghi
                                        </span>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                style={pageBtnStyle(currentPage === 1)}
                                            >
                                                Trước
                                            </button>

                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <button
                                                    key={i + 1}
                                                    onClick={() => paginate(i + 1)}
                                                    style={currentPage === i + 1 ? activePageBtnStyle : pageBtnStyle(false)}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                style={pageBtnStyle(currentPage === totalPages)}
                                            >
                                                Sau
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Hàm bổ trợ render màu sắc
const statusBadge = (status) => {
    const isGood = status === 'Đúng giờ';
    return {
        padding: '6px 15px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        backgroundColor: isGood ? '#e6fff5' : '#fff5f5',
        color: isGood ? '#05cd99' : '#ee5d50'
    };
};

const pageBtnStyle = (disabled) => ({
    padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px',
    backgroundColor: disabled ? '#f8fafc' : '#fff', color: disabled ? '#cbd5e1' : '#1b2559',
    cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: 'bold', transition: '0.2s'
});

const activePageBtnStyle = {
    padding: '6px 12px', border: '1px solid #4318ff', borderRadius: '6px',
    backgroundColor: '#4318ff', color: '#fff', cursor: 'pointer', fontWeight: 'bold'
};

export default MyAttendancePage;