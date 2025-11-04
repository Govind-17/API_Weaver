import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaDatabase, 
  FaCode, 
  FaRocket, 
  FaShieldAlt, 
  FaFileAlt, 
  FaDownload,
  FaPlay,
  FaCheckCircle
} from 'react-icons/fa';

const Home = () => {
  const features = [
    {
      icon: FaDatabase,
      title: 'Database Integration',
      description: 'Connect to MySQL, PostgreSQL, or MongoDB and auto-generate CRUD APIs',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FaCode,
      title: 'Multiple Frameworks',
      description: 'Generate APIs in Flask, FastAPI, or Express.js with just a few clicks',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FaShieldAlt,
      title: 'JWT Authentication',
      description: 'Built-in authentication with JWT tokens and role-based access control',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: FaFileAlt,
      title: 'Auto Documentation',
      description: 'Automatic Swagger/OpenAPI documentation generation for all endpoints',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: FaRocket,
      title: 'One-Click Deploy',
      description: 'Deploy your APIs to Heroku, Render, or run locally with one click',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: FaDownload,
      title: 'Export & Download',
      description: 'Download your generated API as a complete project with all dependencies',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Connect Database',
      description: 'Upload your database schema or connect to MySQL/MongoDB',
      icon: FaDatabase
    },
    {
      number: '2',
      title: 'Select Tables',
      description: 'Choose which tables/collections to generate APIs for',
      icon: FaCode
    },
    {
      number: '3',
      title: 'Generate API',
      description: 'Auto-generate CRUD endpoints with authentication and documentation',
      icon: FaRocket
    },
    {
      number: '4',
      title: 'Deploy & Use',
      description: 'Deploy to cloud or download and run locally',
      icon: FaCheckCircle
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              API Weaver
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Automated API Generator for Web & Mobile Applications
            </p>
            <p className="text-lg mb-12 text-blue-200 max-w-3xl mx-auto">
              Stop writing repetitive boilerplate code. Generate complete REST APIs 
              from your database schema in minutes, not hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/connect"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 btn-animate"
              >
                <FaPlay className="inline mr-2" />
                Start Generating
              </Link>
              <Link
                to="/projects"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 btn-animate"
              >
                <FaFileAlt className="inline mr-2" />
                View Examples
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to generate production-ready APIs quickly and efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card-hover bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Generate APIs in 4 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">{step.number}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transform translate-x-8"></div>
                    )}
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Example: Blood Donors API
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a simple database table to a complete REST API
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Input: Database Table
              </h3>
              <div className="bg-gray-900 rounded-lg p-6 text-green-400 font-mono text-sm">
                <div className="text-gray-400 mb-2"># blood_donors table</div>
                <div>id | name | blood_group | phone | location</div>
                <div>1 | Ramesh | A+ | 9876543210 | Delhi</div>
                <div>2 | Priya | B+ | 9876543211 | Mumbai</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Output: Complete API
              </h3>
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                  <div className="font-semibold text-green-800">GET /donors</div>
                  <div className="text-green-600">Get all donors</div>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <div className="font-semibold text-blue-800">POST /donors</div>
                  <div className="text-blue-600">Add new donor</div>
                </div>
                <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
                  <div className="font-semibold text-purple-800">PUT /donors/{id}</div>
                  <div className="text-purple-600">Update donor</div>
                </div>
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <div className="font-semibold text-red-800">DELETE /donors/{id}</div>
                  <div className="text-red-600">Delete donor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg-2 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Generate Your API?
          </h2>
          <p className="text-xl mb-8 text-pink-100">
            Join thousands of developers who save hours of coding with API Weaver
          </p>
          <Link
            to="/connect"
            className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-colors duration-200 btn-animate inline-flex items-center"
          >
            <FaRocket className="mr-2" />
            Start Generating Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
