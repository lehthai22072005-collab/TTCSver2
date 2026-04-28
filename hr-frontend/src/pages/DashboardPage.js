import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

// --- DỮ LIỆU MẪU ---
const adminChartData = [{ name: 'T2', users: 40 }, { name: 'T3', users: 30 }, { name: 'T4', users: 20 }, { name: 'T5', users: 60 }, { name: 'T6', users: 50 }, { name: 'T7', users: 90 }];
const accountantData = [{ name: 'Tháng 1', Lương: 40, Phụ_Cấp: 5 }, { name: 'Tháng 2', Lương: 42, Phụ_Cấp: 5.5 }, { name: 'Tháng 3', Lương: 45, Phụ_Cấp: 6 }];
const teacherData = [{ name: 'Tuần 1', tiet: 10 }, { name: 'Tuần 2', tiet: 15 }, { name: 'Tuần 3', tiet: 8 }, { name: 'Tuần 4', tiet: 12 }];

// Dữ liệu chung cho Nhân viên (Lao công, Bảo vệ, Hành chính)
const staffCommonData = [
    { name: 'Tuần 1', ngayCong: 6 }, { name: 'Tuần 2', ngayCong: 5 },
    { name: 'Tuần 3', ngayCong: 6 }, { name: 'Tuần 4', ngayCong: 5 }
];

const personnelDynamicData = [{ name: 'T1', tuyenMoi: 5, nghiViec: 2 }, { name: 'T2', tuyenMoi: 8, nghiViec: 1 }, { name: 'T3', tuyenMoi: 12, nghiViec: 4 }, { name: 'T4', tuyenMoi: 10, nghiViec: 2 }];
const salaryFundData = [{ name: 'T1', quyLuong: 1.1 }, { name: 'T2', quyLuong: 1.15 }, { name: 'T3', quyLuong: 1.2 }, { name: 'T4', quyLuong: 1.25 }];

function DashboardPage() {
    const role = localStorage.getItem('role');

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <h2 className="mb-4" style={{fontWeight: 'bold', textTransform: 'uppercase'}}>
                        DASHBOARD {role === 'STAFF' ? 'NHÂN VIÊN' : role}
                    </h2>

                    {/* 1. GIAO DIỆN ADMIN */}
                    {role === 'ADMIN' && (
                        <>
                            <div className="stats-grid">
                                <div className="stat-card border-blue"><p>[Card] Tổng User Active</p><h4>1,250</h4></div>
                                <div className="stat-card border-green"><p>[Card] User Online</p><h4>85</h4></div>
                                <div className="stat-card border-red"><p>[Card] User Locked</p><h4>12</h4></div>
                                <div className="stat-card border-orange"><p>[Card] Request hôm nay</p><h4>4,800</h4></div>
                            </div>
                            <div className="card shadow-sm p-4 mt-4">
                                <h4 className="mb-4">Biểu đồ người dùng hệ thống</h4>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={adminChartData}>
                                        <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip />
                                        <Bar dataKey="users" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    )}

                    {/* 2. GIAO DIỆN KẾ TOÁN */}
                    {role === 'ACCOUNTANT' && (
                        <>
                            <div className="stats-grid">
                                <div className="stat-card border-blue"><p>TỔNG SỐ NHÂN SỰ</p><h4>50 người</h4></div>
                                <div className="stat-card border-green"><p>QUỸ LƯƠNG THÁNG NÀY</p><h4>51,500,000đ</h4></div>
                            </div>
                            <div className="card shadow-sm p-4 mt-4">
                                <h4 className="mb-4">Biến động chi phí lương (triệu VNĐ)</h4>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={accountantData}>
                                        <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><Tooltip /><Legend />
                                        <Bar dataKey="Lương" fill="#4f46e5" /><Bar dataKey="Phụ_Cấp" fill="#10b981" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    )}

                    {/* 3. GIAO DIỆN GIẢNG VIÊN (TEACHER) */}
                    {role === 'TEACHER' && (
                        <>
                            <div className="stats-grid">
                                <div className="stat-card border-blue">
                                    <p>SỐ TIẾT DẠY THÁNG NÀY</p>
                                    <h4>40 tiết</h4>
                                </div>
                                <div className="stat-card border-green">
                                    <p>LƯƠNG DỰ KIẾN</p>
                                    <h4>11,000,000đ</h4>
                                </div>
                            </div>
                            <div className="card shadow-sm p-4 mt-4">
                                <h4 className="mb-3">Biểu đồ tiết dạy theo tuần</h4>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={teacherData}>
                                        <XAxis dataKey="name" /><Tooltip />
                                        <Bar dataKey="tiet" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    )}

                    {/* 4. GIAO DIỆN DÙNG CHUNG CHO NHÂN VIÊN (STAFF: Bảo vệ, Lao công, Tạp vụ...) */}
                    {role === 'STAFF' && (
                        <>
                            <div className="stats-grid">
                                <div className="stat-card border-blue">
                                    <p>SỐ NGÀY CÔNG THÁNG NÀY</p>
                                    <h4>22 ngày</h4>
                                </div>
                                <div className="stat-card border-orange">
                                    <p>TRẠNG THÁI CHẤM CÔNG</p>
                                    <h4 style={{color: '#10b981'}}>Hôm nay: Đã điểm danh</h4>
                                </div>
                            </div>
                            <div className="card shadow-sm p-4 mt-4">
                                <h4 className="mb-3">Biểu đồ chuyên cần (Số ngày làm việc/tuần)</h4>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={staffCommonData}>
                                        <XAxis dataKey="name" /><Tooltip />
                                        <Bar dataKey="ngayCong" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="card shadow-sm p-4 mt-4 text-center">
                                <h4 style={{color: '#64748b'}}>Xin chào cán bộ nhân viên!</h4>
                                <p>Bạn có thể kiểm tra phiếu lương và gửi đơn xin nghỉ phép ở thực đơn bên trái.</p>
                            </div>
                        </>
                    )}

                    {/* 5. GIAO DIỆN BAN GIÁM HIỆU (DIRECTOR) */}
                    {role === 'DIRECTOR' && (
                        <>
                            <div className="stats-grid mb-4">
                                <div className="stat-card border-blue"><p>[Card] Tổng nhân sự:</p><h4>120 người</h4></div>
                                <div className="stat-card border-green"><p>[Card] Tuyển mới tháng:</p><h4 style={{ color: '#10b981' }}>+10</h4></div>
                                <div className="stat-card border-red"><p>[Card] Nghỉ việc tháng:</p><h4 style={{ color: '#ef4444' }}>-3</h4></div>
                                <div className="stat-card border-orange"><p>[Card] Quỹ lương tháng:</p><h4>1.2 tỷ</h4></div>
                            </div>
                            <div className="card shadow-sm p-4 mb-4">
                                <h4 className="mb-4">Biểu đồ biến động nhân sự (Line Chart)</h4>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={personnelDynamicData}>
                                        <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend />
                                        <Line type="monotone" dataKey="tuyenMoi" stroke="#10b981" name="Tuyển mới" strokeWidth={2} />
                                        <Line type="monotone" dataKey="nghiViec" stroke="#ef4444" name="Nghỉ việc" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="card shadow-sm p-4">
                                <h4 className="mb-4">Biểu đồ quỹ lương theo tháng (Bar Chart)</h4>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={salaryFundData}>
                                        <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip />
                                        <Bar dataKey="quyLuong" fill="#4f46e5" name="Quỹ lương (tỷ VNĐ)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    )}

                    {/* --- PHẦN THÔNG BÁO CHUNG --- */}
                    <div className="card shadow-sm p-4 mt-4">
                        <h4 className="mb-3">{role === 'ADMIN' ? 'System Logs' : 'Thông báo hệ thống'}</h4>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">- [Hệ thống] Bảo trì định kỳ vào Chủ Nhật tuần này.</li>
                            <li className="list-group-item">- [Lương] Đã chốt bảng lương tháng 03/2026.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;