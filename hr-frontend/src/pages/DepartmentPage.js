import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import '../App.css';

function DepartmentPage() {
    const [departments, setDepartments] = useState([
        { id: 'BM01', name: 'Khoa Công nghệ Thông tin', manager: 'PGS. TS. Trần Văn X', count: 45, status: 'Hoạt động' },
        { id: 'BM02', name: 'Khoa Kinh tế', manager: 'TS. Nguyễn Thị Y', count: 30, status: 'Hoạt động' },
        { id: 'PB01', name: 'Phòng Hành chính Nhân sự', manager: 'ThS. Lê Văn Z', count: 12, status: 'Hoạt động' },
        { id: 'PB02', name: 'Phòng Kế toán', manager: 'CN. Phạm Thị T', count: 8, status: 'Hoạt động' }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [newDept, setNewDept] = useState({ id: '', name: '', manager: '', count: 0, status: 'Hoạt động' });

    const handleAddSubmit = (e) => {
        e.preventDefault();
        setDepartments([...departments, newDept]);
        setShowModal(false);
        setNewDept({ id: '', name: '', manager: '', count: 0, status: 'Hoạt động' });
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
                                        <td style={{ fontWeight: 'bold', color: '#64748b' }}>{dept.id}</td>
                                        <td style={{ fontWeight: 'bold', color: '#0f172a' }}>{dept.name}</td>
                                        <td>{dept.manager}</td>
                                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{dept.count}</td>
                                        <td><span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem' }}>{dept.status}</span></td>
                                        <td>
                                            <button style={{ backgroundColor: '#e0f2fe', color: '#0284c7', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Sửa</button>
                                            <button style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Xoá</button>
                                        </td>
                                    </tr>
                                ))}
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
                                <input type="text" required value={newDept.id} onChange={(e) => setNewDept({...newDept, id: e.target.value})} placeholder="VD: BM03" />
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
                                <input type="number" required value={newDept.count} onChange={(e) => setNewDept({...newDept, count: parseInt(e.target.value) || 0})} />
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
