import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function AccountManagementPage() {
    const [accounts, setAccounts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Form data: Đã bổ sung trường employeeId
    const [formData, setFormData] = useState({
        employeeId: '', oldUsername: '', oldRole: '',
        username: '', fullName: '', email: '', password: '', role: 'Admin', status: 'Active'
    });

    const fetchAccounts = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/accounts/list');
            setAccounts(res.data);
        } catch (err) {
            console.error("Lỗi lấy danh sách tài khoản:", err);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    // XỬ LÝ MỞ FORM THÔNG MINH
    const handleOpenModal = (account = null) => {
        if (account) {
            // Nếu bấm vào người chưa có tài khoản -> Chuyển sang mode CREATE (Cấp TK)
            if (account.username === "[ Chưa có tài khoản ]") {
                setIsEditMode(false);
                setFormData({
                    employeeId: account.employeeId, // Giữ ID để cấp TK cho đúng người
                    oldUsername: '', oldRole: '',
                    username: '', fullName: account.fullName, email: account.email || '',
                    password: '', role: 'Nhân viên', status: 'Active'
                });
            } else {
                // Nếu bấm vào người đã có tài khoản -> Mode EDIT (Chỉnh sửa)
                setIsEditMode(true);
                setFormData({
                    employeeId: account.employeeId,
                    oldUsername: account.username, oldRole: account.role,
                    username: account.username, fullName: account.fullName, email: account.email || '',
                    password: '', // Để trống, có sửa thì backend cập nhật
                    role: account.role, status: account.status
                });
            }
        } else {
            // Nút [+ Tạo User] -> Tạo mới hoàn toàn cả NV lẫn Tài khoản
            setIsEditMode(false);
            setFormData({
                employeeId: '', oldUsername: '', oldRole: '',
                username: '', fullName: '', email: '', password: '', role: 'Admin', status: 'Active'
            });
        }
        setShowModal(true);
    };
    const handleSave = async () => {
        try {
            // Lấy tên người đang đăng nhập (ví dụ: admin_thai)
            const currentUser = localStorage.getItem('username') || 'System';

            // Đính kèm vào dữ liệu gửi đi
            const payload = { ...formData, actionBy: currentUser };

            const endpoint = isEditMode ? '/update' : '/create';
            await axios.post(`http://localhost:8080/api/accounts${endpoint}`, payload);

            alert("✅ Xử lý thành công!");
            setShowModal(false);
            fetchAccounts();
        } catch (err) {
            alert(err.response?.data?.message || "❌ Có lỗi xảy ra!");
            console.error(err);
        }
    };

    const handleToggleStatus = async (account) => {
        if(window.confirm(`Bạn có chắc muốn ${account.status === 'Active' ? 'khóa' : 'mở khóa'} user ${account.username}?`)) {
            try {
                const currentUser = localStorage.getItem('username') || 'System';

                await axios.post('http://localhost:8080/api/accounts/toggle-status', {
                    username: account.username,
                    role: account.role,
                    status: account.status,
                    actionBy: currentUser // Đính kèm người thực hiện
                });
                fetchAccounts();
            } catch (err) {
                console.error("Lỗi đổi trạng thái:", err);
            }
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '30px' }}>QUẢN LÝ TÀI KHOẢN</h2>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <input type="text" placeholder="[ Tìm kiếm 🔍 ]" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', width: '300px' }} />
                        <button onClick={() => handleOpenModal()} style={{ backgroundColor: '#4318ff', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            [ + Tạo User ]
                        </button>
                    </div>

                    <div style={{ backgroundColor: '#fff', borderRadius: '15px', padding: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                            <tr style={{ borderBottom: '2px solid #f4f7fe', color: '#a3aed0' }}>
                                <th style={{ padding: '15px' }}>STT</th>
                                <th>USERNAME</th>
                                <th>HỌ VÀ TÊN</th>
                                <th>ROLE</th>
                                <th>STATUS</th>
                                <th>ACTION</th>
                            </tr>
                            </thead>
                            <tbody>
                            {accounts.map((acc, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #f4f7fe', color: '#2b3674', fontWeight: '500' }}>
                                    <td style={{ padding: '15px' }}>{index + 1}</td>
                                    <td>{acc.username}</td>
                                    <td>{acc.fullName}</td>
                                    <td>{acc.role}</td>
                                    <td style={{ color: acc.status === 'Active' ? '#05cd99' : '#e53e3e' }}>{acc.status}</td>
                                    <td>
                                        {acc.username === "[ Chưa có tài khoản ]" ? (
                                            <button onClick={() => handleOpenModal(acc)} style={{ color: '#05cd99', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                                [Cấp TK]
                                            </button>
                                        ) : (
                                            <>
                                                <button onClick={() => handleOpenModal(acc)} style={{ color: '#4318ff', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px' }}>
                                                    [Edit]
                                                </button>
                                                <button onClick={() => handleToggleStatus(acc)} style={{ color: acc.status === 'Active' ? '#e53e3e' : '#05cd99', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                                    [{acc.status === 'Active' ? 'Lock' : 'Unlock'}]
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {showModal && (
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', width: '400px' }}>
                                <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#1b2559' }}>
                                    {isEditMode ? 'EDIT USER' : (formData.employeeId ? 'CẤP TÀI KHOẢN' : 'CREATE USER')}
                                </h3>

                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Username:</label>
                                    <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={inputStyle} />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Họ và tên:</label>
                                    <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={inputStyle} />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Email:</label>
                                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={inputStyle} />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Password: {isEditMode && <span style={{fontSize:'12px', color:'gray'}}>(Bỏ trống nếu không đổi)</span>}</label>
                                    <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={inputStyle} />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Role:</label>
                                    <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={inputStyle}>
                                        <option value="Admin">Admin</option>
                                        <option value="Kế toán">Kế toán</option>
                                        <option value="Nhân viên">Nhân viên</option>
                                        <option value="Ban Giám Hiệu">Ban Giám Hiệu</option>
                                    </select>
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Status:</label>
                                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={inputStyle}>
                                        <option value="Active">Active</option>
                                        <option value="Locked">Locked</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                    <button onClick={handleSave} style={{ backgroundColor: '#4318ff', color: 'white', padding: '10px 30px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>[ Save ]</button>
                                    <button onClick={() => setShowModal(false)} style={{ backgroundColor: 'transparent', color: '#1b2559', padding: '10px 30px', borderRadius: '8px', border: '1px solid #1b2559', cursor: 'pointer', fontWeight: 'bold' }}>[ Cancel ]</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' };

export default AccountManagementPage;