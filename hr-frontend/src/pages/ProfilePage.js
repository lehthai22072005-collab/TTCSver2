import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function ProfilePage() {
    const [showModal, setShowModal] = useState(false);
    const [profile, setProfile] = useState({
        id: 'GV001',
        fullName: 'Nguyễn Văn A',
        email: 'a@gmail.com',
        phone: '0123456789'
    });

    const [editData, setEditData] = useState({ ...profile });

    const handleSave = () => {
        setProfile({ ...editData });
        setShowModal(false);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '30px' }}>
                        <h2 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Thông tin cá nhân</h2>
                    </div>

                    <div style={{ lineHeight: '2.5', fontSize: '1.1rem' }}>
                        {/* Đã bỏ chữ readonly */}
                        <p>Mã NV: <b style={{ marginLeft: '45px' }}>{profile.id}</b></p>
                        <p>Họ và tên: <span style={{ marginLeft: '25px' }}>{profile.fullName}</span></p>
                        <p>Email: <span style={{ marginLeft: '50px' }}>{profile.email}</span></p>
                        <p>SĐT: <span style={{ marginLeft: '62px' }}>{profile.phone}</span></p>

                        <div style={{ marginTop: '30px' }}>
                            <button
                                className="btn-primary"
                                onClick={() => setShowModal(true)}
                                style={{ padding: '10px 30px', borderRadius: '4px' }}
                            >
                                [ Chỉnh sửa ]
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '500px', border: '2px solid #000', padding: 0 }}>
                        <h3 style={{ textAlign: 'center', background: '#f8fafc', padding: '15px', borderBottom: '1px solid #000', fontWeight: 'bold', margin: 0 }}>
                            CẬP NHẬT THÔNG TIN
                        </h3>
                        <div style={{ padding: '40px' }}>
                            <div className="form-group mb-4" style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center' }}>
                                <label>Email:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editData.email}
                                    onChange={e => setEditData({...editData, email: e.target.value})}
                                    style={{ border: 'none', borderBottom: '1px solid #000', borderRadius: 0 }}
                                />
                            </div>
                            <div className="form-group mb-5" style={{ display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center' }}>
                                <label>SĐT:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editData.phone}
                                    onChange={e => setEditData({...editData, phone: e.target.value})}
                                    style={{ border: 'none', borderBottom: '1px solid #000', borderRadius: 0 }}
                                />
                            </div>

                            <div className="d-flex justify-content-between px-4">
                                <button className="btn-primary" onClick={handleSave} style={{ padding: '10px 40px' }}>
                                    [ Lưu ]
                                </button>
                                <button className="btn-secondary" onClick={() => setShowModal(false)} style={{ padding: '10px 40px', background: 'none', border: 'none', color: '#000' }}>
                                    [ Hủy ]
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;