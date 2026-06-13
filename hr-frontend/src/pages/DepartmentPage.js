import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import '../App.css';

function DepartmentPage() {
    const [departments, setDepartments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newDept, setNewDept] = useState({ departmentCode: '', name: '', manager: '', employeeCount: 0, status: 'Hoạt động' });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await axios.get("/api/departments");
            setDepartments(res.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách phòng ban:", err);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/departments", newDept);
            alert("Thêm phòng ban thành công!");
            setShowModal(false);
            setNewDept({ departmentCode: '', name: '', manager: '', employeeCount: 0, status: 'Hoạt động' });
            fetchDepartments();
        } catch (err) {
            console.error("Lỗi khi thêm phòng ban:", err);
            alert("Thêm phòng ban thất bại!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa phòng ban này?")) {
            try {
                await axios.delete(`/api/departments/${id}`);
                alert("Xóa thành công!");
                fetchDepartments();
            } catch (err) {
                console.error("Lỗi khi xóa:", err);
                alert("Xóa thất bại!");
            }
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <div className="header-action" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3>Quản lý Phòng ban / Khoa</h3>
                        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowModal(true)}><span>+</span> Thêm Đơn vị mới</button>
                    </div>
                    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Mã Đơn vị</th>
                                    <th>Tên Phòng ban / Khoa</th>
                                    <th>Trưởng đơn vị</th>
                                    <th>Số lượng nhân sự</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departments.map((dept, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: 'bold', color: '#64748b' }}>{dept.departmentCode}</td>
                                        <td style={{ fontWeight: 'bold', color: '#0f172a' }}>{dept.name}</td>
                                        <td>{dept.manager}</td>
                                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{dept.employeeCount}</td>
                                        <td><span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem' }}>{dept.status}</span></td>
                                        <td>
                                            <button style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleDelete(dept.id)}>Xoá</button>
                                        </td>
                                    </tr>
                                ))}
                                {departments.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Chưa có dữ liệu phòng ban.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Thêm Đơn vị mới</h3>
                        <form onSubmit={handleAddSubmit}>
                            <div className="form-group">
                                <label>Mã Đơn vị</label>
                                <input type="text" required value={newDept.departmentCode} onChange={(e) => setNewDept({...newDept, departmentCode: e.target.value})} placeholder="VD: BM03" />
                            </div>
                            <div className="form-group">
                                <label>Tên Đơn vị / Khoa</label>
                                <input type="text" required value={newDept.name} onChange={(e) => setNewDept({...newDept, name: e.target.value})} placeholder="Nhập tên phòng ban..." />
                            </div>
                            <div className="form-group">
                                <label>Trưởng đơn vị</label>
                                <input type="text" required value={newDept.manager} onChange={(e) => setNewDept({...newDept, manager: e.target.value})} placeholder="Nhập họ tên trưởng đơn vị..." />
                            </div>
                            <div className="form-group">
                                <label>Số lượng nhân sự ban đầu</label>
                                <input type="number" required value={newDept.employeeCount} onChange={(e) => setNewDept({...newDept, employeeCount: parseInt(e.target.value) || 0})} />
                            </div>
                            <div className="form-group">
                                <label>Trạng thái ban đầu</label>
                                <select value={newDept.status} onChange={(e) => setNewDept({...newDept, status: e.target.value})}>
                                    <option value="Hoạt động">Hoạt động</option>
                                    <option value="Ngưng hoạt động">Ngưng hoạt động</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                                <button type="submit" className="btn-primary">Lưu Đơn vị</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DepartmentPage;
