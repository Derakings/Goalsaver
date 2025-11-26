# Payment Testing Guide for Goalsaver

## Current Payment Implementation

The Goalsaver app currently has a **mock payment system** for testing purposes. Here's how to test the complete savings-to-purchase flow:

## Testing the Complete Flow

### Step 1: Create a Savings Group
1. Log in to your account
2. Go to **Groups** → **Create Group**
3. Set a low target amount for testing (e.g., ₦1,000)
4. Fill in the details:
   - Group Name: "Test Purchase Group"
   - Target Amount: 1000
   - Target Item: "Test Item"
5. Click **Create Group**

### Step 2: Make Contributions
1. Open your group
2. Click **Add Contribution**
3. Contribute the full amount or split across multiple contributions
4. Once contributions reach 100% of the target, the system will:
   - Automatically change group status to `PURCHASING`
   - Create a purchase record
   - Trigger notifications to all members

### Step 3: Monitor Purchase Process
1. The purchase service (`backend/src/services/purchase.service.ts`) handles:
   - `initiatePurchase()` - Creates purchase record
   - `completePurchase()` - Marks as completed
2. Currently, purchases are **automatically marked as complete** for testing

### Step 4: Verify Purchase Completion
1. Check the **Dashboard** for purchase completion notification
2. Group status will change to `COMPLETED`
3. All members receive email notifications

---

## Integrating Real Payment Gateway

To add real payment processing, you'll need to integrate a payment provider. Here are the recommended options for Nigerian payments:

### Option 1: Paystack (Recommended)
**Why Paystack?**
- Popular in Nigeria
- Supports card payments, bank transfers, USSD
- Easy API integration
- Good documentation

**Steps to Integrate:**

1. **Sign up at [https://paystack.com](https://paystack.com)**
2. **Get API keys** from Dashboard → Settings → API Keys & Webhooks
3. **Install Paystack SDK:**
   ```bash
   cd backend
   npm install paystack-node
   ```

4. **Update `.env`:**
   ```env
   PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
   PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
   ```

5. **Modify `backend/src/services/purchase.service.ts`:**
   ```typescript
   import Paystack from 'paystack-node';
   
   const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);
   
   async initiatePurchase(groupId: string) {
     // Get group and total amount
     const group = await prisma.group.findUnique({ where: { id: groupId } });
     
     // Create purchase record
     const purchase = await prisma.purchase.create({
       data: {
         groupId,
         totalAmount: group.currentAmount,
         status: 'PENDING',
       },
     });
     
     // Initialize Paystack transaction
     const response = await paystack.transaction.initialize({
       email: 'admin@goalsaver.com', // Group admin email
       amount: group.currentAmount * 100, // Amount in kobo
       reference: purchase.id,
       callback_url: `${process.env.FRONTEND_URL}/purchase/callback`,
     });
     
     return {
       purchaseId: purchase.id,
       authorizationUrl: response.data.authorization_url,
     };
   }
   ```

6. **Add webhook handler:**
   ```typescript
   // backend/src/routes/webhook.routes.ts
   router.post('/paystack', async (req, res) => {
     const hash = crypto
       .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
       .update(JSON.stringify(req.body))
       .digest('hex');
     
     if (hash === req.headers['x-paystack-signature']) {
       const event = req.body;
       
       if (event.event === 'charge.success') {
         await purchaseService.completePurchase(event.data.reference);
       }
     }
     
     res.sendStatus(200);
   });
   ```

### Option 2: Flutterwave
- Similar setup to Paystack
- Supports multiple African currencies
- SDK: `npm install flutterwave-node-v3`

### Option 3: Stripe (International)
- Best for international payments
- More complex setup for Nigeria
- SDK: `npm install stripe`

---

## Testing with Test Cards

### Paystack Test Cards:
```
Successful:
Card Number: 4084084084084081
CVV: 408
Expiry: Any future date
PIN: 0000
OTP: 123456

Declined:
Card Number: 5060666666666666666
CVV: 123
Expiry: Any future date
```

### Flutterwave Test Cards:
```
Successful:
Card Number: 5531886652142950
CVV: 564
Expiry: 09/32
PIN: 3310
OTP: 12345
```

---

## Current Mock Implementation

For testing without payment integration, the app uses this flow:

1. **When target is reached:**
   - `PurchaseService.initiatePurchase()` is called
   - Purchase record created with status `PENDING`
   - Notifications sent to all members

2. **Manual completion (for testing):**
   - Admin can mark purchase as complete
   - Updates group status to `COMPLETED`
   - Sends completion notifications

3. **Testing endpoint:**
   ```bash
   # Complete a purchase manually
   curl -X POST http://localhost:3000/api/purchases/{purchaseId}/complete \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

---

## Frontend Integration

Once payment gateway is integrated, update the frontend:

```typescript
// frontend/app/(dashboard)/groups/[id]/purchase/page.tsx
const handlePurchase = async () => {
  const response = await fetch(`${API_URL}/purchases/initiate`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ groupId }),
  });
  
  const { authorizationUrl } = await response.json();
  
  // Redirect to payment page
  window.location.href = authorizationUrl;
};
```

---

## Production Checklist

Before going live with real payments:

- [ ] Switch to live API keys (not test keys)
- [ ] Set up webhook URLs in payment provider dashboard
- [ ] Add SSL certificate to your domain
- [ ] Test with small real amounts first
- [ ] Set up proper error handling and refund flows
- [ ] Add payment receipts and invoices
- [ ] Implement dispute resolution system
- [ ] Add payment history tracking
- [ ] Set up monitoring and alerting for failed payments

---

## Need Help?

- **Paystack Docs:** https://paystack.com/docs/
- **Flutterwave Docs:** https://developer.flutterwave.com/docs
- **Stripe Docs:** https://stripe.com/docs

For any questions about the Goalsaver payment integration, check the purchase service code at `/backend/src/services/purchase.service.ts`
