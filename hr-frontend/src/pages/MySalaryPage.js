import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function MySalaryPage() {
    const [salaryList, setSalaryList] = useState([]);
    const [totalYear, setTotalYear] = useState(0);
    const [lastMonthSalary, setLastMonthSalary] = useState(0);
    const [lastMonthName, setLastMonthName] = useState('--/----');

    const currentUsername = localStorage.getItem("username");
    const currentRole = localStorage.getItem("role");

    useEffect(() => {
        const fetchMySalary = async () => {
            try {
                // Bước 1: Lấy thông tin Profile để biết Employee ID
                const profileRes = await axios.get(`http://localhost:8080/api/profile/${currentRole}/${currentUsername}`);
                const empId = profileRes.data.id;

                // Bước 2: Gọi API lấy lương dựa vào ID vừa lấy được
                const salaryRes = await axios.get(`http://localhost:8080/api/salary/my-salary/${empId}`);
                const data = salaryRes.data;

                // Sắp xếp lương mới nhất lên đầu
                data.sort((a, b) => {
                    const dateA = new Date(a.thangNam.split('/').reverse().join('-'));
                    const dateB = new Date(b.thangNam.split('/').reverse().join('-'));
                    return dateB - dateA;
                });

                setSalaryList(data);

                // Tính toán số liệu thống kê nhanh
                if (data.length > 0) {
                    setLastMonthSalary(data[0].thucLinh);
                    setLastMonthName(data[0].thangNam);

                    const total = data.reduce((sum, item) => sum + (item.thucLinh || 0), 0);
                    setTotalYear(total);
                }
            } catch (err) {
                console.error("Lỗi khi tải phiếu lương:", err);
            }
        };

        fetchMySalary();
    }, [currentRole, currentUsername]);

    const handleViewDetail = (month) => {
        alert(`Chức năng in PDF phiếu lương tháng ${month} sẽ sớm được cập nhật!`);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ backgroundColor: '#f4f7fe', minHeight: '100vh', padding: '30px' }}>

                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '25px', textTransform: 'uppercase' }}>
                            Phiếu lương cá nhân
                        </h2>

                        {/* Thẻ tóm tắt nhanh */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                            <div style={summaryCardStyle}>
                                <p style={labelStyle}>Tổng thu nhập (Các tháng đã có)</p>
                                <h3 style={{ color: '#4318ff', fontWeight: 'bold', margin: 0 }}>{totalYear.toLocaleString()} đ</h3>
                            </div>
                            <div style={summaryCardStyle}>
                                <p style={labelStyle}>Tháng gần nhất ({lastMonthName})</p>
                                <h3 style={{ color: '#05cd99', fontWeight: 'bold', margin: 0 }}>{lastMonthSalary.toLocaleString()} đ</h3>
                            </div>
                        </div>

                        {/* Bảng danh sách phiếu lương thật */}
                        <div style={tableCardStyle}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ borderBottom: '1px solid #f4f7fe' }}>
                                    <th style={thStyle}>Tháng</th>
                                    <th style={thStyle}>Ngày chốt</th>
                                    <th style={thStyle}>Tổng thực lĩnh</th>
                                    <th style={thStyle}>Trạng thái</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {salaryList.length > 0 ? (
                                    salaryList.map((item) => (
                                        <tr key={item.id} style={trStyle}>
                                            <td style={{ ...tdStyle, fontWeight: '700' }}>{item.thangNam}</td>
                                            <td style={tdStyle}>{item.ngayChot ? new Date(item.ngayChot).toLocaleDateString('vi-VN') : 'Đang xử lý'}</td>
                                            <td style={{ ...tdStyle, color: '#4318ff', fontWeight: '700' }}>{item.thucLinh.toLocaleString()}đ</td>
                                            <td style={tdStyle}>
                                                <span style={getStatusStyle(item.trangThaiChot)}>
                                                    {item.trangThaiChot ? 'Đã thanh toán' : 'Bản nháp'}
                                                </span>
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                <button
                                                    onClick={() => handleViewDetail(item.thangNam)}
                                                    style={btnDetailStyle}
                                                >
                                                    Xem chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#a3aed0' }}>
                                            Chưa có dữ liệu phiếu lương nào được hệ thống ghi nhận.
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

// --- Styles ---
const summaryCardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0px 10px 20px rgba(112, 144, 176, 0.05)', border: 'none' };
const tableCardStyle = { backgroundColor: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)' };
const thStyle = { textAlign: 'left', padding: '15px 10px', color: '#a3aed0', fontSize: '0.85rem', fontWeight: '500', textTransform: 'uppercase' };
const tdStyle = { padding: '20px 10px', fontSize: '0.95rem', color: '#2b3674' };
const trStyle = { borderBottom: '1px solid #f4f7fe' };
const labelStyle = { fontSize: '0.85rem', color: '#a3aed0', marginBottom: '5px' };
const btnDetailStyle = { padding: '8px 18px', backgroundColor: '#f4f7fe', color: '#4318ff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };

const getStatusStyle = (isPaid) => {
    return {
        padding: '5px 12px',
        borderRadius: '8px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        backgroundColor: isPaid ? '#e6fffb' : '#fff7e6',
        color: isPaid ? '#00b8d9' : '#ffab00'
    };
};

export default MySalaryPage;