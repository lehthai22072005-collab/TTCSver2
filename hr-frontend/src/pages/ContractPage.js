import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function ContractPage() {
    const [contracts, setContracts] = useState(() => {
        const saved = localStorage.getItem('contractData');
        return saved ? JSON.parse(saved) : [
            { id: 1, maHD: 'HD-001', nhanVien: 'Nguyễn Văn A', loaiHopDong: 'Vô thời hạn', ngayKy: '01/01/2024', trangThai: 'Đang hiệu lực' }
        ];
    });
    const [showModal, setShowModal] = useState(false);
    const [newContract, setNewContract] = useState({ maHD: '', nhanVien: '', loaiHopDong: '1 năm', ngayKy: '', trangThai: 'Đang hiệu lực' });

    useEffect(() => {
        localStorage.setItem('contractData', JSON.stringify(contracts));
    }, [contracts]);

    const handleSaveContract = (e) => {
        e.preventDefault();
        const contractWithId = { ...newContract, id: Date.now() };
        setContracts([...contracts, contractWithId]);
        setShowModal(false);
        setNewContract({ maHD: '', nhanVien: '', loaiHopDong: '1 năm', ngayKy: '', trangThai: 'Đang hiệu lực' });
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <div className="header-action">
                        <h3>Quản lý hợp đồng lao động</h3>
                        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Tạo hợp đồng mới</button>
                    </div>
                    <div className="card-info shadow-sm">
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
                            </tr>
                        </thead>
                        <tbody>
                            {contracts.map(contract => (
                                <tr key={contract.id}>
                                    <td className="font-bold">{contract.maHD}</td>
                                    <td>{contract.nhanVien}</td>
                                    <td>{contract.loaiHopDong}</td>
                                    <td>{contract.ngayKy}</td>
                                    <td>
                                        <span className={contract.trangThai === "Đang hiệu lực" ? "status-active" : ""}>
                                            {contract.trangThai}
                                        </span>
                                    </td>
                                </tr>
                            ))}
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
                                <input type="text" value={newContract.maHD} onChange={e => setNewContract({ ...newContract, maHD: e.target.value })} required placeholder="VD: HD-002" />
                            </div>
                            <div className="form-group">
                                <label>Tên Nhân Viên</label>
                                <input type="text" value={newContract.nhanVien} onChange={e => setNewContract({ ...newContract, nhanVien: e.target.value })} required placeholder="Nhập tên nhân viên..." />
                            </div>
                            <div className="form-group">
                                <label>Loại hợp đồng</label>
                                <select value={newContract.loaiHopDong} onChange={e => setNewContract({ ...newContract, loaiHopDong: e.target.value })}>
                                    <option value="1 năm">1 năm</option>
                                    <option value="3 năm">3 năm</option>
                                    <option value="Vô thời hạn">Vô thời hạn</option>
                                    <option value="Thử việc">Thử việc</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Ngày ký</label>
                                <input type="date" value={newContract.ngayKy} onChange={e => setNewContract({ ...newContract, ngayKy: e.target.value })} required />
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
