# Finance Tracker Backend

Personal Finance Tracking Application - Backend Server

## Features

- User registration and authentication with JWT
- Transaction management (CRUD)
- Multiple account support
- Expense categories (predefined and custom)
- Financial analytics and reporting
- Dashboard summaries

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT

## Project Structure

```
backend/
├── src/
│   ├── config/       # Configuration files
│   ├── middleware/   # Express middleware
│   ├── controllers/  # Route controllers
│   ├── services/     # Business logic
│   ├── routes/       # API routes
│   ├── utils/        # Utility functions
│   └── app.ts        # Express app setup
├── prisma/           # Database schema and migrations
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment

Copy `.env.example` to `.env` and update the values:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` with your database connection and JWT secrets:

\`\`\`env
DATABASE_URL="mysql://root:password@localhost:3306/finance_app"
JWT_SECRET="your-secret-key"
REFRESH_TOKEN_SECRET="your-refresh-secret-key"
PORT=3000
FRONTEND_URL="http://localhost:5173"
\`\`\`

### 3. Setup Database

\`\`\`bash

# Generate Prisma Client

npm run prisma:generate

# Create database and run migrations

npm run prisma:migrate
\`\`\`

### 4. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

The server will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout user

### Transactions

- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create custom category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Accounts

- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id` - Get single account
- `POST /api/accounts` - Create account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Analytics

- `GET /api/analytics/summary` - Get dashboard summary
- `GET /api/analytics/expense-breakdown` - Get expense breakdown
- `GET /api/analytics/income-breakdown` - Get income breakdown
- `GET /api/analytics/monthly-trend` - Get monthly trend

## Authentication

All protected endpoints require an `Authorization` header with Bearer token:

\`\`\`
Authorization: Bearer <access_token>
\`\`\`

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Build

\`\`\`bash
npm run build
\`\`\`

### Start Production Server

\`\`\`bash
npm start
\`\`\`
