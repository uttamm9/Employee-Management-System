# Employee Management System (EMS)

A modern, production-style, full-stack **Employee Management System** built with the **MERN Stack** (MongoDB, Express.js, React.js with Vite, Node.js). 

This solution is engineered to emulate real enterprise HR and workforce management platforms, implementing robust JWT authentication, role-based access control (Admin & Employee roles), server-side pagination/filtering/sorting, database aggregations for real-time dashboard analytics, and a responsive Tailwind CSS interface.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Key Features](#2-key-features)
3. [Technology Stack](#3-technology-stack)
4. [Project Folder Structure](#4-project-folder-structure)
5. [Prerequisites & Installation](#5-prerequisites--installation)
6. [Backend Setup](#6-backend-setup)
7. [Frontend Setup](#7-frontend-setup)
8. [Environment Variable Configuration](#8-environment-variable-configuration)
9. [Admin Account & Sample Data Seeding](#9-admin-account--sample-data-seeding)
10. [Default Login Credentials for Testing](#10-default-login-credentials-for-testing)
11. [API Endpoints Documentation](#11-api-endpoints-documentation)
12. [Database Schema Overview](#12-database-schema-overview)
13. [Security Architecture & Implementation](#13-security-architecture--implementation)
14. [Screenshots & Visual Tour](#14-screenshots--visual-tour)

---

## 1. Project Overview

The Employee Management System (EMS) solves common workforce administration challenges by providing a secure, dual-role system:
- **Administrators** have complete control over workforce lifecycle management: viewing real-time company statistics, managing employees across departments, creating and editing records, adjusting account statuses, and searching/filtering large employee datasets via server-side pagination.
- **Employees** have self-service access to view their organizational assignment and personal profile, and update permitted personal contact information while strictly preventing privilege escalation.

---

## 2. Key Features

### Authentication & Authorization
- **Secure Password Hashing:** Utilizes `bcryptjs` with salt rounds for all user passwords. Passwords are never returned in responses.
- **JWT Authentication:** Stateful token issuance with Bearer header verification and automatic expiration handling.
- **Role-Based Access Control (RBAC):** Backend route guards (`protect` and `authorize('admin')`) enforce strict permissions. Frontend routes mirror authorization with `ProtectedRoute` and `AdminRoute`.
- **Escalation Protection:** Public registration strictly provisions the `employee` role and prevents clients from declaring administrative privileges.

### Admin Dashboard & Analytics
- **Live Metric Cards:** Instant counts of Total Workforce, Active Employees, Inactive Accounts, and System Admins.
- **Department Distribution:** MongoDB aggregation pipeline calculates real-time departmental headcount and percentages.
- **Recent Joiners:** Direct query of the most recently joined staff members with quick profile navigation.
- **Zero Dummy Data:** All dashboard data is dynamically calculated from MongoDB collections.

### Employee Directory & Management
- **Server-Side Pagination:** Skip and limit pagination tailored for large enterprise datasets.
- **Multi-Field Search:** Server-side regex search covering employee name, email, phone, and designation.
- **Faceted Filters:** Instant filtering by Department and Account Status (Active/Inactive).
- **Multi-Column Sorting:** Sort ascending or descending by Created Date, Name, Joining Date, or Department.
- **Safe Deletion:** Deletion confirmation dialog preventing accidental data loss; backend prevents admins from deleting their own active session.

### Employee Self-Service Portal
- **Profile Overview:** View assigned department, designation, joining date, and contact information.
- **Controlled Self-Update:** Employees can modify personal phone number, residential address, and name without tampering with roles, statuses, or salaries.

---

## 3. Technology Stack

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js (v5)
- **Database:** MongoDB with Mongoose (v8 ODM)
- **Security & Auth:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cors`
- **Validation:** `express-validator`
- **Environment:** `dotenv`

### Frontend
- **Build Tool:** Vite
- **UI Library:** React.js (v18)
- **Styling:** Tailwind CSS with PostCSS & Autoprefixer
- **State Management:** Redux Toolkit (`@reduxjs/toolkit` & `react-redux`)
- **Routing:** React Router DOM (v6)
- **HTTP Client:** Axios with request & response interceptors
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

---

## 4. Project Folder Structure

```
Employee Management System/
├── backend_EMS/                   # Express & MongoDB Backend
│   ├── config/
│   │   └── db.js                  # Mongoose MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, Me, UpdateProfile
│   │   ├── dashboardController.js # Aggregations for KPIs & metrics
│   │   └── employeeController.js  # CRUD, pagination & filters
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT token verification
│   │   ├── errorMiddleware.js     # Centralized error handler & 404
│   │   ├── roleMiddleware.js      # RBAC permission checker
│   │   └── validateMiddleware.js  # express-validator result handler
│   ├── models/
│   │   └── User.js                # Unified User & Employee schema
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth endpoints
│   │   ├── dashboardRoutes.js     # /api/dashboard endpoints
│   │   └── employeeRoutes.js      # /api/employees endpoints
│   ├── utils/
│   │   ├── apiResponse.js         # Uniform JSON response utility
│   │   └── generateToken.js       # JWT signing utility
│   ├── validators/
│   │   ├── authValidator.js       # Auth input validation rules
│   │   └── employeeValidator.js   # Employee CRUD validation rules
│   ├── .env                       # Backend environment variables
│   ├── .env.example               # Template environment configuration
│   ├── app.js                     # Express app configuration & middleware
│   ├── index.js                   # Server entrypoint
│   ├── package.json               # Backend dependencies
│   └── seedAdmin.js               # Admin & sample employees seeder
│
├── frontend_ems/                  # React & Vite Frontend
│   ├── public/                    # Static assets & icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx         # Accessible button with loading states
│   │   │   │   ├── ConfirmDialog.jsx  # Reusable confirmation modal
│   │   │   │   ├── Input.jsx          # Input with show/hide password toggle
│   │   │   │   ├── Loader.jsx         # Custom loading spinner
│   │   │   │   └── Modal.jsx          # Accessible dialog modal
│   │   │   ├── employees/
│   │   │   │   ├── EmployeeCard.jsx   # Card view for employee records
│   │   │   │   ├── EmployeeFilters.jsx# Search, filters, sort toolbar
│   │   │   │   ├── EmployeeForm.jsx   # Reusable Add/Edit employee form
│   │   │   │   └── EmployeeTable.jsx  # Responsive data table with badges
│   │   │   └── layout/
│   │   │       ├── AuthLayout.jsx     # Centered auth card layout
│   │   │       ├── DashboardLayout.jsx# Responsive sidebar + header layout
│   │   │       ├── Header.jsx         # Top navbar with user badge & logout
│   │   │       └── Sidebar.jsx        # Navigation drawer with active states
│   │   ├── hooks/
│   │   │   └── useAuth.js             # Authentication helper hook
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx          # Login page with demo autofill
│   │   │   │   └── Register.jsx       # Employee registration form
│   │   │   ├── dashboard/
│   │   │   │   └── Dashboard.jsx      # Admin analytics dashboard
│   │   │   ├── employees/
│   │   │   │   ├── AddEmployee.jsx    # Add employee page (Admin only)
│   │   │   │   ├── EditEmployee.jsx   # Edit employee page
│   │   │   │   ├── EmployeeList.jsx   # Directory table with pagination
│   │   │   │   └── EmployeeProfile.jsx# Detailed profile & self-service
│   │   │   └── NotFound.jsx           # Clean 404 page
│   │   ├── redux/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js       # Auth state, login/logout thunks
│   │   │   │   └── employeeSlice.js   # Employee CRUD & pagination state
│   │   │   └── store.js               # Redux Toolkit store setup
│   │   ├── routes/
│   │   │   ├── AdminRoute.jsx         # Admin-only route guard
│   │   │   ├── AppRoutes.jsx          # Central route definitions
│   │   │   └── ProtectedRoute.jsx     # Authenticated user route guard
│   │   ├── services/
│   │   │   ├── api.js                 # Axios instance with interceptors
│   │   │   ├── authService.js         # Auth API service methods
│   │   │   ├── dashboardService.js    # Dashboard API service methods
│   │   │   └── employeeService.js     # Employee API service methods
│   │   ├── utils/
│   │   │   ├── constants.js           # Departments, Statuses, Roles
│   │   │   └── validation.js          # Client validation helpers
│   │   ├── App.jsx                    # Root app component with Toaster
│   │   ├── index.css                  # Tailwind CSS root stylesheet
│   │   └── main.jsx                   # React DOM entrypoint
│   ├── .env                           # Frontend environment variables
│   ├── .env.example                   # Template frontend environment
│   ├── index.html                     # HTML template
│   ├── package.json                   # Frontend dependencies
│   ├── tailwind.config.js             # Tailwind CSS theme configuration
│   └── vite.config.js                 # Vite bundler configuration
│
├── screenshots/                       # Application preview screenshots
└── README.md                          # Comprehensive project documentation
```

---

## 5. Prerequisites & Installation

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **MongoDB:** Local MongoDB Community Server running on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI.

---

## 6. Backend Setup

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend_EMS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure your `.env` file is configured (refer to [Section 8](#8-environment-variable-configuration)).

4. Seed the initial Administrator account and sample employees:
   ```bash
   npm run seed
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   # Server runs on http://localhost:5000
   ```

---

## 7. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend_ems
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Verify your `.env` configuration (points to `VITE_API_URL=http://localhost:5000/api`).

4. Start the Vite development server:
   ```bash
   npm run dev
   # Vite serves at http://127.0.0.1:3000
   ```

5. To build for production:
   ```bash
   npm run build
   ```

---

## 8. Environment Variable Configuration

### Backend: `backend_EMS/.env`
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/employee_management
JWT_SECRET=supersecret_jwt_key_ems_interview_2026_dev
JWT_EXPIRES_IN=7d
NODE_ENV=development

# Optional Seed Credentials
ADMIN_NAME=System Administrator
ADMIN_EMAIL=admin@ems.com
ADMIN_PASSWORD=Admin@12345
```

### Frontend: `frontend_ems/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 9. Admin Account & Sample Data Seeding

The backend includes a dedicated, idempotent seed script: `backend_EMS/seedAdmin.js`.

To run the seeder:
```bash
node backend_EMS/seedAdmin.js
# Or from backend_EMS directory:
npm run seed
```

### What the seed script does:
1. Connects securely to MongoDB via `MONGO_URI`.
2. Inspects if an admin account with `ADMIN_EMAIL` exists. If not, creates the Administrator account with a bcrypt-hashed password.
3. Automatically provisions diverse sample employees across Engineering, HR, Sales, Marketing, and Finance departments if fewer than 5 employees are found.
4. Outputs the ready-to-use testing credentials in the terminal.

---

## 10. Default Login Credentials for Testing

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@ems.com` | `Admin@12345` | Full access: Dashboard, Employee CRUD, Department analytics, Filters |
| **Employee (Self-Service)**| `aarav.sharma@ems.com` | `Password123` | Personal profile view, permitted contact details editing |

*(Note: The Login screen includes an autofill demo button for one-click testing.)*

---

## 11. API Endpoints Documentation

All responses follow a standard format:
```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new employee (strictly assigns `employee` role) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token + user details |
| `GET` | `/api/auth/me` | Private | Retrieve currently authenticated user's profile |
| `PUT` | `/api/auth/profile` | Private | Update logged-in user's permitted personal info |

### Employees (`/api/employees`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/employees` | Admin Only | Create a new employee with designated department/role |
| `GET` | `/api/employees` | Admin Only | Fetch employees with server-side pagination, search & filters |
| `GET` | `/api/employees/:id` | Admin or Self | Get employee record by MongoDB ObjectId |
| `PUT` | `/api/employees/:id` | Admin or Self* | Update employee details (*employees can only update personal info) |
| `DELETE`| `/api/employees/:id` | Admin Only | Delete an employee (cannot delete own admin account) |

#### Query Parameters for `GET /api/employees`:
- `page` (default: `1`): Current page number
- `limit` (default: `10`): Number of records per page
- `search`: Filter matching name, email, phone, or designation
- `department`: Filter by department (e.g. `Engineering`, `Sales`)
- `status`: Filter by account status (`active` or `inactive`)
- `sortBy`: Field to sort by (`createdAt`, `name`, `joiningDate`, `department`)
- `order`: Sort direction (`asc` or `desc`)

### Dashboard (`/api/dashboard`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Admin Only | Real-time headcount KPIs, department counts, recent joiners |

---

## 12. Database Schema Overview

### User Model (`backend_EMS/models/User.js`)
| Field | Type | Required | Constraints / Defaults | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | String | Yes | Trimmed, min 2 chars | Full name of employee/admin |
| `email` | String | Yes | Unique, lowercase, valid format | Login email identifier |
| `password` | String | Yes | Min 6 chars, bcrypt hashed | Securely salted password hash |
| `phone` | String | No | Trimmed | Contact phone number |
| `department` | String | No | Default: `'General'` | Assigned department |
| `designation`| String | No | Default: `'Employee'` | Job title / designation |
| `joiningDate`| Date | No | Default: `Date.now` | Employment start date |
| `address` | String | No | Trimmed | Residential/office address |
| `profileImage`| String| No | Default: `''` | Optional avatar image URL |
| `role` | String | No | Enum: `['admin', 'employee']`, Default: `'employee'` | RBAC authorization role |
| `status` | String | No | Enum: `['active', 'inactive']`, Default: `'active'` | Account activity state |
| `createdAt` | Date | Auto | Timestamps enabled | Document creation date |
| `updatedAt` | Date | Auto | Timestamps enabled | Document last modified date |

---

## 13. Security Architecture & Implementation

1. **Password Salt & Hash Lifecycle:** Passwords are automatically hashed in the Mongoose `pre('save')` middleware only when modified (`isModified('password')`), preventing re-hashing during profile edits.
2. **Password Leak Prevention:** A custom Mongoose `toJSON` transform automatically strips `password` and `__v` from all JSON serialization. Controllers additionally employ `.select('-password')`.
3. **Privilege Escalation Defense:** Public registration (`POST /api/auth/register`) explicitly overrides any client-supplied `role` parameter with `'employee'`. Profile updates (`PUT /api/auth/profile`) explicitly discard `role` and `status` updates.
4. **Self-Deletion Guard:** Deleting `/api/employees/:id` validates that the target is not the currently logged-in administrator.
5. **Session Invalidation:** Deactivated (`inactive`) users are immediately rejected during both login and subsequent token verification checks.
6. **Centralized Error Scrubbing:** Production error handlers sanitize stack traces and format MongoDB duplicate keys (code 11000) and CastErrors into clean, user-friendly messages.

---

## 14. Screenshots & Visual Tour

Screenshots of the live system are preserved in the `screenshots/` directory:
- **Admin Dashboard:** Real-time KPI summary, department headcount graphs, and recently joined employee feed.
- **Employee Directory:** Modern table with search bar, department and status filters, column sorting, and pagination.
- **Add Employee Modal/Form:** Full validation, department selector, and status assignment.
- **Employee Profile & Self-Service:** Tabular details, role badges, and personal contact update dialog.
- **Authentication Screens:** Clean card login and registration with credential hints.

---

## Local Verification Checklist
- [x] Backend connects to MongoDB and initializes on port 5000.
- [x] Initial Admin and diverse sample employees seeded via `npm run seed`.
- [x] All 36 automated unit & integration tests pass with 0 failures.
- [x] Frontend builds with Vite and Tailwind CSS with 0 bundle warnings.
- [x] Admin can log in, inspect live dashboard metrics, search/filter employees, create new employees, and delete records.
- [x] Employee can log in, view personal profile, and update permitted contact details.
- [x] Route guards prevent employees from accessing `/dashboard` or admin endpoints.
