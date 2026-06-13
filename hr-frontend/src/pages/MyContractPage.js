import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import '../App.css';

function MyContractPage() {
    const [contract, setContract] = useState(null);
    const employeeId = localStorage.getItem('employeeId');

    useEffect(() => {
        if (employeeId) {
            fetchMyContract();
        }
    }, [employeeId]);

    const fetchMyContract = async () => {
        try {
            const res = await axios.get(`/api/contracts/my-contract/${employeeId}`);
            setContract(res.data);
        } catch (err) {
            console.error("Lỗi khi tải hợp đồng cá nhân:", err);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '700px', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px', color: '#1e293b' }}>Hợp đồng Cá nhân</h2>
                        
                        {contract ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '20px', fontSize: '1.1rem', marginBottom: '30px' }}>
                                <div style={{ color: '#64748b', fontWeight: 'bold' }}>Số hợp đồng:</div>
                                <div style={{ color: '#0f172a', fontWeight: 'bold' }}>{contract.contractNo}</div>

                                <div style={{ color: '#64748b', fontWeight: 'bold' }}>Loại hợp đồng:</div>
                                <div style={{ color: '#0f172a' }}>{contract.type}</div>

                                <div style={{ color: '#64748b', fontWeight: 'bold' }}>Chức danh chuyên môn:</div>
                                <div style={{ color: '#0f172a' }}>{contract.role}</div>

                                <div style={{ color: '#64748b', fontWeight: 'bold' }}>Ngày bắt đầu:</div>
                                <div style={{ color: '#0f172a' }}>{contract.startDate}</div>

                                <div style={{ color: '#64748b', fontWeight: 'bold' }}>Ngày kết thúc:</div>
                                <div style={{ color: '#0f172a' }}>{contract.endDate || 'Vô thời hạn'}</div>

                                <div style={{ color: '#64748b', fontWeight: 'bold' }}>Trạng thái:</div>
                                <div>
                                    <span style={{ backgroundColor: '#22c55e', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                        {contract.status}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                                Chưa có dữ liệu hợp đồng cho nhân viên này.
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button className="btn-primary" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px' }} disabled={!contract}>
                                <span>📄</span> Tải xuống Bản Scan (PDF)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyContractPage;
