import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function SalaryPage() {
    // Tải dữ liệu từ localStorage, nếu không có lấy dữ liệu mẫu
    const initialData = JSON.parse(localStorage.getItem('salaryData')) || [
        { id: 1, teacherId: 'GV001', name: 'Trần Thị B', base: 15000000, allowance: 2000000, deduction: 500000, net: 16500000, teachingHours: 40 }
    ];

    const [salaries, setSalaries] = useState(initialData);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFormat, setExportFormat] = useState('csv');

    // Lưu lại tiến trình mỗi khi mảng salaries thay đổi
    useEffect(() => {
        localStorage.setItem('salaryData', JSON.stringify(salaries));
    }, [salaries]);

    const handleCalculate = () => {
        // Giả lập Lệnh Tính Lương lấy dữ liệu từ bảng chấm công
        alert("Hệ thống đang chạy lệnh tính lương dựa trên cấu hình & file chấm công...");
        setTimeout(() => {
            setSalaries([
                { id: 1, teacherId: 'GV001', name: 'Nguyễn Văn A (NV001)', base: 12000000, allowance: 2000000, deduction: 300000, net: 13700000, email: 'nguyenvana@example.com', teachingHours: 40 },
                { id: 2, teacherId: 'GV002', name: 'Trần Thị B (NV002)', base: 15000000, allowance: 2000000, deduction: 500000, net: 16500000, email: 'tranthib@example.com', teachingHours: 50 },
                { id: 3, teacherId: 'GV003', name: 'Lê Văn C (NV003)', base: 14000000, allowance: 1500000, deduction: 0, net: 15500000, email: 'levanc@example.com', teachingHours: 45 }
            ]);
            alert("Đã kết xuất thành công Bảng Tổng Hợp Lương!");
        }, 1500);
    };

    const handleSendEmails = async () => {
        if (!window.confirm("Bạn có chắc muốn gửi Email Phiếu Lương hàng loạt đến nhân sự?")) return;
        
        let successCount = 0;
        for (const emp of salaries) {
            try {
                // Gọi API backend mock gửi email
                const res = await axios.post("http://localhost:8080/api/email/send-payslip", {
                    email: emp.email || "unknown@default.com",
                    month: new Date().getMonth() + 1
                });
                console.log(res.data.message);
                successCount++;
            } catch (err) {
                console.error("Lỗi gửi email: ", err);
            }
        }
        alert(`Đã hoàn tất lệnh gửi Email tới hệ thống SMTP! Thành công: ${successCount} nhân sự.`);
    };

    const handleExportCSV = () => {
        // Xuất dữ liệu sang file CSV
        const headers = ["ID Giảng viên", "Nhân viên", "Số tiết dạy", "Lương cơ bản", "Phụ cấp", "Khấu trừ", "Thực nhận"];
        const csvContent = [
            headers.join(","),
            ...salaries.map(s => `${s.teacherId || '-'},"${s.name}",${s.teachingHours || 0},${s.base},${s.allowance},${s.deduction},${s.net}`)
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' }); // \uFEFF hỗ trợ font Tiếng Việt
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `bang_luong_thang_${new Date().getMonth() + 1}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const removeAccents = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("BANG TONG HOP LUONG", 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(`Thang: ${new Date().getMonth() + 1}/${new Date().getFullYear()}`, 14, 30);

        const tableColumn = ["ID Giang vien", "Nhan vien", "So tiet", "Luong co ban", "Phu cap", "Khau tru", "Thuc nhan"];
        const tableRows = salaries.map(s => [
            s.teacherId || '-',
            removeAccents(s.name),
            s.teachingHours || 0,
            formatCurrency(s.base).replace('₫', '').trim(),
            formatCurrency(s.allowance).replace('₫', '').trim(),
            formatCurrency(s.deduction).replace('₫', '').trim(),
            formatCurrency(s.net).replace('₫', '').trim()
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 40,
        });

        doc.save(`BangLuong_Thang_${new Date().getMonth() + 1}.pdf`);
    };

    const executeExport = () => {
        if (exportFormat === 'csv') handleExportCSV();
        if (exportFormat === 'pdf') handleExportPDF();
        setShowExportModal(false);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <div className="header-action">
                        <h3>Bảng lương tháng {new Date().getMonth() + 1}</h3>
                        <div>
                            <button className="btn-secondary" style={{ marginRight: '10px' }} onClick={() => setShowExportModal(true)}>Xuất file bảng lương</button>
                            <button className="btn-secondary" style={{ marginRight: '10px', backgroundColor: '#8b5cf6', color: 'white', border: 'none' }} onClick={handleSendEmails}>Gửi Phiếu Lương (Email)</button>
                            <button className="btn-primary" onClick={handleCalculate}>Lệnh Tính Lương</button>
                        </div>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID Giảng viên</th>
                                <th>Nhân viên</th>
                                <th>Số tiết dạy</th>
                                <th>Lương cơ bản</th>
                                <th>Phụ cấp</th>
                                <th>Khấu trừ</th>
                                <th>Thực nhận</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salaries.map(s => (
                                <tr key={s.id}>
                                    <td>{s.teacherId || '-'}</td>
                                    <td className="font-bold">{s.name}</td>
                                    <td>{s.teachingHours || 0}</td>
                                    <td>{formatCurrency(s.base)}</td>
                                    <td>{formatCurrency(s.allowance)}</td>
                                    <td>{formatCurrency(s.deduction)}</td>
                                    <td style={{ color: '#1cc88a', fontWeight: 'bold' }}>{formatCurrency(s.net)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Xuất File */}
            {showExportModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#fff', padding: '24px', borderRadius: '8px',
                        width: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b' }}>Chọn định dạng xuất file</h3>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', cursor: 'pointer' }}>
                                <input 
                                    type="radio" 
                                    name="exportFormat" 
                                    value="csv" 
                                    checked={exportFormat === 'csv'} 
                                    onChange={(e) => setExportFormat(e.target.value)} 
                                    style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
                                />
                                <span style={{ fontSize: '1rem', color: '#334155' }}>Xuất ra Excel (CSV)</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input 
                                    type="radio" 
                                    name="exportFormat" 
                                    value="pdf" 
                                    checked={exportFormat === 'pdf'} 
                                    onChange={(e) => setExportFormat(e.target.value)} 
                                    style={{ width: '18px', height: '18px', accentColor: '#ef4444' }}
                                />
                                <span style={{ fontSize: '1rem', color: '#334155' }}>Xuất ra PDF</span>
                            </label>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '25px' }}>
                            <button onClick={() => setShowExportModal(false)} className="btn-secondary" style={{ padding: '8px 16px', backgroundColor: '#e2e8f0', color: '#475569', border: 'none' }}>Hủy</button>
                            <button onClick={executeExport} className="btn-primary" style={{ padding: '8px 20px' }}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SalaryPage;
