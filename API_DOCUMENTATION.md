# Snackadoo API Documentation

## Overview
This document lists all available API endpoints for the Snackadoo multi-team snack tracking application. All endpoints require authentication unless otherwise specified.

**Base URL:** `http://localhost:3000/api`

**Authentication:** Bearer token in Authorization header
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Sign Up
**POST** `/auth/signup`

Creates a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securePassword123",
  "dob": "1990-01-15",
  "isFundManager": false,
  "isFoodManager": false,
  "isTeamLead": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "statusCode": 201,
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "dob": "1990-01-15",
    "isFundManager": false,
    "isFoodManager": false,
    "isTeamLead": false,
    "isActive": true,
    "token": "jwt_token_here"
  }
}
```

---

### 2. Sign In
**POST** `/auth/signin`

Authenticates user and returns JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User signed in successfully",
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "dob": "1990-01-15",
    "isFundManager": false,
    "isFoodManager": false,
    "isTeamLead": false,
    "isActive": true,
    "currentTeamId": "team_id",
    "token": "jwt_token_here"
  }
}
```

---

### 3. Get Current User
**GET** `/auth/me`

Retrieves currently authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "dob": "1990-01-15",
    "isFundManager": true,
    "isFoodManager": false,
    "isTeamLead": true,
    "isActive": true,
    "currentTeamId": "team_id"
  }
}
```

---

### 4. Request Password Reset
**POST** `/auth/request-password-reset`

Generates a password reset token and sends it via email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset link sent to your email",
  "statusCode": 200
}
```

---

### 5. Reset Password
**POST** `/auth/reset-password`

Resets password using the reset token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "resetToken": "token_from_email",
  "newPassword": "newPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "statusCode": 200
}
```

---

## Team Endpoints

### 1. Create Team
**POST** `/teams`

Creates a new team. Creator automatically becomes team lead with all roles.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "teamName": "Development Team",
  "description": "Our development team"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Team created successfully",
  "statusCode": 201,
  "data": {
    "_id": "team_id",
    "teamName": "Development Team",
    "description": "Our development team",
    "createdBy": "user_id",
    "createdAt": "2025-12-17T10:00:00Z",
    "updatedAt": "2025-12-17T10:00:00Z"
  }
}
```

---

### 2. Get User's Teams
**GET** `/teams`

Retrieves all teams the user belongs to.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Teams retrieved successfully",
  "statusCode": 200,
  "data": [
    {
      "_id": "team_id",
      "teamName": "Development Team",
      "description": "Our development team",
      "createdBy": "user_id",
      "userRole": {
        "isTeamLead": true,
        "isFundManager": true,
        "isFoodManager": true,
        "isActive": true
      }
    }
  ]
}
```

---

### 3. Get Team Details
**GET** `/teams/[teamId]`

Retrieves team details with member list.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Team retrieved successfully",
  "statusCode": 200,
  "data": {
    "_id": "team_id",
    "teamName": "Development Team",
    "description": "Our development team",
    "createdBy": "user_id",
    "members": [
      {
        "_id": "user_id",
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "isTeamLead": true,
        "isFundManager": true,
        "isFoodManager": true,
        "isActive": true
      }
    ]
  }
}
```

---

### 4. Add Team Member
**POST** `/teams/[teamId]/members`

Team lead adds a new user to the team.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "newUserId": "user_id_to_add"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Member added successfully",
  "statusCode": 201,
  "data": {
    "_id": "team_member_id",
    "teamId": "team_id",
    "userId": "user_id",
    "isTeamLead": false,
    "isFundManager": false,
    "isFoodManager": false,
    "isActive": true,
    "joinedAt": "2025-12-17T10:00:00Z"
  }
}
```

---

### 5. Manage Team Member (Deactivate/Assign Roles)
**PUT** `/teams/[teamId]/members/[memberId]`

Team lead can deactivate members or assign roles.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (Deactivate):**
```json
{
  "action": "deactivate"
}
```

**Request Body (Assign Role):**
```json
{
  "action": "assignRole",
  "isFundManager": true,
  "isFoodManager": false,
  "isTeamLead": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Member updated successfully",
  "statusCode": 200,
  "data": {
    "_id": "team_member_id",
    "teamId": "team_id",
    "userId": "user_id",
    "isTeamLead": false,
    "isFundManager": true,
    "isFoodManager": false,
    "isActive": true
  }
}
```

---

### 6. Switch Team
**POST** `/teams/[teamId]/switch`

User switches their active team.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "success": true,
  "message": "Team switched successfully",
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "currentTeamId": "team_id",
    "fullName": "John Doe"
  }
}
```

---

## Snacks Endpoints

### 1. Add Snack
**POST** `/snacks`

Add a new snack contribution. (Food Manager only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "foodItem": "Pizza",
  "expense": 500,
  "contributions": [
    {
      "userId": "user_id",
      "amount": 250
    },
    {
      "userId": "user_id_2",
      "amount": 250
    }
  ],
  "date": "2025-12-17",
  "note": "Office lunch"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Snack added successfully",
  "statusCode": 201,
  "data": {
    "_id": "snack_id",
    "teamId": "team_id",
    "foodItem": "Pizza",
    "expense": 500,
    "contributions": [...],
    "totalContribution": 500,
    "date": "2025-12-17",
    "note": "Office lunch",
    "createdAt": "2025-12-17T10:00:00Z"
  }
}
```

---

### 2. Get All Snacks
**GET** `/snacks`

Retrieve all snacks for current team.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Snacks retrieved successfully",
  "statusCode": 200,
  "data": [
    {
      "_id": "snack_id",
      "teamId": "team_id",
      "foodItem": "Pizza",
      "expense": 500,
      "totalContribution": 500,
      "date": "2025-12-17",
      "note": "Office lunch"
    }
  ]
}
```

---

### 3. Get Snack by ID
**GET** `/snacks/[id]`

Retrieve specific snack details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Snack retrieved successfully",
  "statusCode": 200,
  "data": {
    "_id": "snack_id",
    "teamId": "team_id",
    "foodItem": "Pizza",
    "expense": 500,
    "contributions": [
      {
        "userId": "user_id",
        "amount": 250
      }
    ],
    "totalContribution": 500,
    "date": "2025-12-17",
    "note": "Office lunch"
  }
}
```

---

### 4. Get Snacks by Date Range
**GET** `/snacks/date-range?startDate=2025-12-01&endDate=2025-12-31`

Retrieve snacks within a date range.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Snacks retrieved successfully",
  "statusCode": 200,
  "data": [
    {
      "_id": "snack_id",
      "foodItem": "Pizza",
      "expense": 500,
      "date": "2025-12-17"
    }
  ]
}
```

---

### 5. Update Snack
**PUT** `/snacks/[id]`

Update snack details. (Food Manager only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "foodItem": "Biryani",
  "expense": 600,
  "note": "Updated lunch"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Snack updated successfully",
  "statusCode": 200,
  "data": {
    "_id": "snack_id",
    "foodItem": "Biryani",
    "expense": 600,
    "note": "Updated lunch"
  }
}
```

---

### 6. Delete Snack
**DELETE** `/snacks/[id]`

Delete a snack. (Food Manager only)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Snack deleted successfully",
  "statusCode": 200,
  "data": {
    "_id": "snack_id",
    "foodItem": "Pizza",
    "expense": 500
  }
}
```

---

## Rules Endpoints

### 1. Add Rule
**POST** `/rules`

Create a new snack violation rule. (Fund Manager only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Late to event",
  "amount": 100,
  "description": "Penalty for being late to team snack event"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Rule added successfully",
  "statusCode": 201,
  "data": {
    "_id": "rule_id",
    "teamId": "team_id",
    "title": "Late to event",
    "amount": 100,
    "description": "Penalty for being late to team snack event",
    "createdAt": "2025-12-17T10:00:00Z"
  }
}
```

---

### 2. Get All Rules
**GET** `/rules`

Retrieve all rules for current team.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Rules retrieved successfully",
  "statusCode": 200,
  "data": [
    {
      "_id": "rule_id",
      "title": "Late to event",
      "amount": 100,
      "description": "Penalty for being late"
    }
  ]
}
```

---

### 3. Get Rule by ID
**GET** `/rules/[id]`

Retrieve specific rule details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Rule retrieved successfully",
  "statusCode": 200,
  "data": {
    "_id": "rule_id",
    "teamId": "team_id",
    "title": "Late to event",
    "amount": 100,
    "description": "Penalty for being late"
  }
}
```

---

### 4. Update Rule
**PUT** `/rules/[id]`

Update rule details. (Fund Manager only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Late to event (Updated)",
  "amount": 150,
  "description": "Updated penalty amount"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Rule updated successfully",
  "statusCode": 200,
  "data": {
    "_id": "rule_id",
    "title": "Late to event (Updated)",
    "amount": 150,
    "description": "Updated penalty amount"
  }
}
```

---

### 5. Delete Rule
**DELETE** `/rules/[id]`

Delete a rule. (Fund Manager only)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Rule deleted successfully",
  "statusCode": 200,
  "data": {
    "_id": "rule_id",
    "title": "Late to event",
    "amount": 100
  }
}
```

---

## Rule Violations Endpoints

### 1. Add Violation
**POST** `/rule-violations`

Record a rule violation. (Fund Manager only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "violatorId": "user_id",
  "ruleId": "rule_id",
  "additionalAmount": 100,
  "date": "2025-12-17",
  "note": "Arrived 30 minutes late"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Violation recorded successfully",
  "statusCode": 201,
  "data": {
    "violation": {
      "_id": "violation_id",
      "teamId": "team_id",
      "violatorId": "user_id",
      "ruleId": "rule_id",
      "additionalAmount": 100,
      "date": "2025-12-17",
      "note": "Arrived 30 minutes late"
    },
    "violatorData": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com"
    },
    "ruleData": {
      "id": "rule_id",
      "title": "Late to event",
      "amount": 100
    }
  }
}
```

---

### 2. Get All Violations
**GET** `/rule-violations`

Retrieve all violations for current team.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Violations retrieved successfully",
  "statusCode": 200,
  "violations": [
    {
      "violation": {
        "_id": "violation_id",
        "violatorId": "user_id",
        "ruleId": "rule_id",
        "additionalAmount": 100
      },
      "violatorData": {
        "fullName": "John Doe"
      },
      "ruleData": {
        "title": "Late to event"
      }
    }
  ]
}
```

---

### 3. Get Violation by ID
**GET** `/rule-violations/[id]`

Retrieve specific violation details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Violation retrieved successfully",
  "statusCode": 200,
  "data": {
    "violation": {
      "_id": "violation_id",
      "violatorId": "user_id",
      "ruleId": "rule_id",
      "additionalAmount": 100
    },
    "violatorData": {
      "fullName": "John Doe"
    },
    "ruleData": {
      "title": "Late to event"
    }
  }
}
```

---

### 4. Update Violation
**PUT** `/rule-violations/[id]`

Update violation details. (Fund Manager only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "additionalAmount": 150,
  "note": "Updated note"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Violation updated successfully",
  "statusCode": 200,
  "data": {
    "violation": {
      "_id": "violation_id",
      "additionalAmount": 150,
      "note": "Updated note"
    }
  }
}
```

---

### 5. Delete Violation
**DELETE** `/rule-violations/[id]`

Delete a violation. (Fund Manager only)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Violation deleted successfully",
  "statusCode": 200
}
```

---

### 6. Get Violations by Violator
**GET** `/rule-violations/violator/[violatorId]`

Retrieve all violations for a specific user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Violations retrieved successfully",
  "statusCode": 200,
  "violations": [
    {
      "violation": {...},
      "ruleData": {...}
    }
  ]
}
```

---

### 7. Get Violations by Rule
**GET** `/rule-violations/rule/[ruleId]`

Retrieve all violations for a specific rule.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Violations retrieved successfully",
  "statusCode": 200,
  "violations": [
    {
      "violation": {...},
      "violatorData": {...}
    }
  ]
}
```

---

## Payments Endpoints

### 1. Add Payment
**POST** `/payments`

Record a payment made by a user.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "payedBy": "user_id",
  "amount": 5000,
  "date": "2025-12-17",
  "note": "Monthly snack fund contribution"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment added successfully",
  "statusCode": 201,
  "data": {
    "_id": "payment_id",
    "teamId": "team_id",
    "payedBy": "user_id",
    "amount": 5000,
    "date": "2025-12-17",
    "note": "Monthly snack fund contribution",
    "payedByUser": {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### 2. Get All Payments
**GET** `/payments`

Retrieve all payments for current team.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Payments retrieved successfully",
  "statusCode": 200,
  "data": [
    {
      "_id": "payment_id",
      "amount": 5000,
      "date": "2025-12-17",
      "payedByUser": {
        "fullName": "John Doe"
      }
    }
  ]
}
```

---

### 3. Get Payment by ID
**GET** `/payments/[id]`

Retrieve specific payment details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Payment retrieved successfully",
  "statusCode": 200,
  "data": {
    "_id": "payment_id",
    "amount": 5000,
    "date": "2025-12-17",
    "note": "Monthly contribution",
    "payedByUser": {
      "fullName": "John Doe"
    }
  }
}
```

---

### 4. Get Payments by User
**GET** `/payments/user/[userId]`

Retrieve all payments made by a specific user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Payments retrieved successfully",
  "statusCode": 200,
  "data": [
    {
      "_id": "payment_id",
      "amount": 5000,
      "date": "2025-12-17"
    }
  ]
}
```

---

### 5. Update Payment
**PUT** `/payments/[id]`

Update payment details.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 6000,
  "note": "Updated contribution"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment updated successfully",
  "statusCode": 200,
  "data": {
    "_id": "payment_id",
    "amount": 6000,
    "note": "Updated contribution"
  }
}
```

---

### 6. Delete Payment
**DELETE** `/payments/[id]`

Delete a payment record.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Payment deleted successfully",
  "statusCode": 200,
  "data": {
    "_id": "payment_id",
    "amount": 5000
  }
}
```

---

## Expenses Endpoints

### 1. Add Expense
**POST** `/expenses`

Record an expense for the team.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": "user_id",
  "amount": 2500,
  "reason": "Supplies purchase",
  "date": "2025-12-17"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Expense added successfully",
  "statusCode": 201,
  "data": {
    "_id": "expense_id",
    "teamId": "team_id",
    "userId": "user_id",
    "amount": 2500,
    "reason": "Supplies purchase",
    "date": "2025-12-17",
    "user": {
      "_id": "user_id",
      "fullName": "John Doe"
    }
  }
}
```

---

### 2. Get All Expenses
**GET** `/expenses`

Retrieve all expenses for current team.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Expenses retrieved successfully",
  "statusCode": 200,
  "data": [
    {
      "_id": "expense_id",
      "amount": 2500,
      "reason": "Supplies",
      "date": "2025-12-17",
      "user": {
        "fullName": "John Doe"
      }
    }
  ]
}
```

---

### 3. Get Expense by ID
**GET** `/expenses/[id]`

Retrieve specific expense details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Expense retrieved successfully",
  "statusCode": 200,
  "data": {
    "_id": "expense_id",
    "amount": 2500,
    "reason": "Supplies purchase",
    "date": "2025-12-17",
    "user": {
      "fullName": "John Doe"
    }
  }
}
```

---

### 4. Get Expenses by User
**GET** `/expenses/user/[userId]`

Retrieve all expenses created by a specific user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Expenses retrieved successfully",
  "statusCode": 200,
  "data": [
    {
      "_id": "expense_id",
      "amount": 2500,
      "reason": "Supplies"
    }
  ]
}
```

---

### 5. Update Expense
**PUT** `/expenses/[id]`

Update expense details.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 3000,
  "reason": "Updated supplies"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Expense updated successfully",
  "statusCode": 200,
  "data": {
    "_id": "expense_id",
    "amount": 3000,
    "reason": "Updated supplies"
  }
}
```

---

### 6. Delete Expense
**DELETE** `/expenses/[id]`

Delete an expense record.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Expense deleted successfully",
  "statusCode": 200,
  "data": {
    "_id": "expense_id",
    "amount": 2500
  }
}
```

---

## Bank Accounts Endpoints

### 1. Add Bank Account
**POST** `/bank-accounts`

Add a bank account for the team. (Fund Manager only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": "user_id",
  "bankName": "State Bank of India",
  "branch": "Downtown Branch",
  "accountNo": "1234567890",
  "accountTitle": "Snackadoo Team Fund",
  "routingNumber": "123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bank account added successfully",
  "statusCode": 201,
  "data": {
    "_id": "bank_account_id",
    "teamId": "team_id",
    "userId": "user_id",
    "bankName": "State Bank of India",
    "branch": "Downtown Branch",
    "accountNo": "1234567890",
    "accountTitle": "Snackadoo Team Fund",
    "routingNumber": "123456789"
  }
}
```

---

### 2. Get Bank Account
**GET** `/bank-accounts/[id]`

Retrieve bank account details. (Fund Manager only)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Bank account retrieved successfully",
  "statusCode": 200,
  "data": {
    "_id": "bank_account_id",
    "bankName": "State Bank of India",
    "branch": "Downtown Branch",
    "accountTitle": "Snackadoo Team Fund"
  }
}
```

---

### 3. Update Bank Account
**PUT** `/bank-accounts/[id]`

Update bank account details. (Fund Manager only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "bankName": "HDFC Bank",
  "branch": "Uptown Branch",
  "accountTitle": "Updated Team Fund"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bank account updated successfully",
  "statusCode": 200,
  "data": {
    "_id": "bank_account_id",
    "bankName": "HDFC Bank",
    "branch": "Uptown Branch",
    "accountTitle": "Updated Team Fund"
  }
}
```

---

### 4. Delete Bank Account
**DELETE** `/bank-accounts/[id]`

Delete a bank account. (Fund Manager only)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Bank account deleted successfully",
  "statusCode": 200,
  "data": {
    "_id": "bank_account_id",
    "bankName": "State Bank of India"
  }
}
```

---

## User Endpoints

### 1. Update User
**PUT** `/users/[id]`

Update user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fullName": "Jane Doe",
  "phone": "+9876543210",
  "dob": "1990-02-20",
  "isFundManager": true,
  "isFoodManager": false,
  "isTeamLead": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullName": "Jane Doe",
    "email": "john@example.com",
    "phone": "+9876543210",
    "dob": "1990-02-20",
    "isFundManager": true,
    "isFoodManager": false,
    "isTeamLead": true,
    "isActive": true
  }
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

**401 Unauthorized:**
```json
{
  "message": "Unauthorized",
  "status": 401
}
```

**400 Bad Request:**
```json
{
  "message": "Error description",
  "status": 400
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found",
  "status": 404
}
```

**500 Internal Server Error:**
```json
{
  "message": "Internal server error",
  "status": 500
}
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All monetary amounts are in the base currency unit (e.g., cents, paise)
- Dates should be in YYYY-MM-DD format
- Team-based data isolation: Users can only access data for their active team
- Role-based access control is enforced on the server side

---

**Last Updated:** December 17, 2025
