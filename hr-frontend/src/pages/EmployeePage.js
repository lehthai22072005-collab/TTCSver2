import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

// DANH SÁCH CHUẨN ĐỂ HIỂN THỊ DẠNG DROPDOWN SỔ XUỐNG
const FACULTY_DEPARTMENTS = [
    'Khoa CNTT',
    'Khoa An toàn TT',
    'Khoa Cơ bản',
    'Phòng Tài chính',
    'Trung tâm IT',
    'Phòng Đào tạo',
    'Ban Giám Hiệu',
    'Không thuộc khoa'
];

const POSITION_ROLES = [
    'Giảng viên',
    'Hiệu trưởng',
    'Kế toán',
    'Quản trị viên',
    'Chuyên viên',
    'Nhân viên'
];

function EmployeePage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    // Form tạo mới tự động chọn giá trị mặc định chuẩn
    const [newEmployee, setNewEmployee] = useState({
        fullName: '',
        department: 'Khoa CNTT',
        position: 'Giảng viên',
        email: '',
        phone: '',
        academicDegree: 'Cử nhân',
        contractStartDate: '',
        contractEndDate: '',
        baseSalary: 10000000,
        nhomNhanSu: 'Giảng viên',
        loaiGiangVien: 'Cơ hữu',
        hocHam: 'Không',
        ngachCongChuc: '',
        bacLuong: 1
    });

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/employees");
            setEmployees(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Lỗi khi tải danh sách nhân viên:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreateEmployee = async () => {
        if (!newEmployee.fullName || !newEmployee.email) {
            return alert("Vui lòng điền họ tên và email bắt buộc!");
        }
        try {
            await axios.post("http://localhost:8080/api/employees", newEmployee);
            alert("✅ Hệ thống: Thêm mới hồ sơ nhân sự thành công!");
            setShowCreateModal(false);
            setNewEmployee({
                fullName: '',
                department: 'Khoa CNTT',
                position: 'Giảng viên',
                email: '',
                phone: '',
                academicDegree: 'Cử nhân',
                contractStartDate: '',
                contractEndDate: '',
                baseSalary: 10000000,
                nhomNhanSu: 'Giảng viên',
                loaiGiangVien: 'Cơ hữu',
                hocHam: 'Không',
                ngachCongChuc: '',
                bacLuong: 1
            });
            await fetchEmployees();
        } catch (err) {
            alert("❌ Lỗi khi thêm mới: " + (err.response?.data?.message || err.message));
        }
    };

    const openUpdateModal = (emp) => {
        const sanitizedEmp = { ...emp };

        // LOGIC LỌC: Nếu không nằm trong list chuẩn thì đẩy về giá trị dự phòng
        if (!FACULTY_DEPARTMENTS.includes(sanitizedEmp.department)) {
            sanitizedEmp.department = 'Không thuộc khoa';
        }
        if (!POSITION_ROLES.includes(sanitizedEmp.position)) {
            sanitizedEmp.position = 'Nhân viên';
        }

        setSelectedEmployee(sanitizedEmp);
        setShowUpdateModal(true);
    };

    const handleUpdateEmployee = async () => {
        if (!selectedEmployee.fullName || !selectedEmployee.email) {
            return alert("Vui lòng điền họ tên và email bắt buộc!");
        }
        try {
            await axios.put(`http://localhost:8080/api/employees/${selectedEmployee.id}`, selectedEmployee);
            alert("✅ Hệ thống: Cập nhật hồ sơ nhân sự thành công!");
            setShowUpdateModal(false);
            await fetchEmployees();
        } catch (err) {
            alert("❌ Lỗi khi cập nhật: " + (err.response?.data?.message || err.message));
        }
    };

    // ĐÃ XÓA CHỨC NĂNG XÓA (handleDeleteEmployee) THEO YÊU CẦU

    const formatDate = (dateStr) => {
        if (!dateStr) return "Chưa cập nhật";
        try {
            const parts = dateStr.split('-');
            if (parts.length === 3) {
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
            return dateStr;
        } catch (e) {
            return dateStr;
        }
    };

    const checkStatus = (endDateStr) => {
        if (!endDateStr) return { text: "Đang làm việc", color: '#00b8d9', bg: '#e6fffb' };
        try {
            const endDate = new Date(endDateStr);
            const today = new Date();
            today.setHours(0,0,0,0);
            if (endDate < today) {
                return { text: "Hết hạn HĐ", color: '#ff5630', bg: '#fff1f0' };
            }
            return { text: "Đang làm việc", color: '#00b8d9', bg: '#e6fffb' };
        } catch (e) {
            return { text: "Đang làm việc", color: '#00b8d9', bg: '#e6fffb' };
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <div>
                            <h2 style={{ fontWeight: 'bold', color: '#1b2559', textTransform: 'uppercase', margin: 0 }}>
                                Quản lý thông tin nhân sự
                            </h2>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                style={{ backgroundColor: '#4318ff', color: '#fff', padding: '12px 25px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0px 10px 20px rgba(67, 24, 255, 0.15)' }}
                            >
                                [ + Thêm nhân sự mới ]
                            </button>
                            <span style={{ backgroundColor: '#fff', color: '#4318ff', padding: '10px 20px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 'bold', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.05)' }}>
                                Tổng số: {employees.length} nhân sự
                            </span>
                        </div>
                    </div>

                    <div style={tableCardStyle}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '30px', color: '#4318ff', fontWeight: 'bold' }}>
                                ⏳ Đang đồng bộ hồ sơ nhân sự từ máy chủ...
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                    <tr style={{ borderBottom: '2px solid #f4f7fe', color: '#a3aed0', textAlign: 'left', fontSize: '0.85rem' }}>
                                        <th style={thStyle}>MÃ NV</th>
                                        <th style={thStyle}>HỌ VÀ TÊN</th>
                                        <th style={thStyle}>NHÓM NHÂN SỰ</th>
                                        <th style={thStyle}>PHÒNG BAN/KHOA</th>
                                        <th style={thStyle}>CHỨC VỤ</th>
                                        <th style={thStyle}>NGÀY BẮT ĐẦU HĐ</th>
                                        <th style={thStyle}>NGÀY HẾT HẠN HĐ</th>
                                        <th style={thStyle}>LƯƠNG CB</th>
                                        <th style={thStyle}>TRẠNG THÁI</th>
                                        <th style={{ ...thStyle, textAlign: 'center' }}>THAO TÁC</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {employees.length > 0 ? (
                                        employees.map((emp) => {
                                            const statusInfo = checkStatus(emp.contractEndDate);
                                            return (
                                                <tr key={emp.id} style={{ borderBottom: '1px solid #f4f7fe' }}>
                                                    <td style={{ ...tdStyle, fontWeight: 'bold' }}>NV{emp.id}</td>
                                                    <td style={{ ...tdStyle, fontWeight: '700', color: '#1b2559' }}>{emp.fullName}</td>
                                                    <td style={{ ...tdStyle, fontWeight: 'bold', color: '#4318ff' }}>{emp.nhomNhanSu || "Chưa phân loại"}</td>
                                                    <td style={tdStyle}>{emp.department || "Chưa phân bổ"}</td>
                                                    <td style={tdStyle}>{emp.position || "N/A"}</td>
                                                    <td style={{ ...tdStyle, color: '#4318ff', fontWeight: '500' }}>{formatDate(emp.contractStartDate)}</td>
                                                    <td style={{ ...tdStyle, color: '#ee5d50', fontWeight: '500' }}>{formatDate(emp.contractEndDate)}</td>
                                                    <td style={tdStyle}>{(emp.baseSalary || 0).toLocaleString()}đ</td>
                                                    <td style={tdStyle}>
                                                            <span style={{ padding: '5px 12px', borderRadius: '8px', backgroundColor: statusInfo.bg, color: statusInfo.color, fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                                {statusInfo.text}
                                                            </span>
                                                    </td>
                                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                            {/* ĐÃ BỎ NÚT XÓA Ở ĐÂY */}
                                                            <button onClick={() => openUpdateModal(emp)} style={btnUpdateStyle}>Sửa hồ sơ</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#a3aed0' }}>
                                                Không tìm thấy dữ liệu nhân sự nào trong Database.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL 1: FORM THÊM MỚI NHÂN SỰ */}
            {showCreateModal && (
                <div className="modal-overlay" style={{ zIndex: 999 }}>
                    <div className="modal-content" style={{ width: '650px', padding: '30px', borderRadius: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ textAlign: 'center', fontWeight: 'bold', color: '#1b2559', marginBottom: '25px', textTransform: 'uppercase' }}>
                            Thêm nhân sự mới vào hệ thống
                        </h3>
                        <div style={formGridStyle}>
                            <div>
                                <label style={labelForm}>Họ và tên *</label>
                                <input type="text" style={inputStyle} value={newEmployee.fullName} onChange={e => setNewEmployee({...newEmployee, fullName: e.target.value})} placeholder="Nguyễn Văn A" />
                            </div>
                            <div>
                                <label style={labelForm}>Email liên hệ *</label>
                                <input type="email" style={inputStyle} value={newEmployee.email} onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} placeholder="anv@ptit.edu.vn" />
                            </div>

                            <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                                <label style={labelForm}>Nhóm nhân sự</label>
                                <select style={inputStyle} value={newEmployee.nhomNhanSu} onChange={e => setNewEmployee({...newEmployee, nhomNhanSu: e.target.value})}>
                                    <option value="Giảng viên">Giảng viên</option>
                                    <option value="Cán bộ hành chính">Cán bộ hành chính</option>
                                    <option value="Ban Giám Hiệu">Ban Giám Hiệu</option>
                                    <option value="Nhân viên hỗ trợ">Nhân viên hỗ trợ</option>
                                </select>
                            </div>

                            {newEmployee.nhomNhanSu === 'Giảng viên' ? (
                                <>
                                    <div>
                                        <label style={labelForm}>Loại giảng viên</label>
                                        <select style={inputStyle} value={newEmployee.loaiGiangVien} onChange={e => setNewEmployee({...newEmployee, loaiGiangVien: e.target.value})}>
                                            <option value="Cơ hữu">Cơ hữu</option>
                                            <option value="Thỉnh giảng">Thỉnh giảng</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelForm}>Học hàm</label>
                                        <select style={inputStyle} value={newEmployee.hocHam} onChange={e => setNewEmployee({...newEmployee, hocHam: e.target.value})}>
                                            <option value="Không">Không</option>
                                            <option value="Giáo sư">Giáo sư</option>
                                            <option value="Phó Giáo sư">Phó Giáo sư</option>
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label style={labelForm}>Ngạch công chức</label>
                                        <input type="text" style={inputStyle} value={newEmployee.ngachCongChuc} onChange={e => setNewEmployee({...newEmployee, ngachCongChuc: e.target.value})} placeholder="VD: Chuyên viên chính" />
                                    </div>
                                    <div>
                                        <label style={labelForm}>Bậc lương (Hệ số)</label>
                                        <input type="number" style={inputStyle} value={newEmployee.bacLuong} onChange={e => setNewEmployee({...newEmployee, bacLuong: Number(e.target.value)})} />
                                    </div>
                                </>
                            )}


                            {/* DÙNG THẺ SELECT CHO PHÒNG BAN */}
                            <div>
                                <label style={labelForm}>Phòng ban / Khoa</label>
                                <select style={inputStyle} value={newEmployee.department} onChange={e => setNewEmployee({...newEmployee, department: e.target.value})}>
                                    {FACULTY_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

                            {/* DÙNG THẺ SELECT CHO CHỨC VỤ */}
                            <div>
                                <label style={labelForm}>Chức vụ / Vị trí</label>
                                <select style={inputStyle} value={newEmployee.position} onChange={e => setNewEmployee({...newEmployee, position: e.target.value})}>
                                    {POSITION_ROLES.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={labelForm}>Số điện thoại</label>
                                <input type="text" style={inputStyle} value={newEmployee.phone} onChange={e => setNewEmployee({...newEmployee, phone: e.target.value})} placeholder="0123456789" />
                            </div>
                            <div>
                                <label style={labelForm}>Học vị / Học hàm</label>
                                <select style={inputStyle} value={newEmployee.academicDegree} onChange={e => setNewEmployee({...newEmployee, academicDegree: e.target.value})}>
                                    <option value="Cử nhân">Cử nhân</option>
                                    <option value="Kỹ sư">Kỹ sư</option>
                                    <option value="Thạc sĩ">Thạc sĩ</option>
                                    <option value="Tiến sĩ">Tiến sĩ</option>
                                    <option value="Phó Giáo sư">Phó Giáo sư</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelForm}>Ngày bắt đầu HĐ</label>
                                <input type="date" style={inputStyle} value={newEmployee.contractStartDate} onChange={e => setNewEmployee({...newEmployee, contractStartDate: e.target.value})} />
                            </div>
                            <div>
                                <label style={labelForm}>Ngày hết hạn HĐ</label>
                                <input type="date" style={inputStyle} value={newEmployee.contractEndDate} onChange={e => setNewEmployee({...newEmployee, contractEndDate: e.target.value})} />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelForm}>Mức lương cơ bản (VNĐ)</label>
                                <input type="number" style={inputStyle} value={newEmployee.baseSalary} onChange={e => setNewEmployee({...newEmployee, baseSalary: Number(e.target.value)})} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
                            <button onClick={handleCreateEmployee} style={{ backgroundColor: '#4318ff', color: 'white', padding: '12px 35px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Lưu hồ sơ</button>
                            <button onClick={() => setShowCreateModal(false)} style={{ backgroundColor: '#f4f7fe', color: '#1b2559', padding: '12px 35px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Hủy bỏ</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 2: FORM CẬP NHẬT CHỈNH SỬA NHÂN SỰ */}
            {showUpdateModal && selectedEmployee && (
                <div className="modal-overlay" style={{ zIndex: 999 }}>
                    <div className="modal-content" style={{ width: '650px', padding: '30px', borderRadius: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ textAlign: 'center', fontWeight: 'bold', color: '#1b2559', marginBottom: '25px', textTransform: 'uppercase' }}>
                            Chỉnh sửa hồ sơ nhân sự #{selectedEmployee.id}
                        </h3>
                        <div style={formGridStyle}>
                            <div>
                                <label style={labelForm}>Họ và tên *</label>
                                <input type="text" style={inputStyle} value={selectedEmployee.fullName} onChange={e => setSelectedEmployee({...selectedEmployee, fullName: e.target.value})} />
                            </div>
                            <div>
                                <label style={labelForm}>Email liên hệ *</label>
                                <input type="email" style={inputStyle} value={selectedEmployee.email} onChange={e => setSelectedEmployee({...selectedEmployee, email: e.target.value})} />
                            </div>

                            <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                                <label style={labelForm}>Nhóm nhân sự</label>
                                <select style={inputStyle} value={selectedEmployee.nhomNhanSu || 'Cán bộ hành chính'} onChange={e => setSelectedEmployee({...selectedEmployee, nhomNhanSu: e.target.value})}>
                                    <option value="Giảng viên">Giảng viên</option>
                                    <option value="Cán bộ hành chính">Cán bộ hành chính</option>
                                    <option value="Ban Giám Hiệu">Ban Giám Hiệu</option>
                                    <option value="Nhân viên hỗ trợ">Nhân viên hỗ trợ</option>
                                </select>
                            </div>

                            {selectedEmployee.nhomNhanSu === 'Giảng viên' ? (
                                <>
                                    <div>
                                        <label style={labelForm}>Loại giảng viên</label>
                                        <select style={inputStyle} value={selectedEmployee.loaiGiangVien || 'Cơ hữu'} onChange={e => setSelectedEmployee({...selectedEmployee, loaiGiangVien: e.target.value})}>
                                            <option value="Cơ hữu">Cơ hữu</option>
                                            <option value="Thỉnh giảng">Thỉnh giảng</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={labelForm}>Học hàm</label>
                                        <select style={inputStyle} value={selectedEmployee.hocHam || 'Không'} onChange={e => setSelectedEmployee({...selectedEmployee, hocHam: e.target.value})}>
                                            <option value="Không">Không</option>
                                            <option value="Giáo sư">Giáo sư</option>
                                            <option value="Phó Giáo sư">Phó Giáo sư</option>
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label style={labelForm}>Ngạch công chức</label>
                                        <input type="text" style={inputStyle} value={selectedEmployee.ngachCongChuc || ''} onChange={e => setSelectedEmployee({...selectedEmployee, ngachCongChuc: e.target.value})} />
                                    </div>
                                    <div>
                                        <label style={labelForm}>Bậc lương (Hệ số)</label>
                                        <input type="number" style={inputStyle} value={selectedEmployee.bacLuong || 1} onChange={e => setSelectedEmployee({...selectedEmployee, bacLuong: Number(e.target.value)})} />
                                    </div>
                                </>
                            )}


                            {/* DÙNG THẺ SELECT CHO PHÒNG BAN */}
                            <div>
                                <label style={labelForm}>Phòng ban / Khoa</label>
                                <select style={inputStyle} value={selectedEmployee.department} onChange={e => setSelectedEmployee({...selectedEmployee, department: e.target.value})}>
                                    {FACULTY_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

                            {/* DÙNG THẺ SELECT CHO CHỨC VỤ */}
                            <div>
                                <label style={labelForm}>Chức vụ / Vị trí</label>
                                <select style={inputStyle} value={selectedEmployee.position} onChange={e => setSelectedEmployee({...selectedEmployee, position: e.target.value})}>
                                    {POSITION_ROLES.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={labelForm}>Số điện thoại</label>
                                <input type="text" style={inputStyle} value={selectedEmployee.phone || ''} onChange={e => setSelectedEmployee({...selectedEmployee, phone: e.target.value})} />
                            </div>
                            <div>
                                <label style={labelForm}>Học vị / Học hàm</label>
                                <select style={inputStyle} value={selectedEmployee.academicDegree || 'Cử nhân'} onChange={e => setSelectedEmployee({...selectedEmployee, academicDegree: e.target.value})}>
                                    <option value="Cử nhân">Cử nhân</option>
                                    <option value="Kỹ sư">Kỹ sư</option>
                                    <option value="Thạc sĩ">Thạc sĩ</option>
                                    <option value="Tiến sĩ">Tiến sĩ</option>
                                    <option value="Phó Giáo sư">Phó Giáo sư</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelForm}>Ngày bắt đầu HĐ</label>
                                <input type="date" style={inputStyle} value={selectedEmployee.contractStartDate || ''} onChange={e => setSelectedEmployee({...selectedEmployee, contractStartDate: e.target.value})} />
                            </div>
                            <div>
                                <label style={labelForm}>Ngày hết hạn HĐ</label>
                                <input type="date" style={inputStyle} value={selectedEmployee.contractEndDate || ''} onChange={e => setSelectedEmployee({...selectedEmployee, contractEndDate: e.target.value})} />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelForm}>Mức lương cơ bản (VNĐ)</label>
                                <input type="number" style={inputStyle} value={selectedEmployee.baseSalary || 0} onChange={e => setSelectedEmployee({...selectedEmployee, baseSalary: Number(e.target.value)})} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
                            <button onClick={handleUpdateEmployee} style={{ backgroundColor: '#05cd99', color: 'white', padding: '12px 35px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Cập nhật ngay</button>
                            <button onClick={() => setShowUpdateModal(false)} style={{ backgroundColor: '#f4f7fe', color: '#1b2559', padding: '12px 35px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Đóng lại</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const tableCardStyle = { backgroundColor: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.06)', border: 'none' };
const thStyle = { padding: '15px 10px', textTransform: 'uppercase', color: '#a3aed0', fontSize: '0.82rem', fontWeight: '600' };
const tdStyle = { padding: '18px 10px', fontSize: '0.92rem', color: '#2b3674' };

const formGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', textAlign: 'left' };
const labelForm = { fontSize: '0.85rem', fontWeight: 'bold', color: '#2b3674', display: 'block', marginBottom: '5px' };
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', color: '#2b3674', fontFamily: 'inherit' };

const btnUpdateStyle = { padding: '6px 20px', backgroundColor: '#e6fff5', color: '#05cd99', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

export default EmployeePage;