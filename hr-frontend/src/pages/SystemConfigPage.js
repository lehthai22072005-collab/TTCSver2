import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function SystemConfigPage() {
    // 1. Khởi tạo State để quản lý dữ liệu nhập vào
    const [config, setConfig] = useState({
        baseSalary: '1,800,000',
        standardDays: '26',
        insurance: '10.5',
        unitPrice: '150,000'
    });

    // 2. Hàm xử lý khi nhấn nút Lưu
    const handleSave = () => {
        // Sau này bạn có thể gọi API axios.post ở đây để lưu vào Database
        console.log("Dữ liệu gửi đi:", config);
        alert("✔️ Hệ thống: Đã lưu cấu hình mới thành công!");
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '30px' }}>
                        <h2 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Cấu hình hệ thống</h2>
                    </div>

                    <div className="card shadow-sm" style={{
                        maxWidth: '650px',
                        border: '2px solid #000',
                        padding: '40px',
                        backgroundColor: '#fff',
                        borderRadius: '4px'
                    }}>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center' }}>
                                <label style={{ fontWeight: '500' }}>Lương cơ sở (VNĐ):</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={config.baseSalary}
                                    onChange={(e) => setConfig({...config, baseSalary: e.target.value})}
                                    style={{ border: 'none', borderBottom: '1px solid #000', borderRadius: 0, padding: '5px 10px' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center' }}>
                                <label style={{ fontWeight: '500' }}>Số công chuẩn (Ngày):</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={config.standardDays}
                                    onChange={(e) => setConfig({...config, standardDays: e.target.value})}
                                    style={{ border: 'none', borderBottom: '1px solid #000', borderRadius: 0, padding: '5px 10px' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center' }}>
                                <label style={{ fontWeight: '500' }}>Tiền bảo hiểm (%):</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={config.insurance}
                                    onChange={(e) => setConfig({...config, insurance: e.target.value})}
                                    style={{ border: 'none', borderBottom: '1px solid #000', borderRadius: 0, padding: '5px 10px' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center' }}>
                                <label style={{ fontWeight: '500' }}>Đơn giá tiết dạy (VNĐ):</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={config.unitPrice}
                                    onChange={(e) => setConfig({...config, unitPrice: e.target.value})}
                                    style={{ border: 'none', borderBottom: '1px solid #000', borderRadius: 0, padding: '5px 10px' }}
                                />
                            </div>

                            <div style={{ textAlign: 'right', marginTop: '20px' }}>
                                <button
                                    className="btn-primary"
                                    type="button"
                                    onClick={handleSave} // 3. Gán hàm xử lý click
                                    style={{ padding: '10px 40px', borderRadius: '4px' }}
                                >
                                    [ Lưu cấu hình ]
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SystemConfigPage;