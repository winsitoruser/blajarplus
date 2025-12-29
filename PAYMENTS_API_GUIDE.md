# Payments API Guide - Blajarplus

Panduan lengkap untuk menggunakan Payments API dengan integrasi Midtrans.

---

## 🎯 Available Endpoints

### 1. Create Payment
**POST** `/api/payments`  
**Auth:** Required (JWT Token)  
**Role:** Student only

Membuat payment untuk booking dan mendapatkan Snap Token dari Midtrans.

**Request Body:**
```json
{
  "bookingId": "booking-uuid",
  "paymentMethod": "credit_card",
  "callbackUrl": "https://myapp.com/payment/success"
}
```

**Field Descriptions:**
- `bookingId` - ID booking yang akan dibayar
- `paymentMethod` - Metode pembayaran (credit_card, bank_transfer, gopay, dll)
- `callbackUrl` - URL callback setelah payment selesai (optional)

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "booking-uuid",
    "paymentMethod": "credit_card"
  }'
```

**Response:**
```json
{
  "id": "payment-uuid",
  "bookingId": "booking-uuid",
  "amount": 300000,
  "paymentMethod": "credit_card",
  "status": "pending",
  "orderId": "ORDER-1703808000000-abc12345",
  "snapToken": "mock-snap-token-1703808000000",
  "midtransClientKey": "your-midtrans-client-key",
  "createdAt": "2024-12-29T00:00:00.000Z",
  "booking": {
    "id": "booking-uuid",
    "scheduledAt": "2024-12-30T10:00:00.000Z",
    "duration": 2,
    "totalAmount": 300000,
    "student": {
      "fullName": "John Doe",
      "email": "student@example.com"
    },
    "tutor": {
      "user": {
        "fullName": "Jane Teacher"
      }
    },
    "subject": {
      "name": "Matematika"
    }
  }
}
```

**Next Steps:**
Use the `snapToken` to open Midtrans payment page:
```javascript
snap.pay(snapToken, {
  onSuccess: function(result) {
    // Payment success
  },
  onPending: function(result) {
    // Payment pending
  },
  onError: function(result) {
    // Payment error
  }
});
```

---

### 2. Payment Webhook (Midtrans Callback)
**POST** `/api/payments/webhook`  
**Auth:** Not required (Midtrans webhook)  
**Public endpoint**

Endpoint untuk menerima notifikasi dari Midtrans tentang status payment.

**Request Body (from Midtrans):**
```json
{
  "transaction_status": "settlement",
  "order_id": "ORDER-1703808000000-abc12345",
  "payment_type": "credit_card",
  "transaction_id": "midtrans-txn-123",
  "fraud_status": "accept",
  "signature_key": "hash-signature"
}
```

**Response:**
```json
{
  "message": "Notification processed successfully"
}
```

**Transaction Status:**
- `capture` / `settlement` - Payment berhasil
- `pending` - Payment pending
- `deny` / `expire` / `cancel` - Payment gagal
- `refund` - Payment di-refund

**Auto Actions:**
- Payment `settlement` → Booking status jadi `confirmed`
- Payment `failed` → Booking status jadi `cancelled`
- Updates payment record dengan transaction ID

---

### 3. Get Payment by ID
**GET** `/api/payments/:id`  
**Auth:** Required (JWT Token)

Mendapatkan detail payment berdasarkan ID.

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/payments/payment-uuid" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "id": "payment-uuid",
  "bookingId": "booking-uuid",
  "amount": 300000,
  "paymentMethod": "credit_card",
  "status": "paid",
  "orderId": "ORDER-1703808000000-abc12345",
  "snapToken": "mock-snap-token-1703808000000",
  "midtransTransactionId": "midtrans-txn-123",
  "paidAt": "2024-12-29T01:00:00.000Z",
  "createdAt": "2024-12-29T00:00:00.000Z",
  "booking": {
    "student": {
      "fullName": "John Doe"
    },
    "tutor": {
      "user": {
        "fullName": "Jane Teacher"
      }
    },
    "subject": {
      "name": "Matematika"
    }
  }
}
```

---

### 4. Get Payment by Order ID
**GET** `/api/payments/order/:orderId`  
**Auth:** Not required  
**Public endpoint** (for callback pages)

Mendapatkan payment berdasarkan Order ID (untuk halaman callback).

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/payments/order/ORDER-1703808000000-abc12345"
```

---

### 5. Request Refund
**POST** `/api/payments/:id/refund`  
**Auth:** Required (JWT Token)  
**Role:** Student (owner only)

Request refund untuk payment yang sudah dibayar.

**Request Body:**
```json
{
  "reason": "Booking dibatalkan karena tutor sakit"
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/payments/payment-uuid/refund" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Booking dibatalkan karena tutor sakit"
  }'
```

**Response:**
```json
{
  "id": "payment-uuid",
  "status": "refund_pending",
  "booking": {
    "status": "cancelled"
  }
}
```

---

## 🔄 Payment Flow

```
1. Student creates booking
   ↓
2. Student creates payment
   ↓
3. Get Snap Token from Midtrans
   ↓
4. Student pays via Midtrans
   ↓
5. Midtrans sends webhook notification
   ↓
6. Payment status updated
   ↓
7. Booking status updated to "confirmed"
```

---

## 🧪 Complete Testing Flow

### Scenario 1: Complete Payment Flow

```bash
# 1. Login as student
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "student@example.com",
    "password": "Password123"
  }'

# Save student token

# 2. Create booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tutorId": "tutor-uuid",
    "subjectId": "subject-uuid",
    "scheduledAt": "2024-12-30T10:00:00.000Z",
    "duration": 2,
    "bookingType": "single",
    "teachingMethod": "online"
  }'

# Save booking ID

# 3. Create payment
curl -X POST http://localhost:3000/api/payments \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "booking-uuid",
    "paymentMethod": "credit_card"
  }'

# Save payment ID and snap token

# 4. Simulate Midtrans webhook (settlement)
curl -X POST http://localhost:3000/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_status": "settlement",
    "order_id": "ORDER-1703808000000-abc12345",
    "payment_type": "credit_card",
    "transaction_id": "midtrans-txn-123"
  }'

# 5. Check payment status
curl -X GET "http://localhost:3000/api/payments/payment-uuid" \
  -H "Authorization: Bearer STUDENT_TOKEN"

# 6. Check booking status (should be "confirmed")
curl -X GET "http://localhost:3000/api/bookings/booking-uuid" \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

### Scenario 2: Payment Failed

```bash
# Simulate Midtrans webhook (deny)
curl -X POST http://localhost:3000/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_status": "deny",
    "order_id": "ORDER-1703808000000-abc12345",
    "payment_type": "credit_card"
  }'

# Payment status will be "failed"
# Booking status will be "cancelled"
```

### Scenario 3: Request Refund

```bash
# 1. Cancel booking first
curl -X PUT "http://localhost:3000/api/bookings/booking-uuid/cancel" \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cancellationReason": "Ada keperluan mendadak"
  }'

# 2. Request refund
curl -X POST "http://localhost:3000/api/payments/payment-uuid/refund" \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Booking dibatalkan"
  }'
```

---

## 📊 Business Rules

### 1. Payment Creation
- ✅ Only students can create payments
- ✅ Can only pay for own bookings
- ✅ Booking must be in "pending" status
- ✅ One active payment per booking
- ✅ Auto-generate unique order ID

### 2. Payment Status
- **pending** - Payment created, waiting for user to pay
- **paid** - Payment successful
- **failed** - Payment failed/cancelled
- **refund_pending** - Refund requested
- **refunded** - Refund completed

### 3. Webhook Processing
- ✅ Verify Midtrans signature
- ✅ Update payment status
- ✅ Update booking status
- ✅ Idempotent (safe to retry)

### 4. Refund Policy
- ✅ Only paid payments can be refunded
- ✅ Booking must be cancelled first
- ✅ Only student can request refund
- ✅ Manual approval by admin (future)

---

## 🔐 Midtrans Integration

### Configuration (.env)

```env
MIDTRANS_SERVER_KEY=your-server-key
MIDTRANS_CLIENT_KEY=your-client-key
MIDTRANS_IS_PRODUCTION=false
```

### Development Mode

Jika `MIDTRANS_SERVER_KEY` tidak diset:
- Mock snap token akan di-generate
- Signature verification di-skip
- Cocok untuk development/testing

### Production Mode

Set `MIDTRANS_IS_PRODUCTION=true` untuk:
- Use production Midtrans API
- Real payment processing
- Strict signature verification

### Frontend Integration

```html
<!-- Include Midtrans Snap.js -->
<script src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key="your-client-key"></script>

<script>
// After creating payment, use snap token
const paymentResponse = await createPayment(bookingId);
const snapToken = paymentResponse.snapToken;

snap.pay(snapToken, {
  onSuccess: function(result) {
    console.log('Payment success:', result);
    window.location.href = '/payment/success';
  },
  onPending: function(result) {
    console.log('Payment pending:', result);
    window.location.href = '/payment/pending';
  },
  onError: function(result) {
    console.log('Payment error:', result);
    window.location.href = '/payment/error';
  },
  onClose: function() {
    console.log('Payment popup closed');
  }
});
</script>
```

---

## ⚠️ Error Scenarios

### Booking Not Found
```json
{
  "statusCode": 404,
  "message": "Booking not found"
}
```

### Not Your Booking
```json
{
  "statusCode": 403,
  "message": "You can only pay for your own bookings"
}
```

### Booking Not Pending
```json
{
  "statusCode": 400,
  "message": "Can only pay for pending bookings"
}
```

### Payment Already Exists
```json
{
  "statusCode": 400,
  "message": "Payment already exists for this booking"
}
```

### Invalid Signature (Webhook)
```json
{
  "statusCode": 400,
  "message": "Invalid signature"
}
```

---

## 📝 API Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/payments` | POST | ✅ | Create payment |
| `/api/payments/webhook` | POST | ❌ | Midtrans webhook |
| `/api/payments/:id` | GET | ✅ | Get payment by ID |
| `/api/payments/order/:orderId` | GET | ❌ | Get by order ID |
| `/api/payments/:id/refund` | POST | ✅ | Request refund |

**Total Endpoints:** 5 endpoints  
**Public:** 2 endpoints (webhook, order lookup)  
**Protected:** 3 endpoints

---

## 🎯 Next Steps

1. ✅ Test payment creation
2. ✅ Test webhook simulation
3. 🔨 Setup real Midtrans account
4. 🔨 Test with real payment
5. 🔨 Implement refund processing
6. 🔨 Add payment history page
7. 🔨 Add admin payment management

---

**Happy Testing! 💰**
