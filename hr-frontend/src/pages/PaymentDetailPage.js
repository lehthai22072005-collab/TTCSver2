import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function PaymentDetailPage() {
    const { month } = useParams(); // Lấy "03-2026" từ URL
    const [details, setDetails] = useState([]);
    const realMonth = month.replace('-', '/'); // Chuyển lại thành "03/2026"

    useEffect(() => {
        axios.get(`http://localhost:8080/api/salary/detail?month=${realMonth}`)
            .then(res => setDetails(res.data))
            .catch(err => console.log(err));
    }, [realMonth]);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div style={{ padding: '30px' }}>
                    <button onClick={() => window.history.back()}>← Quay lại</button>
                    <h2>CHI TIẾT LƯƠNG THÁNG {realMonth}</h2>
                    <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '25px', marginTop: '20px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ color: '#a3aed0', borderBottom: '2px solid #f4f7fe' }}>
                                <th style={{ padding: '15px' }}>MÃ NV</th>
                                <th style={{ padding: '15px' }}>HỌ TÊN</th>
                                <th style={{ padding: '15px' }}>LƯƠNG CB</th>
                                <th style={{ padding: '15px' }}>THỰC LĨNH</th>
                            </tr>
                            </thead>
                            <tbody>
                            {details.map((s, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f4f7fe' }}>
                                    <td style={{ padding: '15px' }}>NV{s.employee?.id}</td>
                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{s.employee?.fullName}</td>
                                    <td style={{ padding: '15px' }}>{s.luongCoBan?.toLocaleString()}đ</td>
                                    <td style={{ padding: '15px', color: '#05cd99', fontWeight: 'bold' }}>{s.thucLinh?.toLocaleString()}đ</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentDetailPage;