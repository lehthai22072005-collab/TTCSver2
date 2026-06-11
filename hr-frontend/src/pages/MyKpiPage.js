import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function MyKpiPage() {
    const [kpiList, setKpiList] = useState([]);
    const employeeId = localStorage.getItem('employeeId');
    const role = localStorage.getItem('role') || 'STAFF';

    useEffect(() => {
        if (employeeId) {
            fetchMyKpi();
        }
    }, [employeeId]);

    const fetchMyKpi = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/kpi/my-kpi/${employeeId}`);
            setKpiList(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h2 style={{ color: '#1b2559', marginBottom: '20px' }}>ĐÁNH GIÁ NĂNG LỰC CÁ NHÂN (KPI)</h2>

                    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0px 10px 30px rgba(112, 144, 176, 0.1)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f4f7fe', color: '#a3aed0' }}>
                                    <th style={{ padding: '15px' }}>{role === 'TEACHER' ? 'HỌC KỲ' : 'KỲ ĐÁNH GIÁ'}</th>
                                    <th style={{ padding: '15px' }}>{role === 'TEACHER' ? 'ĐIỂM SV ĐÁNH GIÁ' : 'ĐIỂM ĐÁNH GIÁ KPI'}</th>
                                    <th style={{ padding: '15px' }}>{role === 'TEACHER' ? 'SỐ BÀI BÁO NCKH' : 'SỐ SÁNG KIẾN / ĐỀ ÁN'}</th>
                                    <th style={{ padding: '15px' }}>XẾP LOẠI</th>
                                    <th style={{ padding: '15px' }}>GHI CHÚ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kpiList.length > 0 ? kpiList.map((kpi) => (
                                    <tr key={kpi.id} style={{ borderBottom: '1px solid #f4f7fe', color: '#2b3674' }}>
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{kpi.hocKy}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold', color: '#4318ff' }}>{kpi.diemDanhGia}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold', color: '#05cd99' }}>{kpi.soBaiBao}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{ padding: '5px 10px', borderRadius: '8px', backgroundColor: kpi.xepLoai === 'Xuất sắc' ? '#05cd99' : kpi.xepLoai === 'Hoàn thành tốt' ? '#4318ff' : '#ffb547', color: 'white', fontSize: '12px' }}>
                                                {kpi.xepLoai}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>{kpi.ghiChu}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '15px', textAlign: 'center', color: '#a3aed0' }}>Chưa có dữ liệu đánh giá KPI</td>
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

export default MyKpiPage;
