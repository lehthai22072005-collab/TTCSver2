import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function EmployeePage() {
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState('ADD');

    // State lưu trữ thông tin form
    const [formData, setFormData] = useState({
        id: '',
        fullName: '',
        email: '',
        phone: '',
        position: 'Giảng viên',
        department: 'Hành chính',
        academicDegree: 'Cử nhân',
        contractEndDate: ''
    });

    // 1. LẤY DANH SÁCH NHÂN VIÊN TỪ DATABASE
    const fetchEmployees = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/employees");
            setEmployees(res.data);
        } catch (err) {
            console.error("Lỗi kết nối Backend:", err);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // 2. HÀM LƯU DỮ LIỆU (ADD / EDIT) - ĐÃ FIX THEO YÊU CẦU CỦA BẠN
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Chuẩn bị dữ liệu gửi đi khớp với Entity Backend
            const dataToSave = {
                ...formData,
                // Nếu ngày trống thì gửi null để tránh lỗi định dạng Date trong Java
                contractEndDate: formData.contractEndDate === '' ? null : formData.contractEndDate,
                // Đảm bảo tên biến gửi lên là academicDegree (CamelCase)
                academicDegree: formData.academicDegree
            };

            if (mode === 'ADD') {
                await axios.post("http://localhost:8080/api/employees", dataToSave);
                alert("✅ Thêm nhân sự mới thành công!");
            } else {
                // Gửi lệnh PUT kèm ID để cập nhật thông tin vào MySQL
                await axios.put(`http://localhost:8080/api/employees/${formData.id}`, dataToSave);
                alert("✅ Cập nhật thông tin hồ sơ thành công!");
            }
            setShowModal(false);
            fetchEmployees(); // Tải lại danh sách mới nhất từ Database
        } catch (err) {
            alert("❌ Lỗi thao tác: " + (err.response?.data?.message || err.message));
        }
    };

    // 3. MỞ MODAL XỬ LÝ DỮ LIỆU
    const openModal = (actionMode, emp = null) => {
        setMode(actionMode);
        if (emp) {
            // Khi Sửa: Đổ dữ liệu từ mảng vào form
            setFormData({
                id: emp.id,
                fullName: emp.fullName || '',
                email: emp.email || '',
                phone: emp.phone || '',
                position: emp.position || 'Giảng viên',
                department: emp.department || 'Hành chính',
                academicDegree: emp.academicDegree || 'Cử nhân',
                contractEndDate: emp.contractEndDate || ''
            });
        } else {
            // Khi Thêm: Reset trắng form
            setFormData({
                fullName: '', email: '', phone: '',
                position: 'Kế toán', department: 'Hành chính',
                academicDegree: 'Cử nhân', contractEndDate: ''
            });
        }
        setShowModal(true);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ backgroundColor: '#f4f7fe', minHeight: '100vh', padding: '30px' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h2 style={{ fontWeight: 'bold', color: '#1b2559', textTransform: 'uppercase' }}>Quản lý hồ sơ nhân sự</h2>
                            <button className="btn-primary" onClick={() => openModal('ADD')} style={{ padding: '12px 25px', borderRadius: '12px' }}>
                                + Thêm nhân sự mới
                            </button>
                        </div>

                        {/* BẢNG HIỂN THỊ */}
                        <div style={cardStyle}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ borderBottom: '2px solid #f4f7fe' }}>
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>HỌ TÊN</th>
                                    <th style={thStyle}>CHỨC VỤ</th>
                                    <th style={thStyle}>PHÒNG BAN</th>
                                    <th style={thStyle}>BẰNG CẤP</th>
                                    <th style={thStyle}>HẾT HẠN HĐ</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>THAO TÁC</th>
                                </tr>
                                </thead>
                                <tbody>
                                {employees.map((emp) => (
                                    <tr key={emp.id} style={{ borderBottom: '1px solid #f4f7fe' }}>
                                        <td style={tdStyle}>{emp.id}</td>
                                        <td style={{ ...tdStyle, fontWeight: '700', color: '#1b2559' }}>{emp.fullName}</td>
                                        <td style={tdStyle}>{emp.position}</td>
                                        <td style={tdStyle}>{emp.department}</td>
                                        <td style={tdStyle}>
                                            <span style={badgeStyle}>{emp.academicDegree || 'N/A'}</span>
                                        </td>
                                        <td style={tdStyle}>{emp.contractEndDate || 'Vô thời hạn'}</td>
                                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                                            <button onClick={() => openModal('EDIT', emp)} style={btnEditStyle}>Sửa</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL FORM NHẬP LIỆU */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ borderRadius: '20px', width: '650px', padding: '30px' }}>
                        <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '25px', color: '#1b2559' }}>
                            {mode === 'ADD' ? 'TẠO HỒ SƠ NHÂN SỰ' : 'CẬP NHẬT HỒ SƠ'}
                        </h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group mb-3">
                                <label style={labelStyle}>Họ và tên:</label>
                                <input type="text" required style={inputStyle} value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                            </div>

                            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                                <div className="form-group mb-3">
                                    <label style={labelStyle}>Chức vụ:</label>
                                    <select style={inputStyle} value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})}>
                                        <option>Giảng viên</option>
                                        <option>Kế toán</option>
                                        <option>Bảo vệ</option>
                                        <option>Lao công</option>
                                    </select>
                                </div>
                                <div className="form-group mb-3">
                                    <label style={labelStyle}>Phòng ban / Tổ:</label>
                                    <select style={inputStyle} value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                                        <option>Khoa CNTT</option>
                                        <option>Hành chính</option>
                                        <option>Tổ Toán</option>
                                        <option>Ban Giám Hiệu</option>
                                        <option>Tổ Bảo vệ</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                                <div className="form-group mb-3">
                                    <label style={labelStyle}>Bằng cấp:</label>
                                    <select style={inputStyle} value={formData.academicDegree} onChange={e => setFormData({...formData, academicDegree: e.target.value})}>
                                        <option value="Tiến sĩ">Tiến sĩ</option>
                                        <option value="Thạc sĩ">Thạc sĩ</option>
                                        <option value="Kỹ sư">Kỹ sư</option>
                                        <option value="Cử nhân">Cử nhân</option>
                                        <option value="N/A">N/A</option>
                                    </select>
                                </div>
                                <div className="form-group mb-3">
                                    <label style={labelStyle}>Ngày hết hạn HĐ:</label>
                                    <input type="date" style={inputStyle} value={formData.contractEndDate} onChange={e => setFormData({...formData, contractEndDate: e.target.value})} />
                                </div>
                            </div>

                            <div className="form-group mb-3">
                                <label style={labelStyle}>Email liên hệ:</label>
                                <input type="email" required style={inputStyle} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>

                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '25px' }}>
                                <button type="submit" style={btnSubmitStyle}>LƯU THÔNG TIN</button>
                                <button type="button" onClick={() => setShowModal(false)} style={btnCancelStyle}>HỦY</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Styles Tối ưu ---
const cardStyle = { backgroundColor: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)' };
const thStyle = { textAlign: 'left', padding: '15px 10px', color: '#a3aed0', fontSize: '0.85rem', textTransform: 'uppercase' };
const tdStyle = { padding: '18px 10px', fontSize: '0.95rem', color: '#2b3674' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '0.85rem' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e0e5f2', outline: 'none' };
const btnEditStyle = { color: '#4318ff', backgroundColor: '#f4f7fe', border: 'none', padding: '6px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const btnSubmitStyle = { padding: '12px 40px', backgroundColor: '#4318ff', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const btnCancelStyle = { padding: '12px 40px', backgroundColor: '#f4f7fe', color: '#1b2559', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const badgeStyle = { backgroundColor: '#eef2ff', color: '#4318ff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600' };

export default EmployeePage;