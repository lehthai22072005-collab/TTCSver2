import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function SalaryFundPage() {
    const [selectedYear, setSelectedYear] = useState('2026');

    // Dữ liệu biểu đồ từ T1 đến T12 chuẩn Wireframe
    const data = [
        { name: 'T1', value: 550 }, { name: 'T2', value: 500 }, { name: 'T3', value: 600 },
        { name: 'T4', value: 630 }, { name: 'T5', value: 580 }, { name: 'T6', value: 530 },
        { name: 'T7', value: 540 }, { name: 'T8', value: 560 }, { name: 'T9', value: 620 },
        { name: 'T10', value: 640 }, { name: 'T11', value: 510 }, { name: 'T12', value: 520 },
    ];

    const handleExport = () => {
        alert(`Đang khởi tạo báo cáo Quỹ lương năm ${selectedYear} chuẩn PDF...`);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ maxWidth: '900px', margin: '0 auto' }}>

                    {/* 1. Tiêu đề in hoa có gạch chân */}
                    <div style={{ borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '20px', textAlign: 'center' }}>
                        <h2 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Quỹ lương</h2>
                    </div>

                    {/* 2. Bộ lọc thời gian chọn năm */}
                    <div style={{ border: '1px solid #000', padding: '15px', marginBottom: '25px', backgroundColor: '#f8fafc' }}>
                        <span>Thời gian: </span>
                        <select
                            style={{ padding: '5px 15px', border: '1px solid #000', fontWeight: 'bold', cursor: 'pointer' }}
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            <option value="2025">[ Năm 2025 ▼ ]</option>
                            <option value="2026">[ Năm 2026 ▼ ]</option>
                            <option value="2027">[ Năm 2027 ▼ ]</option>
                        </select>
                    </div>

                    {/* 3. Biểu đồ chi phí lương theo tháng (Bar Chart) */}
                    <div style={{ border: '1px solid #000', padding: '25px', marginBottom: '25px', backgroundColor: '#fff' }}>
                        <h4 style={{ fontWeight: 'bold', marginBottom: '20px' }}>| Biểu đồ chi phí lương theo tháng</h4>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>(Bar chart: T1 → T12)</p>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis unit=" Tr" />
                                <Tooltip formatter={(value) => `${value} Triệu VNĐ`} />
                                <Bar dataKey="value" fill="#4f46e5" radius={[2, 2, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* 4. Tổng kết số liệu hàng dọc chuẩn Wireframe */}
                    <div style={{ border: '1px solid #000', padding: '25px', backgroundColor: '#fff', lineHeight: '2.5' }}>
                        <div style={{ borderBottom: '1px dashed #ccc', display: 'flex', justifyContent: 'space-between' }}>
                            <span>| Tổng quỹ lương năm:</span>
                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>6.824.195.104 đ</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <span>| Tổng bảo hiểm đã đóng:</span>
                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>716.540.486 đ</span>
                        </div>
                    </div>

                    {/* 5. Nút hành động */}
                    <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '60px' }}>
                        <button
                            onClick={handleExport}
                            style={{
                                padding: '15px 50px',
                                border: '2px solid #000',
                                backgroundColor: '#fff',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '5px 5px 0px #000'
                            }}
                        >
                            [ Xuất báo cáo PDF ]
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SalaryFundPage;