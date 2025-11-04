# API Weaver - Project Structure

## 📁 Directory Structure

```
API Weaver/
├── 📄 README.md                    # Project documentation
├── 📄 requirements.txt              # Python dependencies
├── 📄 package.json                  # Node.js dependencies
├── 📄 setup.py                      # Setup script
├── 📄 run.py                        # Main application runner
├── 📄 app.py                        # Flask application
├── 📄 env.example                   # Environment variables template
├── 📄 .gitignore                    # Git ignore file
│
├── 📁 models/                       # Database models
│   ├── __init__.py
│   └── user.py                      # User and Project models
│
├── 📁 connectors/                   # Database connectors
│   ├── __init__.py
│   ├── mysql_connector.py           # MySQL database connector
│   └── mongodb_connector.py         # MongoDB database connector
│
├── 📁 generators/                   # API generators
│   ├── __init__.py
│   └── api_generator.py             # Main API generator
│
├── 📁 auth/                         # Authentication
│   ├── __init__.py
│   └── auth_manager.py              # JWT authentication manager
│
├── 📁 utils/                        # Utility functions
│   ├── __init__.py
│   └── export_manager.py            # Export and deployment manager
│
├── 📁 frontend/                     # React frontend
│   ├── 📄 package.json              # Frontend dependencies
│   ├── 📄 tailwind.config.js        # TailwindCSS configuration
│   ├── 📄 postcss.config.js         # PostCSS configuration
│   │
│   ├── 📁 public/                    # Static files
│   │   ├── index.html
│   │   └── manifest.json
│   │
│   └── 📁 src/                       # React source code
│       ├── index.js                  # React entry point
│       ├── index.css                 # Global styles
│       ├── App.js                    # Main App component
│       │
│       ├── 📁 components/            # React components
│       │   └── Navbar.js             # Navigation component
│       │
│       ├── 📁 pages/                 # Page components
│       │   ├── Home.js               # Home page
│       │   ├── Dashboard.js          # User dashboard
│       │   ├── DatabaseConnection.js # Database connection page
│       │   ├── APIGenerator.js       # API generation page
│       │   ├── Projects.js            # Projects management page
│       │   ├── Login.js              # Login page
│       │   └── Register.js            # Registration page
│       │
│       └── 📁 context/                # React context
│           └── AuthContext.js         # Authentication context
│
└── 📁 generated_apis/               # Generated API projects (created at runtime)
    └── [project_id]/                 # Individual generated projects
        ├── app.py                    # Generated Flask app
        ├── requirements.txt          # Dependencies
        ├── README.md                 # Project documentation
        └── [other generated files]
```

## 🔧 Key Components

### Backend (Flask)
- **app.py**: Main Flask application with all routes
- **models/**: Database models for users, projects, and endpoints
- **connectors/**: Database connection handlers for MySQL and MongoDB
- **generators/**: API generation logic for different frameworks
- **auth/**: JWT-based authentication system
- **utils/**: Export and deployment utilities

### Frontend (React)
- **App.js**: Main React application with routing
- **components/**: Reusable React components
- **pages/**: Individual page components
- **context/**: React context for state management
- **TailwindCSS**: Modern UI styling

### Database Support
- **MySQL**: Traditional SQL database support
- **MongoDB**: NoSQL document database support
- **SQLite**: Default development database

### API Generation
- **Flask**: Python web framework
- **FastAPI**: Modern Python API framework
- **Express.js**: Node.js web framework

## 🚀 Workflow

1. **User Registration/Login** → Authentication system
2. **Database Connection** → Connect to MySQL/MongoDB
3. **Table Selection** → Choose tables for API generation
4. **API Generation** → Generate CRUD endpoints
5. **Documentation** → Auto-generate Swagger docs
6. **Export/Deploy** → Download or deploy generated API

## 📊 Features

### ✅ Completed Features
- [x] User authentication with JWT
- [x] Database connectors (MySQL, MongoDB)
- [x] API generator for multiple frameworks
- [x] React frontend with TailwindCSS
- [x] Export and deployment system
- [x] Project management
- [x] Responsive UI design

### 🔄 In Progress
- [ ] Swagger documentation generation
- [ ] Advanced deployment options
- [ ] API testing interface
- [ ] Custom endpoint configuration

## 🛠️ Technology Stack

### Backend
- **Flask**: Web framework
- **SQLAlchemy**: ORM
- **PyMySQL**: MySQL connector
- **PyMongo**: MongoDB connector
- **JWT**: Authentication
- **Flasgger**: API documentation

### Frontend
- **React**: UI framework
- **React Router**: Navigation
- **TailwindCSS**: Styling
- **Axios**: HTTP client
- **React Toastify**: Notifications

### Database
- **SQLite**: Development
- **MySQL**: Production SQL
- **MongoDB**: NoSQL option

## 📈 Project Status

- **Backend**: ✅ Complete
- **Frontend**: ✅ Complete
- **Database Connectors**: ✅ Complete
- **API Generation**: ✅ Complete
- **Authentication**: ✅ Complete
- **Export System**: ✅ Complete
- **Documentation**: ✅ Complete

## 🎯 Next Steps

1. Run `python setup.py` to install dependencies
2. Start backend: `python run.py`
3. Start frontend: `cd frontend && npm start`
4. Open http://localhost:3000
5. Connect database and generate your first API!
