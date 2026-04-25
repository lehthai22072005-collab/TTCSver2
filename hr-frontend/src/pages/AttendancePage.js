import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function AttendancePage() {
    // Mock timesheet data instead of real file upload
    const [attendanceData, setAttendanceData] = useState([
        { empId: 'NV001', name: 'Nguyễn Văn A', checkInTime: '2026-04-25 08:00', status: 'Đúng giờ' },
        { empId: 'NV002', name: 'Trần Thị B', checkInTime: '2026-04-25 08:15', status: 'Muộn' },
        { empId: 'NV003', name: 'Lê Văn C', checkInTime: '2026-04-25 07:55', status: 'Đúng giờ' }
    ]);

    const handleExportExcel = () => {
        // Thêm BOM \uFEFF để Excel nhận diện đúng tiếng Việt
        let csvContent = "data:text/csv;charset=utf-8,\uFEFFMã NV,Họ Tên,Ngày giờ vào,Trạng thái\n";
        attendanceData.forEach(record => {
            csvContent += `${record.empId},${record.name},${record.checkInTime},${record.status}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Bao_Cao_Cham_Cong.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <h2>Quản Lý Chấm Công (Kế Toán - Nhân Sự)</h2>
                    <p style={{ color: '#64748b' }}>Nhập hoặc Upload File chấm công từ máy vân tay / hệ thống nội bộ</p>

                    <div className="card shadow-sm p-4" style={{ backgroundColor: '#fff', borderRadius: '12px', marginTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h4 style={{ margin: 0 }}>Dữ liệu chấm công tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}</h4>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={handleExportExcel} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    Xuất File Excel
                                </button>
                            </div>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                                    <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Mã NV</th>
                                    <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Họ Tên</th>
                                    <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Ngày giờ vào</th>
                                    <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceData.map((record, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px' }}>{record.empId}</td>
                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{record.name}</td>
                                        <td style={{ padding: '12px', color: '#1e293b' }}>{record.checkInTime}</td>
                                        <td style={{ padding: '12px', color: record.status === 'Muộn' ? '#991b1b' : '#166534', fontWeight: 'bold' }}>{record.status}</td>
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
