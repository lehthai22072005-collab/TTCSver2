package com.ptit.demo.service;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.ptit.demo.entity.Employee;
import com.ptit.demo.entity.Payroll;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

@Service
public class EmailService {

    @Autowired
    private SystemConfigService configService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public boolean isEmailEnabled() {
        return configService.getBoolean("emailEnabled", false);
    }

    public String sendTestEmail(String toEmail) {
        if (!isEmailEnabled()) {
            return "Chức năng gửi email đang tắt trong cấu hình hệ thống!";
        }

        if (toEmail == null || toEmail.trim().isEmpty()) {
            throw new RuntimeException("Email nhận thử không được để trống!");
        }

        String subject = "Kiểm tra cấu hình Email - PTIT HR Management";

        String html = """
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color:#1b2559;">PTIT HR Management</h2>
                    <p>Đây là email kiểm tra cấu hình Gmail SMTP.</p>
                    <p>Nếu bạn nhận được email này, cấu hình gửi mail đã hoạt động.</p>
                </div>
                """;

        sendHtmlEmail(toEmail.trim(), subject, html, null, null);

        ghiLogHeThong("Gửi email thử tới: " + toEmail.trim(), "System");

        return "Gửi email thử thành công tới: " + toEmail.trim();
    }

    public String sendAccountCreatedEmail(String toEmail, String fullName, String username, String password, String role) {
        if (!isEmailEnabled()) {
            return "Email đang tắt, bỏ qua gửi thông tin tài khoản.";
        }

        if (toEmail == null || toEmail.trim().isEmpty()) {
            throw new RuntimeException("Email người nhận không được để trống!");
        }

        String subject = "Thông tin tài khoản hệ thống HR Management";

        String html = """
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color:#1b2559;">Thông tin tài khoản HR Management</h2>
                    <p>Xin chào <b>%s</b>,</p>
                    <p>Tài khoản của bạn đã được tạo trên hệ thống quản lý nhân sự PTIT.</p>
                    
                    <table style="border-collapse: collapse; margin-top: 12px;">
                        <tr>
                            <td style="padding: 8px 14px; border: 1px solid #ddd;"><b>Tên đăng nhập</b></td>
                            <td style="padding: 8px 14px; border: 1px solid #ddd;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 14px; border: 1px solid #ddd;"><b>Mật khẩu mặc định</b></td>
                            <td style="padding: 8px 14px; border: 1px solid #ddd;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 14px; border: 1px solid #ddd;"><b>Vai trò</b></td>
                            <td style="padding: 8px 14px; border: 1px solid #ddd;">%s</td>
                        </tr>
                    </table>
                    
                    <p style="margin-top: 16px;">Vui lòng đăng nhập và đổi mật khẩu sau lần đăng nhập đầu tiên.</p>
                    <p>Trân trọng,<br/>PTIT HR Management</p>
                </div>
                """.formatted(
                safe(fullName),
                safe(username),
                safe(password),
                safe(role)
        );

        sendHtmlEmail(toEmail.trim(), subject, html, null, null);

        ghiLogHeThong("Gửi email thông báo tài khoản tới: " + toEmail.trim(), "System");

        return "Đã gửi email thông báo tài khoản tới: " + toEmail.trim();
    }

    public String sendPayslipEmail(Payroll payroll) {
        if (!isEmailEnabled()) {
            return "Email đang tắt, bỏ qua gửi phiếu lương.";
        }

        if (payroll == null || payroll.getEmployee() == null) {
            throw new RuntimeException("Không có thông tin nhân viên để gửi phiếu lương!");
        }

        Employee emp = payroll.getEmployee();

        if (emp.getEmail() == null || emp.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Nhân viên " + emp.getFullName() + " chưa có email!");
        }

        String subject = "Phiếu lương tháng " + safe(payroll.getThangNam());

        String html = """
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color:#1b2559;">Phiếu lương tháng %s</h2>
                    <p>Xin chào <b>%s</b>,</p>
                    <p>Hệ thống gửi đến bạn phiếu lương tháng <b>%s</b>.</p>
                    <p>Vui lòng xem file PDF đính kèm để biết chi tiết lương, phụ cấp, khấu trừ và thực lĩnh.</p>
                    <p>Trân trọng,<br/>PTIT HR Management</p>
                </div>
                """.formatted(
                safe(payroll.getThangNam()),
                safe(emp.getFullName()),
                safe(payroll.getThangNam())
        );

        byte[] pdfBytes = generatePayslipPdf(payroll);

        String fileName = "Phieu_luong_"
                + safeFileName(emp.getFullName())
                + "_"
                + safeFileName(payroll.getThangNam())
                + ".pdf";

        sendHtmlEmail(emp.getEmail().trim(), subject, html, pdfBytes, fileName);

        ghiLogHeThong("Gửi phiếu lương tới: " + emp.getEmail().trim(), "System");

        return "Đã gửi phiếu lương tới: " + emp.getEmail().trim();
    }

    private void sendHtmlEmail(String toEmail, String subject, String html, byte[] attachmentBytes, String attachmentName) {
        try {
            JavaMailSenderImpl mailSender = buildMailSender();

            MimeMessage message = mailSender.createMimeMessage();

            boolean hasAttachment = attachmentBytes != null && attachmentName != null;

            MimeMessageHelper helper = new MimeMessageHelper(message, hasAttachment, "UTF-8");

            String fromEmail = configService.getValue("smtpUsername", "").trim();
            String senderName = configService.getValue("senderName", "PTIT HR Management").trim();

            if (fromEmail.isEmpty()) {
                throw new RuntimeException("Chưa cấu hình Gmail gửi đi!");
            }

            if (senderName.isEmpty()) {
                senderName = "PTIT HR Management";
            }

            helper.setFrom(fromEmail, senderName);
            helper.setTo(toEmail.trim());
            helper.setSubject(subject);
            helper.setText(html, true);

            if (hasAttachment) {
                ByteArrayDataSource dataSource = new ByteArrayDataSource(attachmentBytes, "application/pdf");
                helper.addAttachment(attachmentName, dataSource);
            }

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi gửi email: " + getReadableMailError(e));
        }
    }

    private JavaMailSenderImpl buildMailSender() {
        String username = configService.getValue("smtpUsername", "");
        String password = configService.getValue("smtpPassword", "");

        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("Chưa cấu hình Gmail gửi đi!");
        }

        if (password == null || password.trim().isEmpty()) {
            throw new RuntimeException("Chưa cấu hình App Password Gmail!");
        }

        username = username.trim();

        // Gmail App Password thường hiện dạng: abcd efgh ijkl mnop
        // JavaMail nên dùng dạng không khoảng trắng: abcdefghijklmnop
        password = password.replaceAll("\\s+", "");

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);
        mailSender.setUsername(username);
        mailSender.setPassword(password);
        mailSender.setDefaultEncoding("UTF-8");

        Properties props = mailSender.getJavaMailProperties();

        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        props.put("mail.smtp.ssl.protocols", "TLSv1.2 TLSv1.3");
        props.put("mail.smtp.connectiontimeout", "15000");
        props.put("mail.smtp.timeout", "15000");
        props.put("mail.smtp.writetimeout", "15000");

        // Muốn xem log SMTP chi tiết ở terminal thì đổi thành "true"
        props.put("mail.debug", "false");

        return mailSender;
    }

    private byte[] generatePayslipPdf(Payroll payroll) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, outputStream);

            document.open();

            Font titleFont = getFont(18, Font.BOLD);
            Font normalFont = getFont(12, Font.NORMAL);
            Font boldFont = getFont(12, Font.BOLD);

            Paragraph title = new Paragraph("PHIẾU LƯƠNG THÁNG " + safe(payroll.getThangNam()), titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            Employee emp = payroll.getEmployee();

            document.add(new Paragraph("Họ tên: " + safe(emp.getFullName()), normalFont));
            document.add(new Paragraph("Email: " + safe(emp.getEmail()), normalFont));
            document.add(new Paragraph("Phòng ban: " + safe(emp.getDepartment()), normalFont));
            document.add(new Paragraph("Chức vụ: " + safe(emp.getPosition()), normalFont));
            document.add(new Paragraph(" ", normalFont));

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);

            addRow(table, "Lương cơ bản", formatMoney(payroll.getLuongCoBan()), boldFont, normalFont);
            addRow(table, "Phụ cấp", formatMoney(payroll.getPhuCap()), boldFont, normalFont);
            addRow(table, "BHXH khấu trừ", formatMoney(payroll.getBhxhKhauTru()), boldFont, normalFont);
            addRow(table, "Thuế TNCN", formatMoney(payroll.getThueTncn()), boldFont, normalFont);
            addRow(table, "Ngày công", safe(payroll.getNgayCong()), boldFont, normalFont);
            addRow(table, "Số tiết dạy", safe(payroll.getTietDay()), boldFont, normalFont);
            addRow(table, "Thực lĩnh", formatMoney(payroll.getThucLinh()), boldFont, normalFont);

            document.add(table);

            Paragraph footer = new Paragraph(
                    "\nPhiếu lương được tạo tự động từ hệ thống PTIT HR Management.",
                    normalFont
            );
            footer.setSpacingBefore(20);
            document.add(footer);

            document.close();

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo PDF phiếu lương: " + e.getMessage());
        }
    }

    private void addRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        table.addCell(new Phrase(label, labelFont));
        table.addCell(new Phrase(value, valueFont));
    }

    private Font getFont(int size, int style) {
        try {
            String windowsFontPath = "C:/Windows/Fonts/arial.ttf";
            BaseFont baseFont = BaseFont.createFont(
                    windowsFontPath,
                    BaseFont.IDENTITY_H,
                    BaseFont.EMBEDDED
            );
            return new Font(baseFont, size, style);
        } catch (Exception e) {
            return new Font(Font.HELVETICA, size, style);
        }
    }

    private String formatMoney(BigDecimal money) {
        if (money == null) {
            return "0 VND";
        }

        DecimalFormat df = new DecimalFormat("#,###");
        return df.format(money) + " VND";
    }

    private String safe(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    private String safeFileName(String value) {
        if (value == null) {
            return "unknown";
        }

        return value
                .replaceAll("[\\\\/:*?\"<>|]", "_")
                .replaceAll("\\s+", "_");
    }

    private String getReadableMailError(Exception e) {
        String message = e.getMessage();

        if (message == null) {
            return "Không xác định được lỗi gửi email.";
        }

        String lower = message.toLowerCase();

        if (lower.contains("authentication failed")
                || lower.contains("bad credentials")
                || lower.contains("username and password not accepted")
                || lower.contains("535")) {
            return "Gmail từ chối đăng nhập. Hãy kiểm tra Gmail gửi đi và App Password.";
        }

        if (lower.contains("could not connect")
                || lower.contains("connection timed out")
                || lower.contains("timeout")) {
            return "Không kết nối được tới smtp.gmail.com:587. Hãy kiểm tra mạng hoặc tường lửa.";
        }

        if (lower.contains("invalid addresses")
                || lower.contains("address")) {
            return "Địa chỉ email không hợp lệ.";
        }

        return message;
    }

    private void ghiLogHeThong(String hanhDong, String nguoiDung) {
        try {
            String thoiGian = new SimpleDateFormat("HH:mm dd/MM/yyyy").format(new Date());

            jdbcTemplate.update(
                    "INSERT INTO system_logs (thoi_gian, hanh_dong, nguoi_dung) VALUES (?, ?, ?)",
                    thoiGian,
                    hanhDong,
                    nguoiDung
            );
        } catch (Exception e) {
            System.out.println("Lỗi ghi log email: " + e.getMessage());
        }
    }
}