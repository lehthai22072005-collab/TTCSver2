import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function AttendancePage() {
    const [attendanceList, setAttendanceList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("Chờ upload");
    const [fileName, setFileName] = useState("Chưa có file nào được chọn");

    // --- STATE CHO PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Hiển thị 10 dòng mỗi trang

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const res = await axios.get("/api/attendance/all");

            // SẮP XẾP DỮ LIỆU: Mới nhất lên đầu (Dựa vào Ngày + Giờ)
            const sortedData = res.data.sort((a, b) => {
                const dateA = new Date(`${a.ngayCham}T${a.gioVao}`);
                const dateB = new Date(`${b.ngayCham}T${b.gioVao}`);
                return dateB - dateA; // Sắp xếp giảm dần
            });

            setAttendanceList(sortedData);
            setLoading(false);
        } catch (err) {
            console.error("Lỗi kết nối API:", err);
            setLoading(false);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
            setUploadStatus("Sẵn sàng để upload");
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Vui lòng chọn 1 file Excel trước!");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            setUploadStatus("Đang xử lý...");
            const res = await axios.post("/api/attendance/upload", formData);

            setUploadStatus("Upload thành công!");
            alert("✅ " + res.data.message);
            fetchAttendance();
            setCurrentPage(1); // Tải file mới xong thì tự động quay về trang 1
        } catch (err) {
            setUploadStatus("Lỗi khi upload!");
            const errorDetail = err.response?.data?.message || err.response?.data || err.message;
            alert("❌ THẤT BẠI: " + errorDetail);
            console.error(err);
        }
    };

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
                    <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '30px' }}>QUẢN LÝ CHẤM CÔNG</h2>

                    {/* KHUNG UPLOAD */}
                    <div style={cardStyle}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Upload file Excel:</label>
                            <input type="file" onChange={handleFileChange} style={{ padding: '5px' }} accept=".xlsx, .xls, .csv" />
                            <button onClick={handleUpload} style={btnActionStyle('#5e3aff')}>Upload</button>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#4318ff', margin: '5px 0' }}>
                            Tên file: <span style={{ fontWeight: '500' }}>{fileName}</span>
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#a3aed0', margin: '5px 0' }}>
                            Trạng thái: <span style={{ fontWeight: 'bold', color: uploadStatus.includes('Lỗi') || uploadStatus.includes('THẤT BẠI') ? 'red' : '#05cd99' }}>
                                [ {uploadStatus} ]
                            </span>
                        </p>
                    </div>

                    {/* BẢNG DỮ LIỆU */}
                    <div style={tableWrapperStyle}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ borderBottom: '2px solid #f4f7fe', textAlign: 'left' }}>
                                <th style={thStyle}>MÃ NV</th>
                                <th style={thStyle}>HỌ TÊN</th>
                                <th style={thStyle}>NGÀY</th>
                                <th style={thStyle}>GIỜ VÀO</th>
                                <th style={thStyle}>TRẠNG THÁI</th>
                                <th style={thStyle}>SỐ TIẾT</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* ĐÃ FIX: Chỉ map(render) mảng currentItems thay vì toàn bộ attendanceList */}
                            {currentItems.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #f4f7fe' }}>
                                    <td style={tdStyle}>NV{item.employeeId}</td>
                                    <td style={{ ...tdStyle, fontWeight: 'bold' }}>{item.employeeName}</td>
                                    <td style={tdStyle}>{item.ngayCham}</td>
                                    <td style={tdStyle}>{item.gioVao}</td>
                                    <td style={tdStyle}>
                                        <span style={statusBadge(item.trangThai)}>{item.trangThai}</span>
                                    </td>
                                    <td style={tdStyle}>{item.soTietDay}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {/* THANH ĐIỀU HƯỚNG PHÂN TRANG */}
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px', marginTop: '20px' }}>
                                <span style={{ color: '#a3aed0', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                                    Đang hiển thị {indexOfFirstItem + 1} đến {Math.min(indexOfLastItem, attendanceList.length)} trong tổng số {attendanceList.length} bản ghi
                                </span>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        style={pageBtnStyle(currentPage === 1)}
                                    >
                                        Trước
                                    </button>

                                    {/* Khung chứa các nút số trang */}
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
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- STYLES GIỮ NGUYÊN ---
const cardStyle = { backgroundColor: '#fff', padding: '25px', borderRadius: '15px', marginBottom: '25px', border: '1px dashed #cbd5e0' };
const tableWrapperStyle = { backgroundColor: '#fff', borderRadius: '20px', padding: '20px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)' };
const thStyle = { padding: '15px', color: '#a3aed0', fontSize: '0.85rem', textTransform: 'uppercase' };
const tdStyle = { padding: '15px', color: '#1b2559', fontSize: '0.95rem' };
const btnActionStyle = (bg) => ({ padding: '8px 25px', backgroundColor: bg, color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' });
const statusBadge = (status) => ({ padding: '6px 15px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: status === 'Đúng giờ' ? '#e6fff5' : '#fff5f5', color: status === 'Đúng giờ' ? '#05cd99' : '#ee5d50' });

// --- STYLES MỚI CHO NÚT PHÂN TRANG ---
const pageBtnStyle = (disabled) => ({
    padding: '6px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    backgroundColor: disabled ? '#f8fafc' : '#fff',
    color: disabled ? '#cbd5e1' : '#1b2559',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
    transition: '0.2s'
});

const activePageBtnStyle = {
    padding: '6px 12px',
    border: '1px solid #4318ff',
    borderRadius: '6px',
    backgroundColor: '#4318ff',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold'
};

export default AttendancePage;
