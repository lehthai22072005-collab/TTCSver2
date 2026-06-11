import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function DeclarationApprovalPage() {
    const [declarations, setDeclarations] = useState([]);

    useEffect(() => {
        fetchDeclarations();
    }, []);

    const fetchDeclarations = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/declarations');
            setDeclarations(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        if (window.confirm(`Xác nhận chuyển trạng thái thành: ${status}?`)) {
            try {
                await axios.put(`http://localhost:8080/api/declarations/${id}/status`, { status });
                alert("Cập nhật thành công!");
                fetchDeclarations();
            } catch (err) {
                alert("Lỗi cập nhật!");
            }
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h2 style={{ color: '#1b2559', marginBottom: '20px' }}>PHÊ DUYỆT KÊ KHAI GIỜ DẠY</h2>

                    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0px 10px 30px rgba(112, 144, 176, 0.1)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f4f7fe', color: '#a3aed0' }}>
                                    <th style={{ padding: '15px' }}>MÃ NV</th>
                                    <th style={{ padding: '15px' }}>HỌ TÊN</th>
                                    <th style={{ padding: '15px' }}>HỌC KỲ</th>
                                    <th style={{ padding: '15px' }}>SỐ TIẾT</th>
                                    <th style={{ padding: '15px' }}>SỐ BÀI BÁO</th>
                                    <th style={{ padding: '15px' }}>CHI TIẾT</th>
                                    <th style={{ padding: '15px' }}>TRẠNG THÁI</th>
                                    <th style={{ padding: '15px' }}>PHÊ DUYỆT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {declarations.map((decl) => (
                                    <tr key={decl.id} style={{ borderBottom: '1px solid #f4f7fe', color: '#2b3674' }}>
                                        <td style={{ padding: '15px' }}>NV{decl.employee.id}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{decl.employee.fullName}</td>
                                        <td style={{ padding: '15px' }}>{decl.hocKy}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold', color: '#4318ff' }}>{decl.soTietDay}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold', color: '#05cd99' }}>{decl.soBaiBao}</td>
                                        <td style={{ padding: '15px', fontSize: '13px', maxWidth: '200px' }}>{decl.ghiChu}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{ padding: '5px 10px', borderRadius: '8px', backgroundColor: decl.trangThai === 'ĐÃ DUYỆT' ? '#05cd99' : decl.trangThai === 'TỪ CHỐI' ? '#ee5d50' : '#ffb547', color: 'white', fontSize: '12px' }}>
                                                {decl.trangThai}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            {decl.trangThai === 'CHỜ DUYỆT' && (
                                                <>
                                                    <button onClick={() => handleUpdateStatus(decl.id, 'ĐÃ DUYỆT')} style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#05cd99', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Duyệt</button>
                                                    <button onClick={() => handleUpdateStatus(decl.id, 'TỪ CHỐI')} style={{ padding: '5px 10px', backgroundColor: '#ee5d50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Từ chối</button>
                                                </>
                                            )}
                                        </td>
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

export default DeclarationApprovalPage;
