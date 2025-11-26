# Email Configuration Guide

## Recommended Email Services

### 1. Gmail (Free - Development)
- Go to https://myaccount.google.com/apppasswords
- Create an "App Password" for your application
- Use these settings:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-digit-app-password
SMTP_FROM=your-email@gmail.com
```

### 2. SendGrid (Free tier: 100 emails/day)
- Sign up at https://sendgrid.com
- Create an API key
- Use these settings:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```

### 3. Mailgun (Free tier: 5,000 emails/month)
- Sign up at https://www.mailgun.com
- Get your SMTP credentials
- Use these settings:

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
SMTP_FROM=noreply@yourdomain.com
```

### 4. Brevo (formerly Sendinblue) (Free tier: 300 emails/day)
- Sign up at https://www.brevo.com
- Get SMTP credentials
- Use these settings:

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email
SMTP_PASS=your-brevo-smtp-key
SMTP_FROM=noreply@yourdomain.com
```

## Setup Instructions

1. Choose an email service from above
2. Get your SMTP credentials
3. Update `/home/dera_kings20/Main_Project/Goalsaver/backend/.env` with your credentials
4. Restart the backend server
5. Test by registering a new account

## Testing Email

After configuration, test by:
1. Registering a new user
2. Check your email for OTP code
3. Verify the OTP
4. Check notifications for group activities

## For Production

Use a professional email service like:
- Amazon SES
- SendGrid Pro
- Mailgun with custom domain
- Microsoft 365
