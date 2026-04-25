import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function AccountPage() {
    const [accounts, setAccounts] = useState(() => {
        const saved = localStorage.getItem('accountData');
        return saved ? JSON.parse(saved) : [
            { id: 1, username: 'admin_hr', role: 'Quản trị viên', lastLogin: '16/04/2026 14:20', status: 'Hoạt động' }
        ];
    });
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newAccount, setNewAccount] = useState({ username: '', role: 'Quản trị viên', status: 'Hoạt động' });

    useEffect(() => {
        localStorage.setItem('accountData', JSON.stringify(accounts));
    }, [accounts]);

    const handleSaveAccount = (e) => {
        e.preventDefault();
        const newAccWithId = { 
            ...newAccount, 
            id: Date.now(), 
            lastLogin: new Date().toLocaleString('vi-VN') 
        };
        setAccounts([...accounts, newAccWithId]);
        setShowModal(false);
        setNewAccount({ username: '', role: 'Quản trị viên', status: 'Hoạt động' });
    };

    const filteredAccounts = accounts.filter(acc => 
        acc.username && acc.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <div className="header-action" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3>Quản lý tài khoản người dùng</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm tài khoản..." 
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
                                <th>Username</th>
                                <th>Quyền hạn</th>
                                <th>Lần đăng nhập cuối</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAccounts.map(acc => (
                                <tr key={acc.id}>
                                    <td>{acc.username}</td>
                                    <td>{acc.role}</td>
                                    <td>{acc.lastLogin}</td>
                                    <td>
                                        <span className={acc.status === 'Hoạt động' ? 'status-active' : 'status-inactive'} style={acc.status === 'Ngưng hoạt động' ? { color: '#ef4444', backgroundColor: '#fee2e2', padding: '4px 8px', borderRadius: '4px' } : {}}>
                                            {acc.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Thêm Tài Khoản */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Thêm tài khoản mới</h3>
                        <form onSubmit={handleSaveAccount}>
                            <div className="form-group">
                                <label>Username</label>
                                <input type="text" value={newAccount.username} onChange={e => setNewAccount({ ...newAccount, username: e.target.value })} required placeholder="Nhập tên đăng nhập..." />
                            </div>
                            <div className="form-group">
                                <label>Quyền hạn</label>
                                <select value={newAccount.role} onChange={e => setNewAccount({ ...newAccount, role: e.target.value })}>
                                    <option value="Quản trị viên">Quản trị viên</option>
                                    <option value="Kế toán">Kế toán</option>
                                    <option value="Giảng viên">Giảng viên</option>
                                    <option value="Nhân viên">Nhân viên</option>
                                    <option value="Giám đốc">Giám đốc</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Trạng thái</label>
                                <select value={newAccount.status} onChange={e => setNewAccount({ ...newAccount, status: e.target.value })}>
                                    <option value="Hoạt động">Hoạt động</option>
                                    <option value="Ngưng hoạt động">Ngưng hoạt động</option>
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

export default AccountPage;
