import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function SystemConfigPage() {
    // Quản lý trạng thái cấu hình để các nút có thể tương tác
    const [config, setConfig] = useState({
        serverIp: '192.168.1.100',
        port: '8080',
        cacheLimit: '512',
        sessionTimeout: '30',
        minPassword: '8',
        maxFailed: '5',
        smtpServer: 'smtp.gmail.com',
        encryption: 'SSL/TLS',
        backupFreq: 'Theo ngày',
        maintenanceMode: false
    });

    // Hàm xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig({ ...config, [name]: value });
    };

    // Hàm xử lý lưu cấu hình
    const handleSave = () => {
        console.log("Saving system configuration:", config);
        alert("✅ Hệ thống: Đã lưu các thông số hạ tầng và bảo mật thành công!");
    };

    // Hàm bật/tắt chế độ bảo trì
    const toggleMaintenance = () => {
        setConfig({ ...config, maintenanceMode: !config.maintenanceMode });
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ backgroundColor: '#f4f7fe', minHeight: '100vh', padding: '30px' }}>

                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <h2 style={{ fontWeight: 'bold', color: '#1b2559', marginBottom: '30px', textTransform: 'uppercase' }}>
                            Cấu hình hệ thống (IT ADMIN)
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>

                            {/* Khối 1: Kết nối & Server */}
                            <section style={cardStyle}>
                                <h5 style={headerStyle}>1. Kết nối & Server</h5>
                                <div style={rowStyle}>
                                    <label style={labelStyle}>Địa chỉ Máy chủ (IP):</label>
                                    <input name="serverIp" style={inputStyle} value={config.serverIp} onChange={handleChange} />
                                </div>
                                <div style={rowStyle}>
                                    <label style={labelStyle}>Cổng (Port):</label>
                                    <input name="port" style={inputStyle} value={config.port} onChange={handleChange} />
                                </div>
                                <div style={rowStyle}>
                                    <label style={labelStyle}>Cache Limit (MB):</label>
                                    <input name="cacheLimit" type="number" style={inputStyle} value={config.cacheLimit} onChange={handleChange} />
                                </div>
                            </section>

                            {/* Khối 2: Bảo mật & Tài khoản */}
                            <section style={cardStyle}>
                                <h5 style={headerStyle}>2. Bảo mật hệ thống</h5>
                                <div style={rowStyle}>
                                    <label style={labelStyle}>Hết hạn phiên (Phút):</label>
                                    <input name="sessionTimeout" type="number" style={inputStyle} value={config.sessionTimeout} onChange={handleChange} />
                                </div>
                                <div style={rowStyle}>
                                    <label style={labelStyle}>Mật khẩu tối thiểu:</label>
                                    <input name="minPassword" type="number" style={inputStyle} value={config.minPassword} onChange={handleChange} />
                                </div>
                                <div style={rowStyle}>
                                    <label style={labelStyle}>Lần nhập sai tối đa:</label>
                                    <input name="maxFailed" type="number" style={inputStyle} value={config.maxFailed} onChange={handleChange} />
                                </div>
                            </section>

                            {/* Khối 3: Email (SMTP) */}
                            <section style={cardStyle}>
                                <h5 style={headerStyle}>3. Cấu hình Email (SMTP)</h5>
                                <div style={rowStyle}>
                                    <label style={labelStyle}>SMTP Server:</label>
                                    <input name="smtpServer" style={inputStyle} value={config.smtpServer} onChange={handleChange} />
                                </div>
                                <div style={rowStyle}>
                                    <label style={labelStyle}>Phương thức mã hóa:</label>
                                    <select name="encryption" style={inputStyle} value={config.encryption} onChange={handleChange}>
                                        <option>SSL/TLS</option>
                                        <option>STARTTLS</option>
                                        <option>NONE</option>
                                    </select>
                                </div>
                            </section>

                            {/* Khối 4: Bảo trì & Sao lưu */}
                            <section style={cardStyle}>
                                <h5 style={headerStyle}>4. Bảo trì & Sao lưu</h5>
                                <div style={rowStyle}>
                                    <label style={labelStyle}>Tự động sao lưu:</label>
                                    <select name="backupFreq" style={inputStyle} value={config.backupFreq} onChange={handleChange}>
                                        <option>Theo ngày</option>
                                        <option>Theo tuần</option>
                                        <option>Theo tháng</option>
                                    </select>
                                </div>
                                <div style={{ ...rowStyle, marginTop: '20px' }}>
                                    <label style={labelStyle}>Chế độ bảo trì:</label>
                                    <button
                                        onClick={toggleMaintenance}
                                        style={{
                                            ...btnBase,
                                            backgroundColor: config.maintenanceMode ? '#ef4444' : '#e2e8f0',
                                            color: config.maintenanceMode ? '#fff' : '#475569',
                                            width: '120px'
                                        }}
                                    >
                                        {config.maintenanceMode ? 'ĐANG BẬT' : 'ĐANG TẮT'}
                                    </button>
                                </div>
                            </section>
                        </div>

                        {/* Nút lưu tổng thể */}
                        <div style={{ textAlign: 'center', marginTop: '40px' }}>
                            <button onClick={handleSave} style={btnMainStyle}>
                                LƯU CẤU HÌNH HỆ THỐNG
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Styles chuyên nghiệp ---
const cardStyle = {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0'
};

const headerStyle = {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#2b3674',
    borderBottom: '2px solid #f4f7fe',
    paddingBottom: '15px',
    marginBottom: '20px'
};

const rowStyle = {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column'
};

const labelStyle = {
    fontSize: '0.9rem',
    color: '#707eae',
    marginBottom: '8px',
    fontWeight: '500'
};

const inputStyle = {
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    color: '#1b2559',
    outline: 'none',
    backgroundColor: '#fcfcfc'
};

const btnBase = {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

const btnMainStyle = {
    padding: '15px 40px',
    backgroundColor: '#4318ff',
    color: '#fff',
    borderRadius: '12px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 10px 15px -3px rgba(67, 24, 255, 0.3)',
    transition: 'transform 0.2s'
};

export default SystemConfigPage;