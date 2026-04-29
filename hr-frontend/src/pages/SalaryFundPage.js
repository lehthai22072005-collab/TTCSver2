import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

// Dữ liệu quỹ lương 12 tháng (đơn vị: triệu VNĐ)
const salaryData = [
    { month: 'T1', value: 550 }, { month: 'T2', value: 490 },
    { month: 'T3', value: 620 }, { month: 'T4', value: 650 },
    { month: 'T5', value: 580 }, { month: 'T6', value: 530 },
    { month: 'T7', value: 545 }, { month: 'T8', value: 560 },
    { month: 'T9', value: 630 }, { month: 'T10', value: 670 },
    { month: 'T11', value: 510 }, { month: 'T12', value: 520 },
];

function SalaryFundPage() {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ backgroundColor: '#f4f7fe', minHeight: '100vh', padding: '30px' }}>

                    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                        {/* Header & Filter */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h2 style={{ fontWeight: 'bold', color: '#1b2559', textTransform: 'uppercase' }}>
                                Biến động quỹ lương
                            </h2>
                            <div style={filterBoxStyle}>
                                <span style={{ color: '#707eae', fontSize: '0.9rem', marginRight: '10px' }}>Thời gian:</span>
                                <select style={selectStyle}><option>[ Năm 2026 ]</option></select>
                            </div>
                        </div>

                        {/* Bar Chart Section */}
                        <div style={cardStyle}>
                            <h5 style={chartTitleStyle}>| Biểu đồ chi phí lương theo tháng</h5>
                            <p style={subTitleStyle}>(Dữ liệu tổng hợp từ T1 đến T12 - Đơn vị: Triệu VNĐ)</p>
                            <div style={{ height: '350px', marginTop: '20px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={salaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9edf7" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#a3aed0', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#a3aed0', fontSize: 12}} />
                                        <Tooltip
                                            cursor={{fill: '#f4f7fe'}}
                                            contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'}}
                                        />
                                        <Bar dataKey="value" radius={[5, 5, 0, 0]} barSize={40}>
                                            {salaryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4318ff' : '#707eae'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Stats Summary Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginTop: '30px' }}>
                            <div style={cardStyle}>
                                <p style={subTitleStyle}>Tổng quỹ lương năm</p>
                                <h3 style={{ color: '#1b2559', fontWeight: '800' }}>6.824.195.104 đ</h3>
                            </div>
                            <div style={cardStyle}>
                                <p style={subTitleStyle}>Tổng bảo hiểm đã đóng (10.5%)</p>
                                <h3 style={{ color: '#05cd99', fontWeight: '800' }}>716.540.486 đ</h3>
                            </div>
                        </div>

                        {/* Export Button */}
                        <div style={{ textAlign: 'center', marginTop: '40px' }}>
                            <button
                                style={exportBtnStyle}
                                onClick={() => alert("Hệ thống: Đang xuất báo cáo tài chính PDF...")}
                            >
                                [ XUẤT BÁO CÁO PDF ]
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Styles chuyên nghiệp ---
const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)',
    border: 'none'
};

const filterBoxStyle = {
    backgroundColor: '#fff',
    padding: '10px 20px',
    borderRadius: '15px',
    boxShadow: '0px 10px 20px rgba(112, 144, 176, 0.05)'
};

const selectStyle = {
    padding: '8px 15px',
    borderRadius: '10px',
    border: '1px solid #e0e5f2',
    color: '#2b3674',
    fontWeight: '600',
    outline: 'none'
};

const chartTitleStyle = {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1b2559',
    marginBottom: '5px'
};

const subTitleStyle = {
    color: '#a3aed0',
    fontSize: '0.9rem',
    marginBottom: '10px',
    fontWeight: '500'
};

const exportBtnStyle = {
    backgroundColor: '#fff',
    color: '#1b2559',
    border: '3px solid #1b2559',
    padding: '15px 50px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '8px 8px 0px #000',
    transition: 'all 0.2s'
};

export default SalaryFundPage;