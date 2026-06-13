import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function RewardDisciplinePage() {
    const [records, setRecords] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({ employeeId: '', type: 'KHEN_THUONG', amount: '', reason: '', effectiveDate: '' });

    useEffect(() => {
        fetchRecords();
        fetchEmployees();
    }, []);

    const fetchRecords = async () => {
        try {
            const res = await axios.get('/api/rewards');
            setRecords(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await axios.get('/api/employees');
            setEmployees(res.data);
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
            await axios.post('/api/rewards', form);
            alert("Lưu quyết định thành công!");
            setForm({ employeeId: '', type: 'KHEN_THUONG', amount: '', reason: '', effectiveDate: '' });
            fetchRecords();
        } catch (err) {
            alert("Lỗi khi lưu!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa quyết định này? Nó sẽ ảnh hưởng tới việc tính lương!")) {
            try {
                await axios.delete(`/api/rewards/${id}`);
                fetchRecords();
            } catch (err) {
                alert("Lỗi khi xóa!");
            }
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h2 style={{ color: '#1b2559', marginBottom: '20px' }}>QUẢN LÝ KHEN THƯỞNG & KỶ LUẬT</h2>

                    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0px 10px 30px rgba(112, 144, 176, 0.1)' }}>
                        <h4 style={{ color: '#2b3674' }}>Tạo Quyết Định Mới</h4>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '15px' }}>
                            <select name="employeeId" value={form.employeeId} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e0e5f2' }}>
                                <option value="">-- Chọn Nhân Sự --</option>
                                {employees.map(e => <option key={e.id} value={e.id}>{e.fullName} ({e.nhomNhanSu})</option>)}
                            </select>

                            <select name="type" value={form.type} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e0e5f2' }}>
                                <option value="KHEN_THUONG">Khen Thưởng (+)</option>
                                <option value="KY_LUAT">Kỷ Luật (-)</option>
                            </select>
                            
                            <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="Số tiền (VNĐ)" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e0e5f2' }} />
                            
                            <input type="date" name="effectiveDate" value={form.effectiveDate} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e0e5f2' }} title="Ngày áp dụng (Dùng để tính lương tháng đó)" />
                            
                            <input type="text" name="reason" value={form.reason} onChange={handleChange} placeholder="Lý do chi tiết" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e0e5f2', flexGrow: 1 }} required />
                            
                            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4318ff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Thêm mới</button>
                        </form>
                    </div>

                    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0px 10px 30px rgba(112, 144, 176, 0.1)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f4f7fe', color: '#a3aed0' }}>
                                    <th style={{ padding: '15px' }}>NHÂN SỰ</th>
                                    <th style={{ padding: '15px' }}>LOẠI</th>
                                    <th style={{ padding: '15px' }}>SỐ TIỀN (VNĐ)</th>
                                    <th style={{ padding: '15px' }}>NGÀY ÁP DỤNG</th>
                                    <th style={{ padding: '15px' }}>LÝ DO</th>
                                    <th style={{ padding: '15px' }}>HÀNH ĐỘNG</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((r) => (
                                    <tr key={r.id} style={{ borderBottom: '1px solid #f4f7fe', color: '#2b3674' }}>
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{r.employee.fullName}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{ padding: '5px 10px', borderRadius: '8px', backgroundColor: r.type === 'KHEN_THUONG' ? '#05cd99' : '#ee5d50', color: 'white', fontSize: '12px' }}>
                                                {r.type === 'KHEN_THUONG' ? 'THƯỞNG' : 'PHẠT'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', fontWeight: 'bold', color: r.type === 'KHEN_THUONG' ? '#05cd99' : '#ee5d50' }}>
                                            {r.type === 'KHEN_THUONG' ? '+' : '-'}{(r.amount || 0).toLocaleString()}đ
                                        </td>
                                        <td style={{ padding: '15px' }}>{new Date(r.effectiveDate).toLocaleDateString('vi-VN')}</td>
                                        <td style={{ padding: '15px' }}>{r.reason}</td>
                                        <td style={{ padding: '15px' }}>
                                            <button onClick={() => handleDelete(r.id)} style={{ padding: '5px 10px', backgroundColor: '#ffe2e5', border: 'none', borderRadius: '5px', cursor: 'pointer', color: '#ee5d50' }}>Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                                {records.length === 0 && !loading && (
                                    <tr><td colSpan="6" style={{ padding: '15px', textAlign: 'center', color: '#a3aed0' }}>Chưa có quyết định nào</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RewardDisciplinePage;
