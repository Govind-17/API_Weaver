#!/usr/bin/env python3
"""
API Weaver - Main Application Runner
Automated API Generator for Web & Mobile Applications
"""

import os
import sys
from app import app, db

def create_tables():
    """Create database tables"""
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully")

def main():
    """Main application entry point"""
    print("🚀 Starting API Weaver...")
    print("📍 Backend: http://localhost:5000")
    print("📍 Frontend: http://localhost:3000")
    print("📍 API Docs: http://localhost:5000/api/docs")
    
    # Create database tables
    create_tables()
    
    # Start the application
    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000,
        threaded=True
    )

if __name__ == '__main__':
    main()
