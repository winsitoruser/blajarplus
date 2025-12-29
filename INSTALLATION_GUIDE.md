# 📦 Installation Guide - Notification Enhancements

**Required for all 5 notification enhancements to work**

---

## 🔧 BACKEND INSTALLATION

### 1. Install Dependencies

```bash
cd backend

# WebSocket support
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io

# Email support
npm install nodemailer
npm install -D @types/nodemailer

# Push notifications
npm install web-push
```

### 2. Generate VAPID Keys for Push Notifications

```bash
npx web-push generate-vapid-keys
```

Copy the output and add to `.env` file.

### 3. Update Environment Variables

Create or update `backend/.env`:

```env
# Existing variables
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url

# WebSocket
FRONTEND_URL=http://localhost:3001

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

# Push Notifications
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

### 4. Gmail App Password Setup

1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → App Passwords
4. Generate new app password for "Mail"
5. Use this password in `SMTP_PASS`

### 5. Update Database Schema

Add to `backend/prisma/schema.prisma`:

```prisma
model User {
  // ... existing fields
  notificationPreferences Json? @map("notification_preferences")
  pushSubscription        Json? @map("push_subscription")
}
```

Then run migration:

```bash
npx prisma migrate dev --name add_notification_enhancements
npx prisma generate
```

### 6. Update App Module

File: `backend/src/app.module.ts`

```typescript
import { WebSocketModule } from './websocket/websocket.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    // ... existing modules
    WebSocketModule,
    EmailModule,
    NotificationsModule, // Already added
  ],
})
export class AppModule {}
```

---

## 🎨 FRONTEND INSTALLATION

### 1. Install Dependencies

```bash
cd frontend

# WebSocket client
npm install socket.io-client
```

### 2. Update Environment Variables

Create or update `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
```

### 3. Add Sound Files

Create `frontend/public/sounds/` directory and add audio files:

- `notification.mp3` - General notification sound
- `message.mp3` - New message sound
- `success.mp3` - Success event sound
- `alert.mp3` - Important alert sound

**Free sound sources:**
- [Freesound.org](https://freesound.org/)
- [Zapsplat.com](https://www.zapsplat.com/)
- [Notification Sounds](https://notificationsounds.com/)

Or use these simple beep sounds:
```bash
# Download sample sounds
curl -o frontend/public/sounds/notification.mp3 https://freesound.org/data/previews/316/316847_4939433-lq.mp3
```

### 4. Add Icon Files

Add to `frontend/public/`:

- `icon-192.png` - App icon (192x192)
- `badge-72.png` - Badge icon (72x72)

You can use your logo or create simple icons.

### 5. Service Worker Already Created

The file `frontend/public/sw.js` is already created. No action needed.

---

## 🚀 TESTING THE SETUP

### 1. Start Backend

```bash
cd backend
npm run start:dev
```

Check console for:
- ✅ "WebSocket server started"
- ✅ "Email service initialized"

### 2. Start Frontend

```bash
cd frontend
npm run dev
```

### 3. Test WebSocket

1. Login to the app
2. Open browser console
3. Look for: "WebSocket connected"

### 4. Test Push Notifications

1. Click notification bell icon
2. Look for "Enable Push Notifications" button
3. Click and grant permission
4. Check console for: "Push subscription successful"

### 5. Test Email

Create a test booking and check your email inbox.

### 6. Test Sound

1. Receive a notification
2. Sound should play automatically
3. Check browser console if blocked

---

## 🔍 TROUBLESHOOTING

### WebSocket Issues

**Problem**: "WebSocket connection failed"

**Solutions**:
- Check backend is running on port 3000
- Check FRONTEND_URL in backend .env
- Check firewall settings
- Try different transport: `transports: ['polling', 'websocket']`

### Email Issues

**Problem**: "Error sending email"

**Solutions**:
- Verify Gmail App Password is correct
- Check SMTP settings
- Enable "Less secure app access" (not recommended)
- Use Gmail App Password instead

### Push Notification Issues

**Problem**: "Push subscription failed"

**Solutions**:
- Check VAPID keys are correct
- Ensure HTTPS in production (localhost is OK for dev)
- Check browser supports push notifications
- Clear browser cache and retry

### Sound Issues

**Problem**: "Sound autoplay blocked"

**Solutions**:
- User must interact with page first (click anywhere)
- Check browser autoplay policy
- Reduce volume in useSoundAlert hook
- Check sound files exist in `/public/sounds/`

### Database Issues

**Problem**: "Column 'notificationPreferences' does not exist"

**Solutions**:
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
```

---

## ✅ VERIFICATION CHECKLIST

### Backend:
- [ ] All npm packages installed
- [ ] .env file configured
- [ ] VAPID keys generated
- [ ] Database migrated
- [ ] Backend starts without errors
- [ ] WebSocket gateway initialized

### Frontend:
- [ ] socket.io-client installed
- [ ] .env.local configured
- [ ] Sound files added
- [ ] Icon files added
- [ ] Service worker registered
- [ ] Frontend starts without errors

### Features:
- [ ] WebSocket connects on login
- [ ] Real-time notifications work
- [ ] Push permission can be requested
- [ ] Push notifications received
- [ ] Email notifications sent
- [ ] Sound alerts play
- [ ] Notification preferences save

---

## 📚 ADDITIONAL RESOURCES

### Documentation:
- [Socket.IO Docs](https://socket.io/docs/v4/)
- [Nodemailer Docs](https://nodemailer.com/)
- [Web Push Docs](https://github.com/web-push-libs/web-push)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

### Tutorials:
- [WebSocket with NestJS](https://docs.nestjs.com/websockets/gateways)
- [Push Notifications Guide](https://web.dev/push-notifications-overview/)
- [Email Templates](https://github.com/leemunroe/responsive-html-email-template)

---

## 🎯 QUICK START COMMANDS

```bash
# Backend setup
cd backend
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io nodemailer web-push
npm install -D @types/nodemailer
npx web-push generate-vapid-keys
# Copy keys to .env
npx prisma migrate dev --name add_notification_enhancements
npm run start:dev

# Frontend setup
cd frontend
npm install socket.io-client
# Add sound files to public/sounds/
# Add .env.local with VAPID key
npm run dev

# Test
# Login and check console for "WebSocket connected"
# Click notification bell
# Request push permission
# Create a booking to test email
```

---

**Installation complete! All 5 notification enhancements are now ready to use.** 🎉
