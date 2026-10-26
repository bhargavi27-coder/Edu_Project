# 🎓 EduLentra — Smart College Management Portal

[![Live Frontend](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://edu-project-fawn.vercel.app)
[![Live Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://edu-project-nx8q.onrender.com)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![React Version](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)

> **EduLentra** is a full-stack, role-based college portal system designed to streamline academic workflows, approval management, communication, and attendance tracking across Students, Faculty, HODs, and Administrators.

---

## 🌐 Live Deployments

* **Frontend Web App**: [https://edu-project-fawn.vercel.app](https://edu-project-fawn.vercel.app)
* **Backend API Server**: [https://edu-project-nx8q.onrender.com](https://edu-project-nx8q.onrender.com)
* **GitHub Repository**: [https://github.com/bhargavi27-coder/Edu_Project](https://github.com/bhargavi27-coder/Edu_Project)

---

## 🚀 Key Features by User Role

### 👨‍🎓 1. Student Portal
* **Dashboard Overview**: Personalized dashboard with quick statistics and notifications.
* **Attendance Tracking**: View semester and course-wise attendance percentages.
* **Outpass Management**: Submit outpass requests with real-time approval status from faculty & HOD.
* **Assignments & Notes**: Access course study materials, assignments, and submit deliverables.
* **Password Recovery**: Secure token-based password reset workflow.

### 👩‍🏫 2. Faculty Portal
* **Student Verification**: Review and approve newly registered student accounts.
* **Attendance Management**: Mark and update lecture attendance sessions.
* **Assignments & Notes**: Upload lecture notes, syllabus materials, and grade assignments.
* **Outpass Approval**: Review, approve, or reject student outpass applications with remarks.
* **Real-time Announcements**: Broadcast department-level announcements.

### 🏛️ 3. Head of Department (HOD) Portal
* **Department Oversight**: Full monitoring of department students and faculty staff.
* **Faculty Approvals**: Review and approve new faculty registration requests.
* **Advanced Outpass Approval**: High-priority student outpass authorizations.
* **Attendance Monitoring**: Department-level attendance reports and analytics.
* **Complaints & Grievances**: Track and resolve department complaints.

### 🛡️ 4. Administrator Portal
* **System-Wide Directory**: Comprehensive directory of all Students, Faculty, and HODs.
* **Role Approval Workflows**: Centralized review of pending HOD, Faculty, and Student signup requests.
* **Announcements Management**: College-wide broadcast management with audience targeting.

---

## 🛠️ Tech Stack

### Frontend
* **Core Framework**: React 19 + Vite 7
* **Routing**: React Router v7 (SPA with client-side rewrites)
* **Real-Time Communication**: Socket.io Client
* **HTTP Client**: Axios & Fetch API
* **Styling**: Vanilla CSS (modular stylesheets with custom design tokens)

### Backend
* **Runtime**: Node.js
* **Server Framework**: Express 5
* **Database**: MongoDB Atlas with Mongoose ORM
* **Real-Time**: Socket.io Server (live announcement events)
* **Authentication**: JSON Web Tokens (JWT) & bcryptjs password hashing
* **Email Service**: Nodemailer

### Infrastructure & Deployment
* **Frontend Hosting**: Vercel
* **Backend Hosting**: Render (Web Service)
* **Database Hosting**: MongoDB Atlas Cloud

---

## 📁 Project Structure

```text
Edu_Project/
├── index.html                   # HTML Entry point with SEO metadata
├── vite.config.js               # Vite build configuration
├── vercel.json                  # Vercel SPA rewrite rules
├── package.json                 # Frontend dependencies & scripts
├── public/                      # Static assets
└── src/
    ├── api/                     # Centralized API service layer
    │   ├── config.js            # Base API URL configuration
    │   ├── authSession.js       # Role-namespaced auth session helpers
    │   ├── announcementsApi.js  # REST + Socket.io announcement API
    │   ├── facultyApi.js        # Faculty API operations
    │   └── roleApprovalApi.js   # Multi-role signup approval endpoints
    ├── COLLEGE/                 # Main College Application
    │   ├── Mainc.jsx            # Application router & portal routes
    │   ├── StudentDashboard.jsx # Student portal & views
    │   ├── Faculty.jsx          # Faculty portal & dashboard
    │   ├── Hod.jsx              # HOD portal & views
    │   ├── Admin.jsx            # Admin portal & role management
    │   ├── Edulentra-Hod/       # HOD dedicated components & pages
    │   └── backend/             # Express.js REST API Server
    │       ├── server.js        # Express server entry point
    │       ├── models/          # Mongoose database models
    │       ├── routes/          # Express route definitions
    │       ├── controllers/     # Business logic & request handlers
    │       ├── realtime/        # Socket.io notification handlers
    │       └── middleware/      # JWT authentication middleware
    └── Components/              # Shared reusable components
```

---

## 💻 Local Development Setup

### Prerequisites
* **Node.js** (v18 or higher)
* **npm** or **yarn**
* **MongoDB Atlas** account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/bhargavi27-coder/Edu_Project.git
cd Edu_Project
```

### 2. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Start development server
npm run dev
```
The frontend will start at `http://localhost:5173`.

### 3. Backend Setup
```bash
# Navigate to backend directory
cd src/COLLEGE/backend

# Install backend dependencies
npm install

# Create .env file with your credentials:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# PORT=5000
# FRONTEND_BASE_URL=http://localhost:5173

# Start backend server
node server.js
```
The backend API will run at `http://localhost:5000`.

---

## 🔒 Environment Variables

### Frontend (`.env` or Vercel Environment Variables)
```env
VITE_API_BASE_URL=https://edu-project-nx8q.onrender.com
```

### Backend (`src/COLLEGE/backend/.env` or Render Environment Variables)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_BASE_URL=https://edu-project-fawn.vercel.app
```

---

## 👩‍💻 Author

* **Bhargavi** — [@bhargavi27-coder](https://github.com/bhargavi27-coder)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

