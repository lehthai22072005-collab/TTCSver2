import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function KpiManagementPage() {
    const [kpiList, setKpiList] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({ id: null, employeeId: '', hocKy: 'Học kỳ 1 - 2026', diemDanhGia: '', soBaiBao: '', ghiChu: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchKpi();
        fetchEmployees();
    }, []);

    const fetchKpi = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/kpi');
            setKpiList(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/employees');
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
            await axios.post('http://localhost:8080/api/kpi', form);
            alert("Lưu thông tin KPI thành công!");
            setForm({ id: null, employeeId: '', hocKy: 'Học kỳ 1 - 2026', diemDanhGia: '', soBaiBao: '', ghiChu: '' });
            setIsEditing(false);
            fetchKpi();
        } catch (err) {
            alert("Lỗi khi lưu KPI!");
        }
    };

    const handleEdit = (kpi) => {
        setForm({
            id: kpi.id,
            employeeId: kpi.employee.id,
            hocKy: kpi.hocKy,
            diemDanhGia: kpi.diemDanhGia,
            soBaiBao: kpi.soBaiBao,
            ghiChu: kpi.ghiChu
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
            try {
                await axios.delete(`http://localhost:8080/api/kpi/${id}`);
                fetchKpi();
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
                    <h2 style={{ color: '#1b2559', marginBottom: '20px' }}>QUẢN LÝ ĐÁNH GIÁ NĂNG LỰC (KPI)</h2>

                    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0px 10px 30px rgba(112, 144, 176, 0.1)' }}>
                        <h4 style={{ color: '#2b3674' }}>{isEditing ? 'Sửa Đánh Giá' : 'Thêm Đánh Giá Mới'}</h4>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '15px' }}>
                            <select name="employeeId" value={form.employeeId} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e0e5f2' }}>
                                <option value="">-- Chọn Nhân Sự --</option>
                                {employees.map(e => <option key={e.id} value={e.id}>{e.fullName} ({e.nhomNhanSu})</option>)}
                            </select>
                            
                            <input type="text" name="hocKy" value={form.hocKy} onChange={handleChange} placeholder="Học kỳ / Kỳ đánh giá" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e0e5f2' }} />
                            
                            <input type="number" step="0.1" name="diemDanhGia" value={form.diemDanhGia} onChange={handleChange} placeholder="Điểm đánh giá" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e0e5f2' }} title="Điểm sinh viên đánh giá hoặc Điểm KPI (thang 10)" />
                            
                            <input type="number" name="soBaiBao" value={form.soBaiBao} onChange={handleChange} placeholder="Số bài báo / Sáng kiến" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e0e5f2' }} title="Số lượng bài báo NCKH hoặc Sáng kiến, Đề án" />
                            
                            <input type="text" name="ghiChu" value={form.ghiChu} onChange={handleChange} placeholder="Ghi chú" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e0e5f2', flexGrow: 1 }} />
                            
                            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4318ff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>{isEditing ? 'Cập nhật' : 'Thêm mới'}</button>
                            {isEditing && <button type="button" onClick={() => { setIsEditing(false); setForm({ id: null, employeeId: '', hocKy: 'Học kỳ 1 - 2026', diemDanhGia: '', soBaiBao: '', ghiChu: '' }); }} style={{ padding: '10px 20px', backgroundColor: '#a3aed0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Hủy</button>}
                        </form>
                    </div>

                    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0px 10px 30px rgba(112, 144, 176, 0.1)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f4f7fe', color: '#a3aed0' }}>
                                    <th style={{ padding: '15px' }}>NHÂN SỰ</th>
                                    <th style={{ padding: '15px' }}>HỌC KỲ / THÁNG</th>
                                    <th style={{ padding: '15px' }}>ĐIỂM ĐÁNH GIÁ</th>
                                    <th style={{ padding: '15px' }}>BÀI BÁO / SÁNG KIẾN</th>
                                    <th style={{ padding: '15px' }}>XẾP LOẠI</th>
                                    <th style={{ padding: '15px' }}>HÀNH ĐỘNG</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kpiList.map((kpi) => (
                                    <tr key={kpi.id} style={{ borderBottom: '1px solid #f4f7fe', color: '#2b3674' }}>
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{kpi.employee.fullName}</td>
                                        <td style={{ padding: '15px' }}>{kpi.hocKy}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold', color: '#4318ff' }}>{kpi.diemDanhGia}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold', color: '#05cd99' }}>{kpi.soBaiBao}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{ padding: '5px 10px', borderRadius: '8px', backgroundColor: kpi.xepLoai === 'Xuất sắc' ? '#05cd99' : kpi.xepLoai === 'Hoàn thành tốt' ? '#4318ff' : '#ffb547', color: 'white', fontSize: '12px' }}>
                                                {kpi.xepLoai}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <button onClick={() => handleEdit(kpi)} style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#f4f7fe', border: 'none', borderRadius: '5px', cursor: 'pointer', color: '#4318ff' }}>Sửa</button>
                                            <button onClick={() => handleDelete(kpi.id)} style={{ padding: '5px 10px', backgroundColor: '#ffe2e5', border: 'none', borderRadius: '5px', cursor: 'pointer', color: '#ee5d50' }}>Xóa</button>
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

export default KpiManagementPage;
