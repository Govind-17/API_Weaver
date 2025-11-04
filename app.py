"""
API Weaver - Main Application
Automated API Generator for Web & Mobile Applications
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flasgger import Swagger
import os
from datetime import timedelta, datetime

# Import modules
# Change this line
from models.user import User, db

# To these lines
from models.user import db
from models.user import User
from connectors.mysql_connector import MySQLConnector
from connectors.mongodb_connector import MongoDBConnector
from generators.api_generator import APIGenerator
from auth.auth_manager import AuthManager
from utils.export_manager import ExportManager

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'api-weaver-secret-key-2024')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///api_weaver.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
CORS(app)
jwt = JWTManager(app)
db = SQLAlchemy()
db.init_app(app)
migrate = Migrate(app, db)

# Initialize Swagger documentation
swagger = Swagger(app, template={
    "swagger": "2.0",
    "info": {
        "title": "API Weaver",
        "description": "Automated API Generator for Web & Mobile Applications",
        "version": "1.0.0"
    },
    "host": "localhost:5000",
    "basePath": "/api",
    "schemes": ["http", "https"]
})

# Initialize managers
auth_manager = AuthManager()
export_manager = ExportManager()

@app.route('/')
def home():
    """Welcome endpoint"""
    return jsonify({
        "message": "Welcome to API Weaver!",
        "version": "1.0.0",
        "docs": "/api/docs"
    })

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "API Weaver",
        "timestamp": str(datetime.utcnow())
    })

# Database connection endpoints
@app.route('/api/connect/mysql', methods=['POST'])
def connect_mysql():
    """
    Connect to MySQL database
    ---
    parameters:
      - name: host
        in: formData
        type: string
        required: true
      - name: port
        in: formData
        type: integer
        required: true
      - name: username
        in: formData
        type: string
        required: true
      - name: password
        in: formData
        type: string
        required: true
      - name: database
        in: formData
        type: string
        required: true
    responses:
      200:
        description: Successfully connected to MySQL
      400:
        description: Connection failed
    """
    try:
        data = request.get_json()
        connector = MySQLConnector()
        connection = connector.connect(
            host=data['host'],
            port=data.get('port', 3306),
            username=data['username'],
            password=data['password'],
            database=data['database']
        )
        
        if connection:
            return jsonify({
                "status": "success",
                "message": "Successfully connected to MySQL",
                "tables": connector.get_tables()
            })
        else:
            return jsonify({
                "status": "error",
                "message": "Failed to connect to MySQL"
            }), 400
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/connect/mongodb', methods=['POST'])
def connect_mongodb():
    """
    Connect to MongoDB database
    ---
    parameters:
      - name: connection_string
        in: formData
        type: string
        required: true
      - name: database
        in: formData
        type: string
        required: true
    responses:
      200:
        description: Successfully connected to MongoDB
      400:
        description: Connection failed
    """
    try:
        data = request.get_json()
        connector = MongoDBConnector()
        connection = connector.connect(
            connection_string=data['connection_string'],
            database=data['database']
        )
        
        if connection:
            return jsonify({
                "status": "success",
                "message": "Successfully connected to MongoDB",
                "collections": connector.get_collections()
            })
        else:
            return jsonify({
                "status": "error",
                "message": "Failed to connect to MongoDB"
            }), 400
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/generate', methods=['POST'])
def generate_api():
    """
    Generate API from database schema
    ---
    parameters:
      - name: database_type
        in: formData
        type: string
        enum: [mysql, mongodb]
        required: true
      - name: tables
        in: formData
        type: array
        items:
          type: string
        required: true
      - name: framework
        in: formData
        type: string
        enum: [flask, fastapi, express]
        required: true
      - name: include_auth
        in: formData
        type: boolean
        required: false
    responses:
      200:
        description: API generated successfully
      400:
        description: Generation failed
    """
    try:
        data = request.get_json()
        generator = APIGenerator()
        
        result = generator.generate_api(
            database_type=data['database_type'],
            tables=data['tables'],
            framework=data['framework'],
            include_auth=data.get('include_auth', False)
        )
        
        return jsonify({
            "status": "success",
            "message": "API generated successfully",
            "download_url": result['download_url'],
            "swagger_url": result['swagger_url']
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

# Authentication endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    """User registration"""
    return auth_manager.register(request)

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login"""
    return auth_manager.login(request)

@app.route('/api/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    """User logout"""
    return auth_manager.logout()

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user info"""
    return auth_manager.get_current_user()

# Export endpoints
@app.route('/api/export/<project_id>', methods=['GET'])
def export_project(project_id):
    """Export generated API project"""
    return export_manager.export_project(project_id)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
