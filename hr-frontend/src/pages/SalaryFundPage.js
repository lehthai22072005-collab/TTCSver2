import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function SalaryFundPage() {
    const currentYear = new Date().getFullYear();
    
    const [fundData, setFundData] = useState([]);
    const [totalSalary, setTotalSalary] = useState(0);
    const [totalInsurance, setTotalInsurance] = useState(0);

    useEffect(() => {
        const data = [];
        let tSalary = 0;
        let tInsurance = 0;
        
        for (let i = 1; i <= 12; i++) {
            // Giả lập quỹ lương mỗi tháng dao động từ 500 triệu đến 650 triệu
            const baseSalary = Math.floor(Math.random() * 150000000) + 500000000;
            // Bảo hiểm tính khoảng 10.5% tổng lương
            const insurance = baseSalary * 0.105; 
            
            data.push({
                month: `Tháng ${i}`,
                salary: baseSalary,
                insurance: insurance
            });
            
            // Chỉ cộng dồn các tháng đã qua hoặc đến tháng hiện tại (giả lập)
            // Để đơn giản, ta tính tổng cả năm
            tSalary += baseSalary;
            tInsurance += insurance;
        }
        
        setFundData(data);
        setTotalSalary(tSalary);
        setTotalInsurance(tInsurance);
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: '#fff', padding: '15px', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>{label}</p>
                    <p style={{ margin: '5px 0', color: '#4f46e5', fontWeight: '500' }}>Chi phí lương: {formatCurrency(payload[0].value)}</p>
                    <p style={{ margin: '5px 0', color: '#10b981', fontWeight: '500' }}>Chi phí bảo hiểm: {formatCurrency(payload[1].value)}</p>
                </div>
            );
        }
        return null;
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`BAO CAO QUY LUONG NAM ${currentYear}`, 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(`Tong quy luong: ${formatCurrency(totalSalary).replace('₫', '').trim()} VND`, 14, 30);
        doc.text(`Tong bao hiem da dong: ${formatCurrency(totalInsurance).replace('₫', '').trim()} VND`, 14, 40);

        const tableColumn = ["Thang", "Chi phi luong", "Chi phi bao hiem"];
        const tableRows = fundData.map(d => [
            d.month.replace('Tháng', 'Thang'),
            formatCurrency(d.salary).replace('₫', '').trim(),
            formatCurrency(d.insurance).replace('₫', '').trim()
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 50,
        });

        doc.save(`BaoCaoQuyLuong_${currentYear}.pdf`);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2>Báo cáo Quỹ Lương Năm {currentYear} (Ban Giám Hiệu)</h2>
                        <button className="btn-secondary" onClick={handleExportPDF} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 16px' }}>Xuất PDF</button>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, backgroundColor: '#f0fdfa', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #0d9488' }}>
                            <p style={{ margin: 0, color: '#0f766e', fontSize: '1.1rem', fontWeight: 'bold' }}>Tổng Quỹ Lương Năm {currentYear}</p>
                            <h2 style={{ margin: '10px 0 0 0', color: '#115e59', fontSize: '2rem' }}>{formatCurrency(totalSalary)}</h2>
                        </div>
                        <div style={{ flex: 1, backgroundColor: '#fffbeb', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #d97706' }}>
                            <p style={{ margin: 0, color: '#b45309', fontSize: '1.1rem', fontWeight: 'bold' }}>Tổng Bảo Hiểm Đã Đóng (BHXH, BHYT, BHTN)</p>
                            <h2 style={{ margin: '10px 0 0 0', color: '#92400e', fontSize: '2rem' }}>{formatCurrency(totalInsurance)}</h2>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ textAlign: 'center', marginBottom: '30px', color: '#334155' }}>Biểu đồ Chi phí Lương và Bảo hiểm theo tháng</h4>
                        <ResponsiveContainer width="100%" height={450}>
                            <BarChart
                                data={fundData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                <YAxis 
                                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)} Tr`} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#64748b'}}
                                    width={80}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="salary" name="Chi phí Lương" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="insurance" name="Chi phí Bảo hiểm" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SalaryFundPage;
