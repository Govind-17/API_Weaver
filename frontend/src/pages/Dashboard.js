import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaDatabase, 
  FaCode, 
  FaRocket, 
  FaFileAlt, 
  FaChartBar,
  FaUsers,
  FaCog
} from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Projects',
      value: '12',
      change: '+2 this month',
      icon: FaFileAlt,
      color: 'blue'
    },
    {
      title: 'APIs Generated',
      value: '48',
      change: '+8 this week',
      icon: FaCode,
      color: 'green'
    },
    {
      title: 'Active Connections',
      value: '3',
      change: '2 databases',
      icon: FaDatabase,
      color: 'purple'
    },
    {
      title: 'Total Endpoints',
      value: '156',
      change: '+23 this month',
      icon: FaRocket,
      color: 'orange'
    }
  ];

  const recentProjects = [
    {
      id: 1,
      name: 'E-commerce API',
      framework: 'Flask',
      database: 'MySQL',
      status: 'Active',
      created: '2 days ago',
      endpoints: 12
    },
    {
      id: 2,
      name: 'User Management API',
      framework: 'FastAPI',
      database: 'MongoDB',
      status: 'Active',
      created: '1 week ago',
      endpoints: 8
    },
    {
      id: 3,
      name: 'Inventory API',
      framework: 'Express',
      database: 'MySQL',
      status: 'Draft',
      created: '2 weeks ago',
      endpoints: 6
    }
  ];

  const quickActions = [
    {
      title: 'Connect Database',
      description: 'Connect to MySQL, PostgreSQL, or MongoDB',
      icon: FaDatabase,
      link: '/connect',
      color: 'blue'
    },
    {
      title: 'Generate API',
      description: 'Create new API from database schema',
      icon: FaCode,
      link: '/generate',
      color: 'green'
    },
    {
      title: 'View Projects',
      description: 'Manage your existing projects',
      icon: FaFileAlt,
      link: '/projects',
      color: 'purple'
    },
    {
      title: 'Deploy API',
      description: 'Deploy your APIs to cloud platforms',
      icon: FaRocket,
      link: '/deploy',
      color: 'orange'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your API Weaver projects.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getColorClasses(stat.color)} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={index}
                      to={action.link}
                      className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getColorClasses(action.color)} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
                  <Link
                    to="/projects"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View all
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {recentProjects.map((project) => (
                  <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <FaCode className="w-4 h-4 mr-1" />
                            {project.framework}
                          </span>
                          <span className="flex items-center">
                            <FaDatabase className="w-4 h-4 mr-1" />
                            {project.database}
                          </span>
                          <span className="flex items-center">
                            <FaRocket className="w-4 h-4 mr-1" />
                            {project.endpoints} endpoints
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          project.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status}
                        </span>
                        <span className="text-sm text-gray-500">{project.created}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to generate your first API?</h2>
              <p className="text-blue-100 mb-4">
                Connect your database and start generating APIs in minutes.
              </p>
              <Link
                to="/connect"
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 inline-flex items-center"
              >
                <FaDatabase className="mr-2" />
                Get Started
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaRocket className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
