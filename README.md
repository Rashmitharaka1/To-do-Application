# 📝 Next.js Role-Based To-Do App

A full-stack Next.js application with role-based authentication, Neon DB, and TailwindCSS, built as a technical assignment. The app includes a complete To-Do Management System with protected routes and permissions.

### 🚀 Live Demo
- 🔗 **Vercel Deployment:** https://to-do-application-rashmitharaka1s-projects.vercel.app
- 🔗 **GitHub Repo:** https://github.com/Rashmitharaka1/To-do-Application

---

## 📖 Overview
This is a **Role-Based To-Do List Application** built with **Next.js**, using **better-auth** for authentication and **Neon PostgreSQL** as the database.

Users can log in, manage tasks, and access features depending on their assigned role:
- **User**
- **Manager**
- **Admin**

## 🎯 Project Objective
The goal of this assignment is to test full-stack capability including:
- Next.js App Router
- `better-auth` based authentication
- Role-based authorization
- Secure backend APIs
- Clean UI with TailwindCSS
- Proper validation
- Full CRUD operations

---

## 🔐 Role Permissions

| Role | Permissions |
| :--- | :--- |
| **User** | Create, Read, Update, Delete **their own** to-dos |
| **Manager** | View **all** to-dos, mark any as **Done** |
| **Admin** | **Full CRUD** access to all to-dos |

---

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TailwindCSS
- React Server Components

### Backend
- better-auth (Authentication & Authorization)
- Neon PostgreSQL (Database)
- Drizzle ORM (Optional)

### Deployment
- Vercel

---

## ⚙️ Features

### 📝 To-Do Management
- Add new tasks
- Edit tasks
- Delete tasks
- Mark tasks as complete

### 🔐 Authentication
- Sign-Up
- Sign-In
- Role-based dashboard
- Session handling with `better-auth`

### 🔒 Authorization Validation
- ✔ Frontend UI dynamically changes by role
- ✔ Backend API protected by middleware
- ✔ Users cannot modify others’ tasks
- ✔ Managers can mark all tasks done
- ✔ Admin has unrestricted access

---

## 📂 Project Structure

```text
TO-DO-APPLICATION
│
├── .next/
├── app/
│   ├── admin/
│   ├── api/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── add-todo-form.tsx
│   ├── admin-dashboard.tsx
│   ├── dashboard-content.tsx
│   ├── login-form.tsx
│   ├── register-form.tsx
│   ├── theme-provider.tsx
│   ├── todo-item.tsx
│   └── todo-list.tsx
│
├── lib/
│   ├── auth-client.ts
│   ├── auth-utils.ts
│   ├── auth.ts
│   ├── db.ts
│   └── utils.ts
│
├── node_modules/
│
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── scripts/
│
├── styles/
│   └── globals.css
│
├── .env.local
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```
---
## 🚦 Getting Started
### ✅ Prerequisites
- Node.js 18+
- Neon DB (PostgreSQL)
- Vercel account

### 📥 Installation
Clone the repository
```bash
git clone https://github.com/Rashmitharaka1/To-do-Application.git
```
Navigate to folder
```bash
cd To-do-Application
```
Install dependencies 
```bash
npm install
```
---

## 🔧 Setup Environment Variables
Create a .env.local file in the root directory and add the following:
- Code snippet
```bash
DATABASE_URL="your-neon-postgres-url"
BETTER_AUTH_SECRET="your-secret-key"
```
---

### ▶️ Run the Project Locally
Start the development server:

```Bash
npm run dev
```
Open http://localhost:3000 with your browser to see the result.

🚀 Deployment (Vercel)
To deploy to Vercel, install the Vercel CLI or connect your GitHub repository to the Vercel dashboard.

