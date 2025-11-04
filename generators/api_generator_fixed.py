"""
API Generator for API Weaver
Generates CRUD APIs from database schemas
"""

import os
import json
import zipfile
from typing import Dict, List, Any, Optional
from datetime import datetime
import uuid

class APIGenerator:
    """Main API generator class"""
    
    def __init__(self):
        self.output_dir = "generated_apis"
        self.ensure_output_dir()
    
    def ensure_output_dir(self):
        """Ensure output directory exists"""
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
    
    def generate_api(self, database_type: str, tables: List[str], framework: str, 
                    include_auth: bool = False, connection_config: Dict = None) -> Dict[str, Any]:
        """
        Generate API from database schema
        
        Args:
            database_type: Type of database (mysql, mongodb)
            tables: List of table/collection names
            framework: Target framework (flask, fastapi, express)
            include_auth: Whether to include authentication
            connection_config: Database connection configuration
            
        Returns:
            Dict: Generation result with download URL and swagger URL
        """
        try:
            project_id = str(uuid.uuid4())
            project_dir = os.path.join(self.output_dir, project_id)
            os.makedirs(project_dir, exist_ok=True)
            
            # Generate API based on framework
            if framework == 'flask':
                result = self._generate_flask_api(project_dir, database_type, tables, include_auth)
            elif framework == 'fastapi':
                result = self._generate_fastapi_api(project_dir, database_type, tables, include_auth)
            elif framework == 'express':
                result = self._generate_express_api(project_dir, database_type, tables, include_auth)
            else:
                raise ValueError(f"Unsupported framework: {framework}")
            
            # Create ZIP file
            zip_path = f"{project_dir}.zip"
            self._create_zip_file(project_dir, zip_path)
            
            return {
                'status': 'success',
                'project_id': project_id,
                'download_url': f'/api/download/{project_id}',
                'swagger_url': f'/api/swagger/{project_id}',
                'zip_path': zip_path
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }
    
    def _generate_flask_api(self, project_dir: str, database_type: str, 
                           tables: List[str], include_auth: bool) -> Dict:
        """Generate Flask API"""
        
        # Create main app.py
        app_content = self._generate_flask_app_content(database_type, tables, include_auth)
        with open(os.path.join(project_dir, 'app.py'), 'w') as f:
            f.write(app_content)
        
        # Create requirements.txt
        requirements = self._generate_requirements_content(database_type)
        with open(os.path.join(project_dir, 'requirements.txt'), 'w') as f:
            f.write(requirements)
        
        # Create models
        models_dir = os.path.join(project_dir, 'models')
        os.makedirs(models_dir, exist_ok=True)
        
        for table in tables:
            model_content = self._generate_flask_model(table, database_type)
            with open(os.path.join(models_dir, f'{table}.py'), 'w') as f:
                f.write(model_content)
        
        # Create routes
        routes_dir = os.path.join(project_dir, 'routes')
        os.makedirs(routes_dir, exist_ok=True)
        
        for table in tables:
            route_content = self._generate_flask_routes(table)
            with open(os.path.join(routes_dir, f'{table}_routes.py'), 'w') as f:
                f.write(route_content)
        
        # Create README
        readme_content = self._generate_readme_content('Flask', database_type, tables)
        with open(os.path.join(project_dir, 'README.md'), 'w') as f:
            f.write(readme_content)
        
        return {'framework': 'flask', 'tables': tables}
    
    def _generate_fastapi_api(self, project_dir: str, database_type: str, 
                            tables: List[str], include_auth: bool) -> Dict:
        """Generate FastAPI API"""
        
        # Create main main.py
        main_content = self._generate_fastapi_main_content(database_type, tables, include_auth)
        with open(os.path.join(project_dir, 'main.py'), 'w') as f:
            f.write(main_content)
        
        # Create requirements.txt
        requirements = self._generate_fastapi_requirements_content(database_type)
        with open(os.path.join(project_dir, 'requirements.txt'), 'w') as f:
            f.write(requirements)
        
        # Create models
        models_dir = os.path.join(project_dir, 'models')
        os.makedirs(models_dir, exist_ok=True)
        
        for table in tables:
            model_content = self._generate_fastapi_model(table, database_type)
            with open(os.path.join(models_dir, f'{table}.py'), 'w') as f:
                f.write(model_content)
        
        # Create README
        readme_content = self._generate_readme_content('FastAPI', database_type, tables)
        with open(os.path.join(project_dir, 'README.md'), 'w') as f:
            f.write(readme_content)
        
        return {'framework': 'fastapi', 'tables': tables}
    
    def _generate_express_api(self, project_dir: str, database_type: str, 
                            tables: List[str], include_auth: bool) -> Dict:
        """Generate Express.js API"""
        
        # Create main app.js
        app_content = self._generate_express_app_content(database_type, tables, include_auth)
        with open(os.path.join(project_dir, 'app.js'), 'w') as f:
            f.write(app_content)
        
        # Create package.json
        package_content = self._generate_package_json_content(database_type)
        with open(os.path.join(project_dir, 'package.json'), 'w') as f:
            f.write(package_content)
        
        # Create models
        models_dir = os.path.join(project_dir, 'models')
        os.makedirs(models_dir, exist_ok=True)
        
        for table in tables:
            model_content = self._generate_express_model(table, database_type)
            with open(os.path.join(models_dir, f'{table}.js'), 'w') as f:
                f.write(model_content)
        
        # Create routes
        routes_dir = os.path.join(project_dir, 'routes')
        os.makedirs(routes_dir, exist_ok=True)
        
        for table in tables:
            route_content = self._generate_express_routes(table)
            with open(os.path.join(routes_dir, f'{table}Routes.js'), 'w') as f:
                f.write(route_content)
        
        # Create README
        readme_content = self._generate_readme_content('Express.js', database_type, tables)
        with open(os.path.join(project_dir, 'README.md'), 'w') as f:
            f.write(readme_content)
        
        return {'framework': 'express', 'tables': tables}
    
    def _generate_flask_app_content(self, database_type: str, tables: List[str], include_auth: bool) -> str:
        """Generate Flask app.py content"""
        import_lines = []
        blueprint_lines = []
        register_lines = []
        
        for table in tables:
            import_lines.append(f"from models.{table} import {table.title().replace('_', '')}")
            blueprint_lines.append(f"from routes.{table}_routes import {table}_bp")
            register_lines.append(f"app.register_blueprint({table}_bp, url_prefix='/api/{table}')")
        
        return f'''"""
Generated Flask API by API Weaver
Database: {database_type}
Tables: {', '.join(tables)}
Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
CORS(app)
db = SQLAlchemy(app)

# Import models
{chr(10).join(import_lines)}

# Import routes
{chr(10).join(blueprint_lines)}

# Register blueprints
{chr(10).join(register_lines)}

@app.route('/')
def home():
    return jsonify({{
        "message": "API Weaver Generated API",
        "version": "1.0.0",
        "tables": {tables},
        "docs": "/docs"
    }})

@app.route('/health')
def health():
    return jsonify({{"status": "healthy", "timestamp": datetime.utcnow().isoformat()}})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
'''
    
    def _generate_flask_model(self, table_name: str, database_type: str) -> str:
        """Generate Flask model for a table"""
        return f'''"""
{table_name.title()} Model
Generated by API Weaver
"""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class {table_name.title().replace('_', '')}(db.Model):
    """{table_name.title()} model"""
    
    __tablename__ = '{table_name}'
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {{
            'id': self.id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }}
    
    def __repr__(self):
        return f'<{table_name.title().replace('_', '')} {{self.id}}>'
'''
    
    def _generate_flask_routes(self, table_name: str) -> str:
        """Generate Flask routes for a table"""
        return f'''"""
{table_name.title()} Routes
Generated by API Weaver
"""

from flask import Blueprint, request, jsonify
from models.{table_name} import {table_name.title().replace('_', '')}
from flask_sqlalchemy import SQLAlchemy

{table_name}_bp = Blueprint('{table_name}', __name__)

@{table_name}_bp.route('/', methods=['GET'])
def get_{table_name}():
    """Get all {table_name}"""
    try:
        {table_name} = {table_name.title().replace('_', '')}.query.all()
        return jsonify([item.to_dict() for item in {table_name}])
    except Exception as e:
        return jsonify({{'error': str(e)}}), 500

@{table_name}_bp.route('/<int:id>', methods=['GET'])
def get_{table_name}_by_id(id):
    """Get {table_name} by ID"""
    try:
        {table_name} = {table_name.title().replace('_', '')}.query.get_or_404(id)
        return jsonify({table_name}.to_dict())
    except Exception as e:
        return jsonify({{'error': str(e)}}), 500

@{table_name}_bp.route('/', methods=['POST'])
def create_{table_name}():
    """Create new {table_name}"""
    try:
        data = request.get_json()
        {table_name} = {table_name.title().replace('_', '')}(**data)
        db.session.add({table_name})
        db.session.commit()
        return jsonify({table_name}.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({{'error': str(e)}}), 500

@{table_name}_bp.route('/<int:id>', methods=['PUT'])
def update_{table_name}(id):
    """Update {table_name}"""
    try:
        {table_name} = {table_name.title().replace('_', '')}.query.get_or_404(id)
        data = request.get_json()
        for key, value in data.items():
            setattr({table_name}, key, value)
        db.session.commit()
        return jsonify({table_name}.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({{'error': str(e)}}), 500

@{table_name}_bp.route('/<int:id>', methods=['DELETE'])
def delete_{table_name}(id):
    """Delete {table_name}"""
    try:
        {table_name} = {table_name.title().replace('_', '')}.query.get_or_404(id)
        db.session.delete({table_name})
        db.session.commit()
        return jsonify({{'message': 'Deleted successfully'}})
    except Exception as e:
        db.session.rollback()
        return jsonify({{'error': str(e)}}), 500
'''
    
    def _generate_requirements_content(self, database_type: str) -> str:
        """Generate requirements.txt content"""
        base_requirements = [
            "Flask==2.3.3",
            "Flask-CORS==4.0.0",
            "Flask-SQLAlchemy==3.0.5",
            "gunicorn==21.2.0"
        ]
        
        if database_type == 'mysql':
            base_requirements.append("PyMySQL==1.1.0")
        elif database_type == 'mongodb':
            base_requirements.append("pymongo==4.5.0")
        
        return '\n'.join(base_requirements)
    
    def _generate_fastapi_main_content(self, database_type: str, tables: List[str], include_auth: bool) -> str:
        """Generate FastAPI main.py content"""
        import_lines = []
        include_lines = []
        
        for table in tables:
            import_lines.append(f"from routes.{table}_routes import router as {table}_router")
            include_lines.append(f"app.include_router({table}_router, prefix='/api/{table}', tags=['{table}'])")
        
        return f'''"""
Generated FastAPI by API Weaver
Database: {database_type}
Tables: {', '.join(tables)}
Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
import uvicorn

app = FastAPI(
    title="API Weaver Generated API",
    description="Auto-generated API",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def home():
    return {{
        "message": "API Weaver Generated API",
        "version": "1.0.0",
        "tables": {tables}
    }}

@app.get("/health")
async def health():
    return {{"status": "healthy", "timestamp": datetime.utcnow().isoformat()}}

# Import and include routers
{chr(10).join(import_lines)}
{chr(10).join(include_lines)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
'''
    
    def _generate_fastapi_requirements_content(self, database_type: str) -> str:
        """Generate FastAPI requirements.txt content"""
        base_requirements = [
            "fastapi==0.104.1",
            "uvicorn==0.24.0",
            "pydantic==2.5.0"
        ]
        
        if database_type == 'mysql':
            base_requirements.append("PyMySQL==1.1.0")
        elif database_type == 'mongodb':
            base_requirements.append("pymongo==4.5.0")
        
        return '\n'.join(base_requirements)
    
    def _generate_express_app_content(self, database_type: str, tables: List[str], include_auth: bool) -> str:
        """Generate Express.js app.js content"""
        require_lines = []
        use_lines = []
        
        for table in tables:
            require_lines.append(f"const {table}Routes = require('./routes/{table}Routes');")
            use_lines.append(f"app.use('/api/{table}', {table}Routes);")
        
        return f'''/**
 * Generated Express.js API by API Weaver
 * Database: {database_type}
 * Tables: {', '.join(tables)}
 * Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
{chr(10).join(require_lines)}
{chr(10).join(use_lines)}

// Health check
app.get('/health', (req, res) => {{
    res.json({{ status: 'healthy', timestamp: new Date().toISOString() }});
}});

// Home route
app.get('/', (req, res) => {{
    res.json({{
        message: 'API Weaver Generated API',
        version: '1.0.0',
        tables: {tables}
    }});
}});

// Database connection
const connectDB = async () => {{
    try {{
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apiweaver';
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected');
    }} catch (error) {{
        console.error('Database connection error:', error);
        process.exit(1);
    }}
}};

// Start server
const startServer = async () => {{
    await connectDB();
    app.listen(PORT, () => {{
        console.log(`Server running on port ${{PORT}}`);
    }});
}};

startServer();

module.exports = app;
'''
    
    def _generate_package_json_content(self, database_type: str) -> str:
        """Generate package.json content"""
        return '''{
  "name": "api-weaver-generated-api",
  "version": "1.0.0",
  "description": "Auto-generated API by API Weaver",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "mongoose": "^7.5.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "keywords": ["api", "generated", "api-weaver"],
  "author": "API Weaver",
  "license": "MIT"
}'''
    
    def _generate_readme_content(self, framework: str, database_type: str, tables: List[str]) -> str:
        """Generate README.md content"""
        port = "5000" if framework == 'Flask' else "8000" if framework == 'FastAPI' else "3000"
        install_cmd = "pip install -r requirements.txt" if framework in ['Flask', 'FastAPI'] else "npm install"
        run_cmd = "python app.py" if framework == 'Flask' else "python main.py" if framework == 'FastAPI' else "npm start"
        
        endpoint_lines = []
        for table in tables:
            endpoint_lines.append(f"### {table.title()}\n- GET /api/{table} - List all {table}\n- GET /api/{table}/{{id}} - Get {table} by ID\n- POST /api/{table} - Create {table}\n- PUT /api/{table}/{{id}} - Update {table}\n- DELETE /api/{table}/{{id}} - Delete {table}")
        
        return f'''# Generated API by API Weaver

## Framework: {framework}
## Database: {database_type}
## Tables: {', '.join(tables)}

## Quick Start

### Installation
```bash
{install_cmd}
```

### Running the API
```bash
{run_cmd}
```

## API Endpoints

{chr(10).join(endpoint_lines)}

## Documentation
- Swagger UI: http://localhost:{port}/docs
- Health Check: http://localhost:{port}/health

## Generated by API Weaver
Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
'''
    
    def _create_zip_file(self, source_dir: str, zip_path: str):
        """Create ZIP file from directory"""
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(source_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, source_dir)
                    zipf.write(file_path, arcname)
