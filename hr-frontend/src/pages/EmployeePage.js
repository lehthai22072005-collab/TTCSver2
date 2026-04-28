import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function EmployeePage() {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState('ADD'); // ADD, EDIT, VIEW
    const [selectedEmp, setSelectedEmp] = useState({
        id: '', fullName: '', email: '', phone: '',
        position: 'Giảng viên', contractType: 'Full-time',
        status: 'Còn hạn', startDate: '', endDate: '', note: ''
    });

    useEffect(() => { fetchEmployees(); }, []);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/employees");
            setEmployees(res.data);
        } catch (err) { console.error("Lỗi lấy dữ liệu:", err); }
    };

    const openModal = (actionMode, employee = null) => {
        setMode(actionMode);
        if (employee) {
            setSelectedEmp({
                ...employee,
                fullName: employee.full_name || employee.fullName || '',
                phone: employee.phone || '',
                startDate: employee.startDate || '',
                endDate: employee.endDate || '',
                note: employee.note || '',
                contractType: employee.contractType || 'Full-time',
                status: employee.status || 'Còn hạn'
            });
        } else {
            setSelectedEmp({ id: '', fullName: '', email: '', phone: '', position: 'Giảng viên', contractType: 'Full-time', status: 'Còn hạn', startDate: '', endDate: '', note: '' });
        }
        setShowModal(true);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    {/* Header chuẩn Wireframe */}
                    <div className="header-action" style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>
                        <h2 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Hệ thống Quản lý nhân sự</h2>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                        <div style={{ position: 'relative', width: '350px' }}>
                            <input
                                type="text"
                                placeholder="[ Tìm kiếm 🔍 nhân viên ]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '10px 15px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <button className="btn-primary" onClick={() => openModal('ADD')} style={{ borderRadius: '4px', padding: '10px 25px' }}>
                            [ + Thêm ]
                        </button>
                    </div>

                    {/* Table chuẩn cột Wireframe */}
                    <div className="card shadow-sm" style={{ backgroundColor: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
                        <table className="data-table" style={{ marginTop: 0 }}>
                            <thead>
                            <tr style={{ backgroundColor: '#f8fafc' }}>
                                <th>Mã NV</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Chức vụ</th>
                                <th>Hợp đồng</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {employees.filter(e => (e.fullName || e.full_name)?.toLowerCase().includes(searchTerm.toLowerCase())).map((emp) => (
                                <tr key={emp.id}>
                                    <td>{emp.position === 'Giảng viên' ? `GV00${emp.id}` : `NV00${emp.id}`}</td>
                                    <td className="font-bold">{emp.full_name || emp.fullName}</td>
                                    <td>{emp.email || 'N/A'}</td>
                                    <td>{emp.position}</td>
                                    <td>
                                            <span style={{ color: emp.id % 2 === 0 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                                                {emp.id % 2 === 0 ? 'Hết hạn' : 'Còn hạn'}
                                            </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={() => openModal('VIEW', emp)}
                                            style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px' }}
                                        >
                                            [Xem]
                                        </button>
                                        <button
                                            onClick={() => openModal('EDIT', emp)}
                                            style={{ color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            [Sửa]
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL THÔNG TIN NHÂN VIÊN */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '650px', borderRadius: '4px', border: '2px solid #000', padding: 0 }}>
                        <h3 style={{ textAlign: 'center', background: '#f8fafc', padding: '15px', margin: 0, borderBottom: '1px solid #000', fontWeight: 'bold' }}>
                            THÔNG TIN NHÂN VIÊN
                        </h3>
                        <form style={{ padding: '30px' }}>
                            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '180px 1fr', alignItems: 'center' }}>
                                <label>Mã nhân viên:</label>
                                <div style={{ padding: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1' }}>
                                    [ AUTO / {selectedEmp.id ? (selectedEmp.position === 'Giảng viên' ? `GV00${selectedEmp.id}` : `NV00${selectedEmp.id}`) : 'NEW'} ]
                                </div>
                            </div>

                            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '180px 1fr', alignItems: 'center' }}>
                                <label>Họ và tên:</label>
                                <input type="text" value={selectedEmp.fullName} readOnly={mode === 'VIEW'} onChange={e => setSelectedEmp({...selectedEmp, fullName: e.target.value})} style={{ border: 'none', borderBottom: '1px solid #000' }} />
                            </div>

                            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '180px 1fr', alignItems: 'center' }}>
                                <label>Email:</label>
                                <input type="email" value={selectedEmp.email} readOnly={mode === 'VIEW'} onChange={e => setSelectedEmp({...selectedEmp, email: e.target.value})} style={{ border: 'none', borderBottom: '1px solid #000' }} />
                            </div>

                            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '180px 1fr', alignItems: 'center' }}>
                                <label>SĐT:</label>
                                <input type="text" value={selectedEmp.phone} readOnly={mode === 'VIEW'} onChange={e => setSelectedEmp({...selectedEmp, phone: e.target.value})} style={{ border: 'none', borderBottom: '1px solid #000' }} />
                            </div>

                            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '180px 1fr', alignItems: 'center' }}>
                                <label>Chức vụ:</label>
                                <select disabled={mode === 'VIEW'} value={selectedEmp.position} onChange={e => setSelectedEmp({...selectedEmp, position: e.target.value})}>
                                    <option value="Giảng viên">Giáo viên</option>
                                    <option value="Kế toán">Kế toán</option>
                                    <option value="Bảo vệ">Bảo vệ</option>
                                    <option value="Lao công">Lao công</option>
                                    <option value="Hiệu trưởng">Hiệu trưởng</option>
                                    <option value="Quản trị">Quản trị viên</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '180px 1fr', alignItems: 'center' }}>
                                <label>Loại hợp đồng:</label>
                                <select disabled={mode === 'VIEW'} value={selectedEmp.contractType} onChange={e => setSelectedEmp({...selectedEmp, contractType: e.target.value})}>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Biên chế">Biên chế</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '180px 1fr', alignItems: 'center' }}>
                                <label>Trạng thái HĐ:</label>
                                <select disabled={mode === 'VIEW'} value={selectedEmp.status} onChange={e => setSelectedEmp({...selectedEmp, status: e.target.value})}>
                                    <option value="Còn hạn">Còn hạn</option>
                                    <option value="Hết hạn">Hết hạn</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '180px 1fr', alignItems: 'center' }}>
                                <label>Ngày bắt đầu:</label>
                                <input type="date" value={selectedEmp.startDate} readOnly={mode === 'VIEW'} onChange={e => setSelectedEmp({...selectedEmp, startDate: e.target.value})} />
                            </div>

                            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '180px 1fr', alignItems: 'center' }}>
                                <label>Ngày kết thúc:</label>
                                <input type="date" value={selectedEmp.endDate} readOnly={mode === 'VIEW'} onChange={e => setSelectedEmp({...selectedEmp, endDate: e.target.value})} />
                            </div>

                            <div className="form-group">
                                <label>Ghi chú:</label>
                                <textarea rows="2" value={selectedEmp.note} readOnly={mode === 'VIEW'} onChange={e => setSelectedEmp({...selectedEmp, note: e.target.value})} style={{ width: '100%', border: '1px solid #cbd5e1', marginTop: '5px' }}></textarea>
                            </div>

                            <div className="form-actions" style={{ justifyContent: 'center', gap: '40px', marginTop: '20px' }}>
                                {mode !== 'VIEW' && <button type="button" className="btn-primary" style={{ padding: '10px 40px' }}>[ Lưu ]</button>}
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} style={{ padding: '10px 40px' }}>[ Hủy ]</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmployeePage;