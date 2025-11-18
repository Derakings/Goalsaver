# Goalsaver API Testing Guide

This guide provides examples for testing all API endpoints using curl, Postman, or any HTTP client.

## 🚀 Getting Started

### Base URL
```
http://localhost:3000/api
```

### Health Check
```bash
curl http://localhost:3000/health
```

## 🔐 Authentication Flow

### 1. Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### 3. Get Current User Profile

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Update Profile

```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Johnny",
    "phone": "+9876543210"
  }'
```

## 👥 Group Management

### 1. Create a Group

```bash
curl -X POST http://localhost:3000/api/groups \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro Fund",
    "description": "Saving together for the latest iPhone",
    "targetAmount": 1200,
    "targetItem": "iPhone 15 Pro 256GB",
    "deadline": "2024-12-31T23:59:59Z",
    "isPublic": true
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "group-uuid",
    "name": "iPhone 15 Pro Fund",
    "description": "Saving together for the latest iPhone",
    "targetAmount": "1200.00",
    "currentAmount": "0.00",
    "targetItem": "iPhone 15 Pro 256GB",
    "status": "SAVING",
    "isPublic": true,
    "members": [
      {
        "id": "member-uuid",
        "role": "ADMIN",
        "user": {
          "id": "user-uuid",
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ]
  }
}
```

### 2. List All Groups

```bash
# All groups
curl -X GET http://localhost:3000/api/groups \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Only my groups
curl -X GET "http://localhost:3000/api/groups?myGroups=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Only public groups
curl -X GET "http://localhost:3000/api/groups?public=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Get Group Details

```bash
curl -X GET http://localhost:3000/api/groups/GROUP_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Update Group (Admin Only)

```bash
curl -X PUT http://localhost:3000/api/groups/GROUP_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Group Name",
    "targetAmount": 1500
  }'
```

### 5. Join a Group

```bash
curl -X POST http://localhost:3000/api/groups/GROUP_ID/join \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Leave a Group

```bash
curl -X POST http://localhost:3000/api/groups/GROUP_ID/leave \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 7. Get Group Members

```bash
curl -X GET http://localhost:3000/api/groups/GROUP_ID/members \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 8. Delete Group (Admin Only)

```bash
curl -X DELETE http://localhost:3000/api/groups/GROUP_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 💰 Contributions

### 1. Add Contribution

```bash
curl -X POST http://localhost:3000/api/contributions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "groupId": "GROUP_ID",
    "note": "My first contribution!"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "contribution-uuid",
    "amount": "100.00",
    "note": "My first contribution!",
    "createdAt": "2024-01-01T12:00:00Z",
    "user": {
      "id": "user-uuid",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

### 2. Get Group Contributions

```bash
curl -X GET http://localhost:3000/api/contributions/group/GROUP_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Get User Contributions

```bash
curl -X GET http://localhost:3000/api/contributions/user/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Get Contribution Details

```bash
curl -X GET http://localhost:3000/api/contributions/CONTRIBUTION_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🛒 Purchase Workflow

### 1. Initiate Purchase (Auto or Manual)

```bash
curl -X POST http://localhost:3000/api/purchases/initiate/GROUP_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Note:** This is usually triggered automatically when the target is reached.

### 2. Get Purchase Status

```bash
curl -X GET http://localhost:3000/api/purchases/GROUP_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "purchase-uuid",
    "groupId": "group-uuid",
    "totalAmount": "1200.00",
    "status": "PROCESSING",
    "initiatedAt": "2024-01-01T12:00:00Z",
    "group": {
      "id": "group-uuid",
      "name": "iPhone 15 Pro Fund",
      "status": "PROCESSING_PURCHASE"
    }
  }
}
```

### 3. Complete Purchase

```bash
curl -X PUT http://localhost:3000/api/purchases/PURCHASE_ID/complete \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Get All Purchases

```bash
curl -X GET http://localhost:3000/api/purchases \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔔 Notifications

### 1. Get User Notifications

```bash
# All notifications
curl -X GET http://localhost:3000/api/notifications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Unread only
curl -X GET "http://localhost:3000/api/notifications?unreadOnly=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "notification-uuid",
      "title": "New Contribution",
      "message": "Jane Doe contributed $50 to iPhone 15 Pro Fund",
      "type": "CONTRIBUTION_MADE",
      "isRead": false,
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### 2. Mark Notification as Read

```bash
curl -X PUT http://localhost:3000/api/notifications/NOTIFICATION_ID/read \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Mark All Notifications as Read

```bash
curl -X PUT http://localhost:3000/api/notifications/read-all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🧪 Complete Testing Workflow

Here's a complete workflow to test the entire system:

```bash
# 1. Register two users
# User 1 (Admin)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User"
  }'
# Save the token as TOKEN_1

# User 2 (Member)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "member@example.com",
    "password": "Member123!",
    "firstName": "Member",
    "lastName": "User"
  }'
# Save the token as TOKEN_2

# 2. User 1 creates a group
curl -X POST http://localhost:3000/api/groups \
  -H "Authorization: Bearer $TOKEN_1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Group",
    "description": "Testing the API",
    "targetAmount": 100,
    "targetItem": "Test Item",
    "isPublic": true
  }'
# Save the group ID as GROUP_ID

# 3. User 2 joins the group
curl -X POST http://localhost:3000/api/groups/$GROUP_ID/join \
  -H "Authorization: Bearer $TOKEN_2"

# 4. User 1 contributes $60
curl -X POST http://localhost:3000/api/contributions \
  -H "Authorization: Bearer $TOKEN_1" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 60,
    "groupId": "'$GROUP_ID'",
    "note": "First contribution"
  }'

# 5. User 2 contributes $40 (reaches 100%)
curl -X POST http://localhost:3000/api/contributions \
  -H "Authorization: Bearer $TOKEN_2" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 40,
    "groupId": "'$GROUP_ID'",
    "note": "Completing the goal!"
  }'

# 6. Check purchase status (should be auto-created)
curl -X GET http://localhost:3000/api/purchases/$GROUP_ID \
  -H "Authorization: Bearer $TOKEN_1"

# 7. Check notifications
curl -X GET http://localhost:3000/api/notifications \
  -H "Authorization: Bearer $TOKEN_1"
```

## 📝 Postman Collection

You can also import this collection into Postman:

1. Create a new collection called "Goalsaver API"
2. Add a variable `baseUrl` = `http://localhost:3000/api`
3. Add a variable `token` (will be set from login response)
4. Import all the endpoints above

### Postman Environment Variables
```json
{
  "baseUrl": "http://localhost:3000/api",
  "token": "",
  "groupId": "",
  "userId": ""
}
```

## 🔍 Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## 🛡️ Testing Security

### Test Rate Limiting
```bash
# Send 101 requests rapidly (should get rate limited)
for i in {1..101}; do
  curl http://localhost:3000/health
done
```

### Test Invalid Token
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer invalid_token"
```

### Test Missing Fields
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

## 📊 Performance Testing

Using Apache Bench (ab):

```bash
# 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:3000/health

# With authentication
ab -n 100 -c 10 -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/groups
```

## 🐛 Debugging Tips

1. **Check Logs**: Always check the server logs for errors
2. **Verify Token**: Use jwt.io to decode and verify JWT tokens
3. **Database State**: Use Prisma Studio (`npm run prisma:studio`) to inspect database
4. **Network Tab**: Use browser DevTools Network tab to inspect requests
5. **Postman Console**: Enable Postman console for detailed request/response logs

---

**Happy Testing! 🧪**
