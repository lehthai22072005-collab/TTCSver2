import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import để điều hướng trang
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function PaymentHistoryPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook để chuyển trang

    // 1. Lấy dữ liệu lịch sử ngay khi load trang
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Gọi API lấy các bản ghi đã chốt lương
                const res = await axios.get('http://localhost:8080/api/salary/history');

                // Nhóm theo tháng để hiển thị danh sách tổng quát
                const map = new Map();
                if (Array.isArray(res.data)) {
                    res.data.forEach(item => {
                        if (!map.has(item.thangNam)) {
                            map.set(item.thangNam, item);
                        }
                    });
                }
                setHistory(Array.from(map.values()));
            } catch (err) {
                console.error("Lỗi khi tải lịch sử:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // 2. Hàm xử lý khi nhấn nút "Xem chi tiết"
    const handleViewDetail = (month) => {
        // Chuyển ký tự '/' thành '-' để đưa lên URL không bị lỗi (VD: 03/2026 -> 03-2026)
        const safeMonth = month.replace('/', '-');
        navigate(`/payment-history/detail/${safeMonth}`);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '30px' }}>LỊCH SỬ CHI TRẢ</h2>

                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '20px',
                        padding: '25px',
                        boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ textAlign: 'left', color: '#a3aed0', borderBottom: '2px solid #f4f7fe' }}>
                                <th style={{ padding: '15px', fontSize: '13px', textTransform: 'uppercase' }}>Tháng</th>
                                <th style={{ padding: '15px', fontSize: '13px', textTransform: 'uppercase' }}>Ngày Chốt</th>
                                <th style={{ padding: '15px', fontSize: '13px', textTransform: 'uppercase' }}>Trạng Thái</th>
                                <th style={{ padding: '15px', fontSize: '13px', textTransform: 'uppercase' }}>Hành Động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {history.length > 0 ? (
                                history.map((item, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #f4f7fe' }}>
                                        <td style={{ padding: '15px', color: '#2b3674', fontWeight: 'bold' }}>
                                            {item.thangNam}
                                        </td>
                                        <td style={{ padding: '15px', color: '#2b3674' }}>
                                            {item.ngayChot ? new Date(item.ngayChot).toLocaleString('vi-VN') : '---'}
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                                <span style={{
                                                    padding: '5px 12px',
                                                    backgroundColor: '#e6fffa',
                                                    color: '#05cd99',
                                                    borderRadius: '8px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    ĐÃ CHI TRẢ
                                                </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <button
                                                onClick={() => handleViewDetail(item.thangNam)}
                                                style={{
                                                    padding: '8px 15px',
                                                    backgroundColor: '#4318ff',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '10px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500',
                                                    transition: '0.3s'
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#3311cc'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#4318ff'}
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#a3aed0' }}>
                                        {loading ? "Đang tải dữ liệu..." : "Chưa có lịch sử chi trả."}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentHistoryPage;