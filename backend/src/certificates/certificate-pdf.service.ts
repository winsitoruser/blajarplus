import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CertificatePdfService {
  constructor(private prisma: PrismaService) {}

  async generateCertificatePDF(userCertificationId: string): Promise<Buffer> {
    const userCert = await this.prisma.userCertification.findUnique({
      where: { id: userCertificationId },
      include: {
        user: true,
        certification: {
          include: {
            course: {
              include: { language: true },
            },
          },
        },
      },
    });

    if (!userCert) {
      throw new Error('Certificate not found');
    }

    // Generate PDF content (simplified - in production use pdfkit or puppeteer)
    const certificateHtml = this.generateCertificateHTML(userCert);
    
    // For now, return HTML as buffer (in production, convert to PDF)
    return Buffer.from(certificateHtml, 'utf-8');
  }

  private generateCertificateHTML(userCert: any): string {
    const earnedDate = new Date(userCert.earnedAt).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4 landscape;
      margin: 0;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Georgia', serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .certificate {
      width: 297mm;
      height: 210mm;
      background: white;
      padding: 40px 60px;
      box-shadow: 0 10px 50px rgba(0,0,0,0.3);
      position: relative;
      border: 20px solid #f0f0f0;
    }
    .certificate::before {
      content: '';
      position: absolute;
      top: 30px;
      left: 30px;
      right: 30px;
      bottom: 30px;
      border: 3px solid #667eea;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 48px;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 10px;
    }
    .subtitle {
      font-size: 18px;
      color: #666;
      letter-spacing: 3px;
    }
    .title {
      text-align: center;
      font-size: 56px;
      font-weight: bold;
      color: #333;
      margin: 40px 0 30px;
      text-transform: uppercase;
      letter-spacing: 5px;
    }
    .content {
      text-align: center;
      font-size: 22px;
      line-height: 1.8;
      color: #555;
      margin: 30px 0;
    }
    .recipient {
      font-size: 42px;
      font-weight: bold;
      color: #667eea;
      margin: 25px 0;
      font-style: italic;
    }
    .course-name {
      font-size: 32px;
      font-weight: bold;
      color: #333;
      margin: 20px 0;
    }
    .details {
      display: flex;
      justify-content: space-around;
      margin: 40px 0;
      font-size: 16px;
      color: #666;
    }
    .detail-item {
      text-align: center;
    }
    .detail-label {
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      margin-top: 60px;
      padding-top: 30px;
      border-top: 2px solid #ddd;
    }
    .signature {
      text-align: center;
      flex: 1;
    }
    .signature-line {
      width: 200px;
      border-top: 2px solid #333;
      margin: 50px auto 10px;
    }
    .signature-name {
      font-weight: bold;
      color: #333;
    }
    .signature-title {
      font-size: 14px;
      color: #666;
    }
    .seal {
      width: 100px;
      height: 100px;
      border: 3px solid #667eea;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #667eea;
      font-size: 14px;
      text-align: center;
      line-height: 1.2;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="logo">🎓 BlajarPlus</div>
      <div class="subtitle">LANGUAGE ACADEMY</div>
    </div>
    
    <div class="title">Certificate of Completion</div>
    
    <div class="content">
      This is to certify that
    </div>
    
    <div class="recipient">${userCert.user.fullName}</div>
    
    <div class="content">
      has successfully completed the
    </div>
    
    <div class="course-name">
      ${userCert.certification.course.language.flag} ${userCert.certification.course.title}
    </div>
    
    <div class="content">
      and has demonstrated proficiency in<br>
      <strong>${userCert.certification.name}</strong>
    </div>
    
    <div class="details">
      <div class="detail-item">
        <div class="detail-label">Certificate Number</div>
        <div>${userCert.certificateNumber}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Date Issued</div>
        <div>${earnedDate}</div>
      </div>
      ${userCert.score ? `
      <div class="detail-item">
        <div class="detail-label">Final Score</div>
        <div>${userCert.score}%</div>
      </div>
      ` : ''}
    </div>
    
    <div class="footer">
      <div class="signature">
        <div class="signature-line"></div>
        <div class="signature-name">Director of Education</div>
        <div class="signature-title">BlajarPlus Language Academy</div>
      </div>
      
      <div class="seal">
        OFFICIAL<br>SEAL
      </div>
      
      <div class="signature">
        <div class="signature-line"></div>
        <div class="signature-name">Head of Certification</div>
        <div class="signature-title">BlajarPlus Language Academy</div>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }

  async getCertificateUrl(certificateNumber: string): Promise<string> {
    // Generate public URL for certificate verification
    return `https://blajarplus.com/verify/${certificateNumber}`;
  }
}
