import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../App.css';

function MySalaryPage() {
    const [salaries] = useState([
        { month: 'Tháng 4 / 2026', base: 15000000, allowance: 2000000, deduction: 500000, net: 16500000, status: 'Đã thanh toán' },
        { month: 'Tháng 3 / 2026', base: 15000000, allowance: 1500000, deduction: 0, net: 16500000, status: 'Đã thanh toán' },
        { month: 'Tháng 2 / 2026', base: 15000000, allowance: 3000000, deduction: 200000, net: 17800000, status: 'Đã thanh toán' }
    ]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleDownloadPDF = (salary) => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("PHIEU LUONG", 105, 20, { align: 'center' });
        
        doc.setFontSize(14);
        doc.text(`Ky luong: ${salary.month}`, 20, 40);
        doc.text(`Trang thai: ${salary.status}`, 20, 50);

        const tableColumn = ["Chi tiet", "So tien (VND)"];
        const tableRows = [
            ["Luong co ban", formatCurrency(salary.base).replace('₫', '')],
            ["Phu cap", formatCurrency(salary.allowance).replace('₫', '')],
            ["Khau tru", formatCurrency(salary.deduction).replace('₫', '')],
            ["Thuc nhan", formatCurrency(salary.net).replace('₫', '')]
        ];

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 60,
        });

        doc.save(`PhieuLuong_${salary.month.replace(/[\s/]/g, '')}.pdf`);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <h3>Tra cứu Bảng lương</h3>
                    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Kỳ lương</th>
                                    <th>Lương cơ bản</th>
                                    <th>Phụ cấp (Tiết dạy thêm, v.v...)</th>
                                    <th>Khấu trừ</th>
                                    <th>Thực nhận</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salaries.map((s, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: 'bold' }}>{s.month}</td>
                                        <td>{formatCurrency(s.base)}</td>
                                        <td>{formatCurrency(s.allowance)}</td>
                                        <td style={{ color: '#ef4444' }}>{formatCurrency(s.deduction)}</td>
                                        <td style={{ color: '#1cc88a', fontWeight: 'bold', fontSize: '1.1rem' }}>{formatCurrency(s.net)}</td>
                                        <td><span style={{ backgroundColor: '#ccfbf1', padding: '5px 10px', borderRadius: '5px', color: '#0f766e', fontSize: '0.85rem', fontWeight: 'bold' }}>{s.status}</span></td>
                                        <td>
                                            <button className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.85rem', backgroundColor: '#e2e8f0', color: '#1e293b' }} onClick={() => handleDownloadPDF(s)}>
                                                Tải PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#64748b' }}>
                            <p>* Lương cơ bản và phụ cấp có thể thay đổi dựa trên tổng số giờ thực tế giảng dạy trong tháng.</p>
                            <p>* Mọi thắc mắc về bảng lương vui lòng liên hệ trực tiếp phòng Kế toán.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MySalaryPage;
