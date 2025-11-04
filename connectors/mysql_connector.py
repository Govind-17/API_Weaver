"""
MySQL Database Connector for API Weaver
"""

import pymysql
import pandas as pd
from typing import Dict, List, Any, Optional
import json

class MySQLConnector:
    """MySQL database connector for schema reading and API generation"""
    
    def __init__(self):
        self.connection = None
        self.cursor = None
    
    def connect(self, host: str, port: int, username: str, password: str, database: str) -> bool:
        """
        Connect to MySQL database
        
        Args:
            host: Database host
            port: Database port
            username: Database username
            password: Database password
            database: Database name
            
        Returns:
            bool: True if connection successful, False otherwise
        """
        try:
            self.connection = pymysql.connect(
                host=host,
                port=port,
                user=username,
                password=password,
                database=database,
                charset='utf8mb4',
                cursorclass=pymysql.cursors.DictCursor
            )
            self.cursor = self.connection.cursor()
            return True
        except Exception as e:
            print(f"MySQL connection error: {e}")
            return False
    
    def get_tables(self) -> List[str]:
        """
        Get list of tables in the database
        
        Returns:
            List[str]: List of table names
        """
        try:
            self.cursor.execute("SHOW TABLES")
            tables = [list(row.values())[0] for row in self.cursor.fetchall()]
            return tables
        except Exception as e:
            print(f"Error getting tables: {e}")
            return []
    
    def get_table_schema(self, table_name: str) -> Dict[str, Any]:
        """
        Get schema information for a specific table
        
        Args:
            table_name: Name of the table
            
        Returns:
            Dict: Table schema information
        """
        try:
            # Get column information
            self.cursor.execute(f"DESCRIBE `{table_name}`")
            columns = self.cursor.fetchall()
            
            # Get primary key information
            self.cursor.execute(f"""
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = '{table_name}' 
                AND CONSTRAINT_NAME = 'PRIMARY'
            """)
            primary_keys = [row['COLUMN_NAME'] for row in self.cursor.fetchall()]
            
            # Get foreign key information
            self.cursor.execute(f"""
                SELECT 
                    COLUMN_NAME,
                    REFERENCED_TABLE_NAME,
                    REFERENCED_COLUMN_NAME
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = '{table_name}' 
                AND REFERENCED_TABLE_NAME IS NOT NULL
            """)
            foreign_keys = self.cursor.fetchall()
            
            schema = {
                'table_name': table_name,
                'columns': [],
                'primary_keys': primary_keys,
                'foreign_keys': foreign_keys,
                'total_rows': self.get_table_row_count(table_name)
            }
            
            for column in columns:
                column_info = {
                    'name': column['Field'],
                    'type': column['Type'],
                    'null': column['Null'] == 'YES',
                    'key': column['Key'],
                    'default': column['Default'],
                    'extra': column['Extra']
                }
                schema['columns'].append(column_info)
            
            return schema
            
        except Exception as e:
            print(f"Error getting table schema for {table_name}: {e}")
            return {}
    
    def get_table_row_count(self, table_name: str) -> int:
        """
        Get row count for a table
        
        Args:
            table_name: Name of the table
            
        Returns:
            int: Number of rows in the table
        """
        try:
            self.cursor.execute(f"SELECT COUNT(*) as count FROM `{table_name}`")
            result = self.cursor.fetchone()
            return result['count']
        except Exception as e:
            print(f"Error getting row count for {table_name}: {e}")
            return 0
    
    def get_sample_data(self, table_name: str, limit: int = 5) -> List[Dict]:
        """
        Get sample data from a table
        
        Args:
            table_name: Name of the table
            limit: Number of sample rows to fetch
            
        Returns:
            List[Dict]: Sample data
        """
        try:
            self.cursor.execute(f"SELECT * FROM `{table_name}` LIMIT {limit}")
            return self.cursor.fetchall()
        except Exception as e:
            print(f"Error getting sample data for {table_name}: {e}")
            return []
    
    def generate_crud_operations(self, table_name: str) -> Dict[str, Any]:
        """
        Generate CRUD operations for a table
        
        Args:
            table_name: Name of the table
            
        Returns:
            Dict: Generated CRUD operations
        """
        schema = self.get_table_schema(table_name)
        if not schema:
            return {}
        
        operations = {
            'table_name': table_name,
            'endpoints': []
        }
        
        # Generate endpoints for each CRUD operation
        endpoints = [
            {
                'name': f'List {table_name}',
                'method': 'GET',
                'path': f'/{table_name}',
                'operation': 'list',
                'description': f'Get all {table_name} records'
            },
            {
                'name': f'Get {table_name} by ID',
                'method': 'GET',
                'path': f'/{table_name}/{{id}}',
                'operation': 'read',
                'description': f'Get a specific {table_name} record by ID'
            },
            {
                'name': f'Create {table_name}',
                'method': 'POST',
                'path': f'/{table_name}',
                'operation': 'create',
                'description': f'Create a new {table_name} record'
            },
            {
                'name': f'Update {table_name}',
                'method': 'PUT',
                'path': f'/{table_name}/{{id}}',
                'operation': 'update',
                'description': f'Update an existing {table_name} record'
            },
            {
                'name': f'Delete {table_name}',
                'method': 'DELETE',
                'path': f'/{table_name}/{{id}}',
                'operation': 'delete',
                'description': f'Delete a {table_name} record'
            }
        ]
        
        operations['endpoints'] = endpoints
        operations['schema'] = schema
        
        return operations
    
    def close(self):
        """Close database connection"""
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
    
    def __del__(self):
        """Destructor to ensure connection is closed"""
        self.close()
