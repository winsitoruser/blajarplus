import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST') || 'smtp.gmail.com',
      port: this.configService.get('SMTP_PORT') || 587,
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"BlajarPlus" <${this.configService.get('SMTP_USER')}>`,
        to,
        subject,
        html,
      });
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendBookingConfirmationEmail(to: string, userName: string, tutorName: string, bookingDetails: any) {
    const subject = 'Booking Dikonfirmasi - BlajarPlus';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Booking Dikonfirmasi!</h1>
          </div>
          <div class="content">
            <p>Halo ${userName},</p>
            <p>Kabar baik! <strong>${tutorName}</strong> telah mengkonfirmasi booking Anda.</p>
            
            <div class="details">
              <h3>Detail Booking:</h3>
              <p><strong>Tutor:</strong> ${tutorName}</p>
              <p><strong>Mata Pelajaran:</strong> ${bookingDetails.subject}</p>
              <p><strong>Tanggal & Waktu:</strong> ${bookingDetails.dateTime}</p>
              <p><strong>Durasi:</strong> ${bookingDetails.duration} jam</p>
              <p><strong>Total:</strong> Rp ${bookingDetails.amount?.toLocaleString('id-ID')}</p>
            </div>

            <p>Persiapkan diri Anda untuk kelas yang produktif!</p>
            
            <a href="${this.configService.get('FRONTEND_URL')}/bookings/${bookingDetails.id}" class="button">
              Lihat Detail Booking
            </a>

            <p>Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi tutor melalui fitur chat.</p>
          </div>
          <div class="footer">
            <p>© 2024 BlajarPlus. All rights reserved.</p>
            <p>Email ini dikirim otomatis, mohon tidak membalas.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendPaymentSuccessEmail(to: string, userName: string, amount: number, bookingId: string) {
    const subject = 'Pembayaran Berhasil - BlajarPlus';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .amount { font-size: 32px; font-weight: bold; color: #10b981; text-align: center; margin: 20px 0; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Pembayaran Berhasil!</h1>
          </div>
          <div class="content">
            <p>Halo ${userName},</p>
            <p>Pembayaran Anda telah berhasil diproses.</p>
            
            <div class="amount">
              Rp ${amount.toLocaleString('id-ID')}
            </div>

            <p>Dana Anda telah disimpan dengan aman dalam sistem escrow kami dan akan diteruskan ke tutor setelah kelas selesai.</p>
            
            <a href="${this.configService.get('FRONTEND_URL')}/bookings/${bookingId}" class="button">
              Lihat Detail Booking
            </a>

            <p>Terima kasih telah menggunakan BlajarPlus!</p>
          </div>
          <div class="footer">
            <p>© 2024 BlajarPlus. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendNewBookingEmail(to: string, tutorName: string, studentName: string, bookingDetails: any) {
    const subject = 'Booking Baru Menunggu Konfirmasi - BlajarPlus';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Booking Baru!</h1>
          </div>
          <div class="content">
            <p>Halo ${tutorName},</p>
            <p>Anda memiliki booking baru dari <strong>${studentName}</strong>.</p>
            
            <div class="details">
              <h3>Detail Booking:</h3>
              <p><strong>Student:</strong> ${studentName}</p>
              <p><strong>Mata Pelajaran:</strong> ${bookingDetails.subject}</p>
              <p><strong>Tanggal & Waktu:</strong> ${bookingDetails.dateTime}</p>
              <p><strong>Durasi:</strong> ${bookingDetails.duration} jam</p>
            </div>

            <p>Silakan konfirmasi atau tolak booking ini sesegera mungkin.</p>
            
            <a href="${this.configService.get('FRONTEND_URL')}/dashboard/tutor" class="button">
              Konfirmasi Booking
            </a>
          </div>
          <div class="footer">
            <p>© 2024 BlajarPlus. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendWelcomeEmail(to: string, userName: string) {
    const subject = 'Selamat Datang di BlajarPlus!';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .features { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Selamat Datang di BlajarPlus!</h1>
          </div>
          <div class="content">
            <p>Halo ${userName},</p>
            <p>Terima kasih telah bergabung dengan BlajarPlus! Kami senang Anda menjadi bagian dari komunitas pembelajaran kami.</p>
            
            <div class="features">
              <h3>Apa yang bisa Anda lakukan:</h3>
              <ul>
                <li>🔍 Cari tutor terbaik sesuai kebutuhan Anda</li>
                <li>💬 Chat langsung dengan tutor</li>
                <li>📅 Booking kelas dengan mudah</li>
                <li>💰 Pembayaran aman dengan escrow</li>
                <li>⭐ Berikan review untuk tutor</li>
              </ul>
            </div>

            <a href="${this.configService.get('FRONTEND_URL')}/search" class="button">
              Mulai Cari Tutor
            </a>

            <p>Jika Anda memiliki pertanyaan, tim support kami siap membantu!</p>
          </div>
          <div class="footer">
            <p>© 2024 BlajarPlus. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    return this.sendEmail(to, subject, html);
  }
}
