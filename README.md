# 🧑‍💼 Job Platform (MEAN Stack)

A full-featured job platform built with the **MEAN stack** (MongoDB, Express.js, Angular, Node.js).  
This platform connects **job seekers** with **employers** and provides a smooth workflow for posting, browsing, and applying to jobs.

---

## 🚀 Features

### 👤 For Job Seekers
- Create and manage profiles (resume, skills, experience).
- Browse and search jobs by category, location, salary, etc.
- Apply for jobs directly from the platform.
- Save favorite job listings.
- Track applications status.


### ⚙️ General Platform Features
- Authentication & Authorization (JWT-based).
- Role-based access (Admin / Employer / Job Seeker).
- Responsive and intuitive Angular frontend.
- RESTful API backend.
- Secure data storage with MongoDB.
- Admin dashboard for monitoring users and jobs.
- Filtering, sorting, and pagination for job listings.
- Email notifications for key actions (e.g., application submitted).

---

## 🛠️ Tech Stack

- **Frontend**: Angular  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Mongoose ODM)  
- **Authentication**: JSON Web Tokens (JWT), bcrypt for password hashing  

---

## 📂 Project Structure

```bash
job-platform/
│
├── backend/             # Express.js API
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & role check
│   └── server.js        # App entry point
│
├── frontend/            # Angular app
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # UI components
│   │   │   ├── services/     # API integration
│   │   │   └── pages/        # Main views
│   │   └── assets/
│   └── angular.json
│
└── README.md
