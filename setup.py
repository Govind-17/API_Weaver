#!/usr/bin/env python3
"""
API Weaver Setup Script
Automated API Generator for Web & Mobile Applications
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    print(f"✅ Python {sys.version.split()[0]} detected")

def install_python_dependencies():
    """Install Python dependencies"""
    return run_command("pip install -r requirements.txt", "Installing Python dependencies")

def install_node_dependencies():
    """Install Node.js dependencies"""
    if os.path.exists("frontend"):
        os.chdir("frontend")
        success = run_command("npm install", "Installing Node.js dependencies")
        os.chdir("..")
        return success
    return True

def setup_database():
    """Setup database"""
    print("🔄 Setting up database...")
    try:
        from app import app, db
        with app.app_context():
            db.create_all()
        print("✅ Database setup completed")
        return True
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 API Weaver Setup")
    print("=" * 50)
    
    # Check Python version
    check_python_version()
    
    # Install dependencies
    if not install_python_dependencies():
        print("❌ Setup failed at Python dependencies")
        sys.exit(1)
    
    if not install_node_dependencies():
        print("❌ Setup failed at Node.js dependencies")
        sys.exit(1)
    
    # Setup database
    if not setup_database():
        print("❌ Setup failed at database setup")
        sys.exit(1)
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Start the backend: python run.py")
    print("2. Start the frontend: cd frontend && npm start")
    print("3. Open http://localhost:3000 in your browser")
    print("\n📚 Documentation: README.md")

if __name__ == '__main__':
    main()
