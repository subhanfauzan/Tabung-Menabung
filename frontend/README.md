# Finance Tracker Frontend

Personal Finance Tracking Application - Frontend Client

## Features

- User authentication (Login/Register)
- Dashboard with financial overview
- Transaction management (CRUD)
- Multiple account management
- Category-based transaction filtering
- Financial visualizations (charts)
- Responsive design for mobile and desktop
- Real-time balance updates

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand (with React Context for auth)
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Routing**: React Router

## Project Structure

```
frontend/
├── src/
│   ├── components/   # Reusable React components
│   ├── pages/        # Page components
│   ├── services/     # API services
│   ├── hooks/        # Custom React hooks
│   ├── context/      # React context providers
│   ├── types/        # TypeScript interfaces
│   ├── utils/        # Utility functions
│   ├── App.tsx       # Main app component
│   ├── main.tsx      # Entry point
│   └── index.css     # Global styles
├── public/           # Static files
├── index.html        # HTML template
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment

Copy \`.env.example\` to \`.env.local\`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Update the API URL if needed (default is http://localhost:3000/api):

\`\`\`env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Finance Tracker
\`\`\`

### 3. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

The application will be available at \`http://localhost:5173\`

## Available Scripts

\`\`\`bash

# Start development server

npm run dev

# Build for production

npm run build

# Preview production build

npm run preview

# Lint code

npm run lint
\`\`\`

## Pages

- **Login**: User authentication page
- **Register**: New user registration page
- **Dashboard**: Main dashboard with overview and charts
- **Transactions**: View and manage all transactions
- **Accounts**: Manage multiple accounts

## Components

### Common

- Header: Navigation header with logout button
- Sidebar: Navigation sidebar
- PrivateRoute: Protected route component

### Pages

- LoginPage: Login form
- RegisterPage: Registration form
- DashboardPage: Financial overview with charts
- TransactionsPage: Transaction list with filters
- AccountsPage: Account management

## Styling

The application uses TailwindCSS for styling with a mobile-first approach:

- Mobile-optimized layout
- Responsive grid system
- Utility-based styling
- Custom component classes

## API Integration

All API requests are handled through service files:

- `authService`: Authentication endpoints
- `transactionService`: Transaction CRUD
- `categoryService`: Category management
- `accountService`: Account management
- `analyticsService`: Analytics and charts data

## Authentication Flow

1. User logs in/registers
2. JWT token is received and stored in localStorage
3. Token is automatically included in all API requests
4. On 401 response, user is redirected to login page
5. Token stored in localStorage for persistence

## Features Details

### Dashboard

- Display total balance across all accounts
- Show monthly income and expenses
- Pie chart for expense categories
- Line chart for monthly trends

### Transactions

- List all transactions with details
- Filter by type (income/expense), category, account
- Create, edit, delete transactions
- See transaction details and notes

### Accounts

- View all user accounts
- Create new accounts
- Delete accounts (if no transactions)
- See current balance for each account

## Mobile Responsive

- Optimized for mobile devices (< 768px)
- Tablet layout (768px - 1024px)
- Desktop layout (> 1024px)
- Touch-friendly buttons and inputs

## Best Practices

- Clean component structure
- Proper error handling
- Loading states
- Form validation
- TypeScript for type safety
- RESTful API integration
- Token-based authentication
- Responsive design
