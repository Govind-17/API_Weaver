# API_Weaver

## 🔹 Problem Statement

Developers waste time writing repetitive boilerplate code for APIs (CRUD operations, authentication, database connections, etc.). A tool that automatically generates APIs from a given database schema or user input can save a lot of development time.

## 🔹 Project Overview

API Weaver is a low-code/no-code tool that allows developers (or even non-tech users) to quickly generate REST APIs or GraphQL APIs.

**Input:** Database schema (MySQL, PostgreSQL, MongoDB) or CSV/JSON.
**Output:** A ready-to-use API with CRUD operations, authentication, and documentation.

## 🔹 Features

✅ **Database Integration** – Connect to MySQL/MongoDB and auto-generate CRUD APIs.
✅ **Authentication** – JWT-based login/signup API generation.
✅ **Export Options** – Export API in Flask/FastAPI (Python) or Express.js (Node.js).
✅ **Swagger/OpenAPI Docs** – Auto-generate API documentation.
✅ **Admin Dashboard** – Web UI to manage endpoints, users, and tokens.
✅ **One-click Deployment** – Deploy APIs to local/Heroku/Render.

## 🔹 Tech Stack

- **Frontend:** React.js + TailwindCSS
- **Backend:** Flask/FastAPI (Python)
- **Database:** MySQL + MongoDB support
- **Auth:** JWT Tokens
- **API Docs:** Swagger / Redoc

## 🔹 Project Modules

### User Module
- Register, Login, Token generation
- Role-based access control (Admin/Developer/User)

### Database Connector Module
- Connect MySQL/MongoDB
- Parse schema & auto-generate models

### API Generator Module
- CRUD API endpoints auto-generation
- Option to add custom routes

### Documentation Module
- Auto-generate Swagger UI / Postman Collection

### Deployment Module
- Export code as Flask/FastAPI project
- One-click deploy to cloud

## 🔹 Workflow of API Weaver

1. **User Input** - Upload database schema or CSV/JSON file
2. **Schema Reader** - Parse database structure
3. **API Generator** - Auto-generate CRUD endpoints
4. **Authentication** - Add JWT auth (optional)
5. **API Documentation** - Generate Swagger docs
6. **Code Export** - Download generated project
7. **Deployment** - One-click deploy to cloud

## 🔹 Example Use Case

For a `blood_donors` table with fields (id, name, blood_group, phone, location), API Weaver generates:

- `GET /donors` → Get all donors
- `GET /donors/{id}` → Get donor by ID
- `POST /donors` → Add donor
- `PUT /donors/{id}` → Update donor
- `DELETE /donors/{id}` → Delete donor

Plus Swagger documentation for testing! 🚀

## 🔹 Quick Start

1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Run the backend: `python app.py`
4. Run the frontend: `cd frontend && npm start`
5. Open http://localhost:3000

## 🔹 Project Structure

```
API Weaver/
├── backend/                 # Flask/FastAPI backend
│   ├── app.py              # Main application
│   ├── models/             # Database models
│   ├── connectors/         # Database connectors
│   ├── generators/         # API generators
│   └── auth/               # Authentication
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   └── public/
├── generated_apis/         # Exported API projects
└── docs/                   # Documentation
```

## 🔹 License

MIT License - see LICENSE file for details.
