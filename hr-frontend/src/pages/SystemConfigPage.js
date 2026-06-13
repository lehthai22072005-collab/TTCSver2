import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function SystemConfigPage() {
    const [config, setConfig] = useState({
        maxLoginAttempts: '5',
        maintenanceMode: 'false',
        emailEnabled: 'false',
        smtpUsername: '',
        smtpPassword: '',
        senderName: 'PTIT HR Management'
    });

    const [testEmail, setTestEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/config');

            setConfig(prev => ({
                ...prev,
                maxLoginAttempts: res.data.maxLoginAttempts || '5',
                maintenanceMode: res.data.maintenanceMode || 'false',
                emailEnabled: res.data.emailEnabled || 'false',
                smtpUsername: res.data.smtpUsername || '',
                smtpPassword: '',
                senderName: res.data.senderName || 'PTIT HR Management'
            }));
        } catch (err) {
            console.error('Lỗi tải cấu hình:', err);
            setIsError(true);
            setMessage('Không thể tải cấu hình từ hệ thống!');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleMaintenance = () => {
        setConfig(prev => ({
            ...prev,
            maintenanceMode: prev.maintenanceMode === 'true' ? 'false' : 'true'
        }));
    };

    const toggleEmail = () => {
        setConfig(prev => ({
            ...prev,
            emailEnabled: prev.emailEnabled === 'true' ? 'false' : 'true'
        }));
    };

    const validateConfig = () => {
        const maxLoginAttempts = Number(config.maxLoginAttempts);

        if (!maxLoginAttempts || maxLoginAttempts < 1) {
            setIsError(true);
            setMessage('Số lần nhập sai tối đa phải từ 1 trở lên!');
            return false;
        }

        if (config.emailEnabled === 'true') {
            if (!config.smtpUsername.trim()) {
                setIsError(true);
                setMessage('Vui lòng nhập Gmail gửi đi!');
                return false;
            }

            if (!config.senderName.trim()) {
                setIsError(true);
                setMessage('Vui lòng nhập tên người gửi!');
                return false;
            }
        }

        return true;
    };

    const saveConfig = async () => {
        const currentUser = localStorage.getItem('username') || 'admin_thai';
        const payload = {
            ...config,
            actionBy: currentUser
        };

        const res = await axios.post(
            '/api/config/update',
            payload
        );

        setConfig(prev => ({
            ...prev,
            smtpPassword: '' // Reset field sau khi lưu để bảo mật
        }));

        return res;
    };

    const handleSave = async () => {
        setMessage('');

        if (!validateConfig()) {
            return;
        }

        try {
            const res = await saveConfig();

            setIsError(false);
            setMessage(res.data.message || 'Đã lưu cấu hình hệ thống thành công!');

            setTimeout(() => {
                setMessage('');
            }, 4000);
        } catch (err) {
            console.error('Lỗi lưu cấu hình:', err);
            setIsError(true);
            setMessage('Không thể lưu cấu hình hệ thống!');
        }
    };

    const handleSendTestEmail = async () => {
        setMessage('');

        if (!validateConfig()) {
            return;
        }

        if (config.emailEnabled !== 'true') {
            setIsError(true);
            setMessage('Bạn cần bật chức năng gửi Email trước!');
            return;
        }

        if (!testEmail.trim()) {
            setIsError(true);
            setMessage('Vui lòng nhập email nhận thử!');
            return;
        }

        try {
            await saveConfig(); // Tự động lưu cấu hình trước khi gửi mail

            const res = await axios.post('/api/email/test', {
                toEmail: testEmail
            });

            setIsError(false);
            setMessage(res.data.message || 'Gửi email thành công!');
        } catch (err) {
            console.error('Lỗi gửi email:', err);
            setIsError(true);
            setMessage(err.response?.data?.message || 'Gửi email thất bại!');
        }
    };

    if (loading) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <div className="main-content">
                    <TopBar />
                    <div style={pageStyle}>
                        <h2 style={pageTitle}>CẤU HÌNH HỆ THỐNG</h2>
                        <div style={loadingBox}>Đang tải cấu hình...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <div className="main-content">
                <TopBar />

                <div style={pageStyle}>
                    <div style={headerRow}>
                        <div>
                            <h2 style={pageTitle}>CẤU HÌNH HỆ THỐNG</h2>
                            <p style={pageSubtitle}>
                                Thiết lập bảo mật, bảo trì và Email/Gmail cho hệ thống HR Management.
                            </p>
                        </div>

                        <div style={headerBadges}>
                            <div
                                style={{
                                    ...statusBadge,
                                    backgroundColor: config.maintenanceMode === 'true' ? '#fff1f0' : '#e6fff5',
                                    color: config.maintenanceMode === 'true' ? '#ff5630' : '#05a66b',
                                    borderColor: config.maintenanceMode === 'true' ? '#ff5630' : '#05cd99'
                                }}
                            >
                                {config.maintenanceMode === 'true' ? 'ĐANG BẢO TRÌ' : 'ĐANG HOẠT ĐỘNG'}
                            </div>

                            <div
                                style={{
                                    ...statusBadge,
                                    backgroundColor: config.emailEnabled === 'true' ? '#eef2ff' : '#f1f5f9',
                                    color: config.emailEnabled === 'true' ? '#4318ff' : '#64748b',
                                    borderColor: config.emailEnabled === 'true' ? '#4318ff' : '#cbd5e1'
                                }}
                            >
                                {config.emailEnabled === 'true' ? 'EMAIL BẬT' : 'EMAIL TẮT'}
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div
                            style={{
                                ...messageBox,
                                backgroundColor: isError ? '#fff1f0' : '#e6fff5',
                                color: isError ? '#ff5630' : '#05a66b',
                                borderColor: isError ? '#ff5630' : '#05cd99'
                            }}
                        >
                            {message}
                        </div>
                    )}

                    <div style={gridStyle}>

                        {/* Thẻ Lần nhập sai tối đa (Đã mở rộng full width) */}
                        <div style={{ ...cardStyle, ...wideCard }}>
                            <div style={iconBox}>🛡️</div>
                            <h3 style={cardTitle}>Lần nhập sai tối đa</h3>
                            <p style={cardDesc}>
                                Giới hạn số lần đăng nhập sai trước khi tài khoản bị chặn tạm thời.
                            </p>

                            <label style={labelStyle}>Số lần nhập sai:</label>
                            <input
                                type="number"
                                min="1"
                                name="maxLoginAttempts"
                                value={config.maxLoginAttempts}
                                onChange={handleChange}
                                style={inputStyle}
                            />

                            <div style={hintStyle}>
                                Ví dụ: đặt 5 nghĩa là sai 5 lần sẽ bị khóa đăng nhập.
                            </div>
                        </div>

                        {/* Thẻ Chế độ bảo trì */}
                        <div style={{ ...cardStyle, ...wideCard }}>
                            <div style={sectionHeader}>
                                <div>
                                    <div style={iconBox}>⚙️</div>
                                    <h3 style={cardTitle}>Chế độ bảo trì</h3>
                                    <p style={cardDesc}>
                                        Khi bật bảo trì, chỉ tài khoản Admin được đăng nhập vào hệ thống.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={toggleMaintenance}
                                    style={{
                                        ...toggleButton,
                                        backgroundColor: config.maintenanceMode === 'true' ? '#ff5630' : '#e2e8f0',
                                        color: config.maintenanceMode === 'true' ? '#fff' : '#64748b'
                                    }}
                                >
                                    {config.maintenanceMode === 'true' ? 'ĐANG BẬT' : 'ĐANG TẮT'}
                                </button>
                            </div>

                            <div
                                style={{
                                    ...infoBox,
                                    backgroundColor: config.maintenanceMode === 'true' ? '#fff1f0' : '#f8fafc',
                                    color: config.maintenanceMode === 'true' ? '#c2410c' : '#64748b'
                                }}
                            >
                                {config.maintenanceMode === 'true'
                                    ? 'Hệ thống đang bảo trì. Giảng viên, kế toán và ban giám hiệu sẽ bị chặn đăng nhập.'
                                    : 'Hệ thống đang hoạt động bình thường.'}
                            </div>
                        </div>

                        {/* Thẻ Cấu hình Email */}
                        <div style={{ ...cardStyle, ...wideCard }}>
                            <div style={sectionHeader}>
                                <div>
                                    <div style={iconBox}>📧</div>
                                    <h3 style={cardTitle}>Cấu hình Email/Gmail</h3>
                                    <p style={cardDesc}>
                                        Dùng để gửi email thông báo cấp tài khoản và gửi phiếu lương PDF tự động cho nhân viên.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={toggleEmail}
                                    style={{
                                        ...toggleButton,
                                        backgroundColor: config.emailEnabled === 'true' ? '#4318ff' : '#e2e8f0',
                                        color: config.emailEnabled === 'true' ? '#fff' : '#64748b'
                                    }}
                                >
                                    {config.emailEnabled === 'true' ? 'EMAIL ĐANG BẬT' : 'EMAIL ĐANG TẮT'}
                                </button>
                            </div>

                            <div style={emailGrid}>
                                <div style={formGroup}>
                                    <label style={labelStyle}>Gmail gửi đi:</label>
                                    <input
                                        type="email"
                                        name="smtpUsername"
                                        value={config.smtpUsername}
                                        onChange={handleChange}
                                        placeholder="ptit.hr.management@gmail.com"
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={formGroup}>
                                    <label style={labelStyle}>App Password Gmail:</label>
                                    <input
                                        type="password"
                                        name="smtpPassword"
                                        value={config.smtpPassword}
                                        onChange={handleChange}
                                        placeholder="Để trống nếu không đổi"
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={formGroup}>
                                    <label style={labelStyle}>Tên người gửi:</label>
                                    <input
                                        type="text"
                                        name="senderName"
                                        value={config.senderName}
                                        onChange={handleChange}
                                        placeholder="PTIT HR Management"
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={formGroup}>
                                    <label style={labelStyle}>Email nhận thử:</label>
                                    <input
                                        type="email"
                                        value={testEmail}
                                        onChange={(e) => setTestEmail(e.target.value)}
                                        placeholder="test.employee@gmail.com"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            <div style={emailActionRow}>
                                <button onClick={handleSendTestEmail} style={testEmailButton}>
                                    GỬI EMAIL
                                </button>
                            </div>

                            <div style={emailNote}>
                                Gmail cần dùng App Password, không dùng mật khẩu Gmail thật.
                                Hệ thống dùng mặc định SMTP Host là smtp.gmail.com và Port là 587.
                                App Password sẽ không hiển thị lại sau khi lưu để bảo mật.
                            </div>
                        </div>
                    </div>

                    <div style={actionRow}>
                        <button onClick={fetchConfig} style={secondaryButton}>
                            TẢI LẠI
                        </button>

                        <button onClick={handleSave} style={saveButton}>
                            LƯU CẤU HÌNH
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const pageStyle = { padding: '32px', backgroundColor: '#f4f7fe', minHeight: '100vh' };
const headerRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', gap: '20px' };
const headerBadges = { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' };
const pageTitle = { color: '#1b2559', fontWeight: '800', fontSize: '28px', margin: 0, letterSpacing: '0.5px' };
const pageSubtitle = { color: '#64748b', marginTop: '8px', fontSize: '15px' };
const statusBadge = { padding: '12px 18px', borderRadius: '999px', fontWeight: '800', border: '1px solid', fontSize: '14px', minWidth: '130px', textAlign: 'center' };
const messageBox = { padding: '15px 18px', marginBottom: '24px', borderRadius: '14px', fontWeight: '700', border: '1px solid', textAlign: 'center' };
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr', gap: '28px' }; // Đổi thành 1 cột
const cardStyle = { backgroundColor: '#fff', borderRadius: '22px', padding: '30px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.10)', border: '1px solid #eef2f7' };
const wideCard = { gridColumn: '1 / span 1' };
const iconBox = { width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#f4f7fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '18px' };
const cardTitle = { color: '#1b2559', fontSize: '22px', fontWeight: '800', margin: '0 0 10px 0' };
const cardDesc = { color: '#64748b', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' };
const labelStyle = { display: 'block', color: '#2b3674', fontWeight: '700', marginBottom: '10px' };
const inputStyle = { width: '100%', padding: '15px 16px', borderRadius: '14px', border: '1px solid #cbd5e1', outline: 'none', color: '#1b2559', fontWeight: '700', fontSize: '16px', boxSizing: 'border-box' };
const hintStyle = { marginTop: '12px', color: '#94a3b8', fontSize: '14px' };
const sectionHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '30px' };
const toggleButton = { minWidth: '170px', padding: '16px 28px', borderRadius: '14px', border: 'none', fontWeight: '900', cursor: 'pointer', fontSize: '15px', letterSpacing: '0.5px' };
const infoBox = { marginTop: '20px', padding: '15px 18px', borderRadius: '14px', fontWeight: '700' };
const emailGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px', marginTop: '10px' };
const formGroup = { marginBottom: '4px' };
const emailActionRow = { display: 'flex', justifyContent: 'flex-end', marginTop: '22px' };
const testEmailButton = { backgroundColor: '#05cd99', color: '#fff', padding: '13px 28px', borderRadius: '12px', border: 'none', fontWeight: '800', cursor: 'pointer' };
const emailNote = { marginTop: '18px', padding: '14px 16px', borderRadius: '14px', backgroundColor: '#f8fafc', color: '#64748b', fontWeight: '600', fontSize: '14px' };
const actionRow = { display: 'flex', justifyContent: 'center', gap: '18px', marginTop: '36px', paddingBottom: '40px' };
const saveButton = { backgroundColor: '#4318ff', color: '#fff', padding: '15px 42px', borderRadius: '14px', border: 'none', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0px 10px 20px rgba(67, 24, 255, 0.22)' };
const secondaryButton = { backgroundColor: '#e2e8f0', color: '#475569', padding: '15px 34px', borderRadius: '14px', border: 'none', fontWeight: '800', fontSize: '16px', cursor: 'pointer' };
const loadingBox = { backgroundColor: '#fff', padding: '30px', borderRadius: '20px', color: '#64748b', fontWeight: '700', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.10)' };

export default SystemConfigPage;
