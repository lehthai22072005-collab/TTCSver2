import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Thêm thư viện điều hướng
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

function AdminDashboardPage() {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- PHÂN TRANG CHO LOGS ---
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 5; // Dashboard chỉ hiện 5 dòng/trang cho gọn

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const accRes = await axios.get('http://localhost:8080/api/accounts/list');
                setAccounts(accRes.data);
                const logRes = await axios.get('http://localhost:8080/api/accounts/logs');
                setLogs(logRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu Dashboard:", err);
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Logic thống kê tài khoản
    const validAccounts = accounts.filter(acc => acc.username !== '[ Chưa có tài khoản ]');
    const totalAccounts = validAccounts.length;
    const activeAccounts = validAccounts.filter(acc => acc.status === 'Active').length;
    const lockedAccounts = validAccounts.filter(acc => acc.status === 'Locked' || acc.status === 'Khóa').length;

    const rolesCount = { 'Admin': 0, 'Ban Giám Hiệu': 0, 'Giảng viên/Nhân viên': 0, 'Kế toán': 0 };
    validAccounts.forEach(acc => {
        if (acc.role === 'Admin') rolesCount['Admin']++;
        else if (acc.role === 'Ban Giám Hiệu') rolesCount['Ban Giám Hiệu']++;
        else if (acc.role === 'Kế toán') rolesCount['Kế toán']++;
        else rolesCount['Giảng viên/Nhân viên']++;
    });

    const pieData = [
        { name: 'Admin', value: rolesCount['Admin'], color: '#4318ff' },
        { name: 'Ban Giám Hiệu', value: rolesCount['Ban Giám Hiệu'], color: '#ffb547' },
        { name: 'Nhân viên', value: rolesCount['Giảng viên/Nhân viên'], color: '#ff5630' },
        { name: 'Kế toán', value: rolesCount['Kế toán'], color: '#05cd99' }
    ].filter(item => item.value > 0);

    // --- XỬ LÝ DỮ LIỆU PHÂN TRANG ---
    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
    const totalPages = Math.ceil(logs.length / logsPerPage);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>

                    <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '30px', textTransform: 'uppercase' }}>
                        DASHBOARD HỆ THỐNG (ADMIN)
                    </h2>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px', color: '#4318ff', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            ⏳ Đang tính toán dữ liệu hệ thống...
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                                <div style={{ backgroundColor: '#4318ff', borderRadius: '20px', padding: '25px', color: 'white', boxShadow: '0px 10px 20px rgba(67, 24, 255, 0.2)' }}>
                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.9 }}>Tổng số tài khoản</h4>
                                    <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: '900' }}>{totalAccounts}</h1>
                                </div>
                                <div style={{ backgroundColor: '#05cd99', borderRadius: '20px', padding: '25px', color: 'white', boxShadow: '0px 10px 20px rgba(5, 205, 153, 0.2)' }}>
                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.9 }}>Đang hoạt động (Active)</h4>
                                    <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: '900' }}>{activeAccounts}</h1>
                                </div>
                                <div style={{ backgroundColor: '#ff5630', borderRadius: '20px', padding: '25px', color: 'white', boxShadow: '0px 10px 20px rgba(255, 86, 48, 0.2)' }}>
                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.9 }}>Đang bị khóa (Locked)</h4>
                                    <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: '900' }}>{lockedAccounts}</h1>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>

                                {/* Biểu đồ */}
                                <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)' }}>
                                    <h3 style={{ color: '#1b2559', fontWeight: 'bold', fontSize: '1.1rem', margin: '0 0 20px 0' }}>Phân bổ quyền (Roles)</h3>
                                    <div style={{ width: '100%', height: '250px' }}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie data={pieData} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                                                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                                </Pie>
                                                <Tooltip formatter={(value, name) => [`${value} tài khoản`, name]} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0px 10px 20px rgba(0,0,0,0.1)' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
                                        {pieData.map((item, index) => (
                                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', color: item.color, fontWeight: 'bold' }}>
                                                <div style={{ width: '12px', height: '12px', backgroundColor: item.color, borderRadius: '3px' }}></div>
                                                {item.name} ({item.value})
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Bảng Logs có phân trang */}
                                <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <h3 style={{ color: '#1b2559', fontWeight: 'bold', fontSize: '1.1rem', margin: 0 }}>Nhật ký hoạt động mới nhất</h3>
                                        <span onClick={() => navigate('/system-logs')} style={{ color: '#4318ff', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer' }}>Xem tất cả →</span>
                                    </div>

                                    <table style={{ width: '100%', borderCollapse: 'collapse', flex: 1 }}>
                                        <thead>
                                        <tr style={{ borderBottom: '2px solid #f4f7fe', color: '#a3aed0', textAlign: 'left', fontSize: '0.85rem' }}>
                                            <th style={{ padding: '15px 10px', fontWeight: 'bold' }}>THỜI GIAN</th>
                                            <th style={{ padding: '15px 10px', fontWeight: 'bold' }}>HÀNH ĐỘNG</th>
                                            <th style={{ padding: '15px 10px', fontWeight: 'bold' }}>USER</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {currentLogs.map((log, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #f4f7fe', color: '#2b3674' }}>
                                                <td style={{ padding: '15px 10px', fontSize: '0.9rem' }}>{log.thoi_gian}</td>
                                                <td style={{ padding: '15px 10px', fontSize: '0.95rem', fontWeight: '600' }}>{log.hanh_dong}</td>
                                                <td style={{ padding: '15px 10px' }}>
                                                        <span style={{ backgroundColor: '#f4f7fe', color: '#4318ff', padding: '5px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                                            {log.nguoi_dung || 'System'}
                                                        </span>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>

                                    {/* Nút Phân Trang (Chỉ hiện khi có nhiều hơn 1 trang) */}
                                    {totalPages > 1 && (
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '15px' }}>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                                <button
                                                    key={number}
                                                    onClick={() => setCurrentPage(number)}
                                                    style={{
                                                        padding: '6px 12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
                                                        backgroundColor: currentPage === number ? '#4318ff' : '#f4f7fe',
                                                        color: currentPage === number ? 'white' : '#a3aed0'
                                                    }}
                                                >
                                                    {number}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboardPage;