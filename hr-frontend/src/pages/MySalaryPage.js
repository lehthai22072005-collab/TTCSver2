import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function MySalaryPage() {
    const [salaryList, setSalaryList] = useState([]);
    const [totalYear, setTotalYear] = useState(0);
    const [lastMonthSalary, setLastMonthSalary] = useState(0);
    const [lastMonthName, setLastMonthName] = useState('--/----');

    // Quản lý Modal Xem chi tiết
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedPayroll, setSelectedPayroll] = useState(null);

    const currentUsername = localStorage.getItem("username");
    const currentRole = localStorage.getItem("role");

    const fetchMySalary = async () => {
        try {
            const profileRes = await axios.get(`http://localhost:8080/api/profile/${currentRole}/${currentUsername}`);
            const empId = profileRes.data.id;

            const salaryRes = await axios.get(`http://localhost:8080/api/salary/my-salary/${empId}`);
            const data = salaryRes.data;

            data.sort((a, b) => {
                const dateA = new Date(a.thangNam.split('/').reverse().join('-'));
                const dateB = new Date(b.thangNam.split('/').reverse().join('-'));
                return dateB - dateA;
            });

            setSalaryList(data);

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

    useEffect(() => {
        fetchMySalary();
    }, [currentRole, currentUsername]);

    const handleOpenDetail = (payroll) => {
        setSelectedPayroll(payroll);
        setShowDetailModal(true);
    };

    // HÀM XUẤT PDF / IN ẤN TIÊU CHUẨN ĐỒ ÁN
    const handlePrintPDF = () => {
        window.print();
    };

    return (
        <div className="dashboard-layout">
            {/* Thêm CSS Print trực tiếp để khi in ấn sẽ tự động ẩn Sidebar & Topbar, gom phiếu lương ra giữa trang A4 */}
            <style>{`
                @media print {
                    .sidebar, .top-bar, .btn-primary, .btn-secondary, h2, .stats-grid, .table-card-wrapper, p {
                        display: none !important;
                    }
                    .main-content {
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .print-payslip-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100% !important;
                        border: none !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                        display: block !important;
                    }
                    body {
                        background-color: #fff !important;
                    }
                }
            `}</style>

            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>

                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '25px', textTransform: 'uppercase' }}>
                            Phiếu lương cá nhân
                        </h2>

                        {/* Thẻ tóm tắt nhanh */}
                        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                            <div style={summaryCardStyle}>
                                <p style={labelStyle}>Tổng thu nhập (Các tháng đã có)</p>
                                <h3 style={{ color: '#4318ff', fontWeight: 'bold', margin: 0 }}>{totalYear.toLocaleString()} đ</h3>
                            </div>
                            <div style={summaryCardStyle}>
                                <p style={labelStyle}>Tháng gần nhất ({lastMonthName})</p>
                                <h3 style={{ color: '#05cd99', fontWeight: 'bold', margin: 0 }}>{lastMonthSalary.toLocaleString()} đ</h3>
                            </div>
                        </div>

                        {/* Bảng danh sách phiếu lương */}
                        <div className="table-card-wrapper" style={tableCardStyle}>
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
                                                    onClick={() => handleOpenDetail(item)}
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
                                            Chưa có dữ liệu phiếu lương nào từ hệ thống.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL PHIẾU LƯƠNG CHI TIẾT CHUẨN A4 */}
            {showDetailModal && selectedPayroll && (
                <div className="modal-overlay" style={{ zIndex: 9999 }}>
                    <div className="modal-content print-payslip-container" style={{ width: '700px', maxWidth: '95%', padding: '40px', borderRadius: '15px', border: '1px solid #cbd5e1', backgroundColor: '#fff', overflowY: 'auto', maxHeight: '90vh' }}>

                        {/* Quốc hiệu tiêu đề */}
                        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                            <h5 style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', letterSpacing: '0.5px' }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h5>
                            <p style={{ margin: '3px 0 10px 0', fontSize: '12px', fontWeight: '500' }}>Độc lập - Tự do - Hạnh phúc</p>
                            <div style={{ width: '150px', height: '1px', backgroundColor: '#000', margin: '0 auto' }}></div>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <h4 style={{ margin: 0, fontSize: '12px', fontWeight: 'bold' }}>HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</h4>
                            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#475569' }}>Phòng Tài chính - Kế toán</p>
                        </div>

                        <h3 style={{ textAlign: 'center', fontWeight: '800', color: '#1b2559', fontSize: '1.6rem', marginBottom: '30px', textTransform: 'uppercase' }}>
                            Phiếu lương chi tiết tháng {selectedPayroll.thangNam}
                        </h3>

                        {/* Thông tin cá nhân giảng viên */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div><b>Mã số giảng viên:</b> <span style={{ marginLeft: '10px' }}>NV{selectedPayroll.employee?.id}</span></div>
                            <div><b>Họ và tên:</b> <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>{selectedPayroll.employee?.fullName}</span></div>
                            <div><b>Khoa / Phòng ban:</b> <span style={{ marginLeft: '10px' }}>{selectedPayroll.employee?.department}</span></div>
                            <div><b>Học vị / Chức vụ:</b> <span style={{ marginLeft: '10px' }}>{selectedPayroll.employee?.academicDegree}</span></div>
                        </div>

                        {/* Bảng chi tiết cấu trúc thu nhập */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                            <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1' }}>
                                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px' }}>DANMỤC MỤC LƯƠNG</th>
                                <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px' }}>THÔNG SỐ</th>
                                <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px' }}>SỐ TIỀN (VNĐ)</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr style={{ borderBottom: '1px dashed #e2e8f0' }}>
                                <td style={{ padding: '12px', fontSize: '13px' }}>1. Lương cơ bản gốc</td>
                                <td style={{ padding: '12px', textAlign: 'right', color: '#64748b' }}>Hợp đồng</td>
                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500' }}>{(selectedPayroll.luongCoBan || 0).toLocaleString()}đ</td>
                            </tr>
                            <tr style={{ borderBottom: '1px dashed #e2e8f0' }}>
                                <td style={{ padding: '12px', fontSize: '13px' }}>2. Số ngày công đi làm thực tế</td>
                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#4318ff' }}>{selectedPayroll.ngayCong || 0} ngày</td>
                                <td style={{ padding: '12px', textAlign: 'right', color: '#64748b' }}>---</td>
                            </tr>
                            <tr style={{ borderBottom: '1px dashed #e2e8f0' }}>
                                <td style={{ padding: '12px', fontSize: '13px' }}>3. Số tiết giảng dạy vượt giờ</td>
                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#4318ff' }}>{selectedPayroll.tietDay || 0} tiết</td>
                                <td style={{ padding: '12px', textAlign: 'right', color: '#64748b' }}>---</td>
                            </tr>
                            <tr style={{ borderBottom: '1px dashed #e2e8f0' }}>
                                <td style={{ padding: '12px', fontSize: '13px' }}>4. Phụ cấp thù lao giảng dạy</td>
                                <td style={{ padding: '12px', textAlign: 'right', color: '#64748b' }}>150.000đ/tiết</td>
                                <td style={{ padding: '12px', textAlign: 'right', color: '#05cd99', fontWeight: '500' }}>{((selectedPayroll.phuCap) || 0).toLocaleString()}đ</td>
                            </tr>
                            <tr style={{ borderBottom: '1px dashed #e2e8f0', color: '#ee5d50' }}>
                                <td style={{ padding: '12px', fontSize: '13px' }}>5. Khấu trừ Bảo hiểm xã hội (BHXH)</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>10.5%</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>- {((selectedPayroll.bhxhKhauTru) || 0).toLocaleString()}đ</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#ee5d50' }}>
                                <td style={{ padding: '12px', fontSize: '13px' }}>6. Thuế thu nhập cá nhân (TNCN)</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>Luỹ tiến 5%</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>- {((selectedPayroll.thueTncn) || 0).toLocaleString()}đ</td>
                            </tr>
                            <tr style={{ backgroundColor: '#eff6ff', fontWeight: 'bold' }}>
                                <td style={{ padding: '15px', fontSize: '14px', color: '#1b2559' }} colSpan="2">THỰC LĨNH CHUYỂN KHOẢN (NET):</td>
                                <td style={{ padding: '15px', textAlign: 'right', fontSize: '1.3rem', color: '#4318ff' }}>{(selectedPayroll.thucLinh || 0).toLocaleString()}đ</td>
                            </tr>
                            </tbody>
                        </table>

                        {/* Chữ ký các bên công chứng */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'center', marginTop: '10px', fontSize: '12px', fontStyle: 'italic' }}>
                            <div>
                                <p style={{ fontWeight: 'bold', margin: '0 0 50px 0', notItalic: true }}>Người nhận phiếu lương</p>
                                <p style={{ margin: 0 }}>(Ký và ghi rõ họ tên)</p>
                            </div>
                            <div>
                                <p style={{ fontWeight: 'bold', margin: '0 0 50px 0', notItalic: true }}>TM. BAN GIÁM ĐỐC HỌC VIỆN</p>
                                <p style={{ margin: 0, fontWeight: 'bold', notItalic: true }}>Trưởng phòng Tài chính - Kế toán</p>
                            </div>
                        </div>

                        {/* Nút thao tác tương tác loại trừ khi in ấn */}
                        <div className="form-actions" style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '40px' }}>
                            <button onClick={handlePrintPDF} style={{ backgroundColor: '#4318ff', color: 'white', padding: '10px 30px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                📄 Xuất File PDF / In Phiếu
                            </button>
                            <button onClick={() => setShowDetailModal(false)} style={{ backgroundColor: '#edf2f7', color: '#1b2559', padding: '10px 30px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                Đóng lại
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Styles Giữ Nguyên ---
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