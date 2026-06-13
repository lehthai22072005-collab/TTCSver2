import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// COMPONENT: VẼ NHÃN % TĂNG/GIẢM TRỰC TIẾP LÊN ĐỈNH BIỂU ĐỒ (ĐÃ FIX LỖI RECHARTS)
const CustomBarLabel = (props) => {
    const { x, y, width, index, changePercentage } = props;

    if (index === 0) return (
        <text x={x + width / 2} y={y - 12} fill="#a3aed0" fontSize="13" fontWeight="bold" textAnchor="middle">Gốc</text>
    );

    if (!changePercentage || changePercentage === 0) return null;

    const isIncrease = changePercentage > 0;
    const color = isIncrease ? '#05cd99' : '#ff5630';
    const arrow = isIncrease ? '▲' : '▼';

    return (
        <text x={x + width / 2} y={y - 12} fill={color} fontSize="14" fontWeight="bold" textAnchor="middle">
            {`${arrow} ${Math.abs(changePercentage)}%`}
        </text>
    );
};

// COMPONENT: TOOLTIP HIỂN THỊ CHI TIẾT KHI DI CHUỘT
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div style={{ backgroundColor: '#fff', padding: '15px 20px', border: '1px solid #e2e8f0', borderRadius: '15px', boxShadow: '0px 10px 30px rgba(112, 144, 176, 0.15)' }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#1b2559', fontSize: '1rem', borderBottom: '1px solid #f4f7fe', paddingBottom: '8px' }}>
                    {data.fullLabel}
                </p>
                <p style={{ margin: '8px 0', color: '#4318ff', fontWeight: 'bold', fontSize: '0.95rem' }}>
                    💰 Tổng chi: {data["Tổng chi (VNĐ)"].toLocaleString()} VNĐ
                </p>
                {data.changeValue !== 0 && (
                    <p style={{ margin: '5px 0', color: data.changePercentage > 0 ? '#05cd99' : '#ff5630', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        {data.changePercentage > 0 ? '📈 Tăng thêm:' : '📉 Giảm đi:'} {Math.abs(data.changeValue).toLocaleString()} VNĐ
                    </p>
                )}
            </div>
        );
    }
    return null;
};

function SalaryFluctuationPage() {
    const [fluctuations, setFluctuations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFluctuations = async () => {
        try {
            const res = await axios.get("/api/dashboard/salary-fluctuations");
            setFluctuations(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Lỗi khi tải biến động quỹ lương:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFluctuations();
    }, []);

    // HÀM XUẤT BÁO CÁO PDF BẰNG TRÌNH DUYỆT
    const handleExportToPDF = () => {
        window.print();
    };

    const totalAnnualFund = fluctuations.reduce((sum, item) => sum + item.totalFund, 0);

    const chartData = fluctuations.map((item, index) => ({
        name: `T${index + 1}`,
        "Tổng chi (VNĐ)": item.totalFund,
        fullLabel: item.month,
        changePercentage: item.changePercentage,
        changeValue: item.changeValue,
        status: item.status
    }));

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar />
                <div className="content-body" style={{ padding: '30px', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>

                    {/* KHỐI CSS ĐỂ CẮT CÚP GIAO DIỆN KHI XUẤT PDF CHUẨN A4 */}
                    <style>
                        {`
                            @media print {
                                body { background-color: #fff !important; }
                                body * { visibility: hidden; }
                                #printable-report, #printable-report * { visibility: visible; }
                                #printable-report { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; }
                                .no-print { display: none !important; }
                                .print-header { display: block !important; text-align: center; margin-bottom: 40px; }
                                .chart-box { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
                                .recharts-responsive-container { width: 100% !important; height: 400px !important; }
                            }
                        `}
                    </style>

                    {/* HEADER HÀNH ĐỘNG (Sẽ bị giấu đi khi in PDF) */}
                    <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <div>
                            <h2 style={{ fontWeight: 'bold', color: '#1b2559', textTransform: 'uppercase', margin: 0, fontSize: '1.6rem' }}>
                                Biểu đồ biến động quỹ lương 2026
                            </h2>
                        </div>
                        <button
                            onClick={handleExportToPDF}
                            style={{ backgroundColor: '#1b2559', color: '#fff', padding: '14px 28px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0px 10px 20px rgba(27, 37, 89, 0.2)', fontSize: '0.95rem' }}
                        >
                            📄 [ XUẤT BÁO CÁO PDF ]
                        </button>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px', color: '#4318ff', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            ⏳ Hệ thống đang chạy thuật toán phân tích quỹ lương...
                        </div>
                    ) : (
                        <div id="printable-report">
                            {/* TIÊU ĐỀ CHÍNH THỨC (Chỉ hiển thị trong file PDF xuất ra) */}
                            <div className="print-header" style={{ display: 'none' }}>
                                <h2 style={{ color: '#1b2559', fontSize: '22px', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
                                    BÁO CÁO BIẾN ĐỘNG QUỸ LƯƠNG NĂM 2026
                                </h2>
                                <p style={{ color: '#475569', fontSize: '15px', margin: 0 }}>
                                    Học viện Công nghệ Bưu chính Viễn thông (PTIT)
                                </p>
                                <hr style={{ border: 'none', borderTop: '2px solid #e2e8f0', width: '200px', margin: '20px auto' }} />
                            </div>

                            {/* BIỂU ĐỒ TRỰC QUAN */}
                            <div className="chart-box" style={{ backgroundColor: '#fff', borderRadius: '25px', padding: '40px 30px 20px 30px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)', marginBottom: '30px' }}>
                                <div style={{ width: '100%', height: 450 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={chartData} margin={{ top: 30, right: 20, left: 10, bottom: 10 }}>
                                            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#e2e8f0" />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fill: '#a3aed0', fontWeight: 'bold' }}
                                                axisLine={false}
                                                tickLine={false}
                                                dy={10}
                                            />
                                            <YAxis
                                                tickFormatter={(value) => value > 0 ? `${value / 1000000}Tr` : '0'}
                                                tick={{ fill: '#a3aed0', fontWeight: 'bold' }}
                                                axisLine={false}
                                                tickLine={false}
                                                dx={-10}
                                            />
                                            <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f4f7fe', opacity: 0.6 }} />
                                            <Bar
                                                dataKey="Tổng chi (VNĐ)"
                                                fill="#4318ff"
                                                radius={[8, 8, 0, 0]}
                                                barSize={50}
                                                label={<CustomBarLabel />}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* THẺ TỔNG KẾT */}
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '25px 50px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.08)', textAlign: 'center', borderBottom: '6px solid #4318ff', minWidth: '400px' }}>
                                    <p style={{ color: '#a3aed0', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 10px 0' }}>
                                        TỔNG QUỸ LƯƠNG TÍCH LŨY (12 THÁNG)
                                    </p>
                                    <h2 style={{ color: '#1b2559', margin: 0, fontWeight: '900', fontSize: '2.2rem' }}>
                                        {totalAnnualFund.toLocaleString()} <span style={{ fontSize: '1.2rem', color: '#4318ff' }}>VNĐ</span>
                                    </h2>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SalaryFluctuationPage;
