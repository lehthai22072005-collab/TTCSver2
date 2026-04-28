import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import jsPDF from 'jspdf';

function MySalaryPage() {
    const [view, setView] = useState('LIST');

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("PHIẾU LƯƠNG THÁNG 03/2026", 10, 10);
        doc.text("Mã NV: GV001 - Họ tên: Nguyễn Văn A", 10, 20);
        doc.text("Tổng nhận: 10,500,000 VND", 10, 30);
        doc.save("PhieuLuong.pdf");
    };

    if (view === 'DETAIL') return (
        <div className="dashboard-layout">
            <Sidebar /><div className="main-content"><TopBar />
            <div className="content-body">
                <div className="card p-4 mx-auto shadow" style={{ maxWidth: '500px', border: '1px solid #000' }}>
                    <h3 className="text-center">PHIẾU LƯƠNG</h3>
                    <p className="text-center">Tháng: 03/2026</p>
                    <hr />
                    <p>Mã NV: <b>GV001</b></p><p>Họ tên: <b>Nguyễn Văn A</b></p>
                    <hr />
                    <div className="d-flex justify-content-between"><p>Lương cơ bản:</p><p>10,000,000đ</p></div>
                    <div className="d-flex justify-content-between"><p>Phụ cấp:</p><p>1,000,000đ</p></div>
                    <div className="d-flex justify-content-between"><p>Khấu trừ:</p><p>500,000đ</p></div>
                    <hr />
                    <div className="d-flex justify-content-between text-success"><h4>TỔNG LƯƠNG:</h4><h4>10,500,000đ</h4></div>
                    <div className="text-center mt-4">
                        <button className="btn-primary" onClick={handleExportPDF}>[ Xuất PDF 📄 ]</button>
                        <button className="btn-secondary ms-2" onClick={() => setView('LIST')}>Quay lại</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );

    return (
        <div className="dashboard-layout">
            <Sidebar /><div className="main-content"><TopBar />
            <div className="content-body">
                <h2 className="mb-4">DANH SÁCH PHIẾU LƯƠNG</h2>
                <table className="data-table">
                    <thead><tr><th>Tháng</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                    <tbody>
                    <tr><td>03/26</td><td>Đã chốt</td><td><button className="btn-link" onClick={() => setView('DETAIL')}>[Xem chi tiết]</button></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
}
export default MySalaryPage;