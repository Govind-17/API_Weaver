import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaDatabase, 
  FaCheck, 
  FaTimes, 
  FaSpinner,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const DatabaseConnection = () => {
  const [connectionType, setConnectionType] = useState('mysql');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [connectionData, setConnectionData] = useState({
    host: '',
    port: 3306,
    username: '',
    password: '',
    database: '',
    connection_string: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConnectionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    setIsConnecting(true);

    try {
      const endpoint = connectionType === 'mysql' ? '/api/connect/mysql' : '/api/connect/mongodb';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(connectionData)
      });

      const result = await response.json();

      if (result.status === 'success') {
        toast.success('Database connected successfully!');
        // Store connection info and navigate to generator
        localStorage.setItem('dbConnection', JSON.stringify({
          type: connectionType,
          data: connectionData,
          tables: result.tables || result.collections
        }));
        navigate('/generate');
      } else {
        toast.error(result.message || 'Connection failed');
      }
    } catch (error) {
      toast.error('Connection failed: ' + error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Connect Your Database
          </h1>
          <p className="text-xl text-gray-600">
            Connect to your database to start generating APIs
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Database Type Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Database Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setConnectionType('mysql')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  connectionType === 'mysql'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FaDatabase className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">MySQL</div>
                    <div className="text-sm text-gray-600">Traditional SQL database</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setConnectionType('mongodb')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  connectionType === 'mongodb'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FaDatabase className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">MongoDB</div>
                    <div className="text-sm text-gray-600">NoSQL document database</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Connection Form */}
          <form onSubmit={handleConnect} className="space-y-6">
            {connectionType === 'mysql' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Host
                    </label>
                    <input
                      type="text"
                      name="host"
                      value={connectionData.host}
                      onChange={handleInputChange}
                      placeholder="localhost"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Port
                    </label>
                    <input
                      type="number"
                      name="port"
                      value={connectionData.port}
                      onChange={handleInputChange}
                      placeholder="3306"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={connectionData.username}
                      onChange={handleInputChange}
                      placeholder="root"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={connectionData.password}
                        onChange={handleInputChange}
                        placeholder="Enter password"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Database Name
                  </label>
                  <input
                    type="text"
                    name="database"
                    value={connectionData.database}
                    onChange={handleInputChange}
                    placeholder="my_database"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connection String
                </label>
                <input
                  type="text"
                  name="connection_string"
                  value={connectionData.connection_string}
                  onChange={handleInputChange}
                  placeholder="mongodb://localhost:27017"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Database Name
                  </label>
                  <input
                    type="text"
                    name="database"
                    value={connectionData.database}
                    onChange={handleInputChange}
                    placeholder="my_database"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isConnecting}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 btn-animate flex items-center space-x-2"
              >
                {isConnecting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>Connect Database</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Need Help Connecting?
          </h3>
          <div className="text-blue-800 space-y-2">
            <p><strong>MySQL:</strong> Make sure your MySQL server is running and accessible</p>
            <p><strong>MongoDB:</strong> Ensure MongoDB is running on the specified port</p>
            <p><strong>Security:</strong> We don't store your database credentials - they're only used for connection</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseConnection;
