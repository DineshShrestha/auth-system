# JWT Authentication System

Full stack authentication system built with **Elixir Phoenix (backend)** and **React + TypeScript (frontend)**.

The system implements secure authentication using **JWT access tokens and refresh tokens** with automatic token refresh.

---

# Architecture

Frontend: React + TypeScript + Vite  
Backend: Elixir + Phoenix  
Database: PostgreSQL  
Authentication: JWT (Joken)

Flow

Client → Phoenix API → PostgreSQL

---

# Features

User registration  
User login  
JWT access token authentication  
Refresh token rotation  
Secure logout  
Protected API routes  
Automatic token refresh in frontend  
React authentication context  
Axios interceptor for token handling

---

# Authentication Flow

The system uses **two tokens**.

Access Token  
Short lived token used to call protected APIs.

Refresh Token  
Stored in the database and used to issue new access tokens.

Flow

1. User logs in or registers
2. Backend returns
   - access_token
   - refresh_token
3. Frontend stores refresh_token in localStorage
4. access_token is stored in memory
5. Protected requests include Authorization header
6. If access token expires the frontend calls `/api/auth/refresh`
7. Backend verifies refresh token and issues new tokens

---

# Project Structure


authentication_system/
│
├── backend
│ ├── lib/
│ │ ├── authentication_system/
│ │ │ ├── accounts/
│ │ │ └── auth/
│ │ │ ├── jwt.ex
│ │ │ └── refresh_token.ex
│ │ │
│ │ └── authentication_system_web/
│ │ ├── controllers/
│ │ │ └── auth_controller.ex
│ │ ├── plugs/
│ │ │ └── auth_access.ex
│ │ ├── router.ex
│ │ └── endpoint.ex
│ │
│ └── priv/repo/migrations
│
└── frontend
└── src
├── api.ts
├── auth.ts
├── auth/
│ └── AuthProvider.tsx
│
├── pages/
│ ├── LoginPage.tsx
│ ├── RegisterPage.tsx
│ └── DashboardPage.tsx
│
├── App.tsx
└── main.tsx


---

# Backend Setup (Phoenix)

Install dependencies


mix deps.get


Create database


mix ecto.create


Run migrations


mix ecto.migrate


Start server


mix phx.server


Backend runs at


http://localhost:4000


---

# Frontend Setup (React)

Install dependencies


npm install


Start development server


npm run dev


Frontend runs at


http://localhost:5173


---

# Environment Variables

Frontend `.env`


VITE_API_URL=http://localhost:4000


Backend environment variable


JWT_SECRET=your_secret_key


---

# API Endpoints

Register user

POST `/api/auth/register`

Request


{
"email": "user@example.com
",
"password": "password123",
"password_confirmation": "password123"
}


---

Login user

POST `/api/auth/login`

Request


{
"email": "user@example.com
",
"password": "password123"
}


Response


{
"user": {
"id": 1,
"email": "user@example.com
",
"role": "user"
},
"tokens": {
"access_token": "...",
"refresh_token": "..."
}
}


---

Refresh token

POST `/api/auth/refresh`

Request


{
"refresh_token": "token_here"
}


Response


{
"tokens": {
"access_token": "...",
"refresh_token": "..."
}
}


---

Logout

POST `/api/auth/logout`

Request


{
"refresh_token": "token_here"
}


---

Get current user

GET `/api/me`

Header


Authorization: Bearer ACCESS_TOKEN


Response


{
"user": {
"id": 1,
"email": "user@example.com
",
"role": "user"
}
}


---

# Security Design

Access tokens are short lived.  
Refresh tokens are stored in the database.  
Refresh tokens are rotated when used.  
Revoked refresh tokens cannot be reused.

---

# Development

Backend


mix compile
mix test
mix format


Frontend


npm run dev
npm run build


---

# Future Improvements

Role based authorization  
Email verification  
Password reset flow  
OAuth login (Google / GitHub)  
Rate limiting  
Better UI design

---
