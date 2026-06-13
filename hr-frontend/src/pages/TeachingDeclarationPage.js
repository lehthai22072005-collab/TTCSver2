import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function TeachingDeclarationPage() {
    const [declarations, setDeclarations] = useState([]);
    const employeeId = localStorage.getItem('employeeId');

    const [form, setForm] = useState({ employeeId: employeeId, hocKy: 'Học kỳ 1 - 2026', soTietDay: '', soBaiBao: '', ghiChu: '' });

    useEffect(() => {
        if (employeeId) {
            fetchMyDeclarations();
        }
    }, [employeeId]);

    const fetchMyDeclarations = async () => {
        try {
            const res = await axios.get(`/api/declarations/my-declarations/${employeeId}`);
            setDeclarations(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/declarations', form);
            alert("Đã gửi phiếu kê khai thành công! Vui lòng chờ phê duyệt.");
            setForm({ employeeId: employeeId, hocKy: 'Học kỳ 1 - 2026', soTietDay: '', soBaiBao: '', ghiChu: '' });
            fetchMyDeclarations();
        } catch (err) {
            alert("Lỗi khi gửi phiếu kê khai!");
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h2 style={{ color: '#1b2559', marginBottom: '20px' }}>KÊ KHAI GIỜ DẠY & NGHIÊN CỨU KHOA HỌC</h2>

                    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0px 10px 30px rgba(112, 144, 176, 0.1)' }}>
                        <h4 style={{ color: '#2b3674' }}>Tạo Phiếu Kê Khai Mới</h4>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '15px' }}>
                            <input type="text" name="hocKy" value={form.hocKy} onChange={handleChange} placeholder="Học kỳ" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e0e5f2' }} />
                            
                            <input type="number" name="soTietDay" value={form.soTietDay} onChange={handleChange} placeholder="Số tiết đã dạy" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e0e5f2' }} title="Tổng số tiết thực giảng" />
                            
                            <input type="number" name="soBaiBao" value={form.soBaiBao} onChange={handleChange} placeholder="Số bài báo NCKH" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e0e5f2' }} title="Số lượng bài báo NCKH" />
                            
                            <input type="text" name="ghiChu" value={form.ghiChu} onChange={handleChange} placeholder="Ghi chú chi tiết (Các môn đã dạy, Tên bài báo...)" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e0e5f2', flexGrow: 1 }} />
                            
                            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4318ff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Gửi Kê Khai</button>
                        </form>
                    </div>

                    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0px 10px 30px rgba(112, 144, 176, 0.1)' }}>
                        <h4 style={{ color: '#2b3674', marginBottom: '15px' }}>Lịch sử Kê Khai</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f4f7fe', color: '#a3aed0' }}>
                                    <th style={{ padding: '15px' }}>HỌC KỲ</th>
                                    <th style={{ padding: '15px' }}>SỐ TIẾT DẠY</th>
                                    <th style={{ padding: '15px' }}>SỐ BÀI BÁO</th>
                                    <th style={{ padding: '15px' }}>TRẠNG THÁI</th>
                                    <th style={{ padding: '15px' }}>GHI CHÚ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {declarations.map((decl) => (
                                    <tr key={decl.id} style={{ borderBottom: '1px solid #f4f7fe', color: '#2b3674' }}>
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{decl.hocKy}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold', color: '#4318ff' }}>{decl.soTietDay}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold', color: '#05cd99' }}>{decl.soBaiBao}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{ padding: '5px 10px', borderRadius: '8px', backgroundColor: decl.trangThai === 'ĐÃ DUYỆT' ? '#05cd99' : decl.trangThai === 'TỪ CHỐI' ? '#ee5d50' : '#ffb547', color: 'white', fontSize: '12px' }}>
                                                {decl.trangThai}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>{decl.ghiChu}</td>
                                    </tr>
                                ))}
                                {declarations.length === 0 && (
                                    <tr><td colSpan="5" style={{ padding: '15px', textAlign: 'center', color: '#a3aed0' }}>Bạn chưa có phiếu kê khai nào</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeachingDeclarationPage;
