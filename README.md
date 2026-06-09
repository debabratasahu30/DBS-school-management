# School Management System

A comprehensive, production-ready School Management System built as a Turborepo monorepo with Next.js 14, Express, Prisma, and PostgreSQL.

## 🏗️ Architecture

This project uses a monorepo structure with Turborepo for efficient development and deployment:

```
nextjs-school-management/
├── apps/
│   ├── api/          # Express backend API
│   └── web/          # Next.js 14 frontend
├── packages/
│   └── types/        # Shared TypeScript types
├── turbo.json        # Turborepo configuration
└── package.json      # Root package.json
```

## 🚀 Tech Stack

### Frontend (`apps/web`)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query v5
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Theming**: next-themes
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend (`apps/api`)
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: SQLite (file-based, no installation required)
- **Authentication**: JWT + Refresh Tokens
- **File Uploads**: Multer
- **Real-time**: Socket.io
- **Scheduling**: node-cron
- **Validation**: express-validator

### Shared (`packages/types`)
- Shared TypeScript interfaces and enums across frontend and backend

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm (comes with Node.js)
- SQLite (no installation required - file-based database)

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd nextjs-school-management
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env` files for both apps:

**Backend (apps/api/.env)**:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
PORT=5001
NODE_ENV=development
```

**Frontend (apps/web/.env)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

4. **Set up the database (SQLite - no server required)**

```bash
cd apps/api
npx prisma generate
npx prisma db push
npx prisma db seed
```

This will create a local `dev.db` file in the `apps/api` folder.

5. **Run the development servers**

```bash
# Start both apps in development mode
npm run dev

# Or start individually
npm run dev --workspace=apps/api
npm run dev --workspace=apps/web
```

## 🎯 Features

### Authentication
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Teacher, Accountant, Parent, Student)
- Password reset functionality
- Protected routes with middleware

### Student Management
- Student enrollment and profile management
- Guardian information tracking
- Student search and filtering
- Export student data

### Teacher Management
- Teacher profiles and subject assignments
- Experience and qualification tracking
- Class teacher assignments

### Class Management
- Class section management
- Capacity tracking
- Class teacher assignment
- Timetable scheduling

### Attendance
- Daily attendance marking
- Attendance reports
- Multiple attendance statuses (Present, Absent, Late, Excused)
- Date-based attendance history

### Exams
- Exam creation and scheduling
- Result entry and management
- Report card generation
- Performance analytics

### Fee Management
- Fee structure configuration
- Payment tracking
- Receipt generation
- Outstanding fee reports

### Library
- Book catalog management
- Book issue/return tracking
- Overdue book tracking
- Book availability status

### Communication
- Notice board for announcements
- Categorized notices (General, Academic, Event)
- Notice publishing and management

### Settings
- School information configuration
- Role and permission management
- User management

## 🗄️ Database Schema

The application uses Prisma ORM with PostgreSQL. Key models include:

- **School**: School information and settings
- **User**: System users with role-based access
- **Student**: Student profiles and academic information
- **Guardian**: Parent/guardian information
- **Teacher**: Teacher profiles and assignments
- **Class**: Class sections and configurations
- **Subject**: Subject information
- **Timetable**: Class schedules
- **Attendance**: Daily attendance records
- **Exam**: Exam configurations
- **ExamResult**: Student exam results
- **FeeStructure**: Fee configurations
- **FeePayment**: Payment records
- **Notice**: School announcements
- **LeaveApplication**: Leave requests
- **LibraryBook**: Book catalog
- **BookIssue**: Book circulation records

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Students
- `GET /api/students` - List all students
- `GET /api/students/:id` - Get student details
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Teachers
- `GET /api/teachers` - List all teachers
- `GET /api/teachers/:id` - Get teacher details
- `POST /api/teachers` - Create teacher
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

### Classes
- `GET /api/classes` - List all classes
- `GET /api/classes/:id` - Get class details
- `POST /api/classes` - Create class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/report` - Get attendance report

### Exams
- `GET /api/exams` - List all exams
- `GET /api/exams/:id` - Get exam details
- `POST /api/exams` - Create exam
- `PUT /api/exams/:id` - Update exam
- `DELETE /api/exams/:id` - Delete exam

### Fees
- `GET /api/fees` - List fee payments
- `POST /api/fees/collect` - Collect fee
- `GET /api/fees/outstanding` - Get outstanding fees

### Library
- `GET /api/library/books` - List all books
- `POST /api/library/books` - Add book
- `POST /api/library/issue` - Issue book
- `POST /api/library/return` - Return book

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/analytics` - Get analytics data

## 🎨 UI Components

The frontend includes reusable components built with shadcn/ui:

- **PageHeader**: Consistent page headers with actions
- **StatsCard**: Statistics display with trends
- **DataTable**: Sortable, searchable data tables with pagination
- **StatusBadge**: Status indicators with color coding
- **Sidebar**: Collapsible navigation sidebar
- **Header**: Top header with breadcrumbs and theme toggle
- **Card**: Card container components
- **Button**: Variant buttons (default, outline, ghost, etc.)
- **Input**: Form input fields
- **Select**: Dropdown select components
- **Dialog**: Modal dialogs
- **Tabs**: Tabbed content
- **Avatar**: User avatars
- **Toast**: Notification toasts

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Mobile-specific features:
- Collapsible sidebar with overlay
- Bottom navigation on mobile
- Touch-friendly buttons (min 44px)
- Data tables convert to cards on mobile

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start all apps in development
npm run dev --workspace=apps/api    # Start API only
npm run dev --workspace=apps/web    # Start Web only

# Build
npm run build            # Build all apps
npm run build --workspace=apps/api  # Build API only
npm run build --workspace=apps/web  # Build Web only

# Database
cd apps/api && npx prisma generate  # Generate Prisma client
cd apps/api && npx prisma db push    # Push schema to database
cd apps/api && npx prisma db seed    # Seed database

# Linting
npm run lint             # Lint all apps
```

### Code Quality

- **ESLint**: Code linting with Next.js and TypeScript rules
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking

## 🚢 Deployment

### Backend Deployment

1. Set production environment variables
2. Build the application: `pnpm --filter @school-management/api build`
3. Run the production server: `node apps/api/dist/index.js`
4. Set up PostgreSQL database
5. Run migrations: `npx prisma migrate deploy`

### Frontend Deployment

1. Set production environment variables
2. Build the application: `pnpm --filter @school-management/web build`
3. Deploy the `.next` folder to your hosting provider (Vercel, Netlify, etc.)

## 🧪 Testing

The project structure supports testing. Add test files as needed:
- Unit tests with Jest/Vitest
- E2E tests with Playwright

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 🆘 Support

For issues and questions, please open an issue on the repository.

## 📞 Demo Credentials

After seeding the database, you can use these credentials to test:

- **Admin**: admin@greenwood.edu / admin123
- **Teacher**: teacher@greenwood.edu / teacher123
- **Accountant**: accountant@greenwood.edu / accountant123

## 🔄 Future Enhancements

- Transport management module
- HR and payroll module
- Messaging system
- Advanced reporting
- Mobile app (React Native)
- Parent portal
- Student portal
