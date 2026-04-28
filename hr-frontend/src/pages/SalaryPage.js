import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function SalaryPage() {
    const [isCalculated, setIsCalculated] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportFormat, setExportFormat] = useState('excel');

    const salaries = [
        { id: 'GV001', name: 'Nguyen Van A', workDays: 26, periods: 40, base: '10tr', total: '11tr' },
        { id: 'NV002', name: 'Tran Thi B', workDays: 24, periods: 35, base: '9tr', total: '9.5tr' }
    ];

    const handleExport = () => {
        alert(`Đang xuất file định dạng: ${exportFormat.toUpperCase()}`);
        setShowExportModal(false);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    {/* Header chuẩn Wireframe */}
                    <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>
                        <h2 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Tính lương</h2>
                    </div>

                    <div className="card p-4 mb-4 shadow-sm" style={{ border: '1px solid #cbd5e1' }}>
                        <div className="mb-4 d-flex align-items-center">
                            <span className="me-2">Tháng:</span>
                            <select className="form-select d-inline-block w-auto" style={{ border: '1px solid #000' }}>
                                <option>03/2026</option>
                                <option>02/2026</option>
                            </select>
                        </div>

                        <div className="d-flex gap-4">
                            <button
                                className="btn-primary"
                                onClick={() => setIsCalculated(true)}
                                disabled={isLocked}
                                style={{ padding: '10px 20px', borderRadius: '4px' }}
                            >
                                [ Chạy tính lương ]
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={() => setShowExportModal(true)}
                                style={{ padding: '10px 20px', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#000', border: '1px solid #cbd5e1' }}
                            >
                                [ Xuất file đối soát 📄 ]
                            </button>
                        </div>
                    </div>

                    {isCalculated && (
                        <div className="mt-4">
                            <h4 className="mb-3" style={{ fontWeight: 'bold' }}>BẢNG LƯƠNG NHÁP</h4>
                            <div className="card shadow-sm" style={{ borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                                <table className="data-table" style={{ marginTop: 0 }}>
                                    <thead style={{ backgroundColor: '#f8fafc' }}>
                                    <tr>
                                        <th>Mã NV</th>
                                        <th>Họ tên</th>
                                        <th>Công</th>
                                        <th>Tiết dạy</th>
                                        <th>Lương</th>
                                        <th>Tổng</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {salaries.map((s, i) => (
                                        <tr key={i}>
                                            <td>{s.id}</td>
                                            <td>{s.name}</td>
                                            <td>{s.workDays}</td>
                                            <td>{s.periods}</td>
                                            <td>{s.base}</td>
                                            <td className="text-success"><b>{s.total}</b></td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 d-flex justify-content-between align-items-center">
                                <div style={{ fontSize: '24px' }}>{isLocked ? '🔒' : ''}</div>
                                <button
                                    className="btn-primary"
                                    style={{ backgroundColor: isLocked ? '#94a3b8' : '#4f46e5', padding: '10px 30px' }}
                                    onClick={() => { if(window.confirm("Xác nhận chốt lương?")) setIsLocked(true); }}
                                    disabled={isLocked}
                                >
                                    [ Chốt lương ]
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL XUẤT FILE ĐỐI SOÁT - Chuẩn Wireframe */}
            {showExportModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '400px', border: '2px solid #000', padding: 0 }}>
                        <h3 style={{ textAlign: 'center', background: '#f8fafc', padding: '15px', borderBottom: '1px solid #000', fontWeight: 'bold' }}>
                            XUẤT FILE ĐỐI SOÁT
                        </h3>
                        <div style={{ padding: '30px' }}>
                            <p className="mb-3">Định dạng:</p>
                            <div className="mb-2">
                                <label style={{ cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="format"
                                        checked={exportFormat === 'excel'}
                                        onChange={() => setExportFormat('excel')}
                                        className="me-2"
                                    />
                                    Excel (.xlsx)
                                </label>
                            </div>
                            <div className="mb-4">
                                <label style={{ cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="format"
                                        checked={exportFormat === 'pdf'}
                                        onChange={() => setExportFormat('pdf')}
                                        className="me-2"
                                    />
                                    PDF
                                </label>
                            </div>

                            <div className="d-flex flex-column gap-2 align-items-center">
                                <button className="btn-primary w-75" onClick={handleExport}>
                                    [ Xuất file ]
                                </button>
                                <button className="btn-link text-dark" onClick={() => setShowExportModal(false)}>
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

export default SalaryPage;