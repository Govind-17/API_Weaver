import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaDatabase, 
  FaCode, 
  FaRocket, 
  FaCheck, 
  FaSpinner,
  FaEye,
  FaDownload,
  FaPlay
} from 'react-icons/fa';

const APIGenerator = () => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTables, setSelectedTables] = useState([]);
  const [generationResult, setGenerationResult] = useState(null);
  const [dbConnection, setDbConnection] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Load saved database connection
    const savedConnection = localStorage.getItem('dbConnection');
    if (savedConnection) {
      const connection = JSON.parse(savedConnection);
      setDbConnection(connection);
      setSelectedTables(connection.tables || []);
    } else {
      navigate('/connect');
    }
  }, [navigate]);

  const handleTableToggle = (table) => {
    setSelectedTables(prev => 
      prev.includes(table) 
        ? prev.filter(t => t !== table)
        : [...prev, table]
    );
  };

  const handleGenerate = async () => {
    if (selectedTables.length === 0) {
      toast.error('Please select at least one table');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          database_type: dbConnection.type,
          tables: selectedTables,
          framework: 'flask', // Default to Flask
          include_auth: true
        })
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        setGenerationResult(result);
        setStep(4);
        toast.success('API generated successfully!');
      } else {
        toast.error(result.message || 'Generation failed');
      }
    } catch (error) {
      toast.error('Generation failed: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const steps = [
    { number: 1, title: 'Select Tables', description: 'Choose which tables to generate APIs for' },
    { number: 2, title: 'Configure Options', description: 'Set framework and authentication options' },
    { number: 3, title: 'Generate API', description: 'Generate your API endpoints' },
    { number: 4, title: 'Download & Deploy', description: 'Get your generated API' }
  ];

  if (!dbConnection) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin w-8 h-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading database connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Generate Your API
          </h1>
          <p className="text-gray-600">
            Connected to {dbConnection.type.toUpperCase()} database
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepItem.number
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step > stepItem.number ? <FaCheck className="w-4 h-4" /> : stepItem.number}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    step >= stepItem.number ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {stepItem.title}
                  </p>
                  <p className="text-xs text-gray-500">{stepItem.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    step > stepItem.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Select Tables to Generate APIs For
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dbConnection.tables.map((table) => (
                  <div
                    key={table}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedTables.includes(table)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleTableToggle(table)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaDatabase className="w-5 h-5 text-gray-600 mr-3" />
                        <span className="font-medium text-gray-900">{table}</span>
                      </div>
                      {selectedTables.includes(table) && (
                        <FaCheck className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={selectedTables.length === 0}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next: Configure Options
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Configure API Generation Options
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Framework
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="flask">Flask (Python)</option>
                    <option value="fastapi">FastAPI (Python)</option>
                    <option value="express">Express.js (Node.js)</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      Include JWT Authentication
                    </span>
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Add login/signup endpoints and protect your API
                  </p>
                </div>

                <div>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      Generate Swagger Documentation
                    </span>
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Auto-generate API documentation
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors duration-200"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Next: Generate API
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Generate Your API
              </h2>
              <div className="text-center">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Selected Tables: {selectedTables.join(', ')}
                  </h3>
                  <p className="text-gray-600">
                    This will generate CRUD endpoints for each selected table
                  </p>
                </div>
                
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center mx-auto"
                >
                  {isGenerating ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Generating API...
                    </>
                  ) : (
                    <>
                      <FaRocket className="mr-2" />
                      Generate API
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 4 && generationResult && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🎉 Your API is Ready!
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <FaCheck className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-green-800">
                    API Generated Successfully
                  </h3>
                </div>
                <p className="text-green-700">
                  Your API has been generated with {selectedTables.length} tables and is ready for download.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Download API
                  </h3>
                  <p className="text-blue-700 mb-4">
                    Download your complete API project as a ZIP file
                  </p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
                    <FaDownload className="mr-2" />
                    Download ZIP
                  </button>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">
                    View Documentation
                  </h3>
                  <p className="text-purple-700 mb-4">
                    Open Swagger documentation in a new tab
                  </p>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center">
                    <FaEye className="mr-2" />
                    View Docs
                  </button>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setStep(1);
                    setGenerationResult(null);
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors duration-200"
                >
                  Generate Another API
                </button>
                <button
                  onClick={() => navigate('/projects')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  View All Projects
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default APIGenerator;
