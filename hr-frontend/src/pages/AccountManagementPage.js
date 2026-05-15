import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function AccountManagementPage() {
    const [accounts, setAccounts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        oldUsername: '', oldRole: '',
        username: '', fullName: '', email: '', password: '', role: 'Admin', status: 'Active'
    });

    // 1. Fetch dữ liệu khi load trang
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

    // 2. Mở Modal
    const handleOpenModal = (account = null) => {
        if (account) {
            setIsEditMode(true);
            setFormData({
                oldUsername: account.username, oldRole: account.role,
                username: account.username, fullName: account.fullName, email: account.email,
                password: '', // Để trống password khi edit, nếu nhập mới update
                role: account.role, status: account.status
            });
        } else {
            setIsEditMode(false);
            setFormData({
                oldUsername: '', oldRole: '',
                username: '', fullName: '', email: '', password: '', role: 'Admin', status: 'Active'
            });
        }
        setShowModal(true);
    };

    // 3. Lưu (Create hoặc Update)
    const handleSave = async () => {
        try {
            const endpoint = isEditMode ? '/update' : '/create';
            await axios.post(`http://localhost:8080/api/accounts${endpoint}`, formData);
            alert(isEditMode ? "Cập nhật thành công!" : "Tạo mới thành công!");
            setShowModal(false);
            fetchAccounts(); // Load lại bảng
        } catch (err) {
            // Dòng này sẽ lấy đúng lỗi từ Backend (ví dụ: Thiếu cột status, trùng email...) hiển thị lên
            alert(err.response?.data?.message || "Có lỗi xảy ra!");
            console.error(err);
        }
    };
    // 4. Nút Khóa/Mở khóa nhanh
    const handleToggleStatus = async (account) => {
        if(window.confirm(`Bạn có chắc muốn ${account.status === 'Active' ? 'khóa' : 'mở khóa'} user ${account.username}?`)) {
            try {
                await axios.post('http://localhost:8080/api/accounts/toggle-status', {
                    username: account.username,
                    role: account.role,
                    status: account.status
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

                    {/* BẢNG DỮ LIỆU */}
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
                                        <button onClick={() => handleOpenModal(acc)} style={{ color: '#4318ff', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px' }}>[Edit]</button>
                                        <button onClick={() => handleToggleStatus(acc)} style={{ color: acc.status === 'Active' ? '#e53e3e' : '#05cd99', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                            [{acc.status === 'Active' ? 'Lock' : 'Unlock'}]
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* MODAL TẠO/SỬA */}
                    {showModal && (
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', width: '400px' }}>
                                <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#1b2559' }}>
                                    {isEditMode ? 'EDIT USER' : 'CREATE USER'}
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