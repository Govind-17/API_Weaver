"""
Authentication Manager for API Weaver
Handles JWT-based authentication
"""

from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User, db
from datetime import datetime
import re

class AuthManager:
    """Authentication manager for user registration, login, and JWT handling"""
    
    def __init__(self):
        pass
    
    def register(self, request):
        """
        Register a new user
        
        Args:
            request: Flask request object
            
        Returns:
            JSON response with registration result
        """
        try:
            data = request.get_json()
            
            # Validate input
            validation_result = self._validate_registration_data(data)
            if not validation_result['valid']:
                return jsonify({
                    'status': 'error',
                    'message': validation_result['message']
                }), 400
            
            # Check if user already exists
            if User.query.filter_by(username=data['username']).first():
                return jsonify({
                    'status': 'error',
                    'message': 'Username already exists'
                }), 400
            
            if User.query.filter_by(email=data['email']).first():
                return jsonify({
                    'status': 'error',
                    'message': 'Email already exists'
                }), 400
            
            # Create new user
            user = User(
                username=data['username'],
                email=data['email'],
                password=data['password'],
                role=data.get('role', 'user')
            )
            
            db.session.add(user)
            db.session.commit()
            
            # Generate JWT token
            access_token = create_access_token(identity=user.id)
            
            return jsonify({
                'status': 'success',
                'message': 'User registered successfully',
                'access_token': access_token,
                'user': user.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({
                'status': 'error',
                'message': f'Registration failed: {str(e)}'
            }), 500
    
    def login(self, request):
        """
        Login user and return JWT token
        
        Args:
            request: Flask request object
            
        Returns:
            JSON response with login result
        """
        try:
            data = request.get_json()
            
            # Validate input
            if not data.get('username') or not data.get('password'):
                return jsonify({
                    'status': 'error',
                    'message': 'Username and password are required'
                }), 400
            
            # Find user by username or email
            user = User.query.filter(
                (User.username == data['username']) | 
                (User.email == data['username'])
            ).first()
            
            if not user:
                return jsonify({
                    'status': 'error',
                    'message': 'Invalid credentials'
                }), 401
            
            # Check password
            if not user.check_password(data['password']):
                return jsonify({
                    'status': 'error',
                    'message': 'Invalid credentials'
                }), 401
            
            # Check if user is active
            if not user.is_active:
                return jsonify({
                    'status': 'error',
                    'message': 'Account is deactivated'
                }), 401
            
            # Generate JWT token
            access_token = create_access_token(identity=user.id)
            
            return jsonify({
                'status': 'success',
                'message': 'Login successful',
                'access_token': access_token,
                'user': user.to_dict()
            }), 200
            
        except Exception as e:
            return jsonify({
                'status': 'error',
                'message': f'Login failed: {str(e)}'
            }), 500
    
    def logout(self):
        """
        Logout user (JWT tokens are stateless, so this is mainly for client-side)
        
        Returns:
            JSON response with logout result
        """
        return jsonify({
            'status': 'success',
            'message': 'Logout successful'
        }), 200
    
    def get_current_user(self):
        """
        Get current user from JWT token
        
        Returns:
            JSON response with current user info
        """
        try:
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user:
                return jsonify({
                    'status': 'error',
                    'message': 'User not found'
                }), 404
            
            return jsonify({
                'status': 'success',
                'user': user.to_dict()
            }), 200
            
        except Exception as e:
            return jsonify({
                'status': 'error',
                'message': f'Failed to get user: {str(e)}'
            }), 500
    
    def _validate_registration_data(self, data):
        """
        Validate registration data
        
        Args:
            data: Registration data dictionary
            
        Returns:
            Dict with validation result
        """
        # Check required fields
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return {
                    'valid': False,
                    'message': f'{field} is required'
                }
        
        # Validate username
        if len(data['username']) < 3:
            return {
                'valid': False,
                'message': 'Username must be at least 3 characters long'
            }
        
        if not re.match(r'^[a-zA-Z0-9_]+$', data['username']):
            return {
                'valid': False,
                'message': 'Username can only contain letters, numbers, and underscores'
            }
        
        # Validate email
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['email']):
            return {
                'valid': False,
                'message': 'Invalid email format'
            }
        
        # Validate password
        if len(data['password']) < 6:
            return {
                'valid': False,
                'message': 'Password must be at least 6 characters long'
            }
        
        # Validate role
        valid_roles = ['admin', 'developer', 'user']
        if data.get('role') and data['role'] not in valid_roles:
            return {
                'valid': False,
                'message': f'Role must be one of: {", ".join(valid_roles)}'
            }
        
        return {'valid': True}
