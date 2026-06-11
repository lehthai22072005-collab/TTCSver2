[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Stop"

try {
    Write-Host "1. Submitting new declaration..."
    $body1 = [System.Text.Encoding]::UTF8.GetBytes('{"employeeId": 1, "hocKy": "Học kỳ 1 - 2026", "soTietDay": 10, "soBaiBao": 0, "ghiChu": "Test 2"}')
    $req1 = [System.Net.WebRequest]::Create("http://localhost:8080/api/declarations")
    $req1.Method = "POST"
    $req1.ContentType = "application/json; charset=utf-8"
    $req1.GetRequestStream().Write($body1, 0, $body1.Length)
    $res1 = $req1.GetResponse()
    $reader1 = New-Object System.IO.StreamReader($res1.GetResponseStream())
    $resp1 = $reader1.ReadToEnd() | ConvertFrom-Json
    $declId = $resp1.declaration.id
    Write-Host "Created Declaration ID: $declId"

    Write-Host "2. Approving declaration..."
    $body2 = [System.Text.Encoding]::UTF8.GetBytes('{"status": "ĐÃ DUYỆT"}')
    $req2 = [System.Net.WebRequest]::Create("http://localhost:8080/api/declarations/$declId/status")
    $req2.Method = "PUT"
    $req2.ContentType = "application/json; charset=utf-8"
    $req2.GetRequestStream().Write($body2, 0, $body2.Length)
    $res2 = $req2.GetResponse()
    $reader2 = New-Object System.IO.StreamReader($res2.GetResponseStream())
    Write-Host "Approved: $($reader2.ReadToEnd())"

    Write-Host "3. Previewing salary for 05/2026..."
    $salaries = Invoke-RestMethod -Uri 'http://localhost:8080/api/salary/preview?month=05/2026' -Method Get
    $emp1Salary = $salaries | Where-Object { $_.employee.id -eq 1 }
    
    Write-Host "Salary details for Employee 1:"
    Write-Host " - Tiền giảng dạy: $($emp1Salary.tienGiangDay)"

    Write-Host "4. Locking salary for 05/2026..."
    $lockRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/salary/lock?month=05/2026' -Method Post
    Write-Host "Locked response: $lockRes"

    Write-Host "5. Checking declaration paid status..."
    $checkRes = Invoke-RestMethod -Uri "http://localhost:8080/api/declarations/my-declarations/1" -Method Get
    $paidDecl = $checkRes | Where-Object { $_.id -eq $declId }
    Write-Host "Declaration $declId Paid Status: $($paidDecl.isPaid)"

} catch {
    Write-Host "Error occurred: $_"
}
