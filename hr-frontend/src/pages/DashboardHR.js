import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function DashboardHR() {
    const [isExporting, setIsExporting] = useState(false);

    const formatMoney = (value) => {
        const numberValue = Number(value || 0);
        return `${numberValue.toLocaleString('vi-VN')}đ`;
    };

    const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const tableRows = (items, columns) => {
        if (!items || items.length === 0) {
            return `<tr><td colspan="${columns.length}" class="empty">Chưa có dữ liệu</td></tr>`;
        }
        return items.map(item => `
            <tr>
                ${columns.map(col => `<td>${escapeHtml(col.value(item))}</td>`).join('')}
            </tr>
        `).join('');
    };

    const keyValueRows = (data) => Object.entries(data || {}).map(([key, value]) => `
        <tr>
            <td>${escapeHtml(key)}</td>
            <td class="number">${escapeHtml(value)}</td>
        </tr>
    `).join('');

    const buildReportHtml = (report) => {
        const generatedAt = new Date(report.generatedAt || Date.now()).toLocaleString('vi-VN');
        const personnel = report.personnelOverview || {};
        const contracts = report.contractSituation || {};
        const salary = report.salaryFund || {};
        const kpi = report.kpiReport || {};
        const leave = report.leaveSituation || {};
        const rewardDiscipline = report.rewardDisciplineReport || {};

        const departmentRows = keyValueRows(personnel.departmentDistribution);
        const kpiRows = keyValueRows(kpi.distribution);
        const salaryRows = tableRows(salary.sixMonthTrend || [], [
            { value: item => item.month },
            { value: item => formatMoney(item.totalNetSalary) }
        ]);

        return `
<!doctype html>
<html lang="vi">
<head>
    <meta charset="utf-8" />
    <title>Báo cáo tổng quan nhân sự</title>
    <style>
        @page { size: A4; margin: 14mm; }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: Arial, "Segoe UI", sans-serif;
            color: #1b2559;
            background: #fff;
            line-height: 1.45;
        }
        .header {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            padding-bottom: 18px;
            border-bottom: 3px solid #4318ff;
            margin-bottom: 24px;
        }
        .header h1 {
            margin: 0 0 8px 0;
            font-size: 26px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .header p { margin: 4px 0; color: #64748b; font-size: 13px; }
        .badge {
            align-self: flex-start;
            background: linear-gradient(135deg, #4318ff, #8b5cf6);
            color: #fff;
            border-radius: 16px;
            padding: 12px 18px;
            font-weight: 800;
            text-align: center;
            min-width: 150px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 22px;
        }
        .metric {
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 14px;
            background: #f8fafc;
        }
        .metric span {
            display: block;
            color: #64748b;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
        }
        .metric strong {
            display: block;
            margin-top: 6px;
            color: #4318ff;
            font-size: 22px;
        }
        .section {
            page-break-inside: avoid;
            margin: 0 0 18px 0;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            overflow: hidden;
        }
        .section h2 {
            margin: 0;
            padding: 12px 16px;
            background: #f4f7fe;
            font-size: 16px;
            text-transform: uppercase;
        }
        .section-body { padding: 14px 16px; }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }
        th {
            text-align: left;
            background: #eef2ff;
            color: #2b3674;
            padding: 9px;
            border-bottom: 1px solid #dbe3f0;
        }
        td {
            padding: 9px;
            border-bottom: 1px solid #edf2f7;
            vertical-align: top;
        }
        tr:last-child td { border-bottom: none; }
        .number {
            text-align: right;
            font-weight: 800;
            color: #4318ff;
            white-space: nowrap;
        }
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        .empty { text-align: center; color: #94a3b8; font-style: italic; }
        .footer {
            margin-top: 30px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            text-align: center;
            color: #1b2559;
            font-weight: 700;
        }
        .sign-space { height: 60px; }
        @media print {
            .no-print { display: none !important; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>Báo cáo tổng quan nhân sự</h1>
            <p>Hệ thống quản lý nhân sự PTIT</p>
            <p>Thời điểm xuất báo cáo: ${escapeHtml(generatedAt)}</p>
        </div>
        <div class="badge">Báo cáo HR<br/>Tổng hợp hiện tại</div>
    </div>

    <div class="summary">
        <div class="metric"><span>Tổng nhân sự</span><strong>${escapeHtml(personnel.totalEmployees || 0)}</strong></div>
        <div class="metric"><span>Quỹ lương gần nhất</span><strong>${escapeHtml(formatMoney(salary.latestTotalNetSalary))}</strong></div>
        <div class="metric"><span>Đơn nghỉ chờ duyệt</span><strong>${escapeHtml(leave.pending || 0)}</strong></div>
    </div>

    <div class="section">
        <h2>1. Tổng quan nhân sự</h2>
        <div class="section-body grid-2">
            <div>
                <p><b>Tổng số nhân sự toàn trường:</b> ${escapeHtml(personnel.totalEmployees || 0)} người</p>
                <p>Bảng bên phải thể hiện phân bổ nhân sự theo phòng ban/khoa từ hồ sơ hiện có.</p>
            </div>
            <table>
                <thead><tr><th>Phòng ban / Khoa</th><th class="number">Số lượng</th></tr></thead>
                <tbody>${departmentRows || '<tr><td colspan="2" class="empty">Chưa có dữ liệu</td></tr>'}</tbody>
            </table>
        </div>
    </div>

    <div class="section">
        <h2>2. Tình hình hợp đồng</h2>
        <div class="section-body">
            <table>
                <thead><tr><th>Trạng thái</th><th class="number">Số lượng</th></tr></thead>
                <tbody>
                    <tr><td>Đang hoạt động</td><td class="number">${escapeHtml(contracts.active || 0)}</td></tr>
                    <tr><td>Sắp hết hạn trong ${escapeHtml(contracts.expiringWindowDays || 60)} ngày</td><td class="number">${escapeHtml(contracts.expiringSoon || 0)}</td></tr>
                    <tr><td>Đã hết hạn</td><td class="number">${escapeHtml(contracts.expired || 0)}</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="section">
        <h2>3. Quỹ lương</h2>
        <div class="section-body">
            <p><b>Tháng gần nhất đã chốt:</b> ${escapeHtml(salary.latestMonth || 'Chưa có dữ liệu')}</p>
            <p><b>Tổng thực lĩnh tháng gần nhất:</b> ${escapeHtml(formatMoney(salary.latestTotalNetSalary))}</p>
            <table>
                <thead><tr><th>Tháng</th><th class="number">Tổng thực lĩnh</th></tr></thead>
                <tbody>${salaryRows}</tbody>
            </table>
        </div>
    </div>

    <div class="section">
        <h2>4. Đánh giá KPI</h2>
        <div class="section-body">
            <p><b>Tổng phiếu đánh giá:</b> ${escapeHtml(kpi.totalEvaluations || 0)}</p>
            <table>
                <thead><tr><th>Xếp loại</th><th class="number">Số lượng</th></tr></thead>
                <tbody>${kpiRows}</tbody>
            </table>
        </div>
    </div>

    <div class="section">
        <h2>5. Tình hình nghỉ phép</h2>
        <div class="section-body">
            <table>
                <thead><tr><th>Loại đơn</th><th class="number">Số lượng</th></tr></thead>
                <tbody>
                    <tr><td>Đơn đang chờ duyệt</td><td class="number">${escapeHtml(leave.pending || 0)}</td></tr>
                    <tr><td>Đơn đã duyệt</td><td class="number">${escapeHtml(leave.approved || 0)}</td></tr>
                    <tr><td>Tổng đơn trong hệ thống</td><td class="number">${escapeHtml(leave.totalRequests || 0)}</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="section">
        <h2>6. Khen thưởng & Kỷ luật</h2>
        <div class="section-body">
            <p><b>Năm báo cáo:</b> ${escapeHtml(rewardDiscipline.year || new Date().getFullYear())}</p>
            <table>
                <thead><tr><th>Loại quyết định</th><th class="number">Số lượng</th></tr></thead>
                <tbody>
                    <tr><td>Khen thưởng</td><td class="number">${escapeHtml(rewardDiscipline.rewardCount || 0)}</td></tr>
                    <tr><td>Kỷ luật</td><td class="number">${escapeHtml(rewardDiscipline.disciplineCount || 0)}</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="footer">
        <div>
            <p>Người lập báo cáo</p>
            <div class="sign-space"></div>
            <p>Phòng Nhân sự</p>
        </div>
        <div>
            <p>Ban Giám hiệu</p>
            <div class="sign-space"></div>
            <p>Xác nhận</p>
        </div>
    </div>
</body>
</html>`;
    };

    const handleExportOverviewPdf = async () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Trình duyệt đang chặn cửa sổ xuất PDF. Hãy cho phép popup rồi thử lại.');
            return;
        }

        setIsExporting(true);
        printWindow.document.write('<p style="font-family: Arial; padding: 24px;">Đang tổng hợp dữ liệu báo cáo...</p>');
        try {
            const res = await axios.get('/api/dashboard/hr-overview-report');
            printWindow.document.open();
            printWindow.document.write(buildReportHtml(res.data));
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => printWindow.print(), 500);
        } catch (err) {
            printWindow.close();
            console.error('Lỗi xuất báo cáo tổng quan:', err);
            alert('Không thể xuất báo cáo tổng quan. Vui lòng thử lại sau.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                        <div>
                            <h2 style={{ fontWeight: 'bold', color: '#1b2559', margin: 0 }}>Dashboard Phòng Nhân Sự</h2>
                            <p style={{ color: '#707eae', margin: '8px 0 0 0', fontWeight: 600 }}>
                                Theo dõi hồ sơ, đơn từ và xuất báo cáo tổng quan cho Ban Giám hiệu.
                            </p>
                        </div>
                        <button
                            onClick={handleExportOverviewPdf}
                            disabled={isExporting}
                            style={{
                                background: isExporting
                                    ? '#a3aed0'
                                    : 'linear-gradient(135deg, #4318ff 0%, #8b5cf6 100%)',
                                color: '#fff',
                                padding: '15px 28px',
                                borderRadius: '16px',
                                border: 'none',
                                cursor: isExporting ? 'not-allowed' : 'pointer',
                                fontWeight: '900',
                                boxShadow: '0px 14px 28px rgba(67, 24, 255, 0.24)',
                                fontSize: '15px',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {isExporting ? '[ Đang xuất báo cáo... ]' : '[ Xuất báo cáo tổng quan PDF ]'}
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '20px' }}>
                        <div style={cardStyle}>
                            <div style={iconStyle}>HS</div>
                            <h3 style={cardTitle}>Quản lý nhân sự</h3>
                            <p style={cardDesc}>Tra cứu, thêm mới và cập nhật thông tin hồ sơ của toàn bộ nhân viên.</p>
                        </div>
                        <div style={cardStyle}>
                            <div style={iconStyle}>DT</div>
                            <h3 style={cardTitle}>Phê duyệt đơn từ</h3>
                            <p style={cardDesc}>Xử lý đơn xin nghỉ phép và theo dõi trạng thái đã duyệt/chờ duyệt.</p>
                        </div>
                        <div style={{ ...cardStyle, border: '1px solid #d9d3ff', background: 'linear-gradient(180deg, #ffffff 0%, #f8f7ff 100%)' }}>
                            <div style={{ ...iconStyle, backgroundColor: '#4318ff', color: '#fff' }}>PDF</div>
                            <h3 style={cardTitle}>Báo cáo tổng quan</h3>
                            <p style={cardDesc}>Tổng hợp nhân sự, hợp đồng, quỹ lương, KPI, nghỉ phép, khen thưởng và kỷ luật bằng dữ liệu thật.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 18px 40px rgba(112, 144, 176, 0.10)',
    minHeight: '180px'
};

const iconStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    backgroundColor: '#f4f7fe',
    color: '#4318ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '900',
    marginBottom: '18px'
};

const cardTitle = {
    color: '#2b3674',
    margin: '0 0 12px 0',
    fontWeight: '800'
};

const cardDesc = {
    color: '#707eae',
    lineHeight: 1.6,
    margin: 0,
    fontWeight: 600
};

export default DashboardHR;
