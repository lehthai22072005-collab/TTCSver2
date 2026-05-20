import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function SystemLogPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 10; // Trang riêng biệt nên cho hiện nhiều hơn (10 dòng)

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/accounts/logs');
                setLogs(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Lỗi khi tải nhật ký:", err);
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

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
                        LỊCH SỬ HOẠT ĐỘNG HỆ THỐNG
                    </h2>

                    <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '30px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.06)' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '30px', color: '#4318ff', fontWeight: 'bold' }}>
                                ⏳ Đang tải lịch sử hệ thống...
                            </div>
                        ) : (
                            <>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                    <tr style={{ borderBottom: '2px solid #f4f7fe', color: '#a3aed0', textAlign: 'left', fontSize: '0.85rem' }}>
                                        <th style={{ padding: '15px 10px', textTransform: 'uppercase', fontWeight: '700' }}>THỜI GIAN</th>
                                        <th style={{ padding: '15px 10px', textTransform: 'uppercase', fontWeight: '700' }}>HÀNH ĐỘNG</th>
                                        <th style={{ padding: '15px 10px', textTransform: 'uppercase', fontWeight: '700' }}>NGƯỜI THỰC HIỆN</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {currentLogs.map((log, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid #f4f7fe' }}>
                                            <td style={{ padding: '18px 10px', fontSize: '0.95rem', color: '#a3aed0', fontWeight: '600' }}>
                                                {log.thoi_gian}
                                            </td>
                                            <td style={{ padding: '18px 10px', fontSize: '1rem', color: '#1b2559', fontWeight: '700' }}>
                                                {log.hanh_dong}
                                            </td>
                                            <td style={{ padding: '18px 10px' }}>
                                                    <span style={{ backgroundColor: '#f4f7fe', color: '#4318ff', padding: '6px 14px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                                        {log.nguoi_dung || 'System'}
                                                    </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {logs.length === 0 && (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: '#a3aed0' }}>
                                                Hệ thống chưa ghi nhận hoạt động nào.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>

                                {/* KHỐI PHÂN TRANG (PAGINATION) DƯỚI ĐÁY BẢNG */}
                                {totalPages > 1 && (
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '25px' }}>
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            style={pageBtn(currentPage === 1)}
                                        >
                                            « Trước
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                            <button
                                                key={number}
                                                onClick={() => setCurrentPage(number)}
                                                style={{
                                                    padding: '8px 15px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s',
                                                    backgroundColor: currentPage === number ? '#4318ff' : '#f4f7fe',
                                                    color: currentPage === number ? 'white' : '#a3aed0'
                                                }}
                                            >
                                                {number}
                                            </button>
                                        ))}

                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            style={pageBtn(currentPage === totalPages)}
                                        >
                                            Sau »
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Style tái sử dụng cho nút "Trước/Sau"
const pageBtn = (disabled) => ({
    padding: '8px 15px',
    borderRadius: '10px',
    border: 'none',
    fontWeight: 'bold',
    cursor: disabled ? 'not-allowed' : 'pointer',
    backgroundColor: '#f4f7fe',
    color: disabled ? '#cbd5e1' : '#1b2559',
});

export default SystemLogPage;