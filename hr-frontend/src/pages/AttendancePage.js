import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function AttendancePage() {
    const [attendanceList, setAttendanceList] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- BIẾN TRẠNG THÁI CHO UPLOAD ---
    const [selectedFile, setSelectedFile] = useState(null); // Lưu file người dùng chọn
    const [uploadStatus, setUploadStatus] = useState("Chờ upload"); // Trạng thái text
    const [fileName, setFileName] = useState("Chưa có file nào được chọn"); // Tên file hiển thị

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/attendance/all");
            setAttendanceList(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Lỗi kết nối API:", err);
            setLoading(false);
        }
    };

    // --- HÀM XỬ LÝ KHI CHỌN FILE ---
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
            setUploadStatus("Sẵn sàng để upload");
        }
    };

    // --- HÀM XỬ LÝ KHI BẤM NÚT UPLOAD ---
    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Vui lòng chọn 1 file Excel trước!");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            setUploadStatus("Đang xử lý...");
            // Link API này bạn cần tạo ở Backend để đọc Excel
            await axios.post("http://localhost:8080/api/attendance/upload", formData);

            setUploadStatus("Upload thành công!");
            alert("Đã tải dữ liệu lên thành công!");
            fetchAttendance(); // Tải lại bảng sau khi upload
        } catch (err) {
            setUploadStatus("Lỗi khi upload!");
            console.error(err);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '30px' }}>QUẢN LÝ CHẤM CÔNG</h2>

                    {/* KHUNG UPLOAD - ĐÃ FIX LOGIC */}
                    <div style={cardStyle}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Upload file Excel:</label>
                            {/* Input lắng nghe sự thay đổi handleFileChange */}
                            <input type="file" onChange={handleFileChange} style={{ padding: '5px' }} accept=".xlsx, .xls" />
                            <button onClick={handleUpload} style={btnActionStyle('#5e3aff')}>Upload</button>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#4318ff', margin: '5px 0' }}>
                            Tên file: <span style={{ fontWeight: '500' }}>{fileName}</span>
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#a3aed0', margin: '5px 0' }}>
                            Trạng thái: <span style={{ fontWeight: 'bold', color: uploadStatus.includes('Lỗi') ? 'red' : '#05cd99' }}>
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
                            {attendanceList.map((item) => (
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
                    </div>
                </div>
            </div>
        </div>
    );
}

// Styles giữ nguyên như bản trước...
const cardStyle = { backgroundColor: '#fff', padding: '25px', borderRadius: '15px', marginBottom: '25px', border: '1px dashed #cbd5e0' };
const tableWrapperStyle = { backgroundColor: '#fff', borderRadius: '20px', padding: '20px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)' };
const thStyle = { padding: '15px', color: '#a3aed0', fontSize: '0.85rem', textTransform: 'uppercase' };
const tdStyle = { padding: '15px', color: '#1b2559', fontSize: '0.95rem' };
const btnActionStyle = (bg) => ({ padding: '8px 25px', backgroundColor: bg, color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' });
const statusBadge = (status) => ({ padding: '6px 15px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: status === 'Đúng giờ' ? '#e6fff5' : '#fff5f5', color: status === 'Đúng giờ' ? '#05cd99' : '#ee5d50' });

export default AttendancePage;