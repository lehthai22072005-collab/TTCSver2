const xlsx = require('xlsx');
const fs = require('fs');

const attendances = [];
const users = [1, 2, 3, 4, 5, 6, 7];

// Sửa lại thành năm 2026 để khớp với UI
for (let day = 1; day <= 31; day++) {
    const date = new Date(2026, 9, day); // Tháng 10 năm 2026
    // Bỏ qua Thứ 7 (6) và Chủ Nhật (0)
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    const dateStr = `2026-10-${day.toString().padStart(2, '0')}`;
    
    // Tránh trùng lặp với ngày 2026-10-10 đã có trong DB
    if (dateStr === '2026-10-10') continue;
    
    for (const empId of users) {
        const rand = Math.random();
        let status = "Đúng giờ";
        let min = Math.floor(Math.random() * 30) + 30;
        let timeIn = `07:${min}:00`;
        
        if (rand > 0.9) {
            status = "Đi trễ";
            let minLate = Math.floor(Math.random() * 30) + 1;
            timeIn = `08:${minLate.toString().padStart(2, '0')}:00`;
        } else if (rand > 0.95) {
            status = "Vắng mặt";
            timeIn = "";
        }
        
        let soTiet = 0;
        if (empId === 1 || empId === 6 || empId === 7) { 
            soTiet = Math.floor(Math.random() * 5);
        }
        
        attendances.push({
            "Mã NV": empId,
            "Ngày Chấm": dateStr,
            "Giờ Vào": timeIn,
            "Trạng Thái": status,
            "Số Tiết": soTiet
        });
    }
}

const ws = xlsx.utils.json_to_sheet(attendances);
const wb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
xlsx.writeFile(wb, "../chamcong_generated_2026.xlsx");
console.log("Created chamcong_generated_2026.xlsx");
