import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function HrReportsPage() {
    const [employees, setEmployees] = useState([]);
    const [pieData, setPieData] = useState([]);
    const currentDate = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    useEffect(() => {
        axios.get('http://localhost:8080/api/employees')
            .then(res => {
                const data = res.data;
                setEmployees(data);
                
                // Tính tỉ lệ phòng ban
                const deptCounts = {};
                data.forEach(emp => {
                    const dept = emp.department || 'Chưa phân bổ';
                    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
                });
                
                const formattedPieData = Object.keys(deptCounts).map(dept => ({
                    name: dept,
                    value: deptCounts[dept]
                }));
                setPieData(formattedPieData);
            })
            .catch(err => console.error("Lỗi lấy dữ liệu nhân viên:", err));
    }, []);

    const removeAccents = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("BAO CAO NHAN SU", 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(`Ngay xuat: ${removeAccents(currentDate)}`, 14, 30);
        doc.text(`Tong so nhan su: ${employees.length}`, 14, 40);
        doc.text(`So luong phong ban: ${pieData.length}`, 14, 50);

        const tableColumn = ["Phong ban", "So luong nhan su"];
        const tableRows = pieData.map(d => [
            removeAccents(d.name),
            d.value
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 60,
        });

        doc.save(`BaoCaoNhanSu_${new Date().getTime()}.pdf`);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2>Báo cáo nhân sự (Ban Giám Hiệu)</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: '500' }}>{currentDate}</span>
                            <button className="btn-secondary" onClick={handleExportPDF} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 16px' }}>Xuất PDF</button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', minWidth: '350px' }}>
                            <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Tỉ lệ nhân sự theo phòng ban</h4>
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={350}>
                                    <PieChart>
                                        <Pie 
                                            data={pieData} 
                                            cx="50%" 
                                            cy="50%" 
                                            labelLine={true} 
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} 
                                            outerRadius={100} 
                                            fill="#8884d8" 
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '50px' }}>Đang tải dữ liệu biểu đồ...</p>
                            )}
                        </div>

                        <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', minWidth: '300px' }}>
                            <h4>Tổng quan nhân sự</h4>
                            <div style={{ marginTop: '20px' }}>
                                <div style={{ padding: '15px', backgroundColor: '#f1f5f9', borderRadius: '8px', marginBottom: '10px' }}>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Tổng số nhân sự hiện tại</p>
                                    <h2 style={{ margin: '5px 0 0 0', color: '#0f172a' }}>{employees.length}</h2>
                                </div>
                                <div style={{ padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '8px', marginBottom: '10px' }}>
                                    <p style={{ margin: 0, color: '#166534', fontSize: '0.9rem' }}>Số lượng phòng ban</p>
                                    <h2 style={{ margin: '5px 0 0 0', color: '#15803d' }}>{pieData.length}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HrReportsPage;
