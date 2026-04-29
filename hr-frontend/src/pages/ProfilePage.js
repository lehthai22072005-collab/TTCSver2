import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function ProfilePage() {
    const [userProfile, setUserProfile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({ fullName: '', email: '', phone: '' });

    const currentUsername = localStorage.getItem("username") || "Hong_Thai";

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/profile/${currentUsername}`);
            setUserProfile(res.data);
            // Cập nhật dữ liệu vào form chỉnh sửa
            setEditData({
                fullName: res.data.fullName,
                email: res.data.email,
                phone: res.data.phone
            });
        } catch (err) {
            console.error("Lỗi lấy thông tin:", err);
        }
    };

    useEffect(() => { fetchProfile(); }, [currentUsername]);

    // HÀM XỬ LÝ LƯU THÔNG TIN MỚI
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Gọi API Update của nhân viên (sử dụng ID của profile hiện tại)
            await axios.put(`http://localhost:8080/api/employees/${userProfile.id}`, {
                ...userProfile, // Giữ lại các trường cũ (phòng ban, chức vụ...)
                fullName: editData.fullName,
                email: editData.email,
                phone: editData.phone
            });
            alert("✅ Đã cập nhật thông tin cá nhân thành công!");
            setShowModal(false);
            fetchProfile(); // Tải lại dữ liệu mới
        } catch (err) {
            alert("❌ Lỗi cập nhật: " + err.message);
        }
    };

    if (!userProfile) return <div style={{padding: '50px', textAlign: 'center'}}>Đang tải...</div>;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '40px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '30px' }}>THÔNG TIN CÁ NHÂN</h2>

                    <div style={profileCardStyle}>
                        <div style={headerStyle}>
                            <div style={avatarStyle}>
                                {userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div style={{ marginLeft: '25px' }}>
                                <h2 style={{ margin: 0 }}>{userProfile.fullName}</h2>
                                <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>{userProfile.position}</p>
                            </div>
                        </div>

                        <div style={infoGridStyle}>
                            <div style={infoItemStyle}>
                                <label style={labelStyle}>Mã nhân viên</label>
                                <div style={valueStyle}>NV{userProfile.id}</div>
                            </div>
                            <div style={infoItemStyle}>
                                <label style={labelStyle}>Trạng thái tài khoản</label>
                                <div style={{ ...valueStyle, color: '#05cd99' }}>Đang hoạt động</div>
                            </div>
                            <div style={infoItemStyle}>
                                <label style={labelStyle}>Email liên hệ</label>
                                <div style={valueStyle}>{userProfile.email}</div>
                            </div>
                            <div style={infoItemStyle}>
                                <label style={labelStyle}>Số điện thoại</label>
                                <div style={valueStyle}>{userProfile.phone}</div>
                            </div>
                        </div>

                        <div style={{ textAlign: 'right', padding: '0 40px 40px 0' }}>
                            {/* KÍCH HOẠT NÚT CHỈNH SỬA */}
                            <button onClick={() => setShowModal(true)} style={btnEditStyle}>Chỉnh sửa thông tin</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL CHỈNH SỬA THÔNG TIN NHANH */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '450px', borderRadius: '20px' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>CẬP NHẬT THÔNG TIN</h3>
                        <form onSubmit={handleUpdate}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={modalLabel}>Họ và tên:</label>
                                <input
                                    style={modalInput}
                                    value={editData.fullName}
                                    onChange={e => setEditData({...editData, fullName: e.target.value})}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={modalLabel}>Email:</label>
                                <input
                                    style={modalInput}
                                    value={editData.email}
                                    onChange={e => setEditData({...editData, email: e.target.value})}
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={modalLabel}>Số điện thoại:</label>
                                <input
                                    style={modalInput}
                                    value={editData.phone}
                                    onChange={e => setEditData({...editData, phone: e.target.value})}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <button type="submit" style={btnSaveStyle}>Lưu thay đổi</button>
                                <button type="button" onClick={() => setShowModal(false)} style={btnCancelStyle}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- CSS Styles ---
const profileCardStyle = { backgroundColor: '#fff', borderRadius: '25px', overflow: 'hidden', boxShadow: '0px 20px 50px rgba(112, 144, 176, 0.15)' };
const headerStyle = { background: 'linear-gradient(90deg, #4318ff 0%, #5e3aff 100%)', padding: '50px 40px', color: '#fff', display: 'flex', alignItems: 'center' };
const avatarStyle = { width: '90px', height: '90px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2.5rem', fontWeight: 'bold', border: '3px solid #fff' };
const infoGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '40px', gap: '40px' };
const infoItemStyle = { borderBottom: '2px solid #f4f7fe', paddingBottom: '15px' };
const labelStyle = { color: '#a3aed0', fontSize: '0.95rem', marginBottom: '10px', display: 'block' };
const valueStyle = { color: '#1b2559', fontWeight: '800', fontSize: '1.2rem' };
const btnEditStyle = { padding: '12px 35px', backgroundColor: '#4318ff', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' };
const modalLabel = { display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#4a5568' };
const modalInput = { width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' };
const btnSaveStyle = { padding: '10px 25px', backgroundColor: '#4318ff', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' };
const btnCancelStyle = { padding: '10px 25px', backgroundColor: '#edf2f7', border: 'none', borderRadius: '10px', cursor: 'pointer' };

export default ProfilePage;