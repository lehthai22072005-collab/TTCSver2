import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const lineData = [
    { name: 'Tháng 1', moi: 4, nghi: 1 },
    { name: 'Tháng 2', moi: 10, nghi: 2 },
    { name: 'Tháng 3', moi: 7, nghi: 3 },
];

const pieData = [
    { name: 'Khoa CNTT', value: 40 },
    { name: 'Kế toán', value: 20 },
    { name: 'Hành chính', value: 40 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b'];

function HrReportsPage() {
    // Quản lý state cho bộ lọc thời gian
    const [filterType, setFilterType] = useState('Tháng');
    const [selectedTime, setSelectedTime] = useState('03/2026');

    // Danh sách tháng để chọn
    const timeOptions = ['01/2026', '02/2026', '03/2026', '04/2026', '05/2026', '06/2026'];

    const handleExportPDF = () => {
        alert(`Hệ thống đang trích xuất báo cáo nhân sự ${filterType} ${selectedTime} ra file PDF...`);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ maxWidth: '900px', margin: '0 auto' }}>

                    {/* 1. Tiêu đề chuẩn Wireframe */}
                    <div style={{ borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '20px', textAlign: 'center' }}>
                        <h2 style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Báo cáo nhân sự</h2>
                    </div>

                    {/* 2. Bộ lọc thời gian - Đã có thể chọn được */}
                    <div style={{ border: '1px solid #000', padding: '15px', marginBottom: '25px', display: 'flex', gap: '20px', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                        <span style={{ fontWeight: 'bold' }}>Thời gian:</span>

                        <select
                            style={{ padding: '8px 12px', border: '2px solid #000', cursor: 'pointer', fontWeight: '500' }}
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="Tháng">[ Tháng ▼ ]</option>
                            <option value="Quý">[ Quý ▼ ]</option>
                            <option value="Năm">[ Năm ▼ ]</option>
                        </select>

                        <select
                            style={{ padding: '8px 12px', border: '2px solid #000', cursor: 'pointer', fontWeight: '500' }}
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                        >
                            {timeOptions.map((option) => (
                                <option key={option} value={option}>[ {option} ▼ ]</option>
                            ))}
                        </select>

                        <span style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                            * Đang hiển thị dữ liệu của {filterType} {selectedTime}
                        </span>
                    </div>

                    {/* 3. Biểu đồ Line Chart (Nhân sự theo thời gian) */}
                    <div style={{ border: '1px solid #000', padding: '20px', marginBottom: '25px', backgroundColor: '#fff' }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '10px', fontWeight: 'bold' }}>
                            | Biểu đồ: Nhân sự theo thời gian (Tăng/Giảm)
                        </h4>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>(Line chart: số người mới vs nghỉ)</p>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={lineData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                                <Line type="monotone" dataKey="moi" stroke="#4f46e5" name="Người mới" strokeWidth={3} dot={{ r: 6 }} />
                                <Line type="monotone" dataKey="nghi" stroke="#ef4444" name="Nghỉ việc" strokeWidth={3} dot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* 4. Biểu đồ Pie Chart (Tỷ lệ theo phòng ban) */}
                    <div style={{ border: '1px solid #000', padding: '20px', marginBottom: '25px', backgroundColor: '#fff' }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: 'bold' }}>
                            | Biểu đồ: Tỷ lệ theo phòng ban (Pie chart)
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                            <ResponsiveContainer width="45%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>

                            <div style={{ width: '45%', lineHeight: '3', fontSize: '1.05rem' }}>
                                {pieData.map((item, index) => (
                                    <div key={index} style={{ borderBottom: '1px dashed #000', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>- {item.name}:</span>
                                        <span style={{ fontWeight: 'bold' }}>{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 5. Nút xuất báo cáo PDF phong cách Wireframe */}
                    <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '60px' }}>
                        <button
                            onClick={handleExportPDF}
                            style={{
                                padding: '15px 60px',
                                fontSize: '1.1rem',
                                borderRadius: '0',
                                border: '3px solid #000',
                                backgroundColor: '#fff',
                                color: '#000',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '6px 6px 0px #000',
                                transition: 'all 0.1s'
                            }}
                            onMouseDown={(e) => e.currentTarget.style.transform = 'translate(2px, 2px)'}
                            onMouseUp={(e) => e.currentTarget.style.transform = 'translate(0px, 0px)'}
                        >
                            [ XUẤT BÁO CÁO PDF ]
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default HrReportsPage;