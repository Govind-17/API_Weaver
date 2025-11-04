"""
MongoDB Database Connector for API Weaver
"""

from pymongo import MongoClient
from typing import Dict, List, Any, Optional
import json
from bson import ObjectId
from bson.json_util import dumps

class MongoDBConnector:
    """MongoDB database connector for schema reading and API generation"""
    
    def __init__(self):
        self.client = None
        self.database = None
        self.db_name = None
    
    def connect(self, connection_string: str, database: str) -> bool:
        """
        Connect to MongoDB database
        
        Args:
            connection_string: MongoDB connection string
            database: Database name
            
        Returns:
            bool: True if connection successful, False otherwise
        """
        try:
            self.client = MongoClient(connection_string)
            self.database = self.client[database]
            self.db_name = database
            
            # Test connection
            self.client.admin.command('ping')
            return True
        except Exception as e:
            print(f"MongoDB connection error: {e}")
            return False
    
    def get_collections(self) -> List[str]:
        """
        Get list of collections in the database
        
        Returns:
            List[str]: List of collection names
        """
        try:
            return self.database.list_collection_names()
        except Exception as e:
            print(f"Error getting collections: {e}")
            return []
    
    def get_collection_schema(self, collection_name: str) -> Dict[str, Any]:
        """
        Get schema information for a specific collection
        
        Args:
            collection_name: Name of the collection
            
        Returns:
            Dict: Collection schema information
        """
        try:
            collection = self.database[collection_name]
            
            # Get sample documents to analyze schema
            sample_docs = list(collection.find().limit(10))
            
            if not sample_docs:
                return {
                    'collection_name': collection_name,
                    'fields': [],
                    'total_documents': 0,
                    'sample_data': []
                }
            
            # Analyze field types from sample documents
            field_types = {}
            for doc in sample_docs:
                for field, value in doc.items():
                    if field not in field_types:
                        field_types[field] = set()
                    field_types[field].add(type(value).__name__)
            
            # Convert to schema format
            fields = []
            for field, types in field_types.items():
                field_info = {
                    'name': field,
                    'types': list(types),
                    'is_required': True if field == '_id' else False,
                    'is_id': field == '_id'
                }
                fields.append(field_info)
            
            # Get total document count
            total_docs = collection.count_documents({})
            
            return {
                'collection_name': collection_name,
                'fields': fields,
                'total_documents': total_docs,
                'sample_data': sample_docs[:3]  # First 3 documents as sample
            }
            
        except Exception as e:
            print(f"Error getting collection schema for {collection_name}: {e}")
            return {}
    
    def get_sample_data(self, collection_name: str, limit: int = 5) -> List[Dict]:
        """
        Get sample data from a collection
        
        Args:
            collection_name: Name of the collection
            limit: Number of sample documents to fetch
            
        Returns:
            List[Dict]: Sample data
        """
        try:
            collection = self.database[collection_name]
            return list(collection.find().limit(limit))
        except Exception as e:
            print(f"Error getting sample data for {collection_name}: {e}")
            return []
    
    def generate_crud_operations(self, collection_name: str) -> Dict[str, Any]:
        """
        Generate CRUD operations for a collection
        
        Args:
            collection_name: Name of the collection
            
        Returns:
            Dict: Generated CRUD operations
        """
        schema = self.get_collection_schema(collection_name)
        if not schema:
            return {}
        
        operations = {
            'collection_name': collection_name,
            'endpoints': []
        }
        
        # Generate endpoints for each CRUD operation
        endpoints = [
            {
                'name': f'List {collection_name}',
                'method': 'GET',
                'path': f'/{collection_name}',
                'operation': 'list',
                'description': f'Get all {collection_name} documents'
            },
            {
                'name': f'Get {collection_name} by ID',
                'method': 'GET',
                'path': f'/{collection_name}/{{id}}',
                'operation': 'read',
                'description': f'Get a specific {collection_name} document by ID'
            },
            {
                'name': f'Create {collection_name}',
                'method': 'POST',
                'path': f'/{collection_name}',
                'operation': 'create',
                'description': f'Create a new {collection_name} document'
            },
            {
                'name': f'Update {collection_name}',
                'method': 'PUT',
                'path': f'/{collection_name}/{{id}}',
                'operation': 'update',
                'description': f'Update an existing {collection_name} document'
            },
            {
                'name': f'Delete {collection_name}',
                'method': 'DELETE',
                'path': f'/{collection_name}/{{id}}',
                'operation': 'delete',
                'description': f'Delete a {collection_name} document'
            }
        ]
        
        operations['endpoints'] = endpoints
        operations['schema'] = schema
        
        return operations
    
    def close(self):
        """Close database connection"""
        if self.client:
            self.client.close()
    
    def __del__(self):
        """Destructor to ensure connection is closed"""
        self.close()
