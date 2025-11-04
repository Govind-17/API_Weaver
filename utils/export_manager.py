"""
Export Manager for API Weaver
Handles project export and deployment
"""

import os
import shutil
import zipfile
from typing import Dict, Any
from datetime import datetime
import uuid

class ExportManager:
    """Export manager for generated API projects"""
    
    def __init__(self):
        self.export_dir = "generated_apis"
        self.ensure_export_dir()
    
    def ensure_export_dir(self):
        """Ensure export directory exists"""
        if not os.path.exists(self.export_dir):
            os.makedirs(self.export_dir)
    
    def export_project(self, project_id: str) -> Dict[str, Any]:
        """
        Export a generated project
        
        Args:
            project_id: ID of the project to export
            
        Returns:
            Dict: Export result with download information
        """
        try:
            project_path = os.path.join(self.export_dir, project_id)
            
            if not os.path.exists(project_path):
                return {
                    'status': 'error',
                    'message': 'Project not found'
                }
            
            # Create ZIP file
            zip_filename = f"{project_id}.zip"
            zip_path = os.path.join(self.export_dir, zip_filename)
            
            self._create_zip_file(project_path, zip_path)
            
            return {
                'status': 'success',
                'download_url': f'/download/{zip_filename}',
                'filename': zip_filename,
                'size': os.path.getsize(zip_path)
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Export failed: {str(e)}'
            }
    
    def deploy_project(self, project_id: str, deployment_target: str = 'local') -> Dict[str, Any]:
        """
        Deploy a project to specified target
        
        Args:
            project_id: ID of the project to deploy
            deployment_target: Target for deployment (local, heroku, render)
            
        Returns:
            Dict: Deployment result
        """
        try:
            project_path = os.path.join(self.export_dir, project_id)
            
            if not os.path.exists(project_path):
                return {
                    'status': 'error',
                    'message': 'Project not found'
                }
            
            if deployment_target == 'local':
                return self._deploy_local(project_path)
            elif deployment_target == 'heroku':
                return self._deploy_heroku(project_path)
            elif deployment_target == 'render':
                return self._deploy_render(project_path)
            else:
                return {
                    'status': 'error',
                    'message': f'Unsupported deployment target: {deployment_target}'
                }
                
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Deployment failed: {str(e)}'
            }
    
    def _create_zip_file(self, source_dir: str, zip_path: str):
        """Create ZIP file from directory"""
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(source_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, source_dir)
                    zipf.write(file_path, arcname)
    
    def _deploy_local(self, project_path: str) -> Dict[str, Any]:
        """Deploy project locally"""
        try:
            # Create deployment script
            deploy_script = self._create_local_deploy_script(project_path)
            script_path = os.path.join(project_path, 'deploy_local.sh')
            
            with open(script_path, 'w') as f:
                f.write(deploy_script)
            
            # Make script executable
            os.chmod(script_path, 0o755)
            
            return {
                'status': 'success',
                'message': 'Local deployment script created',
                'script_path': script_path,
                'instructions': [
                    '1. Navigate to the project directory',
                    '2. Run: chmod +x deploy_local.sh',
                    '3. Run: ./deploy_local.sh',
                    '4. Your API will be available at http://localhost:5000'
                ]
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Local deployment failed: {str(e)}'
            }
    
    def _deploy_heroku(self, project_path: str) -> Dict[str, Any]:
        """Deploy project to Heroku"""
        try:
            # Create Heroku-specific files
            self._create_heroku_files(project_path)
            
            return {
                'status': 'success',
                'message': 'Heroku deployment files created',
                'instructions': [
                    '1. Install Heroku CLI',
                    '2. Run: heroku login',
                    '3. Run: heroku create your-app-name',
                    '4. Run: git add .',
                    '5. Run: git commit -m "Deploy to Heroku"',
                    '6. Run: git push heroku main'
                ]
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Heroku deployment failed: {str(e)}'
            }
    
    def _deploy_render(self, project_path: str) -> Dict[str, Any]:
        """Deploy project to Render"""
        try:
            # Create Render-specific files
            self._create_render_files(project_path)
            
            return {
                'status': 'success',
                'message': 'Render deployment files created',
                'instructions': [
                    '1. Push your code to GitHub',
                    '2. Go to https://render.com',
                    '3. Create a new Web Service',
                    '4. Connect your GitHub repository',
                    '5. Use the generated render.yaml configuration',
                    '6. Deploy your service'
                ]
            }
            
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Render deployment failed: {str(e)}'
            }
    
    def _create_local_deploy_script(self, project_path: str) -> str:
        """Create local deployment script"""
        return f'''#!/bin/bash

# API Weaver Local Deployment Script
# Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

echo "🚀 Starting API Weaver Local Deployment..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python3 first."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip3 first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pip3 install -r requirements.txt

# Set environment variables
export FLASK_APP=app.py
export FLASK_ENV=development

# Start the application
echo "🌟 Starting API Weaver..."
echo "📍 API will be available at: http://localhost:5000"
echo "📚 Documentation: http://localhost:5000/docs"
echo "🔍 Health Check: http://localhost:5000/health"

python3 app.py
'''
    
    def _create_heroku_files(self, project_path: str):
        """Create Heroku-specific deployment files"""
        
        # Create Procfile
        procfile_content = "web: gunicorn app:app"
        with open(os.path.join(project_path, 'Procfile'), 'w') as f:
            f.write(procfile_content)
        
        # Create runtime.txt
        runtime_content = "python-3.11.0"
        with open(os.path.join(project_path, 'runtime.txt'), 'w') as f:
            f.write(runtime_content)
        
        # Create app.json for Heroku Button
        app_json = {
            "name": "API Weaver Generated API",
            "description": "Auto-generated API by API Weaver",
            "repository": "https://github.com/api-weaver/generated-api",
            "logo": "https://api-weaver.com/logo.png",
            "keywords": ["api", "generated", "api-weaver"],
            "success_url": "/",
            "env": {
                "FLASK_ENV": {
                    "description": "Flask environment",
                    "value": "production"
                }
            }
        }
        
        import json
        with open(os.path.join(project_path, 'app.json'), 'w') as f:
            json.dump(app_json, f, indent=2)
    
    def _create_render_files(self, project_path: str):
        """Create Render-specific deployment files"""
        
        # Create render.yaml
        render_yaml = f'''services:
  - type: web
    name: api-weaver-generated-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app
    envVars:
      - key: FLASK_ENV
        value: production
    healthCheckPath: /health
'''
        
        with open(os.path.join(project_path, 'render.yaml'), 'w') as f:
            f.write(render_yaml)
