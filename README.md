# 🛍️ ShopHub

**Deployed Link - https://shophub-three-chi.vercel.app/**
**Full-stack e-commerce demo** built with Flask API + MongoDB + React UI  
Features JWT authentication, product management, and AI-powered recommendations.

---

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate  # Windows: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```
📍 *Backend will be available at* **http://localhost:5000**

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
📍 *Frontend will be available at* **http://localhost:3000**

---

## ⚙️ Environment Configuration

Create `backend/.env` to override defaults from `backend/config.py`:

```env
SECRET_KEY=your-super-secret-key-here
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
```

> **⚠️ Important:** Use a strong, unique `SECRET_KEY` in production!

---

## 📊 Seed Database (Optional)

Populate your database with sample data:

```bash
cd backend
python fill_database.py
```

---

## 🔌 API Reference

**Base URL:** `http://localhost:5000`

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/signup` | Create new user account | ❌ |
| `POST` | `/login` | User login | ❌ |
| `GET` | `/profile` | Get user profile | ✅ |
| `PUT` | `/profile` | Update user profile | ✅ |

**Response Format:**
```json
{
  "token": "jwt_token_here",
  "user": { "id": "...", "email": "...", "name": "..." }
}
```

### 🛒 Shopping Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/cart` | Add item to cart | ✅ |
| `GET` | `/cart` | Get user's cart | ✅ |
| `POST` | `/wishlist` | Add to wishlist | ✅ |
| `POST` | `/orders` | Create new order | ✅ |

### 📦 Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/products` | List all products | ❌ |
| `GET` | `/products/:id` | Get specific product | ❌ |
| `GET` | `/recommendations` | Get personalized recommendations | ✅ |

**Query Parameters for `/products`:**
- `category` - Filter by product category
- `brand` - Filter by brand name

### 🔑 Authentication Headers

For protected endpoints, include the JWT token:

```http
Authorization: Bearer <your_jwt_token>
```

---

## 🚢 Deployment Guide

### Backend Deployment
- **Python Version:** 3.12.6 (specified in `backend/runtime.txt`)
- **Production Server:** Use Gunicorn
  ```
  web: gunicorn app:app
  ```
- **Environment Variables:**
  - Set `SECRET_KEY` with a strong secret
  - Set `MONGODB_URI` with your production database URL

### Frontend Deployment
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Host the static files from the `build/` directory

---

## 📁 Project Structure

```
ShopHub/
├── backend/
│   ├── app.py              # Flask application entry point
│   ├── config.py           # Configuration settings
│   ├── requirements.txt    # Python dependencies
│   ├── runtime.txt        # Python version for deployment
│   ├── fill_database.py   # Database seeding script
│   └── .env              # Environment variables (create this)
├── frontend/
│   ├── src/              # React source code
│   ├── public/           # Static assets
│   ├── package.json      # Node.js dependencies
│   └── build/           # Production build (generated)
└── README.md
```

---

## 🛠️ Tech Stack

- **Backend:** Flask, MongoDB, JWT, Python 3.12
- **Frontend:** React, JavaScript
- **Database:** MongoDB Atlas (recommended)
- **Authentication:** JSON Web Tokens (JWT)
- **Deployment:** Render (backend),  Vercel (frontend)

---

*Happy coding! 🎉*
