import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-error-50 dark:bg-error-900/20">
            <AlertCircle className="h-12 w-12 text-error-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center">
          <Home className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;