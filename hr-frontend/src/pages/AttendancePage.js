import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function AttendancePage() {
    // Dữ liệu mẫu hiển thị trong bảng
    const [attendanceData] = useState([
        { id: 'GV001', name: 'Nguyễn Thị Lan', date: '01/03', checkIn: '07:55', status: 'Đúng giờ', periods: 4 },
        { id: 'NV002', name: 'Bác Năm (Bảo vệ)', date: '01/03', checkIn: '06:00', status: 'Đúng giờ', periods: '-' }
    ]);

    // State quản lý file và trạng thái
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('Chờ upload');

    // Hàm xử lý khi chọn file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setUploadStatus('Sẵn sàng upload');
        } else {
            setSelectedFile(null);
            setUploadStatus('Chờ upload');
        }
    };

    // Hàm xử lý khi nhấn nút Upload (Giả lập quy trình xử lý)
    const handleUpload = () => {
        if (!selectedFile) {
            alert("Vui lòng chọn file Excel trước khi nhấn Upload!");
            return;
        }

        setUploadStatus('Đang xử lý...');

        // Giả lập thời gian xử lý file 1.5 giây để giảng viên thấy logic
        setTimeout(() => {
            setUploadStatus('Đã xử lý ✔');
        }, 1500);
    };

    // Hàm xác định màu sắc cho dòng trạng thái
    const getStatusColor = () => {
        switch (uploadStatus) {
            case 'Đang xử lý...': return '#3b82f6'; // Xanh dương
            case 'Đã xử lý ✔': return '#10b981';    // Xanh lá
            case 'Sẵn sàng upload': return '#f59e0b'; // Vàng cam
            default: return '#64748b';              // Xám
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    {/* Tiêu đề trang chuẩn Wireframe */}
                    <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>
                        <h2 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Quản lý chấm công</h2>
                    </div>

                    {/* Khu vực Upload file */}
                    <div className="card p-4 mb-4 shadow-sm" style={{ border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                        <div className="d-flex align-items-center mb-3">
                            <label className="me-3" style={{ fontWeight: '500' }}>Upload file Excel:</label>
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                className="form-control w-auto d-inline-block"
                            />
                            <button
                                className="btn-primary ms-3"
                                onClick={handleUpload}
                                style={{ padding: '8px 25px', borderRadius: '4px' }}
                            >
                                Upload
                            </button>
                        </div>

                        <div className="mt-3 pt-3" style={{ borderTop: '1px dashed #cbd5e1' }}>
                            <p className="mb-2">
                                Tên file: <span style={{ color: '#4f46e5', fontWeight: 'bold' }}>
                                    {selectedFile ? selectedFile.name : 'Chưa có file nào được chọn'}
                                </span>
                            </p>
                            <p className="mb-0">
                                Trạng thái: <span style={{ color: getStatusColor(), fontWeight: 'bold' }}>
                                    [ {uploadStatus} ]
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Bảng hiển thị dữ liệu chấm công */}
                    <div className="card shadow-sm" style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                        <table className="data-table" style={{ marginTop: 0 }}>
                            <thead style={{ backgroundColor: '#f8fafc' }}>
                            <tr>
                                <th>MÃ NV</th>
                                <th>HỌ TÊN</th>
                                <th>NGÀY</th>
                                <th>GIỜ VÀO</th>
                                <th>TRẠNG THÁI</th>
                                <th>SỐ TIẾT</th>
                            </tr>
                            </thead>
                            <tbody>
                            {attendanceData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.id}</td>
                                    <td style={{ fontWeight: '500' }}>{row.name}</td>
                                    <td>{row.date}</td>
                                    <td>{row.checkIn}</td>
                                    <td>
                                            <span style={{ color: row.status === 'Trễ' ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                                                {row.status}
                                            </span>
                                    </td>
                                    <td className="text-center"><b>{row.periods}</b></td>
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

export default AttendancePage;