import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function EmployeePage() {
    const [employees, setEmployees] = useState(() => {
        const saved = localStorage.getItem('employeeData');
        return saved ? JSON.parse(saved) : [];
    });
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newEmployee, setNewEmployee] = useState({ employeeId: '', fullName: '', email: '', position: 'Nhân viên', contract: 'Toàn thời gian' });

    useEffect(() => {
        if (!localStorage.getItem('employeeData')) {
            axios.get("http://localhost:8080/api/employees")
                .then(res => {
                    setEmployees(res.data);
                    localStorage.setItem('employeeData', JSON.stringify(res.data));
                })
                .catch(err => console.error(err));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('employeeData', JSON.stringify(employees));
    }, [employees]);

    const handleSaveEmployee = (e) => {
        e.preventDefault();
        // Giả lập lưu thành công (Nếu có API POST thì gọi axios.post ở đây)
        const newEmpWithId = { ...newEmployee, id: Date.now() };
        setEmployees([...employees, newEmpWithId]);
        setShowModal(false);
        setNewEmployee({ employeeId: '', fullName: '', email: '', position: 'Nhân viên', contract: 'Toàn thời gian' });
    };

    const filteredEmployees = employees.filter(emp => 
        (emp.fullName && emp.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (emp.employeeId && emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <div className="header-action" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3>Hồ sơ nhân viên / giảng viên</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm nhân viên..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <button className="btn-primary" onClick={() => setShowModal(true)}>+ Thêm mới</button>
                        </div>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Mã NV</th>
                                <th>Họ Tên</th>
                                <th>Email</th>
                                <th>Chức vụ</th>
                                <th>Hợp đồng</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map(emp => (
                                <tr key={emp.id || emp.employeeId}>
                                    <td>{emp.employeeId || 'N/A'}</td>
                                    <td className="font-bold">{emp.fullName}</td>
                                    <td>{emp.email || 'N/A'}</td>
                                    <td>{emp.position}</td>
                                    <td>{emp.contract || 'N/A'}</td>
                                    <td>
                                        <button className="btn-sm btn-edit">Sửa</button>
                                        <button className="btn-sm btn-delete">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Thêm Nhân Viên */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Thêm nhân viên mới</h3>
                        <form onSubmit={handleSaveEmployee}>
                            <div className="form-group">
                                <label>Mã nhân viên</label>
                                <input type="text" value={newEmployee.employeeId} onChange={e => setNewEmployee({ ...newEmployee, employeeId: e.target.value })} required placeholder="Nhập mã nhân viên..." />
                            </div>
                            <div className="form-group">
                                <label>Họ và Tên</label>
                                <input type="text" value={newEmployee.fullName} onChange={e => setNewEmployee({ ...newEmployee, fullName: e.target.value })} required placeholder="Nhập họ và tên..." />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={newEmployee.email} onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })} required placeholder="Nhập email..." />
                            </div>
                            <div className="form-group">
                                <label>Chức vụ</label>
                                <select value={newEmployee.position} onChange={e => setNewEmployee({ ...newEmployee, position: e.target.value })}>
                                    <option value="Nhân viên">Nhân viên</option>
                                    <option value="Trưởng phòng">Trưởng phòng</option>
                                    <option value="Chuyên viên">Chuyên viên</option>
                                    <option value="Giảng viên">Giảng viên</option>
                                    <option value="Giám đốc">Giám đốc</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Hợp đồng</label>
                                <select value={newEmployee.contract} onChange={e => setNewEmployee({ ...newEmployee, contract: e.target.value })}>
                                    <option value="Toàn thời gian">Toàn thời gian</option>
                                    <option value="Bán thời gian">Bán thời gian</option>
                                    <option value="Thử việc">Thử việc</option>
                                    <option value="Thực tập sinh">Thực tập sinh</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                                <button type="submit" className="btn-primary">Lưu thông tin</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmployeePage;
