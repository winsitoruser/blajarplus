import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  async sendCertificationEmail(userEmail: string, userName: string, certificationName: string, certificateNumber: string) {
    // In production, use nodemailer or SendGrid
    const emailTemplate = this.getCertificationEmailTemplate(userName, certificationName, certificateNumber);
    
    console.log('📧 Sending certification email to:', userEmail);
    console.log('Subject: Congratulations! You\'ve Earned a Certificate');
    console.log('Template:', emailTemplate);

    // Simulate email sending
    return {
      success: true,
      to: userEmail,
      subject: 'Congratulations! You\'ve Earned a Certificate',
      message: 'Email sent successfully (simulated)',
    };
  }

  async sendLearningPathReminderEmail(userEmail: string, userName: string, milestoneName: string, daysUntil: number) {
    const emailTemplate = this.getLearningPathReminderTemplate(userName, milestoneName, daysUntil);
    
    console.log('📧 Sending learning path reminder to:', userEmail);
    console.log('Subject: Upcoming Milestone Reminder');
    
    return {
      success: true,
      to: userEmail,
      subject: 'Upcoming Milestone Reminder',
      message: 'Email sent successfully (simulated)',
    };
  }

  async sendMaterialCompletionEmail(userEmail: string, userName: string, courseName: string, completionPercentage: number) {
    const emailTemplate = this.getMaterialCompletionTemplate(userName, courseName, completionPercentage);
    
    console.log('📧 Sending material completion update to:', userEmail);
    
    return {
      success: true,
      to: userEmail,
      subject: `Great Progress in ${courseName}!`,
      message: 'Email sent successfully (simulated)',
    };
  }

  private getCertificationEmailTemplate(userName: string, certificationName: string, certificateNumber: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .badge {
      text-align: center;
      font-size: 80px;
      margin: 20px 0;
    }
    .cert-number {
      background: #fff;
      padding: 15px;
      border-left: 4px solid #667eea;
      margin: 20px 0;
      font-family: monospace;
    }
    .button {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 Congratulations!</h1>
    <p>You've Earned a Certificate</p>
  </div>
  
  <div class="content">
    <div class="badge">🏆</div>
    
    <p>Dear ${userName},</p>
    
    <p>We are thrilled to inform you that you have successfully completed the requirements and earned:</p>
    
    <h2 style="color: #667eea; text-align: center;">${certificationName}</h2>
    
    <p>Your dedication and hard work have paid off! This achievement demonstrates your commitment to learning and personal growth.</p>
    
    <div class="cert-number">
      <strong>Certificate Number:</strong> ${certificateNumber}
    </div>
    
    <p style="text-align: center;">
      <a href="https://blajarplus.com/certificates/${certificateNumber}" class="button">
        View & Download Certificate
      </a>
    </p>
    
    <p><strong>What's Next?</strong></p>
    <ul>
      <li>Download your certificate and add it to your portfolio</li>
      <li>Share your achievement on social media</li>
      <li>Continue learning with our advanced courses</li>
      <li>Earn more certifications to boost your credentials</li>
    </ul>
    
    <p>Keep up the excellent work!</p>
    
    <p>Best regards,<br>
    <strong>The BlajarPlus Team</strong></p>
  </div>
  
  <div class="footer">
    <p>BlajarPlus Language Academy<br>
    Your Partner in Language Learning Excellence</p>
  </div>
</body>
</html>
    `;
  }

  private getLearningPathReminderTemplate(userName: string, milestoneName: string, daysUntil: number): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .milestone {
      background: white;
      padding: 20px;
      border-left: 4px solid #667eea;
      margin: 20px 0;
    }
    .days-remaining {
      font-size: 48px;
      font-weight: bold;
      color: #667eea;
      text-align: center;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>⏰ Milestone Reminder</h1>
  </div>
  
  <div class="content">
    <p>Hi ${userName},</p>
    
    <p>This is a friendly reminder about your upcoming learning milestone:</p>
    
    <div class="milestone">
      <h3>${milestoneName}</h3>
      <div class="days-remaining">${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}</div>
      <p style="text-align: center;">until your target date</p>
    </div>
    
    <p><strong>Stay on track!</strong> Here are some tips:</p>
    <ul>
      <li>Review your study materials regularly</li>
      <li>Complete at least one lesson per day</li>
      <li>Practice what you've learned</li>
      <li>Don't hesitate to revisit challenging topics</li>
    </ul>
    
    <p>You're making great progress. Keep it up!</p>
    
    <p>Best regards,<br>
    <strong>The BlajarPlus Team</strong></p>
  </div>
</body>
</html>
    `;
  }

  private getMaterialCompletionTemplate(userName: string, courseName: string, completionPercentage: number): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .progress-bar {
      background: #e0e0e0;
      height: 30px;
      border-radius: 15px;
      overflow: hidden;
      margin: 20px 0;
    }
    .progress-fill {
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      height: 100%;
      width: ${completionPercentage}%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📚 Great Progress!</h1>
  </div>
  
  <div class="content">
    <p>Hi ${userName},</p>
    
    <p>You're making excellent progress in <strong>${courseName}</strong>!</p>
    
    <div class="progress-bar">
      <div class="progress-fill">${completionPercentage}%</div>
    </div>
    
    <p>Keep up the momentum and you'll complete this course in no time!</p>
    
    <p>Best regards,<br>
    <strong>The BlajarPlus Team</strong></p>
  </div>
</body>
</html>
    `;
  }
}
