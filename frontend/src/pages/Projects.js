import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFileAlt, 
  FaCode, 
  FaDatabase, 
  FaRocket, 
  FaDownload,
  FaEye,
  FaTrash,
  FaPlay,
  FaPause,
  FaEdit
} from 'react-icons/fa';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading projects
    setTimeout(() => {
      setProjects([
        {
          id: 1,
          name: 'E-commerce API',
          description: 'Complete e-commerce API with products, orders, and users',
          framework: 'Flask',
          database: 'MySQL',
          status: 'Active',
          created: '2024-01-15',
          endpoints: 12,
          lastModified: '2 days ago'
        },
        {
          id: 2,
          name: 'User Management API',
          description: 'User authentication and profile management API',
          framework: 'FastAPI',
          database: 'MongoDB',
          status: 'Active',
          created: '2024-01-10',
          endpoints: 8,
          lastModified: '1 week ago'
        },
        {
          id: 3,
          name: 'Inventory API',
          description: 'Product inventory management system',
          framework: 'Express',
          database: 'MySQL',
          status: 'Draft',
          created: '2024-01-05',
          endpoints: 6,
          lastModified: '2 weeks ago'
        },
        {
          id: 4,
          name: 'Blog API',
          description: 'Content management API for blog posts',
          framework: 'Flask',
          database: 'PostgreSQL',
          status: 'Inactive',
          created: '2023-12-20',
          endpoints: 10,
          lastModified: '1 month ago'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Draft': 'bg-yellow-100 text-yellow-800',
      'Inactive': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors['Draft'];
  };

  const getFrameworkColor = (framework) => {
    const colors = {
      'Flask': 'bg-blue-100 text-blue-800',
      'FastAPI': 'bg-green-100 text-green-800',
      'Express': 'bg-yellow-100 text-yellow-800'
    };
    return colors[framework] || colors['Flask'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
              <p className="text-gray-600 mt-2">
                Manage your generated APIs and projects
              </p>
            </div>
            <Link
              to="/connect"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              <FaRocket className="mr-2" />
              New Project
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaFileAlt className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaRocket className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => p.status === 'Active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaCode className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Endpoints</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.reduce((sum, p) => sum + p.endpoints, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaDatabase className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Databases</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(projects.map(p => p.database)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {project.description}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCode className="w-4 h-4 mr-2" />
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getFrameworkColor(project.framework)}`}>
                      {project.framework}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaDatabase className="w-4 h-4 mr-2" />
                    <span>{project.database}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaRocket className="w-4 h-4 mr-2" />
                    <span>{project.endpoints} endpoints</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Created: {project.created} • Modified: {project.lastModified}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200">
                      <FaDownload className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors duration-200">
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200">
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex space-x-1">
                    {project.status === 'Active' ? (
                      <button className="p-2 text-green-600 hover:text-green-700 transition-colors duration-200">
                        <FaPause className="w-4 h-4" />
                      </button>
                    ) : (
                      <button className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200">
                        <FaPlay className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <FaFileAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">
              Get started by connecting your database and generating your first API
            </p>
            <Link
              to="/connect"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 inline-flex items-center"
            >
              <FaRocket className="mr-2" />
              Create Your First Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
