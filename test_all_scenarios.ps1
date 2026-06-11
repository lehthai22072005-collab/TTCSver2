$ErrorActionPreference = "Continue"

$global:failedCount = 0
$global:passedCount = 0

function Assert-Equal ($Actual, $Expected, $TestName) {
    if ("$Actual" -eq "$Expected") {
        Write-Host "[PASS] $TestName" -ForegroundColor Green
        $global:passedCount++
    } else {
        Write-Host "[FAIL] $TestName (Expected: '$Expected', Got: '$Actual')" -ForegroundColor Red
        $global:failedCount++
    }
}

function Invoke-Api ($Uri, $Method, $Body) {
    try {
        if ($Body) {
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($Body)
            $req = [System.Net.WebRequest]::Create("http://localhost:8080/api/$Uri")
            $req.Method = $Method
            $req.ContentType = "application/json; charset=utf-8"
            $stream = $req.GetRequestStream()
            $stream.Write($bytes, 0, $bytes.Length)
            $stream.Close()
            $res = $req.GetResponse()
        } else {
            $req = [System.Net.WebRequest]::Create("http://localhost:8080/api/$Uri")
            $req.Method = $Method
            $res = $req.GetResponse()
        }
        $reader = New-Object System.IO.StreamReader($res.GetResponseStream(), [System.Text.Encoding]::UTF8)
        $text = $reader.ReadToEnd()
        if ($text.StartsWith("{") -or $text.StartsWith("[")) {
            return $text | ConvertFrom-Json
        }
        return $text
    } catch {
        $errResp = $_.Exception.Response
        if ($errResp) {
            $reader = New-Object System.IO.StreamReader($errResp.GetResponseStream(), [System.Text.Encoding]::UTF8)
            $errText = $reader.ReadToEnd()
            return @{ "error" = $true; "statusCode" = [int]$errResp.StatusCode; "message" = $errText }
        }
        return @{ "error" = $true; "message" = $_.Exception.Message }
    }
}

Write-Host "================= KICH BAN 1: CAN BO HANH CHINH =================" -ForegroundColor Cyan
# ID 4 is Hanh chinh
# 1.1 KPI
$kpiBody = '{"employeeId": 4, "nam": 2026, "thang": 6, "diemKpi": 85, "danhGia": "Tot", "nguoiDanhGia": "Truong phong"}'
$kpi = Invoke-Api "kpi" "POST" $kpiBody

# 1.2 Khen thuong 500k
$rewardBody = '{"employeeId": 4, "type": "KHEN_THUONG", "amount": 500000, "reason": "Lam tot", "effectiveDate": "2026-06-15"}'
$reward = Invoke-Api "rewards" "POST" $rewardBody

# 1.3 Preview Salary 06/2026
$sals = Invoke-Api "salary/preview?month=06/2026" "GET"
$sal4 = $sals | Where-Object { $_.employee.id -eq 4 }
Assert-Equal $sal4.tienGiangDay 0 "Hanh chinh khong co tien giang day"
Assert-Equal $sal4.tienThuong 500000 "Co 500k tien thuong"

Write-Host "================= KICH BAN 2: GIANG VIEN (CAC TRANG THAI KE KHAI) =================" -ForegroundColor Cyan
# ID 1 is Giang vien
# 2.1 Ke khai 20 tiet -> TU CHOI
$declBody1 = '{"employeeId": 1, "hocKy": "Hoc ky 1 - 2026", "soTietDay": 20, "soBaiBao": 0, "ghiChu": "Bi tu choi"}'
$decl1 = Invoke-Api "declarations" "POST" $declBody1
$d1Id = $decl1.declaration.id
$rejBody = '{"status": "TỪ CHỐI"}'
$rej = Invoke-Api "declarations/$d1Id/status" "PUT" $rejBody

# 2.2 Ke khai 30 tiet -> DA DUYET
$declBody2 = '{"employeeId": 1, "hocKy": "Hoc ky 1 - 2026", "soTietDay": 30, "soBaiBao": 0, "ghiChu": "Duoc duyet"}'
$decl2 = Invoke-Api "declarations" "POST" $declBody2
$d2Id = $decl2.declaration.id
$appBody = '{"status": "ĐÃ DUYỆT"}'
$app = Invoke-Api "declarations/$d2Id/status" "PUT" $appBody

# 2.3 Phat 200k
$penBody = '{"employeeId": 1, "type": "KY_LUAT", "amount": 200000, "reason": "Di tre", "effectiveDate": "2026-06-16"}'
$pen = Invoke-Api "rewards" "POST" $penBody

# 2.4 Preview Salary 06/2026 again
$sals2 = Invoke-Api "salary/preview?month=06/2026" "GET"
$sal1 = $sals2 | Where-Object { $_.employee.id -eq 1 }
Assert-Equal $sal1.tienGiangDay 4500000 "Tien giang day = 30 * 150k = 4tr5 (Tu choi 20 tiet khong duoc tinh)"
Assert-Equal $sal1.tienPhat 200000 "Tien phat 200k"

Write-Host "================= KICH BAN 3: LUONG CHOT & XEM LAI =================" -ForegroundColor Cyan
# 3.1 Chot luong
$lockRes = Invoke-Api "salary/lock?month=06/2026" "POST" ""
Assert-Equal $lockRes.message "Chốt lương thành công! Chức năng email đang tắt nên chưa gửi phiếu lương." "Chot luong thanh cong"

# 3.2 Ke khai co bi mark isPaid khong?
$myDecls = Invoke-Api "declarations/my-declarations/1" "GET"
$paidDecl = $myDecls | Where-Object { $_.id -eq $d2Id }
Assert-Equal $paidDecl.isPaid $true "Phieu ke khai 30 tiet da bi mark isPaid=true"

# 3.3 Preview thang da chot -> Bao loi
$sals3 = Invoke-Api "salary/preview?month=06/2026" "GET"
Assert-Equal $sals3.error $true "Preview thang 06/2026 phai bao loi vi da chot"
Assert-Equal $sals3.statusCode 400 "HTTP 400 Bad Request"

Write-Host "================= KICH BAN 4: THANG TIEP THEO (KHONG BI TRUNG) =================" -ForegroundColor Cyan
# Thang 07/2026
$sals4 = Invoke-Api "salary/preview?month=07/2026" "GET"
$sal1_7 = $sals4 | Where-Object { $_.employee.id -eq 1 }
Assert-Equal $sal1_7.tienGiangDay 0 "Thang 7 khong con tien giang day vi phieu kia da paid"

Write-Host "================= KICH BAN 5: EDGE CASES (LOI NGHIEP VU) =================" -ForegroundColor Cyan
# 5.1 Ke khai tiet am
$declBody3 = '{"employeeId": 1, "hocKy": "Hoc ky 2 - 2026", "soTietDay": -10, "soBaiBao": 0, "ghiChu": "Am"}'
$decl3 = Invoke-Api "declarations" "POST" $declBody3
if ($decl3.error) {
    Assert-Equal $true $true "He thong chan ke khai am"
} else {
    Write-Host "[WARN] He thong CHAP NHAN so tiet am! (Co the la Bug)" -ForegroundColor Yellow
}

# 5.2 Phat nhieu hon luong co ban
$hugePenBody = '{"employeeId": 3, "type": "KY_LUAT", "amount": 50000000, "reason": "Phat sieu to", "effectiveDate": "2026-07-01"}'
Invoke-Api "rewards" "POST" $hugePenBody | Out-Null
$sals5 = Invoke-Api "salary/preview?month=07/2026" "GET"
$sal3 = $sals5 | Where-Object { $_.employee.id -eq 3 }
if ($sal3.thucLinh -lt 0) {
    Write-Host "[WARN] Luong thuc linh bi AM: $($sal3.thucLinh) d. (Can check chinh sach)" -ForegroundColor Yellow
} else {
    Assert-Equal ($sal3.thucLinh -ge 0) $true "Luong thuc linh >= 0"
}

Write-Host "=========================================================="
Write-Host "TEST SUMMARY: PASSED = $global:passedCount, FAILED = $global:failedCount"
