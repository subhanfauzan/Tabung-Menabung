# Finance Tracker - Personal Finance Management Application

A comprehensive full-stack web application for personal finance tracking. Track your income and expenses, categorize transactions, and visualize your financial data with beautiful charts.

![Status](https://img.shields.io/badge/status-development-blue)
![License](https://img.shields.io/badge/license-ISC-green)

## 📊 Features

### Core Features

- ✅ **User Authentication** - Secure registration and login with JWT
- ✅ **Multi-Account Support** - Manage multiple accounts (Cash, Bank, E-wallet)
- ✅ **Transaction Management** - Add, edit, delete income and expense transactions
- ✅ **Category System** - Predefined and custom expense/income categories
- ✅ **Dashboard** - Real-time financial overview with charts
- ✅ **Analytics** - Beautiful charts showing expense breakdown and monthly trends
- ✅ **Filters** - Filter transactions by date, category, type, and account
- ✅ **Responsive Design** - Optimized for mobile, tablet, and desktop

### Technical Features

- Clean, modular code architecture
- TypeScript for type safety
- RESTful API design
- Database indexing for performance
- Error handling and validation
- JWT-based authentication
- CORS support

## 🏗️ System Architecture

```
┌─────────────────────────────────────────┐
│  Frontend (React + Vite + TailwindCSS)  │
│  - Dashboard with charts                │
│  - Transaction management               │
│  - Account & category management        │
└──────────────────┬──────────────────────┘
                   │
        REST API (HTTP + JWT)
                   │
┌──────────────────▼──────────────────────┐
│   Backend (Node.js + Express)           │
│  - Authentication endpoints             │
│  - Transaction CRUD                     │
│  - Analytics & reporting                │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Database (MySQL + Prisma ORM)          │
│  - Users, Accounts, Categories          │
│  - Transactions with proper indexes     │
└─────────────────────────────────────────┘
```

## 📁 Project Structure

```
tabung-menabung/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration (DB, env)
│   │   ├── middleware/      # Auth, error handling
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utilities (JWT, bcrypt)
│   │   └── app.ts           # Express setup
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom hooks
│   │   ├── context/         # React context
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── README.md
│
└── README.md (this file)
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:

```env
DATABASE_URL="mysql://root:password@localhost:3306/finance_app"
JWT_SECRET="your-secret-key-here"
REFRESH_TOKEN_SECRET="your-refresh-secret-here"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

5. Setup database:

```bash
npm run prisma:generate
npm run prisma:migrate
```

6. Start development server:

```bash
npm run dev
```

The backend will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file:

```bash
cp .env.example .env.local
```

4. Update `.env.local` if needed:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Finance Tracker
```

5. Start development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔌 API Endpoints

### Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user        |
| GET    | `/api/auth/profile`  | Get user profile  |
| POST   | `/api/auth/logout`   | Logout user       |

### Transactions

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| GET    | `/api/transactions`     | Get all transactions   |
| GET    | `/api/transactions/:id` | Get single transaction |
| POST   | `/api/transactions`     | Create transaction     |
| PUT    | `/api/transactions/:id` | Update transaction     |
| DELETE | `/api/transactions/:id` | Delete transaction     |

### Categories

| Method | Endpoint              | Description        |
| ------ | --------------------- | ------------------ |
| GET    | `/api/categories`     | Get all categories |
| POST   | `/api/categories`     | Create category    |
| PUT    | `/api/categories/:id` | Update category    |
| DELETE | `/api/categories/:id` | Delete category    |

### Accounts

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| GET    | `/api/accounts`     | Get all accounts   |
| GET    | `/api/accounts/:id` | Get single account |
| POST   | `/api/accounts`     | Create account     |
| PUT    | `/api/accounts/:id` | Update account     |
| DELETE | `/api/accounts/:id` | Delete account     |

### Analytics

| Method | Endpoint                           | Description                  |
| ------ | ---------------------------------- | ---------------------------- |
| GET    | `/api/analytics/summary`           | Dashboard summary            |
| GET    | `/api/analytics/expense-breakdown` | Expense categories breakdown |
| GET    | `/api/analytics/income-breakdown`  | Income categories breakdown  |
| GET    | `/api/analytics/monthly-trend`     | Monthly trend data           |

## 🗄️ Database Schema

### Tables

- **users**: User accounts and authentication
- **accounts**: User's bank/cash accounts
- **categories**: Transaction categories (income/expense)
- **transactions**: Individual transactions

### Key Relationships

- 1 User → Many Accounts
- 1 User → Many Categories
- 1 User → Many Transactions
- 1 Transaction → 1 Account, 1 Category, 1 User

## 🎯 Key Features Implementation

### Authentication

- JWT-based authentication
- Bcrypt password hashing
- Secure token storage
- Automatic logout on token expiration

### Transaction Management

- Real-time account balance updates
- Category-based filtering
- Date range filtering
- Transaction history

### Analytics

- Expense categories pie chart
- Monthly income vs expense line chart
- Dashboard summary cards
- Multiple date range queries

## 🛠️ Technology Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT + Bcrypt

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Context + Zustand
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Language**: TypeScript

## 📱 Responsive Design

The application is fully responsive:

- **Mobile** (< 768px): Single column layout, touch-friendly
- **Tablet** (768px - 1024px): Two column layout
- **Desktop** (> 1024px): Full multi-column layout with sidebar

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token validation
- Protected API routes with authentication middleware
- CORS configuration
- Input validation on both client and server
- SQL injection prevention with ORM

## 📝 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow RESTful API conventions
- Modular component structure
- Meaningful variable and function names
- Comments for complex logic

### Best Practices

- Keep components small and focused
- Use hooks for state management
- Proper error handling
- Loading states for async operations
- Form validation
- Responsive mobile-first design

## 🚢 Production Deployment

### Backend Deployment

```bash
npm run build
npm start
```

### Frontend Build

```bash
npm run build
```

Files will be in `dist/` directory for deployment.

## 📚 Documentation

- [Backend README](./backend/README.md) - Backend setup and API details
- [Frontend README](./frontend/README.md) - Frontend setup and component details

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create a pull request

## 📄 License

ISC

## 📧 Support

For issues, questions, or suggestions, please create an issue in the repository.

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Prisma ORM](https://www.prisma.io)
- [MySQL Documentation](https://dev.mysql.com/doc)
- [TailwindCSS](https://tailwindcss.com)

## ✨ Future Enhancements

- [ ] Budget planning and tracking
- [ ] Recurring transactions
- [ ] Export reports (PDF/CSV)
- [ ] Data visualization improvements
- [ ] Mobile app (React Native)
- [ ] Multi-currency support
- [ ] Bill reminders
- [ ] Savings goals
- [ ] Investment tracking
- [ ] Tax reports

---

**Happy tracking! 💰**
