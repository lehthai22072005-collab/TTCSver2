import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function AccountManagementPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState('ADD'); // ADD hoặc EDIT

    // Dữ liệu mẫu
    const [users, setUsers] = useState([
        { id: 1, username: 'thai', fullName: 'Lê Thái', email: 'thai@gmail.com', role: 'Admin', status: 'Active' },
        { id: 2, username: 'nam', fullName: 'Nguyễn Nam', email: 'nam@gmail.com', role: 'Kế toán', status: 'Locked' },
        { id: 3, username: 'linh', fullName: 'Trần Linh', email: 'linh@gmail.com', role: 'Nhân viên', status: 'Active' }
    ]);

    const [selectedUser, setSelectedUser] = useState({
        username: '', fullName: '', email: '', password: '', role: 'Admin', status: 'Active'
    });

    // Mở Modal (Tạo mới hoặc Chỉnh sửa)
    const openModal = (actionMode, user = null) => {
        setMode(actionMode);
        if (user) {
            setSelectedUser({ ...user, password: '***' }); // Giả lập pass khi edit
        } else {
            setSelectedUser({ username: '', fullName: '', email: '', password: '', role: 'Admin', status: 'Active' });
        }
        setShowModal(true);
    };

    // Xử lý Lock/Unlock
    const toggleLock = (id) => {
        const updatedUsers = users.map(user => {
            if (user.id === id) {
                return { ...user, status: user.status === 'Active' ? 'Locked' : 'Active' };
            }
            return user;
        });
        setUsers(updatedUsers);
    };

    // Xử lý Lưu (Save)
    const handleSave = () => {
        if (mode === 'ADD') {
            const newUser = { ...selectedUser, id: users.length + 1 };
            setUsers([...users, newUser]);
        } else {
            setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
        }
        setShowModal(false);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>
                        <h2 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Quản lý tài khoản</h2>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="[ Tìm kiếm 🔍 ]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '300px', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                        />
                        <button className="btn-primary" onClick={() => openModal('ADD')}>
                            [ + Tạo User ]
                        </button>
                    </div>

                    <div className="card shadow-sm">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.filter(u => u.username.includes(searchTerm)).map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td className="font-bold">{user.username}</td>
                                    <td>{user.role}</td>
                                    <td>
                                            <span style={{ fontWeight: 'bold', color: user.status === 'Active' ? '#10b981' : '#ef4444' }}>
                                                {user.status}
                                            </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button onClick={() => openModal('EDIT', user)} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px' }}>[Edit]</button>
                                        <button onClick={() => toggleLock(user.id)} style={{ color: user.status === 'Active' ? '#ef4444' : '#10b981', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                            {user.status === 'Active' ? '[Lock]' : '[Unlock]'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL CREATE/EDIT USER - Chuẩn Wireframe */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '500px', border: '2px solid #000', padding: 0 }}>
                        <h3 style={{ textAlign: 'center', background: '#f8fafc', padding: '15px', borderBottom: '1px solid #000', fontWeight: 'bold', margin: 0 }}>
                            {mode === 'ADD' ? 'CREATE USER' : 'EDIT USER'}
                        </h3>
                        <div style={{ padding: '30px' }}>
                            <div className="form-group mb-3" style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                                <label>Username:</label>
                                <input type="text" value={selectedUser.username} onChange={e => setSelectedUser({...selectedUser, username: e.target.value})} style={{ borderBottom: '1px solid #000', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                            </div>
                            <div className="form-group mb-3" style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                                <label>Họ và tên:</label>
                                <input type="text" value={selectedUser.fullName} onChange={e => setSelectedUser({...selectedUser, fullName: e.target.value})} style={{ borderBottom: '1px solid #000', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                            </div>
                            <div className="form-group mb-3" style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                                <label>Email:</label>
                                <input type="email" value={selectedUser.email} onChange={e => setSelectedUser({...selectedUser, email: e.target.value})} style={{ borderBottom: '1px solid #000', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                            </div>
                            <div className="form-group mb-3" style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                                <label>Password:</label>
                                <input type="password" value={selectedUser.password} onChange={e => setSelectedUser({...selectedUser, password: e.target.value})} style={{ borderBottom: '1px solid #000', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />
                            </div>
                            <div className="form-group mb-3" style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                                <label>Role:</label>
                                <select value={selectedUser.role} onChange={e => setSelectedUser({...selectedUser, role: e.target.value})}>
                                    <option>Admin</option>
                                    <option>Kế toán</option>
                                    <option>Nhân viên</option>
                                </select>
                            </div>
                            <div className="form-group mb-4" style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                                <label>Status:</label>
                                <select value={selectedUser.status} onChange={e => setSelectedUser({...selectedUser, status: e.target.value})}>
                                    <option>Active</option>
                                    <option>Locked</option>
                                </select>
                            </div>

                            <div className="d-flex justify-content-center gap-4">
                                <button className="btn-primary" onClick={handleSave} style={{ padding: '10px 40px' }}>[ Save ]</button>
                                <button className="btn-secondary" onClick={() => setShowModal(false)} style={{ padding: '10px 40px', background: 'none', border: 'none', color: '#000' }}>[ Cancel ]</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AccountManagementPage;