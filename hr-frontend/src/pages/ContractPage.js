import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function ContractPage() {
    const [contracts, setContracts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newContract, setNewContract] = useState({ contractNo: '', employeeName: '', type: '1 năm', startDate: '', status: 'Đang hiệu lực' });

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            const res = await axios.get("/api/contracts");
            setContracts(res.data);
        } catch (err) {
            console.error("Lỗi tải danh sách hợp đồng:", err);
        }
    };

    const handleSaveContract = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/contracts", newContract);
            alert("Thêm hợp đồng thành công!");
            setShowModal(false);
            setNewContract({ contractNo: '', employeeName: '', type: '1 năm', startDate: '', status: 'Đang hiệu lực' });
            fetchContracts();
        } catch (err) {
            console.error("Lỗi khi thêm hợp đồng:", err);
            alert("Lưu thất bại!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa hợp đồng này?")) {
            try {
                await axios.delete(`/api/contracts/${id}`);
                alert("Xóa thành công!");
                fetchContracts();
            } catch (err) {
                console.error("Lỗi khi xóa hợp đồng:", err);
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
                        <h3>Quản lý hợp đồng lao động</h3>
                        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Tạo hợp đồng mới</button>
                    </div>
                    <div className="card-info shadow-sm" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '8px' }}>
                        <p>Danh sách hợp đồng sắp hết hạn: <strong>0</strong></p>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Mã HĐ</th>
                                <th>Nhân viên</th>
                                <th>Loại hợp đồng</th>
                                <th>Ngày ký</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contracts.map(contract => (
                                <tr key={contract.id}>
                                    <td className="font-bold" style={{ fontWeight: 'bold' }}>{contract.contractNo}</td>
                                    <td>{contract.employeeName}</td>
                                    <td>{contract.type}</td>
                                    <td>{contract.startDate}</td>
                                    <td>
                                        <span className={contract.status === "Đang hiệu lực" ? "status-active" : ""}>
                                            {contract.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleDelete(contract.id)}>Xoá</button>
                                    </td>
                                </tr>
                            ))}
                            {contracts.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Chưa có hợp đồng nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Thêm Hợp Đồng */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Tạo hợp đồng mới</h3>
                        <form onSubmit={handleSaveContract}>
                            <div className="form-group">
                                <label>Mã Hợp Đồng</label>
                                <input type="text" value={newContract.contractNo} onChange={e => setNewContract({ ...newContract, contractNo: e.target.value })} required placeholder="VD: HD-002" />
                            </div>
                            <div className="form-group">
                                <label>Tên Nhân Viên</label>
                                <input type="text" value={newContract.employeeName} onChange={e => setNewContract({ ...newContract, employeeName: e.target.value })} required placeholder="Nhập tên nhân viên..." />
                            </div>
                            <div className="form-group">
                                <label>Loại hợp đồng</label>
                                <select value={newContract.type} onChange={e => setNewContract({ ...newContract, type: e.target.value })}>
                                    <option value="1 năm">1 năm</option>
                                    <option value="3 năm">3 năm</option>
                                    <option value="Vô thời hạn">Vô thời hạn</option>
                                    <option value="Thử việc">Thử việc</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Ngày ký</label>
                                <input type="date" value={newContract.startDate} onChange={e => setNewContract({ ...newContract, startDate: e.target.value })} required />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                                <button type="submit" className="btn-primary">Lưu hợp đồng</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ContractPage;
