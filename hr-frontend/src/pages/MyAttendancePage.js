import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import '../App.css';

function MyAttendancePage() {
    const [attendance] = useState([
        { date: '2026-04-19', checkIn: '07:55:00', status: 'Đúng giờ' },
        { date: '2026-04-18', checkIn: '08:05:00', status: 'Đi muộn' },
        { date: '2026-04-17', checkIn: '07:50:00', status: 'Đúng giờ' },
        { date: '2026-04-16', checkIn: '07:58:00', status: 'Đúng giờ' },
        { date: '2026-04-15', checkIn: '07:45:00', status: 'Đúng giờ' }
    ]);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body">
                    <h3>Chấm công Cá nhân</h3>
                    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Ngày</th>
                                    <th>Thời gian vào (Check-in)</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map((record, index) => (
                                    <tr key={index}>
                                        <td>{record.date}</td>
                                        <td style={{ fontWeight: 'bold', color: '#0ea5e9' }}>{record.checkIn}</td>
                                        <td style={{ color: record.status === 'Đúng giờ' ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>{record.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyAttendancePage;
