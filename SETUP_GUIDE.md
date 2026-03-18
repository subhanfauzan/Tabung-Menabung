# 🚀 Personal Finance Tracker - Complete Setup Guide

## ✅ Project Status

Your complete full-stack Finance Tracker application is ready! This guide will help you get everything up and running.

## 📋 What's Included

- ✅ **Backend**: Express.js REST API with MySQL
- ✅ **Frontend**: React + Vite + TailwindCSS SPA
- ✅ **Database**: Prisma ORM with MySQL
- ✅ **Authentication**: JWT-based auth system
- ✅ **API**: All CRUD operations implemented
- ✅ **UI**: Responsive mobile-first design
- ✅ **Charts**: Financial visualizations with Recharts

## 🔧 Prerequisites Installation

### 1. Install Node.js

Download from: https://nodejs.org/ (LTS version recommended)

Verify installation:

```bash
node --version
npm --version
```

### 2. Install MySQL

Download from: https://www.mysql.com/downloads/ or use: https://dev.mysql.com/downloads/mysql/

**For Windows**:

- Download MySQL Community Server
- Run installer
- Remember the password you set for `root` user
- Default port is 3306

**Verify installation**:

```bash
mysql --version
```

## 🎯 Backend Setup (Port 3000)

### Step 1: Navigate to backend

```bash
cd backend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Create database

```bash
mysql -u root -p
```

Then in MySQL console:

```sql
CREATE DATABASE finance_app;
EXIT;
```

### Step 4: Configure environment

```bash
cp .env.example .env
```

Edit `.env` file and update:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/finance_app"
JWT_SECRET="change-this-to-a-random-string"
REFRESH_TOKEN_SECRET="change-this-to-another-random-string"
PORT=3000
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
```

### Step 5: Setup database schema

```bash
npm run prisma:generate
npm run prisma:migrate
```

### Step 6: Start backend server

```bash
npm run dev
```

✅ Backend will be running at: `http://localhost:3000`

---

## 🎨 Frontend Setup (Port 5173)

### Step 1: Open new terminal and navigate to frontend

```bash
cd frontend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Finance Tracker
```

### Step 4: Start frontend server

```bash
npm run dev
```

✅ Frontend will be running at: `http://localhost:5173`

---

## 📱 Access the Application

1. Open browser and go to: **http://localhost:5173**
2. Click "Register" to create a new account
3. Fill in:
   - Full Name
   - Email
   - Password (min 8 chars, uppercase, lowercase, numbers)
   - Confirm Password
4. After registration, you'll be logged in automatically
5. You're ready to use the app!

---

## 🎮 Features to Try

### 1. Dashboard

- View your total balance
- See this month's income and expenses
- Check expense breakdown pie chart
- View monthly trends

### 2. Accounts

- Click "Add Account" to create accounts (Cash, Bank, E-wallet)
- Each account tracks its balance separately
- Delete accounts (no transactions allowed)

### 3. Transactions

- Navigate to Transactions page
- Click "Add Transaction" to record income/expense
- Transactions automatically update account balance
- Filter by type, category, or account
- View all details in a table

### 4. Categories

- Default categories are created automatically
- Food, Transport, Bills, Shopping, Entertainment (expense)
- Salary, Freelance, Investment (income)
- Create custom categories as needed

---

## 📊 Making Your First Transaction

1. Go to **Accounts** → Add Cash account
2. Go to **Transactions** → Add Transaction
3. Fill:
   - Amount: 50000
   - Type: Income
   - Category: Salary
   - Account: Your Cash account
   - Date: Today
   - Note: First salary
4. Click "Save Transaction"
5. Balance updates automatically!

---

## 🔍 Troubleshooting

### Backend won't start

```
Error: connect ECONNREFUSED 127.0.0.1:3306
→ MySQL is not running. Start it first.

Mac: brew services start mysql
Windows: Services → MySQL (start)
Linux: sudo systemctl start mysql
```

### Database migration errors

```bash
# Reset everything (caution!)
npx prisma migrate reset

# Or manually:
# 1. Drop database: DROP DATABASE finance_app;
# 2. Create again: CREATE DATABASE finance_app;
# 3. Run migration: npm run prisma:migrate
```

### Port already in use

```bash
# Backend on different port:
# Edit .env and set PORT=3001
# Or kill process using port 3000

Windows: netstat -ano | findstr :3000
Mac/Linux: lsof -i :3000
```

### Can't connect to database

- Check username/password in .env
- Make sure MySQL is running
- Verify DATABASE_URL format

---

## 📝 Project Structure

```
tabung-menabung/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── config/      # Database & environment
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth, validation
│   │   └── utils/       # Helpers
│   ├── prisma/          # Database schema
│   └── README.md
│
├── frontend/            # React + Vite app
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   ├── hooks/       # Custom hooks
│   │   ├── types/       # TypeScript interfaces
│   │   └── utils/       # Utilities
│   └── README.md
│
└── README.md           # Main project guide
```

---

## 🚀 Common Tasks

### Generate random secrets for JWT

```bash
node
> require('crypto').randomBytes(32).toString('hex')
```

Copy output and use in .env

### Check database

```bash
mysql -u root -p finance_app
```

### View Prisma Studio (visual database)

```bash
npx prisma studio
```

### Build for production

```bash
# Backend
npm run build

# Frontend
npm run build
```

---

## 💡 Tips

1. **Keep both terminals open**: One for backend, one for frontend
2. **Check browser console**: For frontend errors (F12)
3. **Check terminal logs**: For backend errors
4. **Hot reload enabled**: Changes auto-refresh during development
5. **Clear localStorage if needed**: Developer tools → Application → Storage

---

## 🔗 Useful Links

- Node.js: https://nodejs.org/
- MySQL: https://www.mysql.com/
- Express.js: https://expressjs.com/
- React: https://react.dev/
- Prisma: https://www.prisma.io/
- TailwindCSS: https://tailwindcss.com/
- Vite: https://vitejs.dev/

---

## 📚 API Examples

### Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123","name":"John"}'
```

### Create Transaction

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount":50000,
    "type":"income",
    "categoryId":"...",
    "accountId":"...",
    "date":"2024-01-01"
  }'
```

---

## 🎓 Next Steps

1. ✅ Get the app running
2. ✅ Create test accounts and transactions
3. ✅ Explore the UI
4. ✅ Review code in `src/` directories
5. ✅ Customize styles in TailwindCSS config
6. ✅ Add more features as needed

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review backend/README.md for API details
3. Review frontend/README.md for component details
4. Check browser console (F12) for errors
5. Check terminal logs for backend errors

---

## 🎉 You're All Set!

Your complete finance tracking application is ready to use. Start by registering a user and creating your first transaction!

**Happy tracking! 💰**
